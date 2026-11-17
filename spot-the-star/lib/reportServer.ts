import "server-only";
import { db, SessionRow } from "./db";
import { getLessons, getSponsors } from "./content";
import { lessonsFor } from "./report";
import { pickSponsor } from "./sponsors";
import { certificatePdf, reportPdf } from "./pdf";
import { appUrl, sign, verify } from "./server";
import type { GameResult } from "./types";
import { benchmark } from "./benchmark";

export function reportLinks(sessionId: string, hasCert: boolean) {
  const t = sign(`report:${sessionId}`);
  return {
    token: t,
    report: `${appUrl()}/api/report/pdf?sid=${sessionId}&t=${t}`,
    certificate: hasCert ? `${appUrl()}/api/certificate/pdf?sid=${sessionId}&t=${t}` : null,
  };
}

export async function buildReportPdf(s: SessionRow) {
  const result = s.result as GameResult;
  const [lessons, sponsors] = await Promise.all([getLessons(), getSponsors()]);
  const bm = await benchmark(s.id, { role: s.role ?? undefined }).catch(() => null);
  return reportPdf({
    result,
    name: s.first_name ?? "Recruiter",
    role: s.role ?? "",
    company: s.company ?? "",
    lessons: lessonsFor(result, lessons),
    sponsorName: pickSponsor(sponsors, "results_native").name,
    benchmark: (bm?.percentiles as Record<string, number>) ?? null,
  });
}

export async function buildCertificatePdf(s: SessionRow) {
  const result = s.result as GameResult;
  if (!result?.certificateLevel) return null;
  const sponsors = await getSponsors();
  return certificatePdf({
    name: s.first_name ?? "Recruiter",
    company: s.company ?? "",
    level: result.certificateLevel,
    date: new Date(s.updated_at),
    certId: certId(s.id),
    score: result.totalScore,
    sponsorName: pickSponsor(sponsors, "share_footer").name,
    url: `${appUrl()}/verify/${s.id}`,
  });
}

export const certId = (sid: string) => `STS-${sid.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

export async function sessionForToken(sid: string | null, t: string | null) {
  if (!sid || !verify(`report:${sid}`, t)) return null;
  const s = await db().getSession(sid);
  return s?.result ? s : null;
}

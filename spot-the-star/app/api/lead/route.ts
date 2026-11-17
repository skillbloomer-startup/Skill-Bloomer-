import { db, LeadRow } from "@/lib/db";
import { bad, isId, json, str } from "@/lib/api";
import { isFreeEmail, requestMeta } from "@/lib/server";
import { leadScore } from "@/lib/engine/lead";
import { weakestCompetency } from "@/lib/engine/scoring";
import { alertHotLead, emailReport, fireLeadWebhook } from "@/lib/integrations";
import { buildReportPdf, reportLinks } from "@/lib/reportServer";
import type { GameResult } from "@/lib/types";

export const dynamic = "force-dynamic";

const SIZES = ["1–50", "51–200", "201–1000", "1000+"];
const VOLUMES = ["<10", "10–50", "50–200", "200+"];
const PAINS = ["sourcing", "screening time", "fake candidates", "interview scheduling", "quality of hire", "offer drop-outs"];

async function sendReportEmail(lead: LeadRow, sessionId: string, links: ReturnType<typeof reportLinks>) {
  const s = await db().getSession(sessionId);
  if (!s?.result) return null;
  const pdf = await buildReportPdf(s);
  return emailReport(lead, s, links, pdf);
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !isId(b.sessionId)) return bad("invalid");
  const email = str(b.email, 160)?.toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad("Please enter a valid email.");
  if (b.consentScrini !== true) return bad("Consent is required to send your report.");
  const s = await db().getSession(b.sessionId);
  if (!s) return bad("unknown session", 404);
  const meta = await requestMeta();
  const result = s.result as GameResult | undefined;
  const pains: string[] = (Array.isArray(b.pains) ? b.pains : []).filter((p: string) => PAINS.includes(p));
  const companySize = SIZES.includes(b.companySize) ? b.companySize : null;
  const hiringVolume = VOLUMES.includes(b.hiringVolume) ? b.hiringVolume : null;
  const ls = leadScore({
    role: s.role ?? undefined,
    companySize: companySize ?? undefined,
    hiringVolume: hiringVolume ?? undefined,
    pains,
    demoClicked: !!s.demo_clicked,
    teamPlayed: !!s.team_id,
    teamInviteSent: !!s.team_invite_sent,
    competencies: result?.competencies ?? null,
    certificateDownloaded: !!s.certificate_downloaded,
  });
  const now = new Date().toISOString();
  const prev = await db().getLead(s.id);
  const lead: LeadRow = {
    session_id: s.id,
    player_id: s.player_id,
    created_at: prev?.created_at ?? now,
    updated_at: now,
    first_name: s.first_name,
    role: s.role,
    company: s.company,
    email,
    email_is_free: isFreeEmail(email),
    phone: str(b.phone, 30) || null,
    company_size: companySize,
    hiring_volume: hiringVolume,
    pains,
    consent_scrini: true,
    consent_partner: b.consentPartner === true,
    consent_ts: now,
    policy_version: process.env.NEXT_PUBLIC_POLICY_VERSION || "2026-11-v1",
    ip_country: meta.country,
    lead_score: ls.score,
    lead_tag: ls.tag,
    lead_reasons: ls.reasons,
    archetype: s.archetype,
    weakest: result ? weakestCompetency(result.competencies) : null,
    total_score: s.total_score,
    utm_source: s.utm_source,
    utm_medium: s.utm_medium,
    utm_campaign: s.utm_campaign,
    team_id: s.team_id,
  };
  await db().upsertLead(lead);
  if (typeof b.leaderboardOptIn === "boolean") await db().upsertSession({ id: s.id, leaderboard_opt_in: b.leaderboardOptIn });

  const links = reportLinks(s.id, !!result?.certificateLevel);
  // Integrations fail soft — the player is never blocked by a CRM/email outage.
  const jobs = await Promise.allSettled([fireLeadWebhook(lead, s), sendReportEmail(lead, s.id, links), alertHotLead(lead)]);
  jobs.forEach((j) => j.status === "rejected" && console.error("lead integration failed:", j.reason));
  return json({ ok: true, token: links.token, leadTag: ls.tag, freeEmail: lead.email_is_free });
}

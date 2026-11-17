import "server-only";
import { db } from "./db";
import { leadScore } from "./engine/lead";

/** Recompute and persist the lead score for a session (called after any signal changes). */
export async function refreshLead(sessionId: string) {
  const [lead, s] = await Promise.all([db().getLead(sessionId), db().getSession(sessionId)]);
  if (!lead || !s) return null;
  const ls = leadScore({
    role: lead.role ?? s.role ?? undefined,
    companySize: lead.company_size ?? undefined,
    hiringVolume: lead.hiring_volume ?? undefined,
    pains: lead.pains ?? [],
    demoClicked: !!s.demo_clicked,
    teamPlayed: s.mode === "team" || !!s.team_id,
    teamInviteSent: !!s.team_invite_sent,
    competencies: (s.competencies as never) ?? null,
    ats: lead.current_ats ?? undefined,
    agencyPct: lead.agency_pct ?? undefined,
    certificateDownloaded: !!s.certificate_downloaded,
  });
  const prevTag = lead.lead_tag;
  const next = { ...lead, lead_score: ls.score, lead_tag: ls.tag, lead_reasons: ls.reasons, updated_at: new Date().toISOString() };
  await db().upsertLead(next);
  return { lead: next, becameHot: prevTag !== "Hot" && ls.tag === "Hot" };
}

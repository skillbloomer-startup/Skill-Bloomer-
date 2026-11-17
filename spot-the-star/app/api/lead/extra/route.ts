import { db } from "@/lib/db";
import { bad, isId, json, str } from "@/lib/api";
import { verify } from "@/lib/server";
import { refreshLead } from "@/lib/leads";
import { alertHotLead } from "@/lib/integrations";

export const dynamic = "force-dynamic";

/** Optional "Personalise your benchmark" fields + leaderboard opt-in. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !isId(b.sessionId) || !verify(`report:${b.sessionId}`, b.token)) return bad("unauthorised", 401);
  const lead = await db().getLead(b.sessionId);
  if (lead) {
    await db().upsertLead({
      ...lead,
      industry: str(b.industry, 60) ?? lead.industry,
      years_experience: str(b.years, 20) ?? lead.years_experience,
      current_ats: str(b.ats, 60) ?? lead.current_ats,
      agency_pct: str(b.agency, 20) ?? lead.agency_pct,
      updated_at: new Date().toISOString(),
    });
  }
  if (typeof b.leaderboardOptIn === "boolean") await db().upsertSession({ id: b.sessionId, leaderboard_opt_in: b.leaderboardOptIn });
  const r = await refreshLead(b.sessionId);
  if (r?.becameHot) await alertHotLead(r.lead).catch(() => {});
  return json({ ok: true });
}

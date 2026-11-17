import { db, EventRow } from "@/lib/db";
import { bad, isId, json } from "@/lib/api";
import { refreshLead } from "@/lib/leads";
import { alertHotLead } from "@/lib/integrations";

export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "screen_view", "game_start", "badge_created", "sourcing_pick", "card_swipe", "flag_set", "question_asked",
  "reference_checked", "overrule_ai", "final_hire", "offer_decision", "rejection_choice", "round_start", "round_complete",
  "lead_submitted", "report_viewed", "certificate_downloaded", "demo_clicked", "share_clicked", "team_invite",
  "ad_impression", "ad_click", "challenge_sent", "play_again",
]);

const SESSION_FLAGS: Record<string, string> = {
  demo_clicked: "demo_clicked",
  team_invite: "team_invite_sent",
  certificate_downloaded: "certificate_downloaded",
  share_clicked: "shared",
};

export async function POST(req: Request) {
  const text = await req.text();
  let body: { events?: { name: string; sessionId: string; playerId?: string; props?: Record<string, unknown>; ts?: string }[] };
  try {
    body = JSON.parse(text);
  } catch {
    return bad("invalid json");
  }
  const evs = (body.events ?? []).filter((e) => ALLOWED.has(e.name) && isId(e.sessionId)).slice(0, 200);
  const rows: EventRow[] = evs.map((e) => ({
    ts: e.ts && !isNaN(Date.parse(e.ts)) ? new Date(e.ts).toISOString() : new Date().toISOString(),
    session_id: e.sessionId,
    player_id: isId(e.playerId) ? e.playerId : null,
    name: e.name,
    props: e.props && JSON.stringify(e.props).length < 4000 ? e.props : null,
  }));
  await db().insertEvents(rows);

  // Side-effects on the session row (drop-off screen, lead-scoring signals)
  const touched = new Set<string>();
  for (const e of evs) {
    const s = await db().getSession(e.sessionId);
    if (!s) continue;
    if (e.name === "screen_view" && typeof e.props?.screen === "string") await db().upsertSession({ id: s.id, last_screen: e.props.screen as string });
    const flag = SESSION_FLAGS[e.name];
    if (flag) {
      await db().upsertSession({ id: s.id, [flag]: true });
      touched.add(s.id);
    }
  }
  for (const sid of touched) {
    const r = await refreshLead(sid);
    if (r?.becameHot) await alertHotLead(r.lead).catch((err) => console.error("hot alert", err));
  }
  return json({ ok: true, n: rows.length });
}

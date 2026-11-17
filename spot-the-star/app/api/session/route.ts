import { db } from "@/lib/db";
import { bad, isId, json, str } from "@/lib/api";
import { requestMeta } from "@/lib/server";

export const dynamic = "force-dynamic";

/** Create / update a play session (called when the ID badge is created). */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !isId(b.id) || !isId(b.playerId)) return bad("invalid session");
  const meta = await requestMeta();
  const sessions = await db().listSessions();
  const playCount = sessions.filter((s) => s.player_id === b.playerId && s.id !== b.id).length + 1;
  await db().upsertSession({
    id: b.id,
    player_id: b.playerId,
    first_name: str(b.badge?.firstName, 40),
    role: str(b.badge?.role, 40),
    company: str(b.badge?.company, 80),
    mode: str(b.settings?.mode, 20),
    difficulty: str(b.settings?.difficulty, 20),
    pack_id: str(b.settings?.packId, 40),
    team_id: str(b.teamId, 40) || null,
    referral_code: str(b.ref, 40) || null,
    utm_source: str(b.utm?.source, 80) || null,
    utm_medium: str(b.utm?.medium, 80) || null,
    utm_campaign: str(b.utm?.campaign, 80) || null,
    referrer: str(b.referrer, 300) || null,
    device: meta.device,
    ip_country: meta.country,
    play_count: playCount,
    last_screen: "badge",
  });
  return json({ ok: true, playCount });
}

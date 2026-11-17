import { db } from "@/lib/db";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Public leaderboard: top 20, opt-in only, first name + company only. Never exposes bias data. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const team = url.searchParams.get("team");
  const mode = url.searchParams.get("mode") === "volume" ? "volume" : "classic";
  const all = await db().listSessions();
  const rows = all
    .filter((s) => s.completed && s.leaderboard_opt_in && !s.leaderboard_hidden && typeof s.total_score === "number")
    .filter((s) => (mode === "volume" ? s.mode === "volume" : s.mode !== "volume"))
    .filter((s) => !team || s.team_id === team)
    .sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0))
    .slice(0, 20)
    .map((s, i) => ({ rank: i + 1, name: s.first_name ?? "Recruiter", company: s.company ?? "", score: s.total_score, title: s.rank, id: s.id.slice(0, 6) }));
  return json({ rows });
}

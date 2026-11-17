import { bad, isId, json } from "@/lib/api";
import { isAdmin } from "@/lib/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdmin())) return bad("unauthorised", 401);
  const b = await req.json().catch(() => null);
  if (!b || !isId(b.id) || typeof b.hidden !== "boolean") return bad("invalid");
  await db().upsertSession({ id: b.id, leaderboard_hidden: b.hidden });
  return json({ ok: true });
}

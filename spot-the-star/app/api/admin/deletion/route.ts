import { bad, json } from "@/lib/api";
import { isAdmin } from "@/lib/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Admin actions a pending DPDP deletion request. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return bad("unauthorised", 401);
  const b = await req.json().catch(() => null);
  if (!b?.id || !b?.email) return bad("invalid");
  const n = await db().deleteByEmail(String(b.email));
  await db().markDeletion(String(b.id), "done");
  return json({ ok: true, deleted: n });
}

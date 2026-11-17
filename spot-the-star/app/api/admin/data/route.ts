import { bad, json } from "@/lib/api";
import { isAdmin } from "@/lib/server";
import { adminData } from "@/lib/admin";
import { listEditable } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdmin())) return bad("unauthorised", 401);
  const u = new URL(req.url);
  const days = Number(u.searchParams.get("days") || 0);
  const since = days > 0 ? new Date(Date.now() - days * 864e5).toISOString() : undefined;
  const [data, content] = await Promise.all([adminData(since), listEditable()]);
  return json({ ...data, content });
}

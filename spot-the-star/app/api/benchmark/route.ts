import { bad, isId, json } from "@/lib/api";
import { benchmark } from "@/lib/benchmark";
import { verify } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const sid = u.searchParams.get("sid");
  if (!isId(sid) || !verify(`report:${sid}`, u.searchParams.get("t"))) return bad("unauthorised", 401);
  const r = await benchmark(sid, {
    role: u.searchParams.get("role") || undefined,
    size: u.searchParams.get("size") || undefined,
    industry: u.searchParams.get("industry") || undefined,
  });
  return r ? json(r) : bad("no result", 404);
}

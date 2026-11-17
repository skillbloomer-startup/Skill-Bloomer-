import { bad, json } from "@/lib/api";
import { isAdmin } from "@/lib/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const KEY = /^(packs\/index|sourcing|lessons|sponsors|pack:[a-z0-9-]+|volume:[a-z0-9-]+)$/;

/** Content manager: save (or reset with value=null) an editable content document. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return bad("unauthorised", 401);
  const b = await req.json().catch(() => null);
  if (!b || typeof b.key !== "string" || !KEY.test(b.key)) return bad("invalid key");
  const v = b.value;
  if (v !== null) {
    const err = validate(b.key, v);
    if (err) return bad(err);
  }
  await db().setConfig(`content:${b.key}`, v);
  return json({ ok: true });
}

function validate(key: string, v: unknown): string | null {
  if (typeof v !== "object" || v === null) return "Value must be a JSON object or array.";
  if (key === "sponsors") {
    if (!Array.isArray(v)) return "Sponsors must be an array.";
    for (const s of v as Record<string, unknown>[]) {
      for (const f of ["id", "name", "logo_url", "click_url", "start", "end"]) if (typeof s[f] !== "string") return `Sponsor missing "${f}".`;
      if (!Array.isArray(s.slots)) return `Sponsor ${s.id}: slots must be an array.`;
    }
  }
  if (key === "lessons" && !Array.isArray(v)) return "Lessons must be an array.";
  if (key.startsWith("pack:")) {
    const p = v as { rounds?: { candidates?: { is_best_hire?: boolean }[] }[] };
    if (!Array.isArray(p.rounds) || !p.rounds.length) return "Pack needs rounds[].";
    for (const r of p.rounds) {
      if (!Array.isArray(r.candidates) || r.candidates.length < 2) return "Each round needs candidates[].";
      if (r.candidates.filter((c) => c.is_best_hire).length !== 1) return "Each round needs exactly one is_best_hire candidate.";
    }
  }
  if (key === "packs/index") {
    const i = v as { default?: string; packs?: unknown[] };
    if (typeof i.default !== "string" || !Array.isArray(i.packs)) return "Index needs default + packs[].";
  }
  return null;
}

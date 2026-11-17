import { bad } from "@/lib/api";
import { isAdmin } from "@/lib/server";
import { adminData, toCsv } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdmin())) return bad("unauthorised", 401);
  const type = new URL(req.url).searchParams.get("type") ?? "leads";
  const d = await adminData();
  let rows: Record<string, unknown>[] = [];
  if (type === "leads") {
    rows = d.leads.map((l) => {
      const { competencies, lead_reasons, pains, ...rest } = l;
      return { ...rest, pains: (pains ?? []).join("; "), lead_reasons: (lead_reasons ?? []).join("; "), ...Object.fromEntries(Object.entries(competencies ?? {}).map(([k, v]) => [`comp_${k}`, v])) };
    });
  } else if (type === "insights") {
    rows = [
      ...d.insights.headlines.map((h) => ({ section: "headline", value: h })),
      ...d.insights.flagMissRates.map((f) => ({ section: "flag_miss_rate", flag: f.label, miss_rate_pct: f.missRate })),
      ...d.insights.roles.map((r) => ({ section: "by_role", ...r })),
      ...Object.entries(d.insights.archetypes).map(([k, v]) => ({ section: "archetype", archetype: k, players: v })),
    ];
  } else if (type === "sponsors") {
    rows = d.sponsorReport;
  } else return bad("unknown type");
  return new Response(toCsv(rows), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="spot-the-star-${type}-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}

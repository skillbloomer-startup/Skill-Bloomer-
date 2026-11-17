import { bad } from "@/lib/api";
import { buildReportPdf, sessionForToken } from "@/lib/reportServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const s = await sessionForToken(u.searchParams.get("sid"), u.searchParams.get("t"));
  if (!s) return bad("Report not found or link expired.", 404);
  const pdf = await buildReportPdf(s);
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Recruiter-DNA-Report-${(s.first_name ?? "you").replace(/[^a-z0-9]/gi, "")}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}

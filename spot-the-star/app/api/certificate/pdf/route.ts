import { bad } from "@/lib/api";
import { db } from "@/lib/db";
import { refreshLead } from "@/lib/leads";
import { buildCertificatePdf, sessionForToken } from "@/lib/reportServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const s = await sessionForToken(u.searchParams.get("sid"), u.searchParams.get("t"));
  if (!s) return bad("Certificate not found.", 404);
  const pdf = await buildCertificatePdf(s);
  if (!pdf) return bad("A certificate requires 70+ in all ten competencies (Classic mode).", 403);
  await db().upsertSession({ id: s.id, certificate_downloaded: true });
  await refreshLead(s.id).catch(() => null);
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="AI-Ready-Recruiter-2031-Certificate.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}

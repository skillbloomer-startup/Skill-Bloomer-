import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSponsors } from "@/lib/content";
import { SCRINI_DEFAULT, withUtm } from "@/lib/sponsors";
import { isId } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Sponsor click tracker: logs ad_click then 302s to the sponsor URL (with UTM). */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const sponsorId = u.searchParams.get("s") ?? "scrini";
  const slot = (u.searchParams.get("slot") ?? "unknown").slice(0, 30);
  const sid = u.searchParams.get("sid");
  const sponsors = await getSponsors();
  const sp = sponsors.find((x) => x.id === sponsorId) ?? SCRINI_DEFAULT;
  if (isId(sid)) {
    await db()
      .insertEvents([{ ts: new Date().toISOString(), session_id: sid, name: "ad_click", props: { sponsor: sp.id, slot } }])
      .catch(() => null);
  }
  return NextResponse.redirect(withUtm(sp.click_url, slot, sp.id), 302);
}

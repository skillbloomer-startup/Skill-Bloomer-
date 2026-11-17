import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { getSponsors } from "@/lib/content";
import { pickSponsor } from "@/lib/sponsors";
import { ARCHETYPES } from "@/lib/engine/scoring";
import { appUrl } from "@/lib/server";
import { isId } from "@/lib/api";
import type { ArchetypeKey } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** 1200×627 shareable result card. Contains ID badge, score, archetype — NEVER bias results. */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const sid = u.searchParams.get("sid");
  const s = isId(sid) ? await db().getSession(sid) : null;
  const name = s?.first_name ?? "Recruiter";
  const company = s?.company ?? "";
  const score = s?.total_score ?? 0;
  const rank = s?.rank ?? "Recruiter";
  const arch = ARCHETYPES[(s?.archetype as ArchetypeKey) ?? "detective"] ?? ARCHETYPES.detective;
  const sponsor = pickSponsor(await getSponsors(), "share_footer");
  // The shared URL carries full UTM params; the card shows a short, readable version.
  const link = `${appUrl().replace(/^https?:\/\//, "")}/?ref=${(sid ?? "").replace(/-/g, "").slice(0, 8)}`;
  const beatAi = s?.result && (s.result as { ai?: { correctOverrules?: number } }).ai?.correctOverrules;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 627, display: "flex", background: "linear-gradient(135deg,#05060f 0%,#11142b 55%,#1a0f2e 100%)", color: "#fff", fontFamily: "sans-serif", padding: 48, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(rgba(34,228,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,228,255,.07) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Badge */}
        <div style={{ display: "flex", flexDirection: "column", width: 380, height: 520, borderRadius: 28, border: "2px solid #22e4ff", background: "rgba(17,20,43,.9)", padding: 32, boxShadow: "0 0 60px rgba(34,228,255,.35)" }}>
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 4, color: "#22e4ff" }}>RECRUITER ID · 2031</div>
          <div style={{ display: "flex", width: 150, height: 150, borderRadius: 999, marginTop: 36, background: "linear-gradient(135deg,#22e4ff,#8b5cff)", alignItems: "center", justifyContent: "center", fontSize: 72, fontWeight: 800, color: "#05060f" }}>
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, marginTop: 28 }}>{name}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#ff3ea5", marginTop: 6 }}>Senior Recruiter, 2031</div>
          <div style={{ display: "flex", fontSize: 20, color: "#9aa3c7", marginTop: 6 }}>{company}</div>
          <div style={{ display: "flex", marginTop: "auto", fontSize: 16, color: "#9aa3c7" }}>ID {(sid ?? "").slice(0, 8).toUpperCase()}</div>
        </div>
        {/* Result */}
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 56, flex: 1 }}>
          <div style={{ display: "flex", fontSize: 24, color: "#b6ff3b", letterSpacing: 2 }}>SPOT THE STAR · RECRUITER 2031</div>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 800, marginTop: 14, lineHeight: 1.05 }}>{beatAi ? "I beat the AI at hiring." : "I took on the AI at hiring."}</div>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 800, color: "#22e4ff" }}>Can you?</div>
          <div style={{ display: "flex", marginTop: 36, alignItems: "flex-end" }}>
            <div style={{ display: "flex", fontSize: 110, fontWeight: 800, lineHeight: 1 }}>{score}</div>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 24, marginBottom: 10 }}>
              <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>{rank}</div>
              <div style={{ display: "flex", fontSize: 26, color: "#ff3ea5" }}>{arch.name}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", fontSize: 18, color: "#9aa3c7" }}>
            <div style={{ display: "flex", fontSize: 22, color: "#fff" }}>Play: {link}</div>
            <div style={{ display: "flex", marginTop: 6 }}>Powered by Scrini AI{sponsor.id !== "scrini" ? ` · with ${sponsor.name}` : ""}</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 627, headers: { "Cache-Control": "public, max-age=300" } }
  );
}

"use client";
import { useEffect, useState } from "react";
import type { Sponsor, SponsorSlot as Slot } from "@/lib/types";
import { activeFor, pickSponsor } from "@/lib/sponsors";
import { track } from "@/lib/client/analytics";

const seen = new Set<string>();

function useImpression(sp: Sponsor, slot: Slot, sessionId: string, key = "") {
  useEffect(() => {
    const k = `${sessionId}|${slot}|${sp.id}|${key}`;
    if (!sessionId || seen.has(k)) return;
    seen.add(k);
    track("ad_impression", { sponsor: sp.id, slot });
  }, [sp.id, slot, sessionId, key]);
}

export function clickHref(sp: Sponsor, slot: Slot, sessionId: string) {
  return `/api/r?s=${encodeURIComponent(sp.id)}&slot=${slot}&sid=${encodeURIComponent(sessionId)}`;
}

/** Inline logo with "Powered by / Sponsored by" prefix. */
export function SponsorBadge({ sponsors, slot, sessionId, prefix, className = "", rotateKey = 0 }: { sponsors: Sponsor[]; slot: Slot; sessionId: string; prefix: string; className?: string; rotateKey?: number }) {
  const sp = pickSponsor(sponsors, slot, rotateKey);
  useImpression(sp, slot, sessionId, String(rotateKey));
  return (
    <a href={clickHref(sp, slot, sessionId)} target="_blank" rel="noopener sponsored" className={`inline-flex items-center gap-2 text-xs text-white/60 hover:text-white ${className}`}>
      <span>{prefix}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={sp.logo_url} alt={sp.name} className="h-5 w-auto" loading="lazy" />
    </a>
  );
}

/** Rotating holographic "office wall screen" — slot 2. */
export function WallScreen({ sponsors, sessionId }: { sponsors: Sponsor[]; sessionId: string }) {
  const list = activeFor(sponsors, "wall");
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => x + 1), 6000);
    return () => clearInterval(t);
  }, []);
  const sp = list[i % list.length];
  useImpression(sp, "wall", sessionId, String(i % list.length));
  return (
    <a href={clickHref(sp, "wall", sessionId)} target="_blank" rel="noopener sponsored" aria-label={`${sp.name}: ${sp.tagline ?? ""}`}
      className="pointer-events-auto relative hidden md:flex h-24 w-56 overflow-hidden rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-3 flex-col justify-center shadow-glow">
      <div className="absolute inset-x-0 h-6 bg-gradient-to-b from-neon-cyan/20 to-transparent animate-scan" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={sp.logo_url} alt="" className="h-6 w-auto self-start" />
      <div className="mt-1 text-[11px] text-neon-cyan/80 animate-pulseglow">{sp.tagline}</div>
    </a>
  );
}

/** Native results ad card — slot 6. */
export function NativeAd({ sponsors, sessionId }: { sponsors: Sponsor[]; sessionId: string }) {
  const sp = pickSponsor(sponsors, "results_native");
  useImpression(sp, "results_native", sessionId);
  return (
    <div className="glass p-4">
      <div className="label mb-2">Results brought to you by</div>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sp.logo_url} alt={sp.name} className="h-7 w-auto" />
      </div>
      <p className="mt-2 font-semibold">{sp.headline}</p>
      <a href={clickHref(sp, "results_native", sessionId)} target="_blank" rel="noopener sponsored" className="btn-ghost mt-3 w-full text-sm">
        {sp.cta ?? "Learn more"} →
      </a>
    </div>
  );
}

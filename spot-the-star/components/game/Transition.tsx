"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Shared } from "./Game";
import { pickSponsor } from "@/lib/sponsors";
import { track } from "@/lib/client/analytics";
import { clickHref } from "../ui/SponsorSlot";

/** Loading / transition screen between rounds — sponsor slot 4. */
export default function Transition({ shared, nextTitle, onDone }: { shared: Shared; nextTitle: string; onDone: () => void }) {
  const sp = pickSponsor(shared.sponsors, "transition");
  useEffect(() => {
    track("ad_impression", { sponsor: sp.id, slot: "transition" });
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center text-center" onClick={onDone}>
      <div className="label">Loading next requisition</div>
      <motion.h2 initial={{ letterSpacing: "0.5em", opacity: 0 }} animate={{ letterSpacing: "0em", opacity: 1 }} className="mt-2 text-3xl font-bold">
        {nextTitle}
      </motion.h2>
      <div className="mt-6 h-1 w-56 overflow-hidden rounded bg-white/10">
        <motion.div className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.3 }} />
      </div>
      <a href={clickHref(sp, "transition", shared.sessionId)} target="_blank" rel="noopener sponsored" onClick={(e) => e.stopPropagation()} className="mt-10 flex flex-col items-center gap-2 opacity-80 hover:opacity-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sp.logo_url} alt={sp.name} className="h-8 w-auto" />
        <span className="text-xs text-white/60">{sp.tagline}</span>
      </a>
      <p className="mt-6 text-[11px] text-white/30">Tap to skip</p>
    </section>
  );
}

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { RoundResult } from "@/lib/types";
import { FLAG_LABELS } from "@/lib/types";
import type { Shared } from "./Game";
import { SponsorBadge } from "../ui/SponsorSlot";
import { fmtMoney } from "@/lib/report";

const OUTCOME: Record<string, string> = { accepted: "✅ Accepted", declined: "❌ Declined", ghosted: "👻 Accepted → ghosted", walked: "🚪 Walked away", none: "—" };

export function Kpi({ label, value, tone = "cyan" }: { label: string; value: string; tone?: "cyan" | "pink" | "lime" }) {
  const c = tone === "pink" ? "text-neon-pink" : tone === "lime" ? "text-neon-lime" : "text-neon-cyan";
  return (
    <div className="glass p-3">
      <div className="label">{label}</div>
      <div className={`mt-0.5 font-mono text-lg font-bold ${c}`}>{value}</div>
    </div>
  );
}

export default function RoundReveal({ shared, result: r, roundNo, total, onNext }: { shared: Shared; result: RoundResult; roundNo: number; total: number; onNext: () => void }) {
  const [openMissed, setOpenMissed] = useState(false);
  const cur = shared.settings.currency;
  const k = r.kpis;
  return (
    <section className="mx-auto max-w-xl py-6">
      <div className="flex items-center justify-between">
        <div className="label">Round {roundNo + 1} reveal · {r.title}</div>
        <SponsorBadge sponsors={shared.sponsors} slot="round_reveal" sessionId={shared.sessionId} prefix="Round sponsored by" rotateKey={roundNo} />
      </div>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 12 }} className="mt-4 text-center">
        <div className="text-6xl" aria-hidden>
          {r.correctHire ? "✅" : "❌"}
        </div>
        <h2 className={`mt-2 text-3xl font-black ${r.correctHire ? "text-neon-lime" : "text-neon-pink"}`}>{r.correctHire ? "Star spotted!" : "Not the star"}</h2>
        <div className="mt-1 font-mono text-2xl font-bold">+{Math.max(0, r.roundPoints)} pts{r.roundPoints < 0 ? ` (${r.roundPoints})` : ""}</div>
      </motion.div>
      <p className="glass mt-4 p-4 text-[15px] leading-relaxed">{r.explanation}</p>

      {/* holographic ARIA explanation screen */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-neon-violet/40 bg-neon-violet/10 p-4">
        <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-neon-violet/20 to-transparent animate-scan" aria-hidden />
        <div className="label !text-neon-violet">{r.ariaWasRight ? "ARIA's call" : "Where ARIA went wrong"}</div>
        <p className="mt-1 text-sm">{r.ariaMistake}</p>
        {r.overruled && <p className="mt-2 text-xs font-bold text-neon-pink">⚡ You overruled ARIA this round {r.ariaWasRight ? "— but ARIA was right." : r.correctHire ? "— and you were right." : "."}</p>}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="glass p-3">
          <div className="text-2xl font-bold text-neon-lime">{r.flagsCaught.filter((f) => f.exact).length}</div>
          <div className="text-[11px] text-white/60">flags caught</div>
        </div>
        <button className="glass p-3 hover:bg-white/10" onClick={() => setOpenMissed((o) => !o)} aria-expanded={openMissed}>
          <div className="text-2xl font-bold text-neon-pink">{r.flagsMissed.length}</div>
          <div className="text-[11px] text-white/60">missed · tap to see</div>
        </button>
        <div className="glass p-3">
          <div className="text-2xl font-bold text-neon-amber">{r.falseFlags.length}</div>
          <div className="text-[11px] text-white/60">false flags</div>
        </div>
      </div>
      {openMissed && (
        <ul className="mt-2 space-y-2">
          {r.flagsMissed.map((f, i) => (
            <li key={i} className="rounded-xl border border-neon-pink/30 bg-neon-pink/5 p-3 text-sm">
              <b>{f.candidate}</b> · <span className="text-neon-pink">{FLAG_LABELS[f.type]}</span>
              <p className="mt-1 text-white/75">{f.explanation}</p>
            </li>
          ))}
          {r.flagsCaught.filter((f) => !f.exact).map((f, i) => (
            <li key={`w${i}`} className="rounded-xl border border-neon-amber/30 bg-neon-amber/5 p-3 text-sm">
              <b>{f.candidate}</b> · right candidate, wrong reason — it was <span className="text-neon-amber">{FLAG_LABELS[f.type]}</span>
              <p className="mt-1 text-white/75">{f.explanation}</p>
            </li>
          ))}
          {r.falseFlags.map((f, i) => (
            <li key={`f${i}`} className="rounded-xl border border-white/20 bg-white/5 p-3 text-sm">
              <b>{f.candidate}</b> was clean — your “{FLAG_LABELS[f.reason]}” flag was a false alarm.
            </li>
          ))}
          {!r.flagsMissed.length && !r.falseFlags.length && <li className="text-sm text-neon-lime">Nothing missed. Clean sweep! 🧹</li>}
        </ul>
      )}

      <h3 className="label mt-5">Round KPIs</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Kpi label="Quality of hire" value={k.qualityOfHire ? `${k.qualityOfHire}/100` : "—"} tone={k.qualityOfHire >= 75 ? "lime" : "cyan"} />
        <Kpi label="Time-to-hire" value={`${k.timeToHireDays} days`} />
        <Kpi label="Cost-per-hire" value={cur === "INR" ? `₹${k.costPerHireK}K` : `$${Math.round((k.costPerHireK * 1000) / 84 / 100) / 10}k`} />
        <Kpi label="Offer" value={OUTCOME[k.offerOutcome]} tone={k.offerOutcome === "accepted" ? "lime" : "pink"} />
        <Kpi label="Employer brand" value={`${k.brandDelta >= 0 ? "+" : ""}${k.brandDelta}`} tone={k.brandDelta >= 0 ? "lime" : "pink"} />
        {k.badHireCostIncurredLpa ? (
          <Kpi label="Bad-hire cost" value={`−${cur === "INR" ? `₹${k.badHireCostIncurredLpa}L` : fmtMoney(k.badHireCostIncurredLpa, cur)}`} tone="pink" />
        ) : (
          <Kpi label="Bad-hire cost avoided" value={k.badHireCostAvoidedLpa ? `${cur === "INR" ? `₹${k.badHireCostAvoidedLpa}L` : fmtMoney(k.badHireCostAvoidedLpa, cur)}` : "—"} tone="lime" />
        )}
      </div>

      <details className="glass mt-3 p-3 text-sm">
        <summary className="cursor-pointer text-white/70">Points breakdown</summary>
        <ul className="mt-2 space-y-1 font-mono text-[12px]">
          {r.points.map((p, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span>{p.label}</span>
              <span className={p.pts >= 0 ? "text-neon-lime" : "text-neon-pink"}>{p.pts >= 0 ? `+${p.pts}` : p.pts}</span>
            </li>
          ))}
          {!r.points.length && <li>No points this round.</li>}
        </ul>
      </details>

      <button className="btn-primary mt-5 w-full py-4" onClick={onNext} autoFocus>
        {roundNo + 1 < total ? `Next round (${roundNo + 2}/${total}) →` : "See my Recruiter DNA →"}
      </button>
    </section>
  );
}

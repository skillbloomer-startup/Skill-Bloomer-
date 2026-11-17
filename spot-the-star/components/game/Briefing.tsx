"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Round, VolumePack } from "@/lib/types";
import type { Shared } from "./Game";
import { difficultySeconds } from "@/lib/engine/scoring";
import { fmtMoney } from "@/lib/report";

export function AriaOrb({ size = 44 }: { size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden>
      <div className="absolute inset-0 animate-pulseglow rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet blur-md" />
      <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-ink-900 font-mono text-[10px] font-bold text-neon-cyan">ARIA</div>
    </div>
  );
}

export default function Briefing({
  shared,
  round,
  volume,
  roundNo,
  showTutorial,
  onStart,
  onBlind,
}: {
  shared: Shared;
  round?: Round;
  volume?: VolumePack;
  roundNo: number;
  showTutorial: boolean;
  onStart: () => void;
  onBlind: (b: boolean) => void;
}) {
  const bubbles = round?.brief ?? volume?.brief ?? [];
  const [n, setN] = useState(1);
  const [tutorial, setTutorial] = useState(showTutorial && shared.firstPlay);
  useEffect(() => {
    if (n >= bubbles.length) return;
    const t = setTimeout(() => setN((x) => x + 1), 1100);
    return () => clearTimeout(t);
  }, [n, bubbles.length]);
  const s = shared.settings;
  const seconds = round ? difficultySeconds(round.seconds, s.difficulty) : volume ? difficultySeconds(volume.seconds, s.difficulty) : 0;

  return (
    <section className="mx-auto max-w-xl py-6">
      <div className="label">{round ? `Round ${roundNo + 1} · ${round.level}` : "Volume Hiring Challenge"}</div>
      <h2 className="mt-1 text-3xl font-bold">{round?.title ?? volume?.role}</h2>
      <div className="mt-2 flex flex-wrap gap-2 font-mono text-xs text-white/60">
        <span className="chip">⏱ {seconds}s</span>
        {round && <span className="chip">💰 {fmtMoney(round.budget_lpa.min, s.currency)}–{fmtMoney(round.budget_lpa.max, s.currency)}</span>}
        {round && <span className="chip">👥 {round.candidates.length} candidates</span>}
        {volume && <span className="chip">👥 {volume.cards.length} candidates · hire {volume.hires}</span>}
      </div>

      <div className="mt-6 space-y-3" aria-live="polite">
        {bubbles.slice(0, n).map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3">
            {i === 0 ? <AriaOrb /> : <div className="w-11 shrink-0" />}
            <div className="glass rounded-tl-sm px-4 py-3 text-[15px] leading-relaxed">{b}</div>
          </motion.div>
        ))}
      </div>

      {round && s.difficulty === "rookie" && (
        <div className="mt-4 rounded-xl border border-neon-lime/30 bg-neon-lime/10 px-4 py-3 text-sm text-neon-lime">💡 {round.rookie_tip}</div>
      )}

      {round?.allow_blind && (
        <label className="glass mt-4 flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
          <span>
            <span className="font-semibold">🕶️ Blind Mode</span>
            <span className="block text-xs text-white/60">Hide names, avatars, age and institutes. Judge the evidence only.</span>
          </span>
          <input type="checkbox" className="h-6 w-6 accent-[#22e4ff]" checked={s.blind} onChange={(e) => onBlind(e.target.checked)} />
        </label>
      )}

      {tutorial && (
        <div className="glass-strong mt-6 p-4">
          <div className="flex items-center justify-between">
            <div className="label">How to play</div>
            <button className="text-xs text-white/60 underline" onClick={() => setTutorial(false)}>
              Skip tutorial
            </button>
          </div>
          <ul className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            <li className="glass p-3">
              <div className="text-2xl">⭐</div>
              {volume ? "Hire" : "Shortlist"}
              <div className="text-[11px] text-white/50">swipe right · → key</div>
            </li>
            <li className="glass p-3">
              <div className="text-2xl">🚩</div>
              Flag + reason
              <div className="text-[11px] text-white/50">F key</div>
            </li>
            <li className="glass p-3">
              <div className="text-2xl">➡️</div>
              Skip
              <div className="text-[11px] text-white/50">swipe left · ← key</div>
            </li>
          </ul>
          <p className="mt-3 text-xs text-white/60">Tap “View details” (D) for references, notice period and salary. Red flags hide in dates, titles, interview tone and numbers that don't match.</p>
        </div>
      )}

      <button className="btn-primary mt-6 w-full py-4 text-lg" onClick={onStart} disabled={n < bubbles.length && false}>
        {round ? "Start round →" : "Start the clock →"}
      </button>
    </section>
  );
}

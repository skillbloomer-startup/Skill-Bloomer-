"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FlagType, VolumeLog, VolumePack } from "@/lib/types";
import type { Shared } from "./Game";
import Avatar from "../ui/Avatar";
import { FlagPicker, ScoreRing } from "./CandidateCard";
import { difficultySeconds } from "@/lib/engine/scoring";
import { track } from "@/lib/client/analytics";
import { sfx } from "@/lib/client/sound";

/** Volume Hiring Challenge: 30 cards in 3 minutes, hire 5, red-flag scoring only. */
export default function VolumeGame({ shared, pack, onDone }: { shared: Shared; pack: VolumePack; onDone: (l: VolumeLog) => void }) {
  const total = difficultySeconds(pack.seconds, shared.settings.difficulty);
  const [left, setLeft] = useState(total);
  const [i, setI] = useState(0);
  const [actions, setActions] = useState<VolumeLog["actions"]>({});
  const [flagging, setFlagging] = useState(false);
  const [done, setDone] = useState(false);
  const hires = Object.values(actions).filter((a) => a.action === "hire").length;
  // Refs keep rapid key presses from acting on a stale card between renders.
  const iRef = useRef(0);
  const actsRef = useRef<VolumeLog["actions"]>({});
  const card = pack.cards[i];

  const end = useCallback(
    (acts: VolumeLog["actions"], secs: number) => {
      if (done) return;
      setDone(true);
      onDone({ actions: acts, secondsLeft: secs, secondsTotal: total });
    },
    [done, onDone, total]
  );

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setLeft((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [done]);
  useEffect(() => {
    if (left <= 5 && left > 0) sfx.tick();
    if (left <= 0) end(actions, 0);
  }, [left, actions, end]);

  const act = useCallback(
    (action: "hire" | "skip" | "flag", flagReason?: FlagType) => {
      const idx = iRef.current;
      const card = pack.cards[idx];
      if (!card || done) return;
      const hiredNow = Object.values(actsRef.current).filter((a) => a.action === "hire").length;
      if (action === "hire" && hiredNow >= pack.hires) return;
      action === "hire" ? sfx.star() : action === "flag" ? sfx.flag() : sfx.swipe();
      track("card_swipe", { candidate: card.id, action, mode: "volume" });
      if (action === "flag") track("flag_set", { candidate: card.id, reason: flagReason, mode: "volume" });
      const next = { ...actsRef.current, [card.id]: { action, flagReason } };
      actsRef.current = next;
      setActions(next);
      setFlagging(false);
      if (idx + 1 >= pack.cards.length) end(next, left);
      else {
        iRef.current = idx + 1;
        setI(idx + 1);
      }
    },
    [done, pack, end, left]
  );

  useEffect(() => {
    if (flagging) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "s") act("hire");
      else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "k") act("skip");
      else if (e.key.toLowerCase() === "f") setFlagging(true);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [act, flagging]);

  if (!card) return null;
  return (
    <section className="mx-auto max-w-md py-3">
      <div className="sticky top-0 z-30 -mx-4 bg-ink-950/80 px-4 pb-2 backdrop-blur">
        <div className="flex items-center justify-between font-mono text-sm">
          <span>
            {i + 1}/{pack.cards.length}
          </span>
          <span className="text-neon-lime">
            Hired {hires}/{pack.hires}
          </span>
          <span className={`text-lg font-bold ${left <= 15 ? "animate-pulse text-neon-pink" : ""}`} role="timer">
            ⏱ {Math.floor(left / 60)}:{String(Math.max(0, left % 60)).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-all duration-1000" style={{ width: `${(left / total) * 100}%` }} />
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.article key={card.id} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.15 }} className="glass-strong mt-3 p-4" aria-label={`Candidate ${card.name}`}>
          <div className="flex items-center gap-3">
            <Avatar a={card.avatar} size={56} label={`Illustrated avatar of ${card.name}`} />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold">{card.name}</h3>
              <p className="text-sm text-white/70">{card.title}</p>
            </div>
            <ScoreRing score={card.aria_score} />
          </div>
          <p className="mt-3 text-sm">{card.summary}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {card.skills.map((s) => (
              <span key={s} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[12px]">
                {s}
              </span>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-black/30 p-2 font-mono text-[13px]">
            <span className="text-neon-cyan">&gt;</span> {card.interview_line}
          </p>
        </motion.article>
      </AnimatePresence>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button className="btn border border-neon-pink/50 bg-neon-pink/10 text-neon-pink" onClick={() => setFlagging(true)}>
          🚩 Flag
        </button>
        <button className="btn-ghost" onClick={() => act("skip")}>
          ➡️ Skip
        </button>
        <button className="btn-primary" onClick={() => act("hire")} disabled={hires >= pack.hires}>
          ⭐ Hire
        </button>
      </div>
      {hires >= pack.hires && <p className="mt-2 text-center text-xs text-neon-lime">All {pack.hires} hires made — keep flagging red flags for bonus points, or finish now.</p>}
      <button className="mt-3 w-full text-center text-xs text-white/50 underline" onClick={() => end(actions, left)}>
        Finish now
      </button>
      {flagging && <FlagPicker name={card.name} onCancel={() => setFlagging(false)} onPick={(f) => act("flag", f)} />}
    </section>
  );
}

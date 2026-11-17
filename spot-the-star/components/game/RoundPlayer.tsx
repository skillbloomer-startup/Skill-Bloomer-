"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import type { CardAction, Candidate, FlagType, OfferChoice, OfferOutcome, RejectChoice, Round, RoundLog } from "@/lib/types";
import { FLAG_LABELS } from "@/lib/types";
import type { Shared } from "./Game";
import CandidateCard, { displayName, FlagPicker, ScoreRing } from "./CandidateCard";
import Avatar from "../ui/Avatar";
import { ariaRanking, difficultySeconds, runnerUpFor } from "@/lib/engine/scoring";
import { OFFER_LABELS, offerTerms, resolveOffer } from "@/lib/engine/offer";
import { fmtMoney } from "@/lib/report";
import { track } from "@/lib/client/analytics";
import { sfx } from "@/lib/client/sound";
import { AriaOrb } from "./Briefing";

type Step = "sourcing" | "swipe" | "deep" | "hire" | "offer" | "reject";
const STEPS: { k: Step; label: string }[] = [
  { k: "sourcing", label: "Source" },
  { k: "swipe", label: "Screen" },
  { k: "deep", label: "Probe" },
  { k: "hire", label: "Hire" },
  { k: "offer", label: "Offer" },
  { k: "reject", label: "Close" },
];
const TIMED: Step[] = ["swipe", "deep", "hire"];

export default function RoundPlayer({ shared, round, roundNo, onDone }: { shared: Shared; round: Round; roundNo: number; onDone: (l: RoundLog) => void }) {
  const s = shared.settings;
  const blind = !!round.allow_blind && s.blind;
  const expert = s.difficulty === "expert";
  const total = difficultySeconds(round.seconds, s.difficulty);
  const ranking = useMemo(() => ariaRanking(round), [round]);
  const rankOf = (c: Candidate) => ranking.indexOf(c) + 1;
  const idxOf = (c: Candidate) => round.candidates.indexOf(c);
  const nm = (c: Candidate) => displayName(c, idxOf(c), blind);

  const [step, setStep] = useState<Step>("sourcing");
  const [timeLeft, setTimeLeft] = useState(total);
  const [timedOut, setTimedOut] = useState(false);
  const [lockedLeft, setLockedLeft] = useState<number | null>(null);
  const [sourcing, setSourcing] = useState<string[]>([]);
  const [srcLeft, setSrcLeft] = useState(10);
  const [srcTimedOut, setSrcTimedOut] = useState(false);
  const [actions, setActions] = useState<Record<string, CardAction>>({});
  const [cardIdx, setCardIdx] = useState(0);
  const [details, setDetails] = useState(false);
  const [flagFor, setFlagFor] = useState<Candidate | null>(null);
  const [questions, setQuestions] = useState<{ candidateId: string; questionId: string }[]>([]);
  const [asking, setAsking] = useState<Candidate | null>(null);
  const [references, setReferences] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<Record<string, FlagType[]>>({});
  const [hireId, setHireId] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [overruleAnim, setOverruleAnim] = useState(false);
  const [offer, setOffer] = useState<{ choice: OfferChoice; outcome: OfferOutcome; amount: number | null } | null>(null);
  const shownAt = useRef(Date.now());
  const detailsSeen = useRef(false);

  // ── Round timer (screen + deep-dive + hire) ──
  useEffect(() => {
    if (!TIMED.includes(step) || lockedLeft !== null) return;
    const t = setInterval(() => setTimeLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, [step, lockedLeft]);
  useEffect(() => {
    if (lockedLeft !== null || !TIMED.includes(step)) return;
    if (timeLeft <= 5 && timeLeft > 0) sfx.tick();
    if (timeLeft === 0 && !timedOut) {
      setTimedOut(true);
      sfx.bad();
      // Unseen cards count as skipped
      setActions((a) => {
        const n = { ...a };
        for (const c of round.candidates) if (!n[c.id]) n[c.id] = { candidateId: c.id, action: "skip", viewedDetails: false, dwellMs: 0 };
        return n;
      });
      setStep("hire");
    }
  }, [timeLeft, timedOut, step, lockedLeft, round.candidates]);

  // ── Sourcing timer (10s) ──
  useEffect(() => {
    if (step !== "sourcing") return;
    const t = setInterval(() => setSrcLeft((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [step]);
  const finishSourcing = useCallback(
    (picks: string[], timed = false) => {
      track("sourcing_pick", { channels: picks, timed_out: timed, round: roundNo + 1 });
      setSourcing(picks);
      setSrcTimedOut(timed);
      shownAt.current = Date.now();
      setStep("swipe");
    },
    [roundNo]
  );
  useEffect(() => {
    if (step === "sourcing" && srcLeft <= 0) finishSourcing(sourcing, true);
  }, [srcLeft, step, sourcing, finishSourcing]);

  // ── Swipe actions ──
  const current = round.candidates[cardIdx];
  const idxRef = useRef(0); // guards against rapid presses acting on a stale card
  const act = useCallback(
    (action: CardAction["action"], flagReason?: FlagType) => {
      const ci = idxRef.current;
      const current = round.candidates[ci];
      if (!current) return;
      const a: CardAction = { candidateId: current.id, action, flagReason, viewedDetails: detailsSeen.current, dwellMs: Date.now() - shownAt.current };
      track("card_swipe", { candidate: current.id, action, aria_score: current.aria_score, dwell_ms: a.dwellMs, viewed_details: a.viewedDetails });
      if (action === "flag") track("flag_set", { candidate: current.id, reason: flagReason });
      action === "shortlist" ? sfx.star() : action === "flag" ? sfx.flag() : sfx.swipe();
      setActions((x) => ({ ...x, [current.id]: a }));
      setDetails(false);
      detailsSeen.current = false;
      shownAt.current = Date.now();
      setFlagFor(null);
      idxRef.current = ci + 1;
      if (ci + 1 >= round.candidates.length) {
        setStep("deep");
      } else setCardIdx(ci + 1);
    },
    [round.candidates]
  );

  useEffect(() => {
    if (step !== "swipe" || flagFor) return;
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "s") act("shortlist");
      else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "k") act("skip");
      else if (e.key.toLowerCase() === "f") setFlagFor(current);
      else if (e.key.toLowerCase() === "d") {
        detailsSeen.current = true;
        setDetails((d) => !d);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [step, act, flagFor, current]);

  const shortlisted = round.candidates.filter((c) => actions[c.id]?.action === "shortlist").sort((a, b) => rankOf(a) - rankOf(b));
  const hireOptions = shortlisted.length ? shortlisted : round.candidates.filter((c) => actions[c.id]?.action !== "flag").length ? round.candidates.filter((c) => actions[c.id]?.action !== "flag") : round.candidates;

  const lockHire = () => {
    if (!hireId) return;
    const left = timedOut ? 0 : timeLeft;
    setLockedLeft(left);
    const overruled = hireId !== ranking[0].id;
    track("final_hire", { candidate: hireId, aria_rank: rankOf(round.candidates.find((c) => c.id === hireId)!), confidence, seconds_left: left });
    if (overruled) {
      track("overrule_ai", { aria_pick: ranking[0].id, hire: hireId });
      sfx.whoosh();
      setOverruleAnim(true);
      setTimeout(() => {
        setOverruleAnim(false);
        setStep("offer");
      }, 1700);
    } else setStep("offer");
  };

  const hire = round.candidates.find((c) => c.id === hireId) ?? null;
  const runnerUp = hire ? runnerUpFor(round, { actions, hireId }) : null;

  const makeOffer = (choice: OfferChoice) => {
    if (!hire) return;
    const o = resolveOffer(shared.sessionId, round, hire, choice, s.difficulty);
    track("offer_decision", { choice, outcome: o.outcome, amount: o.amount, within_budget: o.withinBudget });
    o.outcome === "accepted" ? sfx.good() : o.outcome === "walked" ? sfx.tap() : sfx.bad();
    setOffer({ choice, outcome: o.outcome, amount: o.amount });
  };

  const finishRound = (rejectChoice: RejectChoice) => {
    track("rejection_choice", { choice: rejectChoice, candidate: runnerUp?.id });
    onDone({
      roundId: round.id,
      sourcing,
      sourcingTimedOut: srcTimedOut,
      actions,
      questions,
      references,
      hireId,
      confidence,
      offerChoice: offer?.choice ?? null,
      offerOutcome: offer?.outcome ?? null,
      offerFinalLpa: offer?.amount ?? null,
      runnerUpId: runnerUp?.id ?? null,
      rejectChoice,
      secondsTotal: total,
      secondsLeft: lockedLeft ?? 0,
      timedOut,
      blind,
    });
  };

  const shownTime = lockedLeft ?? timeLeft;
  const stepIdx = STEPS.findIndex((x) => x.k === step);

  return (
    <section className="mx-auto max-w-xl py-3">
      {/* Stepper + timer */}
      <div className="sticky top-0 z-30 -mx-4 bg-ink-950/80 px-4 pb-2 pt-1 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <ol className="flex flex-wrap gap-0.5 text-[10px] font-mono uppercase" aria-label="Round progress">
            {STEPS.map((x, i) => (
              <li key={x.k} className={`rounded px-1.5 py-0.5 ${i === stepIdx ? "bg-neon-cyan text-ink-950" : i < stepIdx ? "text-neon-cyan/70" : "text-white/30"}`} aria-current={i === stepIdx ? "step" : undefined}>
                {x.label}
              </li>
            ))}
          </ol>
          {step !== "sourcing" && (
            <div className={`shrink-0 whitespace-nowrap font-mono text-lg font-bold tabular-nums ${shownTime <= 10 && lockedLeft === null ? "animate-pulse text-neon-pink" : "text-white"}`} role="timer" aria-live="off">
              ⏱ {shownTime}s
            </div>
          )}
        </div>
        {step !== "sourcing" && (
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className={`h-full transition-all duration-1000 ${shownTime <= 10 ? "bg-neon-pink" : "bg-gradient-to-r from-neon-cyan to-neon-violet"}`} style={{ width: `${(shownTime / total) * 100}%` }} />
          </div>
        )}
      </div>

      {step === "sourcing" && <SourcingStep shared={shared} round={round} picks={sourcing} setPicks={setSourcing} left={srcLeft} onConfirm={(p) => finishSourcing(p)} />}

      {step === "swipe" && current && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between text-xs text-white/60">
            <span>
              Card {cardIdx + 1} of {round.candidates.length}
            </span>
            <span>
              ⭐ {Object.values(actions).filter((a) => a.action === "shortlist").length} · 🚩 {Object.values(actions).filter((a) => a.action === "flag").length}
            </span>
          </div>
          <div className="relative h-[min(64dvh,600px)]">
            {round.candidates[cardIdx + 1] && (
              <div className="absolute inset-0 translate-y-3 scale-[.96] opacity-50" aria-hidden>
                <div className="glass-strong h-full" />
              </div>
            )}
            <AnimatePresence mode="popLayout">
              <SwipeCard key={current.id} onSwipe={(dir) => act(dir === "right" ? "shortlist" : "skip")}>
                <CandidateCard
                  c={current}
                  idx={cardIdx}
                  ariaRank={rankOf(current)}
                  blind={blind}
                  expert={expert}
                  currency={s.currency}
                  sponsors={shared.sponsors}
                  sessionId={shared.sessionId}
                  showDetails={details}
                  onToggleDetails={() => {
                    detailsSeen.current = true;
                    setDetails((d) => !d);
                  }}
                />
              </SwipeCard>
            </AnimatePresence>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button className="btn border border-neon-pink/50 bg-neon-pink/10 text-neon-pink" onClick={() => setFlagFor(current)} aria-label="Flag a red flag (F)">
              🚩 Flag
            </button>
            <button className="btn-ghost" onClick={() => act("skip")} aria-label="Skip candidate (left arrow)">
              ➡️ Skip
            </button>
            <button className="btn-primary" onClick={() => act("shortlist")} aria-label="Shortlist candidate (right arrow)">
              ⭐ Shortlist
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-white/40">Swipe right = shortlist · left = skip · keys ← → F D</p>
        </div>
      )}
      {flagFor && <FlagPicker name={nm(flagFor)} onCancel={() => setFlagFor(null)} onPick={(f) => (step === "swipe" ? act("flag", f) : flagInDeep(flagFor, f))} />}

      {step === "deep" && (
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <AriaOrb size={36} />
            <div className="glass px-3 py-2 text-sm">
              {shortlisted.length
                ? "Deep-dive (optional): ask up to 2 shortlisted candidates one interview question each, or run a reference check (−10s). Target a claim — generic questions reveal nothing."
                : "You didn't shortlist anyone. Skip ahead and pick from the remaining pool."}
            </div>
          </div>
          {shortlisted.map((c) => {
            const asked = questions.find((q) => q.candidateId === c.id);
            const ans = asked ? c.interview_answers[asked.questionId] : null;
            const q = asked ? round.questions.find((x) => x.id === asked.questionId) : null;
            const refd = references.includes(c.id);
            return (
              <div key={c.id} className="glass p-3">
                <div className="flex items-center gap-3">
                  <Avatar a={c.avatar} size={40} blind={blind} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{nm(c)}</div>
                    <div className="truncate text-xs text-white/60">{c.title}</div>
                  </div>
                  <ScoreRing score={c.aria_score} size={40} />
                </div>
                {revealed[c.id]?.length ? <div className="mt-2 text-xs text-neon-pink">🚩 Revealed: {revealed[c.id].map((f) => FLAG_LABELS[f]).join(", ")}</div> : null}
                {asked && (
                  <div className="mt-2 rounded-lg bg-black/30 p-2 text-[13px]">
                    <div className="text-white/50">Q: {q?.text}</div>
                    <div className="mt-1 font-mono">{ans?.text ?? "“That's a great question. I'm a hard worker and a team player who loves challenges.” (Generic — nothing new learned.)"}</div>
                    {ans?.clears && <div className="mt-1 text-neon-lime">✅ Cleared: {ans.clears}</div>}
                    {ans?.reveals && <div className="mt-1 text-neon-pink">🚩 That exposed a red flag.</div>}
                  </div>
                )}
                {refd && <div className="mt-2 rounded-lg bg-black/30 p-2 text-[13px] italic text-white/80">📞 {c.reference_quote}</div>}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button className="chip" disabled={!!asked || questions.length >= 2} onClick={() => setAsking(c)}>
                    🎙 Ask a question{questions.length >= 2 && !asked ? " (max 2)" : ""}
                  </button>
                  <button
                    className="chip"
                    disabled={refd}
                    onClick={() => {
                      setReferences((r) => [...r, c.id]);
                      setTimeLeft((t) => Math.max(0, t - 10));
                      track("reference_checked", { candidate: c.id });
                      sfx.tap();
                    }}
                  >
                    📞 Reference check <span className="text-neon-pink">−10s</span>
                  </button>
                  <button className="chip text-neon-pink" onClick={() => setFlagFor(c)}>
                    🚩 Flag
                  </button>
                </div>
              </div>
            );
          })}
          <button className="btn-primary w-full" onClick={() => setStep("hire")}>
            {questions.length || references.length ? "Make the final call →" : "Skip deep-dive → Final call"}
          </button>
        </div>
      )}
      {asking && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center" role="dialog" aria-modal aria-label="Choose an interview question" onClick={() => setAsking(null)}>
          <div className="glass-strong w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-bold">🎙 Ask {nm(asking)} one question</h4>
            <div className="mt-3 space-y-2">
              {round.questions.map((q, i) => (
                <button
                  key={q.id}
                  autoFocus={i === 0}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm hover:border-neon-cyan hover:bg-neon-cyan/10"
                  onClick={() => {
                    const ans = asking.interview_answers[q.id];
                    setQuestions((x) => [...x, { candidateId: asking.id, questionId: q.id }]);
                    if (ans?.reveals) setRevealed((r) => ({ ...r, [asking.id]: [...(r[asking.id] ?? []), ans.reveals!] }));
                    track("question_asked", { candidate: asking.id, question: q.id, kind: q.kind, unlocked: !!(ans?.reveals || ans?.clears) });
                    ans?.reveals ? sfx.flag() : ans?.clears ? sfx.star() : sfx.tap();
                    setAsking(null);
                  }}
                >
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "hire" && (
        <div className="mt-4 space-y-3">
          {timedOut && <div className="rounded-xl border border-neon-pink/50 bg-neon-pink/10 px-3 py-2 text-sm text-neon-pink">⏰ Time's up! Make your call now — no speed bonus this round.</div>}
          <h3 className="text-xl font-bold">Who gets the offer?</h3>
          <div className="space-y-2" role="radiogroup" aria-label="Final hire">
            {hireOptions.map((c) => (
              <button key={c.id} role="radio" aria-checked={hireId === c.id} onClick={() => (sfx.tap(), setHireId(c.id))} className={`glass flex w-full items-center gap-3 p-3 text-left transition ${hireId === c.id ? "!border-neon-cyan bg-neon-cyan/10" : "hover:bg-white/10"}`}>
                <Avatar a={c.avatar} size={44} blind={blind} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">
                    {nm(c)} {hireId === c.id && "✓"}
                  </div>
                  <div className="truncate text-xs text-white/60">{c.title}</div>
                  {revealed[c.id]?.length ? <div className="text-[11px] text-neon-pink">🚩 {revealed[c.id].map((f) => FLAG_LABELS[f]).join(", ")}</div> : null}
                </div>
                {rankOf(c) === 1 && <span className="rounded-full bg-neon-violet/30 px-2 py-0.5 text-[10px] font-bold text-neon-violet">ARIA #1</span>}
                <ScoreRing score={c.aria_score} size={40} />
              </button>
            ))}
          </div>
          <label className="glass block p-3">
            <span className="flex justify-between text-sm">
              <span>How confident are you?</span>
              <span className="font-mono font-bold text-neon-cyan">{confidence}/5</span>
            </span>
            <input type="range" min={1} max={5} step={1} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="mt-2 w-full accent-[#22e4ff]" aria-valuetext={`${confidence} of 5`} />
            <span className="flex justify-between text-[10px] text-white/40">
              <span>Coin flip</span>
              <span>Certain</span>
            </span>
          </label>
          <button className="btn-primary w-full py-4" disabled={!hireId} onClick={lockHire}>
            Lock in hire 🔒
          </button>
        </div>
      )}

      {step === "offer" && hire && (
        <OfferStep shared={shared} round={round} hire={hire} name={nm(hire)} offer={offer} onChoose={makeOffer} onContinue={() => setStep("reject")} />
      )}

      {step === "reject" && (
        <RejectStep shared={shared} name={runnerUp ? nm(runnerUp) : "the runner-up"} onChoose={finishRound} />
      )}

      <AnimatePresence>
        {overruleAnim && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alert">
            <motion.div initial={{ scale: 0.4, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} className="text-center">
              <div className="text-6xl">⚡</div>
              <div className="mt-2 text-4xl font-black text-neon-pink drop-shadow-[0_0_20px_rgba(255,62,165,.7)]">You overruled ARIA</div>
              <div className="mt-2 text-white/70">Human judgment engaged.</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );

  function flagInDeep(c: Candidate, f: FlagType) {
    setActions((x) => ({ ...x, [c.id]: { ...(x[c.id] ?? { candidateId: c.id, viewedDetails: false, dwellMs: 0 }), action: "flag", flagReason: f } }));
    track("flag_set", { candidate: c.id, reason: f, stage: "deep" });
    sfx.flag();
    setFlagFor(null);
    if (hireId === c.id) setHireId(null);
  }
}

function SwipeCard({ children, onSwipe }: { children: React.ReactNode; onSwipe: (d: "left" | "right") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const yes = useTransform(x, [30, 140], [0, 1]);
  const no = useTransform(x, [-140, -30], [1, 0]);
  const end = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120 || info.velocity.x > 600) onSwipe("right");
    else if (info.offset.x < -120 || info.velocity.x < -600) onSwipe("left");
  };
  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, touchAction: "pan-y" }}
      drag="x"
      dragDirectionLock
      dragSnapToOrigin
      dragElastic={0.7}
      onDragEnd={end}
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ x: x.get() >= 0 ? 400 : -400, opacity: 0, transition: { duration: 0.22 } }}
    >
      <motion.div style={{ opacity: yes }} className="pointer-events-none absolute left-4 top-14 z-10 rotate-[-12deg] rounded-lg border-2 border-neon-lime px-3 py-1 text-xl font-black text-neon-lime">
        SHORTLIST ⭐
      </motion.div>
      <motion.div style={{ opacity: no }} className="pointer-events-none absolute right-4 top-14 z-10 rotate-[12deg] rounded-lg border-2 border-white/70 px-3 py-1 text-xl font-black text-white/80">
        SKIP ➡️
      </motion.div>
      {children}
    </motion.div>
  );
}

function SourcingStep({ shared, round, picks, setPicks, left, onConfirm }: { shared: Shared; round: Round; picks: string[]; setPicks: (p: string[]) => void; left: number; onConfirm: (p: string[]) => void }) {
  const ch = shared.sourcing.channels;
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Where would you source a {round.title}?</h3>
        <span className={`font-mono text-2xl font-bold ${left <= 3 ? "text-neon-pink" : "text-neon-cyan"}`} role="timer">
          {Math.max(0, left)}s
        </span>
      </div>
      <p className="text-sm text-white/60">Pick 2 channels. Your choice affects pool quality, cost-per-hire and time-to-hire.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {ch.map((c) => {
          const on = picks.includes(c.id);
          return (
            <button
              key={c.id}
              aria-pressed={on}
              onClick={() => {
                sfx.tap();
                const n = on ? picks.filter((x) => x !== c.id) : picks.length >= 2 ? [picks[1], c.id] : [...picks, c.id];
                setPicks(n);
              }}
              className={`glass flex items-center gap-2 px-3 py-3 text-left text-sm transition ${on ? "!border-neon-cyan bg-neon-cyan/15" : "hover:bg-white/10"}`}
            >
              <span className="text-xl">{c.emoji}</span>
              <span className="font-medium">{c.label}</span>
              {on && <span className="ml-auto text-neon-cyan">✓</span>}
            </button>
          );
        })}
      </div>
      <button className="btn-primary mt-4 w-full" disabled={picks.length !== 2} onClick={() => onConfirm(picks)}>
        Confirm channels →
      </button>
      {!shared.firstPlay && (
        <button className="mt-2 w-full text-center text-xs text-white/50 underline" onClick={() => onConfirm(["ai_agent", "linkedin"])}>
          Skip — let ARIA pick
        </button>
      )}
    </div>
  );
}

function OfferStep({ shared, round, hire, name, offer, onChoose, onContinue }: { shared: Shared; round: Round; hire: Candidate; name: string; offer: { choice: OfferChoice; outcome: OfferOutcome; amount: number | null } | null; onChoose: (c: OfferChoice) => void; onContinue: () => void }) {
  const t = offerTerms(hire, round);
  const cur = shared.settings.currency;
  const OUT: Record<OfferOutcome, { e: string; t: string; c: string }> = {
    accepted: { e: "🎉", t: `${name} accepted!`, c: "text-neon-lime" },
    declined: { e: "😞", t: `${name} declined and took the competing offer.`, c: "text-neon-pink" },
    ghosted: { e: "👻", t: `${name} accepted… then ghosted on joining day.`, c: "text-neon-amber" },
    walked: { e: "🚪", t: "You walked away. The role reopens.", c: "text-white" },
  };
  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-xl font-bold">Offer stage: {name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="glass p-3">
          <div className="label">Their expectation</div>
          <div className="font-mono text-lg font-bold">{fmtMoney(t.expectation, cur)}</div>
        </div>
        <div className="glass p-3">
          <div className="label">Competing offer</div>
          <div className="font-mono text-lg font-bold text-neon-pink">{fmtMoney(t.competing, cur)}</div>
        </div>
        <div className="glass p-3">
          <div className="label">Your budget band</div>
          <div className="font-mono text-lg font-bold">
            {fmtMoney(t.budgetMin, cur)}–{fmtMoney(t.budgetMax, cur)}
          </div>
        </div>
        <div className="glass p-3">
          <div className="label">Your standard offer</div>
          <div className="font-mono text-lg font-bold text-neon-cyan">{fmtMoney(t.anchor, cur)}</div>
        </div>
      </div>
      {!offer ? (
        <>
          <div className="space-y-2">
            {(Object.keys(OFFER_LABELS) as OfferChoice[]).map((k) => (
              <button key={k} onClick={() => onChoose(k)} className="glass flex w-full items-center gap-3 px-3 py-3 text-left hover:border-neon-cyan hover:bg-neon-cyan/10">
                <span className="text-2xl">{OFFER_LABELS[k].emoji}</span>
                <span>
                  <span className="block font-semibold">{OFFER_LABELS[k].label}</span>
                  <span className="text-xs text-white/50">{OFFER_LABELS[k].hint}</span>
                </span>
              </button>
            ))}
          </div>
          {!shared.firstPlay && (
            <button className="w-full text-center text-xs text-white/50 underline" onClick={() => onChoose("middle")}>
              Skip — auto meet in the middle
            </button>
          )}
        </>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong p-5 text-center" role="status">
          <div className="text-5xl">{OUT[offer.outcome].e}</div>
          <div className={`mt-2 text-lg font-bold ${OUT[offer.outcome].c}`}>{OUT[offer.outcome].t}</div>
          {offer.amount !== null && (
            <div className="mt-1 text-sm text-white/60">
              Offer: {fmtMoney(offer.amount, cur)} {offer.amount > t.budgetMax ? "· ⚠️ above budget" : "· within budget"}
            </div>
          )}
          <button className="btn-primary mt-4 w-full" onClick={onContinue} autoFocus>
            Continue →
          </button>
        </motion.div>
      )}
    </div>
  );
}

function RejectStep({ shared, name, onChoose }: { shared: Shared; name: string; onChoose: (c: RejectChoice) => void }) {
  const opts: { k: RejectChoice; e: string; l: string }[] = [
    { k: "personal", e: "💌", l: "Send personalised feedback" },
    { k: "pool", e: "🗂️", l: "Keep in talent pool + stay in touch" },
    { k: "generic", e: "🤖", l: "Generic auto-email" },
    { k: "none", e: "🔕", l: "No response" },
  ];
  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-xl font-bold">One last thing: {name} was your runner-up.</h3>
      <p className="text-sm text-white/60">How do you close the loop? (1 tap)</p>
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o) => (
          <button key={o.k} onClick={() => (sfx.tap(), onChoose(o.k))} className="glass flex flex-col items-center gap-1 px-3 py-4 text-center text-sm hover:border-neon-cyan hover:bg-neon-cyan/10">
            <span className="text-2xl">{o.e}</span>
            {o.l}
          </button>
        ))}
      </div>
      {!shared.firstPlay && (
        <button className="w-full text-center text-xs text-white/50 underline" onClick={() => onChoose("generic")}>
          Skip — send the auto-email
        </button>
      )}
    </div>
  );
}

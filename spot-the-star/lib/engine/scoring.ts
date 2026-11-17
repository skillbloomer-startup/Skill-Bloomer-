// ─────────────────────────────────────────────────────────────
// Scoring + competency engine (Classic / Team mode)
// Pure functions — shared by client (instant feedback) and server (source of truth).
// ─────────────────────────────────────────────────────────────
import {
  ArchetypeKey,
  Candidate,
  CardAction,
  CompetencyKey,
  CompetencyScores,
  COMPETENCIES,
  Difficulty,
  FLAG_LABELS,
  lc,
  FlagType,
  GameResult,
  Mode,
  Round,
  RoundLog,
  RoundResult,
  SourcingTable,
} from "../types";
import { avg, clamp, round1 } from "./rng";

export const POINTS = {
  correctHire: 500,
  flagExact: 100,
  flagWrongReason: 40,
  falseFlag: -50,
  correctOverrule: 250,
  wrongOverrule: -100,
  questionUnlock: 75,
  sourcingPerChannel: 25, // 2 optimal channels = +50
  offerAccepted: 150,
  rejectGood: 50,
  calibrated: 50,
  perSecond: 5,
  streakMultiplier: 1.5,
};

export const FRAUD_TYPES: FlagType[] = ["fake_experience", "title_inflation", "inconsistent_info", "keyword_stuffing"];
export const SKILL_TYPES: FlagType[] = ["skill_mismatch", "keyword_stuffing"];
export const CULTURE_TYPES: FlagType[] = ["culture_risk"];

export function difficultySeconds(base: number, d: Difficulty) {
  return Math.round(base * (d === "rookie" ? 1.3 : d === "expert" ? 0.75 : 1));
}

/** ARIA's #1 = highest aria_score. ARIA's "shortlist" = top 3. */
export function ariaRanking(r: Round): Candidate[] {
  return [...r.candidates].sort((a, b) => b.aria_score - a.aria_score);
}

export function isGoodCandidate(c: Candidate) {
  return c.flags.length === 0 && c.true_quality >= 70;
}

/** Implicit rating used for bias-trap consistency (never shown publicly). */
export function implicitRating(a: CardAction | undefined, hired: boolean) {
  if (!a) return 40;
  const base = a.action === "shortlist" ? 75 : a.action === "skip" ? 45 : 15;
  return base + (hired ? 10 : 0) + (a.viewedDetails ? 4 : 0);
}

function nameOf(c: Candidate, blind: boolean, idx: number) {
  return blind ? `Candidate ${String.fromCharCode(65 + idx)}` : c.name;
}

export interface RoundCtx {
  sessionId: string;
  difficulty: Difficulty;
  sourcing: SourcingTable;
}

export function runnerUpFor(r: Round, log: Pick<RoundLog, "actions" | "hireId">): Candidate | null {
  const ranked = ariaRanking(r).filter((c) => c.id !== log.hireId);
  const shortlisted = ranked.filter((c) => log.actions[c.id]?.action === "shortlist");
  return shortlisted[0] ?? ranked.find((c) => log.actions[c.id]?.action !== "flag") ?? ranked[0] ?? null;
}

export function scoreRound(r: Round, log: RoundLog, ctx: RoundCtx, roundNo: number): RoundResult {
  const pts: { label: string; pts: number }[] = [];
  const ranking = ariaRanking(r);
  const ariaPick = ranking[0];
  const best = r.candidates.find((c) => c.is_best_hire)!;
  const hire = r.candidates.find((c) => c.id === log.hireId) ?? null;
  const correctHire = !!hire && hire.id === best.id;
  const idx = (c: Candidate) => r.candidates.indexOf(c);
  const nm = (c: Candidate) => nameOf(c, log.blind, idx(c));

  if (correctHire) pts.push({ label: "Correct final hire", pts: POINTS.correctHire });

  // Flags
  const flagsCaught: RoundResult["flagsCaught"] = [];
  const flagsMissed: RoundResult["flagsMissed"] = [];
  const falseFlags: RoundResult["falseFlags"] = [];
  for (const c of r.candidates) {
    const a = log.actions[c.id];
    const flagged = a?.action === "flag" && a.flagReason;
    if (c.flags.length === 0) {
      if (flagged) {
        falseFlags.push({ candidate: nm(c), reason: a!.flagReason! });
        pts.push({ label: `False flag on ${nm(c)}`, pts: POINTS.falseFlag });
      }
      continue;
    }
    if (flagged) {
      const exact = c.flags.some((f) => f.type === a!.flagReason);
      pts.push({
        label: exact ? `Red flag caught: ${nm(c)}` : `Right candidate, wrong reason: ${nm(c)}`,
        pts: exact ? POINTS.flagExact : POINTS.flagWrongReason,
      });
      c.flags.forEach((f, k) => {
        const caught = exact ? true : k === 0; // right reason on a multi-flag candidate = candidate caught
        if (caught) flagsCaught.push({ candidate: nm(c), type: f.type, explanation: f.explanation, exact });
        else flagsMissed.push({ candidate: nm(c), type: f.type, explanation: f.explanation });
      });
    } else {
      for (const f of c.flags) flagsMissed.push({ candidate: nm(c), type: f.type, explanation: f.explanation });
    }
  }

  // ARIA overrule
  const ariaWasRight = ariaPick.id === best.id;
  const overruled = !!hire && hire.id !== ariaPick.id;
  if (overruled && !ariaWasRight && correctHire) pts.push({ label: "Correctly overruled ARIA", pts: POINTS.correctOverrule });
  if (overruled && ariaWasRight) pts.push({ label: "Overruled ARIA when ARIA was right", pts: POINTS.wrongOverrule });

  // Interview questions
  for (const q of log.questions) {
    const c = r.candidates.find((x) => x.id === q.candidateId);
    const ans = c?.interview_answers[q.questionId];
    if (ans && (ans.reveals || ans.clears)) pts.push({ label: `Question unlocked hidden info (${nm(c!)})`, pts: POINTS.questionUnlock });
  }

  // Sourcing
  const roleSrc = ctx.sourcing.roles[r.role_key];
  const optimalHits = log.sourcing.filter((s) => roleSrc?.optimal.includes(s)).length;
  if (optimalHits) pts.push({ label: `Optimal sourcing channel${optimalHits > 1 ? "s" : ""}`, pts: optimalHits * POINTS.sourcingPerChannel });

  // Offer
  const hiredAndAccepted = log.offerOutcome === "accepted";
  const withinBudget = log.offerFinalLpa === null || log.offerFinalLpa <= r.budget_lpa.max + 1e-9;
  if (hiredAndAccepted && withinBudget) pts.push({ label: "Offer accepted within budget", pts: POINTS.offerAccepted });

  // Rejection
  if (log.rejectChoice === "personal" || log.rejectChoice === "pool")
    pts.push({ label: log.rejectChoice === "personal" ? "Personalised feedback to runner-up" : "Runner-up kept in talent pool", pts: POINTS.rejectGood });

  // Calibration
  if (hire && ((correctHire && log.confidence >= 4) || (!correctHire && log.confidence <= 2)))
    pts.push({ label: "Well-calibrated confidence", pts: POINTS.calibrated });

  // Speed (only rewarded for correct hires — rushing a wrong pick earns nothing)
  if (correctHire && !log.timedOut && log.secondsLeft > 0) pts.push({ label: `Speed bonus (${log.secondsLeft}s left)`, pts: log.secondsLeft * POINTS.perSecond });

  const roundPoints = pts.reduce((s, p) => s + p.pts, 0);

  // Bias pair
  let biasGap: number | null = null;
  let biasAttribute: string | null = null;
  const pairs = groupBy(r.candidates.filter((c) => c.bias_pair), (c) => c.bias_pair!.group);
  for (const g of Object.values(pairs)) {
    if (g.length !== 2) continue;
    const [a, b] = g;
    const ra = implicitRating(log.actions[a.id], log.hireId === a.id);
    const rb = implicitRating(log.actions[b.id], log.hireId === b.id);
    biasGap = Math.abs(ra - rb);
    biasAttribute = a.bias_pair!.attribute;
  }

  // KPIs
  const fx = roleSrc?.fx ?? {};
  const picks = log.sourcing.map((s) => fx[s]).filter(Boolean);
  const poolQuality = picks.length ? avg(picks.map((p) => p.quality)) : 3;
  let days = picks.length ? avg(picks.map((p) => p.days)) : 45;
  let cost = picks.length ? avg(picks.map((p) => p.cost_k)) : 60;
  days += log.questions.length * 2 + log.references.length;
  if (log.offerOutcome === "declined" || log.offerOutcome === "ghosted" || log.offerOutcome === "walked") {
    days += 21;
    cost *= 1.5;
  }
  const joined = log.offerOutcome === "accepted";
  const quality = joined && hire ? clamp(hire.true_quality + (poolQuality - 6) * 1.5) : 0;
  const badHire = !!hire && hire.true_quality < 60 && joined;
  const ariaBad = ariaPick.true_quality < 60;
  const avoided = hire && hire.id !== ariaPick.id && ariaBad && !badHire ? r.bad_hire_cost_lpa : 0;
  const brandDelta =
    log.rejectChoice === "personal" ? 8 : log.rejectChoice === "pool" ? 6 : log.rejectChoice === "generic" ? 0 : log.rejectChoice === "none" ? -12 : 0;
  const interviewed = new Set(log.questions.map((q) => q.candidateId).concat(log.references)).size;
  const shortlisted = Object.values(log.actions).filter((a) => a.action === "shortlist").length;

  let explanation: string;
  if (correctHire) explanation = `✅ ${nm(best)} was the best hire. ${r.best_hire_explanation}`;
  else if (hire) explanation = `❌ You hired ${nm(hire)}. ${hire.hire_outcome} The best hire was ${nm(best)}: ${r.best_hire_explanation}`;
  else explanation = `❌ No hire made. The best hire was ${nm(best)}: ${r.best_hire_explanation}`;

  return {
    roundId: r.id,
    title: r.title,
    correctHire,
    hireName: hire ? nm(hire) : null,
    bestName: nm(best),
    ariaPickName: nm(ariaPick),
    ariaWasRight,
    overruled,
    points: pts,
    roundPoints,
    flagsCaught,
    flagsMissed,
    falseFlags,
    explanation,
    ariaMistake: r.aria_mistake,
    kpis: {
      qualityOfHire: Math.round(quality),
      timeToHireDays: Math.round(days),
      costPerHireK: Math.round(cost),
      offerOutcome: log.offerOutcome ?? "none",
      brandDelta,
      badHireCostAvoidedLpa: avoided,
      badHireCostIncurredLpa: badHire ? r.bad_hire_cost_lpa : 0,
      funnel: {
        sourced: Math.round(60 + poolQuality * 14 + log.sourcing.length * 25),
        screened: r.candidates.length,
        interviewed: Math.max(interviewed, Math.min(shortlisted, 3)),
        offered: log.offerOutcome && log.offerOutcome !== "walked" ? 1 : 0,
        joined: joined ? 1 : 0,
      },
    },
    biasGap,
    biasAttribute,
  };
}

function groupBy<T>(xs: T[], k: (x: T) => string): Record<string, T[]> {
  const o: Record<string, T[]> = {};
  for (const x of xs) (o[k(x)] ||= []).push(x);
  return o;
}

// ── Competency engine ────────────────────────────────────────

interface Moment {
  key: CompetencyKey;
  good: boolean;
  text: string;
  weight: number;
}

export function computeGame(
  rounds: Round[],
  logs: RoundLog[],
  ctx: RoundCtx & { mode: Mode; packId: string }
): GameResult {
  const results = logs.map((l, i) => scoreRound(rounds[i], l, ctx, i + 1));
  const moments: Moment[] = [];
  const R = (i: number) => `Round ${i + 1}`;

  // Candidate-level catch score helper
  const catchScores: Record<"fraud" | "skill" | "culture", number[]> = { fraud: [], skill: [], culture: [] };
  const falsePenalty = { fraud: 0, skill: 0, culture: 0 };
  let flagRight = 0,
    flagTotal = 0;

  logs.forEach((log, i) => {
    const r = rounds[i];
    const idx = (c: Candidate) => r.candidates.indexOf(c);
    const nm = (c: Candidate) => nameOf(c, log.blind, idx(c));
    for (const c of r.candidates) {
      const a = log.actions[c.id];
      const hired = log.hireId === c.id;
      const cats = new Set<"fraud" | "skill" | "culture">();
      for (const f of c.flags) {
        if (FRAUD_TYPES.includes(f.type)) cats.add("fraud");
        if (SKILL_TYPES.includes(f.type)) cats.add("skill");
        if (CULTURE_TYPES.includes(f.type)) cats.add("culture");
      }
      if (c.flags.length) {
        flagTotal++;
        for (const cat of cats) {
          const catTypes = cat === "fraud" ? FRAUD_TYPES : cat === "skill" ? SKILL_TYPES : CULTURE_TYPES;
          let s = 0;
          if (a?.action === "flag") {
            s = catTypes.includes(a.flagReason!) && c.flags.some((f) => f.type === a.flagReason) ? 1 : 0.45;
          } else if (hired) s = 0;
          else if (a?.action === "skip") s = 0.3;
          else s = 0.1;
          catchScores[cat].push(s);
          const f = c.flags.find((x) => catTypes.includes(x.type))!;
          if (s === 1) moments.push({ key: cat, good: true, weight: 2, text: `${R(i)}: you caught ${nm(c)}'s ${lc(FLAG_LABELS[f.type])} — ${shorten(f.explanation)}` });
          else if (hired) moments.push({ key: cat, good: false, weight: 3, text: `${R(i)}: you hired ${nm(c)} and missed the ${lc(FLAG_LABELS[f.type])} — ${shorten(f.explanation)}` });
          else if (s < 0.45) moments.push({ key: cat, good: false, weight: 2, text: `${R(i)}: you missed the ${lc(FLAG_LABELS[f.type])} on ${nm(c)}'s profile — ${shorten(f.explanation)}` });
        }
        if (a?.action === "flag" && c.flags.some((f) => f.type === a.flagReason)) flagRight++;
      } else if (a?.action === "flag") {
        const cat = CULTURE_TYPES.includes(a.flagReason!) ? "culture" : SKILL_TYPES.includes(a.flagReason!) ? "skill" : "fraud";
        falsePenalty[cat] += 15;
        moments.push({ key: cat, good: false, weight: 1, text: `${R(i)}: you flagged ${nm(c)} for ${lc(FLAG_LABELS[a.flagReason!])}, but the profile was clean${c.suspicion ? ` (the “${c.suspicion}” had an innocent explanation)` : ""}.` });
      }
    }
  });
  // Interview reveals boost skill + culture
  const revealBoost = { skill: 0, culture: 0, fraud: 0 };
  logs.forEach((log, i) => {
    const r = rounds[i];
    for (const q of log.questions) {
      const c = r.candidates.find((x) => x.id === q.candidateId);
      const ans = c?.interview_answers[q.questionId];
      if (ans?.reveals) {
        const cat = CULTURE_TYPES.includes(ans.reveals) ? "culture" : SKILL_TYPES.includes(ans.reveals) ? "skill" : "fraud";
        revealBoost[cat] += 8;
      }
    }
  });

  const catComp = (cat: "fraud" | "skill" | "culture") =>
    catchScores[cat].length ? clamp(avg(catchScores[cat]) * 100 - falsePenalty[cat] + revealBoost[cat]) : null;

  // AI judgment
  let decisionScores: number[] = [];
  let followed = 0,
    followTotal = 0,
    followedWhenWrong = 0,
    correctOverrules = 0,
    wrongOverrules = 0,
    ariaRightCards = 0,
    ariaRightFollowed = 0,
    ariaWrongCards = 0,
    ariaWrongResisted = 0;
  logs.forEach((log, i) => {
    const r = rounds[i];
    const res = results[i];
    const ranking = ariaRanking(r);
    const top3 = new Set(ranking.slice(0, 3).map((c) => c.id));
    for (const c of r.candidates) {
      const a = log.actions[c.id];
      if (!a) continue;
      followTotal++;
      const ariaRec = top3.has(c.id);
      const playerYes = a.action === "shortlist";
      const follows = ariaRec === playerYes;
      const ariaRight = ariaRec === isGoodCandidate(c);
      if (follows) {
        followed++;
        if (!ariaRight) followedWhenWrong++;
      }
      if (ariaRight) {
        ariaRightCards++;
        if (follows) ariaRightFollowed++;
      } else {
        ariaWrongCards++;
        if (!follows) ariaWrongResisted++;
      }
    }
    if (!log.hireId) {
      decisionScores.push(20);
      return;
    }
    const nm = ranking[0].name;
    if (res.ariaWasRight && !res.overruled) {
      decisionScores.push(100);
      moments.push({ key: "ai", good: true, weight: 1, text: `${R(i)}: you trusted ARIA's #1 when the evidence backed it up.` });
    } else if (res.ariaWasRight && res.overruled) {
      decisionScores.push(15);
      wrongOverrules++;
      moments.push({ key: "ai", good: false, weight: 3, text: `${R(i)}: you overruled ARIA, but ARIA's #1 (${res.ariaPickName}) was actually the best hire.` });
    } else if (!res.ariaWasRight && res.correctHire) {
      decisionScores.push(100);
      correctOverrules++;
      moments.push({ key: "ai", good: true, weight: 3, text: `${R(i)}: you overruled ARIA's ${ranking[0].aria_score}-point pick (${res.ariaPickName}) and hired ${res.bestName} — the right call.` });
    } else if (!res.ariaWasRight && res.overruled) {
      decisionScores.push(45);
      moments.push({ key: "ai", good: false, weight: 1, text: `${R(i)}: you rightly distrusted ARIA's #1, but hired ${res.hireName} instead of ${res.bestName}.` });
    } else {
      decisionScores.push(0);
      moments.push({ key: "ai", good: false, weight: 3, text: `${R(i)}: you went with ARIA's #1 (${res.ariaPickName}, ${ranking[0].aria_score}) — ARIA was wrong. ${shorten(r.aria_mistake, 110)}` });
    }
    void nm;
  });
  const cardAi = avg([
    ariaRightCards ? ariaRightFollowed / ariaRightCards : 0.5,
    ariaWrongCards ? ariaWrongResisted / ariaWrongCards : 0.5,
  ]);
  const aiComp = clamp(avg(decisionScores) * 0.65 + cardAi * 100 * 0.35);

  // Bias
  const pairs = results.filter((r) => r.biasGap !== null).map((r) => ({ attribute: r.biasAttribute!, gap: r.biasGap! }));
  const biasScores = pairs.map((p) => clamp(100 - p.gap * 1.6));
  const blindIdx = logs.map((l, i) => (l.blind ? i : -1)).filter((i) => i >= 0);
  const nonBlindIdx = logs.map((l, i) => (!l.blind ? i : -1)).filter((i) => i >= 0);
  const blindAccuracy = blindIdx.length ? Math.round((blindIdx.filter((i) => results[i].correctHire).length / blindIdx.length) * 100) : null;
  const nonBlindAccuracy = nonBlindIdx.length ? Math.round((nonBlindIdx.filter((i) => results[i].correctHire).length / nonBlindIdx.length) * 100) : null;
  let biasComp = pairs.length ? avg(biasScores) : null;
  if (biasComp !== null && blindIdx.length) biasComp = clamp(biasComp + 5); // choosing blind mode is a good habit
  pairs.forEach((p, k) => {
    const i = results.findIndex((r) => r.biasAttribute === p.attribute);
    if (p.gap >= 15) moments.push({ key: "bias", good: false, weight: 2, text: `${R(i)}: you rated two equally qualified candidates ${p.gap} points apart. The only difference was ${p.attribute}.` });
    else moments.push({ key: "bias", good: true, weight: 1, text: `${R(i)}: you treated two equal candidates consistently, despite a difference in ${p.attribute}.` });
    void k;
  });

  // Sourcing
  const sourcingScores = logs.map((log, i) => {
    const role = ctx.sourcing.roles[rounds[i].role_key];
    if (!role || log.sourcing.length === 0) {
      moments.push({ key: "sourcing", good: false, weight: 1, text: `${R(i)}: the sourcing timer ran out before you picked channels.` });
      return 20;
    }
    const hits = log.sourcing.filter((s) => role.optimal.includes(s)).length;
    const q = avg(log.sourcing.map((s) => role.fx[s]?.quality ?? 0)) / 10;
    const label = (id: string) => ctx.sourcing.channels.find((c) => c.id === id)?.label ?? id;
    if (hits === 2) moments.push({ key: "sourcing", good: true, weight: 2, text: `${R(i)}: ${log.sourcing.map(label).join(" + ")} was the ideal channel mix for a ${rounds[i].title}.` });
    else
      moments.push({
        key: "sourcing",
        good: false,
        weight: hits ? 1 : 2,
        text: `${R(i)}: you sourced via ${log.sourcing.map(label).join(" + ")}; the best fit was ${role.optimal.map(label).join(" + ")}. ${role.why}`,
      });
    return clamp(hits * 30 + q * 40);
  });

  // Interview design
  const interviewScores = logs.map((log, i) => {
    const r = rounds[i];
    if (log.questions.length === 0) {
      moments.push({ key: "interview", good: false, weight: 1, text: `${R(i)}: you skipped the interview question — one targeted question could have tested a claim.` });
      return 30 + Math.min(10, log.references.length * 5);
    }
    let unlocked = 0;
    let s = 0;
    for (const q of log.questions) {
      const c = r.candidates.find((x) => x.id === q.candidateId)!;
      const qq = r.questions.find((x) => x.id === q.questionId);
      const ans = c.interview_answers[q.questionId];
      const nm = nameOf(c, log.blind, r.candidates.indexOf(c));
      if (ans?.reveals || ans?.clears) {
        unlocked++;
        moments.push({ key: "interview", good: true, weight: 2, text: `${R(i)}: your question “${shorten(qq?.text ?? "", 60)}” ${ans.reveals ? `exposed ${nm}'s ${lc(FLAG_LABELS[ans.reveals])}` : `cleared a false suspicion about ${nm}`}.` });
      } else if (qq?.kind === "generic") {
        moments.push({ key: "interview", good: false, weight: 2, text: `${R(i)}: you asked ${nm} “${qq.text}” — a generic question that revealed nothing.` });
      }
      s += qq?.kind === "generic" ? 0 : 1;
    }
    const ratio = unlocked / log.questions.length;
    const structured = s / log.questions.length;
    return clamp(ratio * 70 + structured * 25 + Math.min(10, log.references.length * 5));
  });

  // Offer
  const offerScores: number[] = [];
  logs.forEach((log, i) => {
    const r = rounds[i];
    const hire = r.candidates.find((c) => c.id === log.hireId);
    if (!hire || !log.offerChoice) return;
    const within = log.offerFinalLpa === null || log.offerFinalLpa <= r.budget_lpa.max + 1e-9;
    const nm = nameOf(hire, log.blind, r.candidates.indexOf(hire));
    let s = 0;
    switch (log.offerOutcome) {
      case "accepted":
        s = within ? (log.offerChoice === "match" ? 88 : 100) : 55;
        if (!within) moments.push({ key: "offer", good: false, weight: 2, text: `${R(i)}: ${nm} accepted at ₹${log.offerFinalLpa} LPA — above the ₹${r.budget_lpa.max} LPA cap.` });
        else moments.push({ key: "offer", good: true, weight: 1, text: `${R(i)}: you closed ${nm} at ₹${log.offerFinalLpa} LPA, inside budget.` });
        break;
      case "ghosted":
        s = 35;
        moments.push({ key: "offer", good: false, weight: 2, text: `${R(i)}: ${nm} accepted, then ghosted. Signals like a long notice period or many parallel interviews predict this.` });
        break;
      case "declined":
        s = log.offerChoice === "hold" ? 25 : 35;
        moments.push({ key: "offer", good: false, weight: 2, text: `${R(i)}: ${nm} declined your “${log.offerChoice}” offer against a ₹${hire.offer.competing_offer_lpa} LPA competing offer.` });
        break;
      case "walked":
        s = hire.true_quality < 60 ? 75 : 30;
        break;
    }
    offerScores.push(s);
  });

  // Speed vs quality
  const timeFracs: number[] = [];
  const speedScores = logs.map((log, i) => {
    const res = results[i];
    const frac = 1 - log.secondsLeft / Math.max(1, log.secondsTotal);
    timeFracs.push(log.timedOut ? 1 : frac);
    if (log.timedOut) {
      moments.push({ key: "speed", good: false, weight: 2, text: `${R(i)}: you ran out of time — over-deliberation lets strong candidates slip away.` });
      return 35;
    }
    if (res.correctHire) {
      if (frac < 0.3) return 85;
      if (frac > 0.85) return 72;
      moments.push({ key: "speed", good: true, weight: 1, text: `${R(i)}: right hire with ${log.secondsLeft}s to spare — fast and accurate.` });
      return 100;
    }
    if (frac < 0.35) {
      moments.push({ key: "speed", good: false, weight: 2, text: `${R(i)}: you decided in ${log.secondsTotal - log.secondsLeft}s and hired the wrong person — speed without verification.` });
      return 25;
    }
    return 45;
  });

  // Candidate experience
  let brand = 50;
  const cxScores = logs.map((log, i): number | null => {
    const r = rounds[i];
    const ru = r.candidates.find((c) => c.id === log.runnerUpId);
    const nm = ru ? nameOf(ru, log.blind, r.candidates.indexOf(ru)) : "the runner-up";
    brand += results[i].kpis.brandDelta;
    switch (log.rejectChoice) {
      case "personal":
        moments.push({ key: "cx", good: true, weight: 1, text: `${R(i)}: ${nm} got personalised feedback — that's how employer brands are built.` });
        return 100;
      case "pool":
        moments.push({ key: "cx", good: true, weight: 1, text: `${R(i)}: you kept ${nm} in the talent pool — a cheap future hire.` });
        return 90;
      case "generic":
        moments.push({ key: "cx", good: false, weight: 1, text: `${R(i)}: ${nm} got a generic auto-email after reaching the final stage.` });
        return 50;
      case "none":
        moments.push({ key: "cx", good: false, weight: 2, text: `${R(i)}: ${nm} reached the final stage and never heard back.` });
        return 10;
      default:
        return null;
    }
  }).filter((x): x is number => x !== null);
  brand = clamp(brand);
  const cxComp = cxScores.length ? clamp(avg(cxScores) * 0.75 + brand * 0.25) : null;

  const competencies: CompetencyScores = {
    fraud: rnd(catComp("fraud")),
    skill: rnd(catComp("skill")),
    ai: rnd(aiComp),
    bias: rnd(biasComp),
    culture: rnd(catComp("culture")),
    sourcing: rnd(avg(sourcingScores)),
    interview: rnd(avg(interviewScores)),
    offer: rnd(offerScores.length ? avg(offerScores) : null),
    speed: rnd(avg(speedScores)),
    cx: rnd(cxComp),
  };

  // Totals
  const baseScore = results.reduce((s, r) => s + r.roundPoints, 0);
  const streak = results.length === 3 && results.every((r) => r.correctHire);
  const totalScore = Math.max(0, Math.round(streak ? baseScore * POINTS.streakMultiplier : baseScore));
  const correct = results.filter((r) => r.correctHire).length;
  const accuracy = Math.round((correct / Math.max(1, results.length)) * 100);

  // Calibration
  const confs = logs.filter((l) => l.hireId).map((l) => l.confidence);
  const avgConfidence = round1(avg(confs));
  const expected = ((avgConfidence - 1) / 4) * 100;
  const calibration = {
    avgConfidence,
    accuracy,
    verdict: (expected - accuracy > 25 ? "over-confident" : accuracy - expected > 25 ? "under-confident" : "well-calibrated") as GameResult["calibration"]["verdict"],
  };

  // KPIs total
  const joinedQ = results.filter((r) => r.kpis.qualityOfHire > 0).map((r) => r.kpis.qualityOfHire);
  const offers = results.filter((r) => r.kpis.offerOutcome !== "none" && r.kpis.offerOutcome !== "walked");
  const kpis = {
    qualityOfHire: Math.round(avg(joinedQ)),
    timeToHireDays: Math.round(avg(results.map((r) => r.kpis.timeToHireDays))),
    costPerHireK: Math.round(avg(results.map((r) => r.kpis.costPerHireK))),
    offerAcceptance: offers.length ? Math.round((offers.filter((r) => r.kpis.offerOutcome === "accepted").length / offers.length) * 100) : 0,
    employerBrand: Math.round(brand),
    badHireCostAvoidedLpa: round1(results.reduce((s, r) => s + r.kpis.badHireCostAvoidedLpa, 0)),
    funnel: results.reduce(
      (f, r) => ({
        sourced: f.sourced + r.kpis.funnel.sourced,
        screened: f.screened + r.kpis.funnel.screened,
        interviewed: f.interviewed + r.kpis.funnel.interviewed,
        offered: f.offered + r.kpis.funnel.offered,
        joined: f.joined + r.kpis.funnel.joined,
      }),
      { sourced: 0, screened: 0, interviewed: 0, offered: 0, joined: 0 }
    ),
  };

  const ai = { followed, total: followTotal, followedWhenWrong, correctOverrules, wrongOverrules };
  const archetype = pickArchetype(competencies, {
    avgTimeFrac: avg(timeFracs),
    accuracy,
    blindFollowTopPick: results.filter((r) => !r.ariaWasRight && !r.overruled && r.hireName).length,
    wrongOverrules,
    cardFollowRate: followTotal ? followed / followTotal : 0,
    ignoredRightRate: ariaRightCards ? 1 - ariaRightFollowed / ariaRightCards : 0,
  });

  const { strengths, blindSpots } = strengthsAndBlindSpots(competencies, moments);

  return {
    mode: ctx.mode,
    difficulty: ctx.difficulty,
    packId: ctx.packId,
    totalScore,
    baseScore,
    streak,
    rank: rankFor(totalScore, ctx.mode),
    archetype,
    competencies,
    rounds: results,
    accuracy,
    ai,
    bias: { pairs, avgGap: pairs.length ? Math.round(avg(pairs.map((p) => p.gap))) : null, blindAccuracy, nonBlindAccuracy },
    calibration,
    kpis,
    strengths,
    blindSpots,
    actionPlan: actionPlanFor(competencies),
    certificateLevel: certificateLevel(competencies, ctx.mode),
  };
  void flagRight;
  void flagTotal;
}

function rnd(v: number | null) {
  return v === null || Number.isNaN(v) ? null : Math.round(v);
}

export function shorten(s: string, n = 140) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

export const RANKS = [
  { min: 0, label: "Rookie Screener" },
  { min: 1800, label: "Sharp Recruiter" },
  { min: 3600, label: "Talent Detective" },
  { min: 5600, label: "Hiring Legend" },
];
export const VOLUME_RANKS = [
  { min: 0, label: "Rookie Screener" },
  { min: 500, label: "Sharp Recruiter" },
  { min: 1000, label: "Talent Detective" },
  { min: 1500, label: "Hiring Legend" },
];

export function rankFor(score: number, mode: Mode) {
  const table = mode === "volume" ? VOLUME_RANKS : RANKS;
  let label = table[0].label;
  for (const r of table) if (score >= r.min) label = r.label;
  return label;
}

export const ARCHETYPES: Record<ArchetypeKey, { name: string; emoji: string; blurb: string }> = {
  detective: { name: "The Detective", emoji: "🕵️", blurb: "You catch what others miss — fake timelines, inflated titles, hollow skills. You take your time to be sure." },
  speedster: { name: "The Speedster", emoji: "⚡", blurb: "You move fast and keep the pipeline flowing. Subtle red flags sometimes slip past at speed." },
  loyalist: { name: "The AI Loyalist", emoji: "🤖", blurb: "You lean on ARIA's ranking — even when the evidence says otherwise. Your AI is a co-pilot, not the pilot." },
  maverick: { name: "The Gut-Feel Maverick", emoji: "🎲", blurb: "You trust your instinct and overrule the AI — sometimes when it was right. Back gut calls with evidence." },
  advocate: { name: "The Talent Advocate", emoji: "💛", blurb: "Candidates love working with you. You close offers well and leave every finalist with a good story." },
  strategic: { name: "The Strategic Partner", emoji: "🏆", blurb: "Balanced across every dimension: evidence-led, fast, fair, and great with candidates. Top tier." },
};

export function pickArchetype(
  c: CompetencyScores,
  f: { avgTimeFrac: number; accuracy: number; blindFollowTopPick: number; wrongOverrules: number; cardFollowRate: number; ignoredRightRate: number }
): ArchetypeKey {
  const vals = Object.values(c).filter((v): v is number => v !== null);
  const mean = avg(vals);
  const min = Math.min(...vals);
  if (vals.length >= 8 && min >= 60 && mean >= 75) return "strategic";
  if (f.blindFollowTopPick >= 2 || (f.blindFollowTopPick >= 1 && f.cardFollowRate >= 0.75)) return "loyalist";
  if (f.wrongOverrules >= 1 || f.ignoredRightRate >= 0.6) return "maverick";
  const fraud = c.fraud ?? 50;
  const advocate = avg([c.offer ?? 50, c.cx ?? 50]);
  const fit: Record<"detective" | "speedster" | "advocate", number> = {
    detective: fraud * 0.6 + f.avgTimeFrac * 40,
    speedster: (1 - f.avgTimeFrac) * 70 + (100 - fraud) * 0.3,
    advocate: advocate * 0.9,
  };
  if (fraud >= 65 && f.avgTimeFrac >= 0.7) return "detective";
  if (f.avgTimeFrac <= 0.5 && fraud < 65) return "speedster";
  if (advocate >= 75) return "advocate";
  return (Object.entries(fit).sort((a, b) => b[1] - a[1])[0][0] as ArchetypeKey) ?? "detective";
}

function strengthsAndBlindSpots(c: CompetencyScores, moments: Moment[]) {
  const scored = COMPETENCIES.filter((k) => c[k.key] !== null).map((k) => ({ key: k.key, v: c[k.key] as number }));
  const sorted = [...scored].sort((a, b) => b.v - a.v);
  const pick = (key: CompetencyKey, good: boolean) =>
    moments.filter((m) => m.key === key && m.good === good).sort((a, b) => b.weight - a.weight)[0]?.text ??
    (good ? "Consistently solid decisions in this area." : "Room to grow — see the micro-lesson below.");
  const strengths = sorted.slice(0, 2).map((s) => ({ key: s.key, moment: pick(s.key, true) }));
  const blindSpots = sorted
    .slice(-2)
    .reverse()
    .map((s) => ({ key: s.key, moment: pick(s.key, false) }));
  return { strengths, blindSpots };
}

export const ACTION_PLAN: Record<CompetencyKey, string> = {
  fraud: "Add a 30-second timeline check to every screen: line up dates, verify company headcount, and insist on one direct-manager reference.",
  skill: "Rewrite one interview question per must-have skill as “Tell me about the last time YOU did X” and probe for specifics.",
  ai: "For your next 10 hires, log every time you follow or overrule the AI shortlist — and the evidence you used. Review the hit rate monthly.",
  bias: "Run a blind first-pass screen (hide name, photo, institute, graduation year) on your next open role and compare the shortlist.",
  culture: "Add one ownership question (“Tell me about a time your team missed a target”) and score blame vs ownership language.",
  sourcing: "Track cost-per-hire AND 6-month quality by channel for one quarter, then re-allocate budget to the top two channels per role family.",
  interview: "Write a 'good answer' anchor for each question before the interview and drop any question that can't change your decision.",
  offer: "Ask every finalist “What would make this a clear yes?” before you put a number on the table, and pre-approve non-cash levers.",
  speed: "Define a must-verify checklist per role so you can move fast without skipping the checks that matter.",
  cx: "Send every finalist a 3-line personal note (one strength, one reason, one open door) within 48 hours of the decision.",
};

function actionPlanFor(c: CompetencyScores) {
  return COMPETENCIES.filter((k) => c[k.key] !== null)
    .sort((a, b) => (c[a.key] as number) - (c[b.key] as number))
    .slice(0, 3)
    .map((k) => ACTION_PLAN[k.key]);
}

export function certificateLevel(c: CompetencyScores, mode: Mode): number | null {
  if (mode === "volume") return null;
  const vals = Object.values(c);
  if (vals.some((v) => v === null || v < 70)) return null;
  const mean = avg(vals as number[]);
  return mean >= 90 ? 3 : mean >= 80 ? 2 : 1;
}

export function weakestCompetency(c: CompetencyScores): CompetencyKey {
  return (COMPETENCIES.filter((k) => c[k.key] !== null).sort((a, b) => (c[a.key] as number) - (c[b.key] as number))[0]?.key ?? "fraud") as CompetencyKey;
}

/** Scrini-AI CTA personalised to the weakest competency. */
export const SCRINI_PITCH: Record<CompetencyKey, string> = {
  fraud: "Scrini AI auto-verifies timelines, titles and references on every CV",
  skill: "Scrini AI runs skill-proof interviews that separate claims from hands-on work",
  ai: "Scrini AI shows the evidence behind every AI score so you know when to overrule",
  bias: "Scrini AI offers blind-screening mode and bias-gap analytics for your team",
  culture: "Scrini AI's interview agent scores ownership and behavioural signals",
  sourcing: "Scrini AI's sourcing agents pick the right channels for every role",
  interview: "Scrini AI generates structured, claim-testing interview kits per CV",
  offer: "Scrini AI predicts offer drop-outs and suggests the right close",
  speed: "Scrini AI automates screening so you move fast without skipping checks",
  cx: "Scrini AI sends personalised candidate updates and rejections automatically",
};

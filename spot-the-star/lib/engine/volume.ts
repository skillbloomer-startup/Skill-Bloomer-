// Volume Hiring Challenge: 30 cards, 3 minutes, hire 5. Red-flag scoring only.
import type { CompetencyKey, CompetencyScores, Difficulty, GameResult, VolumeLog, VolumePack } from "../types";
import { FLAG_LABELS, lc } from "../types";
import { ACTION_PLAN, CULTURE_TYPES, FRAUD_TYPES, POINTS, SKILL_TYPES, rankFor, shorten } from "./scoring";
import { avg, clamp } from "./rng";

export function computeVolume(pack: VolumePack, log: VolumeLog, difficulty: Difficulty, packId: string): GameResult {
  const pts: { label: string; pts: number }[] = [];
  const caught: GameResult["rounds"][number]["flagsCaught"] = [];
  const missed: GameResult["rounds"][number]["flagsMissed"] = [];
  const falseFlags: GameResult["rounds"][number]["falseFlags"] = [];
  const cat: Record<"fraud" | "skill" | "culture", number[]> = { fraud: [], skill: [], culture: [] };
  let falseN = 0;
  let hiresClean = 0;
  let hiresBad = 0;
  let followHighScoreBad = 0;
  let highScoreBad = 0;
  const moments: { key: CompetencyKey; good: boolean; text: string }[] = [];

  for (const c of pack.cards) {
    const a = log.actions[c.id];
    if (c.flags.length) {
      const f = c.flags[0];
      const k = FRAUD_TYPES.includes(f.type) ? "fraud" : SKILL_TYPES.includes(f.type) ? "skill" : CULTURE_TYPES.includes(f.type) ? "culture" : "fraud";
      if (c.aria_score >= 80) {
        highScoreBad++;
        if (a?.action === "hire") followHighScoreBad++;
      }
      if (a?.action === "flag") {
        const exact = c.flags.some((x) => x.type === a.flagReason);
        pts.push({ label: exact ? `Red flag caught: ${c.name}` : `Right candidate, wrong reason: ${c.name}`, pts: exact ? POINTS.flagExact : POINTS.flagWrongReason });
        caught.push({ candidate: c.name, type: f.type, explanation: f.explanation, exact });
        cat[k].push(exact ? 1 : 0.45);
        if (exact) moments.push({ key: k, good: true, text: `You caught ${c.name}'s ${lc(FLAG_LABELS[f.type])}.` });
      } else {
        missed.push({ candidate: c.name, type: f.type, explanation: f.explanation });
        cat[k].push(a?.action === "skip" ? 0.3 : 0);
        if (a?.action === "hire") {
          hiresBad++;
          pts.push({ label: `Hired a red-flag candidate: ${c.name}`, pts: -100 });
          moments.push({ key: k, good: false, text: `You hired ${c.name} — ${shorten(f.explanation, 100)}` });
        } else moments.push({ key: k, good: false, text: `You missed ${c.name}: ${shorten(f.explanation, 100)}` });
      }
    } else if (a?.action === "flag") {
      falseN++;
      falseFlags.push({ candidate: c.name, reason: a.flagReason! });
      pts.push({ label: `False flag on ${c.name}`, pts: POINTS.falseFlag });
    } else if (a?.action === "hire") hiresClean++;
  }
  const hiresDone = hiresClean + hiresBad >= pack.hires;
  if (hiresDone && log.secondsLeft > 0) pts.push({ label: `Speed bonus (${log.secondsLeft}s left)`, pts: log.secondsLeft * POINTS.perSecond });
  const base = pts.reduce((s, p) => s + p.pts, 0);
  const comp = (k: "fraud" | "skill" | "culture") => (cat[k].length ? Math.round(clamp(avg(cat[k]) * 100 - falseN * 4)) : null);
  const totalFlagged = pack.cards.filter((c) => c.flags.length).length;
  const exactCaught = caught.filter((c) => c.exact).length;
  const frac = 1 - log.secondsLeft / log.secondsTotal;
  const accuracy = Math.round((exactCaught / Math.max(1, totalFlagged)) * 100);
  const speed = Math.round(
    clamp(!hiresDone ? 35 : accuracy >= 60 ? (frac < 0.85 ? 100 : 75) : frac < 0.4 ? 30 : 50)
  );
  const ai = Math.round(clamp(highScoreBad ? (1 - followHighScoreBad / highScoreBad) * 100 : 60));
  const competencies: CompetencyScores = {
    fraud: comp("fraud"),
    skill: comp("skill"),
    ai,
    bias: null,
    culture: comp("culture"),
    sourcing: null,
    interview: null,
    offer: null,
    speed,
    cx: null,
  };
  const scored = (Object.keys(competencies) as CompetencyKey[]).filter((k) => competencies[k] !== null).sort((a, b) => competencies[b]! - competencies[a]!);
  const pick = (k: CompetencyKey, good: boolean) => moments.find((m) => m.key === k && m.good === good)?.text ?? (good ? "Solid, consistent calls." : "See the micro-lesson below.");
  const totalScore = Math.max(0, base);
  return {
    mode: "volume",
    difficulty,
    packId,
    totalScore,
    baseScore: base,
    streak: false,
    rank: rankFor(totalScore, "volume"),
    archetype: frac < 0.5 && accuracy < 60 ? "speedster" : accuracy >= 70 ? "detective" : ai < 50 ? "loyalist" : "speedster",
    competencies,
    rounds: [
      {
        roundId: pack.id,
        title: pack.role,
        correctHire: hiresBad === 0 && hiresDone,
        hireName: null,
        bestName: "",
        ariaPickName: "",
        ariaWasRight: false,
        overruled: false,
        points: pts,
        roundPoints: base,
        flagsCaught: caught,
        flagsMissed: missed,
        falseFlags,
        explanation: `You hired ${hiresClean + hiresBad} of ${pack.hires} (${hiresBad} with hidden red flags) and caught ${exactCaught} of ${totalFlagged} red flags.`,
        ariaMistake: `ARIA scored ${highScoreBad} red-flag candidates 80+. You hired ${followHighScoreBad} of them.`,
        kpis: {
          qualityOfHire: hiresClean + hiresBad ? Math.round((hiresClean / (hiresClean + hiresBad)) * 85) : 0,
          timeToHireDays: 9,
          costPerHireK: 4,
          offerOutcome: "none",
          brandDelta: 0,
          badHireCostAvoidedLpa: Math.round(exactCaught * 0.8 * 10) / 10,
          badHireCostIncurredLpa: hiresBad * 1.2,
          funnel: { sourced: 640, screened: pack.cards.length, interviewed: 0, offered: hiresClean + hiresBad, joined: hiresClean + hiresBad },
        },
        biasGap: null,
        biasAttribute: null,
      },
    ],
    accuracy,
    ai: { followed: followHighScoreBad, total: highScoreBad, followedWhenWrong: followHighScoreBad, correctOverrules: highScoreBad - followHighScoreBad, wrongOverrules: 0 },
    bias: { pairs: [], avgGap: null, blindAccuracy: null, nonBlindAccuracy: null },
    calibration: { avgConfidence: 0, accuracy, verdict: "well-calibrated" },
    kpis: {
      qualityOfHire: hiresClean + hiresBad ? Math.round((hiresClean / (hiresClean + hiresBad)) * 85) : 0,
      timeToHireDays: 9,
      costPerHireK: 4,
      offerAcceptance: 0,
      employerBrand: 50,
      badHireCostAvoidedLpa: Math.round(exactCaught * 0.8 * 10) / 10,
      funnel: { sourced: 640, screened: pack.cards.length, interviewed: 0, offered: hiresClean + hiresBad, joined: hiresClean + hiresBad },
    },
    strengths: scored.slice(0, 2).map((k) => ({ key: k, moment: pick(k, true) })),
    blindSpots: scored.slice(-2).reverse().map((k) => ({ key: k, moment: pick(k, false) })),
    actionPlan: [...scored].reverse().slice(0, 3).map((k) => ACTION_PLAN[k]),
    certificateLevel: null,
  };
}

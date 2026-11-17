// Simulates several player archetypes through the engine and validates content invariants.
import { fsContent } from "../lib/content-fs";
import { computeGame, ariaRanking, runnerUpFor } from "../lib/engine/scoring";
import { computeVolume } from "../lib/engine/volume";
import { resolveOffer } from "../lib/engine/offer";
import { leadScore } from "../lib/engine/lead";
import type { RoundLog, Round, OfferChoice, CardAction } from "../lib/types";

const idx = fsContent.index();
const pack = fsContent.pack(idx.packs[0].file);
const sourcing = fsContent.sourcing();
let failures = 0;
const assert = (c: boolean, m: string) => { if (!c) { failures++; console.error("FAIL:", m); } };

// Content invariants
for (const [i, r] of pack.rounds.entries()) {
  assert(r.candidates.length === 6, `${r.id} has 6 candidates`);
  assert(r.candidates.filter((c) => c.is_best_hire).length === 1, `${r.id} has exactly one best hire`);
  assert(r.questions.length === 6, `${r.id} has 6 questions`);
  const top = ariaRanking(r)[0];
  if (i >= 1) assert(!top.is_best_hire, `${r.id}: ARIA top pick must not be best hire`);
  const pairs = r.candidates.filter((c) => c.bias_pair);
  assert(pairs.length === 2, `${r.id} has a bias-trap pair`);
  assert(!!sourcing.roles[r.role_key], `${r.id} sourcing role exists`);
}

type Strategy = "perfect" | "loyalist" | "random" | "maverick";
function play(strategy: Strategy, sid: string): RoundLog[] {
  return pack.rounds.map((r: Round, ri) => {
    const actions: Record<string, CardAction> = {};
    const top = ariaRanking(r);
    const rnd = (n: number) => (Math.abs(Math.sin(n * 999 + ri)) * 1000) % 1;
    r.candidates.forEach((c, k) => {
      let action: CardAction["action"] = "skip";
      let flagReason;
      if (strategy === "perfect") {
        if (c.flags.length) { action = "flag"; flagReason = c.flags[0].type; }
        else if (c.true_quality >= 70) action = "shortlist";
      } else if (strategy === "loyalist") {
        action = top.slice(0, 3).includes(c) ? "shortlist" : "skip";
      } else if (strategy === "maverick") {
        action = top.slice(3).includes(c) ? "shortlist" : "skip";
      } else {
        const x = rnd(k);
        action = x < 0.4 ? "shortlist" : x < 0.7 ? "skip" : "flag";
        if (action === "flag") flagReason = "fake_experience";
      }
      actions[c.id] = { candidateId: c.id, action, flagReason: flagReason as any, viewedDetails: strategy === "perfect", dwellMs: 3000 };
    });
    const hire = strategy === "perfect" ? r.candidates.find((c) => c.is_best_hire)! :
      strategy === "loyalist" ? top[0] : strategy === "maverick" ? top[4] : r.candidates[Math.floor(rnd(9) * 6)];
    const questions = strategy === "perfect" ? r.candidates.flatMap((c) => Object.entries(c.interview_answers).filter(([, a]) => a.reveals || a.clears).slice(0, 1).map(([q]) => ({ candidateId: c.id, questionId: q }))).slice(0, 2) : strategy === "random" ? [{ candidateId: hire.id, questionId: "q5" }] : [];
    const choice: OfferChoice = strategy === "perfect" ? "perks" : strategy === "loyalist" ? "match" : "hold";
    const off = resolveOffer(sid, r, hire, choice, "pro");
    const log: RoundLog = {
      roundId: r.id, sourcing: strategy === "perfect" ? sourcing.roles[r.role_key].optimal : ["linkedin", "agency"], sourcingTimedOut: false,
      actions, questions, references: [], hireId: hire.id, confidence: strategy === "perfect" ? 5 : strategy === "loyalist" ? 5 : 3,
      offerChoice: choice, offerOutcome: off.outcome, offerFinalLpa: off.amount, runnerUpId: null,
      rejectChoice: strategy === "perfect" ? "personal" : strategy === "loyalist" ? "generic" : "none",
      secondsTotal: r.seconds, secondsLeft: strategy === "perfect" ? Math.round(r.seconds * 0.4) : strategy === "random" ? Math.round(r.seconds * 0.8) : 20, timedOut: false, blind: false,
    };
    log.runnerUpId = runnerUpFor(r, log)?.id ?? null;
    return log;
  });
}

for (const s of ["perfect", "loyalist", "maverick", "random"] as Strategy[]) {
  const logs = play(s, `sim-${s}`);
  const g = computeGame(pack.rounds, logs, { sessionId: `sim-${s}`, difficulty: "pro", sourcing, mode: "classic", packId: pack.id });
  console.log(`\n== ${s}: score ${g.totalScore} (${g.rank}) archetype=${g.archetype} cert=${g.certificateLevel} acc=${g.accuracy}%`);
  console.log("   competencies", JSON.stringify(g.competencies));
  console.log("   blindSpots", g.blindSpots.map((b) => b.key + ": " + b.moment).join(" | "));
  console.log("   ai", JSON.stringify(g.ai), "bias", JSON.stringify(g.bias));
  if (s === "perfect") { assert(g.accuracy === 100, "perfect accuracy"); assert(g.archetype === "strategic", "perfect → strategic"); }
  if (s === "loyalist") assert(g.archetype === "loyalist", "loyalist archetype");
  if (s === "maverick") assert(g.archetype === "maverick" || g.archetype === "speedster", "maverick-ish archetype");
}

const vol = fsContent.volume(idx.volume);
const vlog = { actions: Object.fromEntries(vol.cards.map((c, i) => [c.id, c.flags.length ? { action: "flag" as const, flagReason: c.flags[0].type } : i < 12 ? { action: "hire" as const } : { action: "skip" as const }])), secondsLeft: 40, secondsTotal: 180 };
let hires = 0; for (const k in vlog.actions) if ((vlog.actions as any)[k].action === "hire") { if (++hires > 5) (vlog.actions as any)[k] = { action: "skip" }; }
const vg = computeVolume(vol, vlog, "pro", vol.id);
console.log(`\n== volume perfect: ${vg.totalScore} ${vg.rank} acc=${vg.accuracy}`, JSON.stringify(vg.competencies));
assert(vg.accuracy === 100, "volume perfect accuracy");

const ls = leadScore({ role: "HR Head", companySize: "1000+", hiringVolume: "200+", pains: ["fake candidates"], demoClicked: true });
console.log("\nlead", ls);
assert(ls.score === 100 && ls.tag === "Hot", "lead score cap");
console.log(failures ? `\n${failures} FAILURES` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);

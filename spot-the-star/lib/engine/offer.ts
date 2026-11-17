import type { Candidate, Difficulty, OfferChoice, OfferOutcome, Round } from "../types";
import { round1, seeded } from "./rng";

export interface OfferTerms {
  expectation: number;
  competing: number;
  budgetMin: number;
  budgetMax: number;
  anchor: number; // your standard offer
}

export function offerTerms(c: Candidate, r: Round): OfferTerms {
  const anchor = round1(
    Math.min(r.budget_lpa.max, Math.max(r.budget_lpa.min, (c.details.current_ctc_lpa || r.budget_lpa.min) * 1.2))
  );
  return {
    expectation: c.details.salary_expectation_lpa,
    competing: c.offer.competing_offer_lpa,
    budgetMin: r.budget_lpa.min,
    budgetMax: r.budget_lpa.max,
    anchor,
  };
}

export function offerAmount(choice: OfferChoice, t: OfferTerms): number | null {
  const top = Math.max(t.expectation, t.competing);
  switch (choice) {
    case "match":
      return round1(top);
    case "middle":
      return round1((t.anchor + top) / 2);
    case "hold":
      return t.anchor;
    case "perks":
      return t.anchor; // + non-cash perks
    case "walk":
      return null;
  }
}

export const OFFER_LABELS: Record<OfferChoice, { label: string; emoji: string; hint: string }> = {
  match: { label: "Match their ask / competing offer", emoji: "🤝", hint: "Highest acceptance, may break budget" },
  middle: { label: "Meet in the middle", emoji: "⚖️", hint: "Balanced" },
  hold: { label: "Hold firm at your standard offer", emoji: "🧱", hint: "Protects budget, risk of decline" },
  perks: { label: "Standard offer + non-cash perks", emoji: "🎁", hint: "Joining bonus, WFH, learning budget" },
  walk: { label: "Walk away", emoji: "🚪", hint: "No offer made" },
};

/** Hidden probability model. Deterministic per session+round+choice so the server can verify. */
export function resolveOffer(
  sessionId: string,
  round: Round,
  c: Candidate,
  choice: OfferChoice,
  difficulty: Difficulty
): { outcome: OfferOutcome; amount: number | null; withinBudget: boolean } {
  const t = offerTerms(c, round);
  const amount = offerAmount(choice, t);
  if (choice === "walk" || amount === null) return { outcome: "walked", amount: null, withinBudget: true };
  let p = c.offer.accept_prob[choice as Exclude<OfferChoice, "walk">];
  if (difficulty === "rookie") p += 0.05;
  if (difficulty === "expert") p -= 0.05;
  const rng = seeded(`${sessionId}:${round.id}:${c.id}:${choice}`);
  const r1 = rng();
  const r2 = rng();
  const withinBudget = amount <= t.budgetMax + 1e-9;
  if (r1 >= p) return { outcome: "declined", amount, withinBudget };
  if (r2 < c.offer.ghost_prob) return { outcome: "ghosted", amount, withinBudget };
  return { outcome: "accepted", amount, withinBudget };
}

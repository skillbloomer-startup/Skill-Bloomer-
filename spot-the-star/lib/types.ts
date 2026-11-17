// ─────────────────────────────────────────────────────────────
// Core domain types for Spot the Star — Recruiter 2031
// Content is JSON-driven: everything in /content conforms to these.
// ─────────────────────────────────────────────────────────────

export type FlagType =
  | "fake_experience"
  | "skill_mismatch"
  | "title_inflation"
  | "culture_risk"
  | "inconsistent_info"
  | "keyword_stuffing";

export const FLAG_LABELS: Record<FlagType, string> = {
  fake_experience: "Fake / overlapping experience",
  skill_mismatch: "Skill mismatch",
  title_inflation: "Title inflation",
  culture_risk: "Culture risk",
  inconsistent_info: "Inconsistent salary / notice",
  keyword_stuffing: "Keyword-stuffed CV",
};

export const FLAG_SHORT: Record<FlagType, string> = {
  fake_experience: "Fake exp.",
  skill_mismatch: "Skill gap",
  title_inflation: "Title inflation",
  culture_risk: "Culture risk",
  inconsistent_info: "Inconsistent info",
  keyword_stuffing: "Keyword stuffing",
};

export type CompetencyKey =
  | "fraud"
  | "skill"
  | "ai"
  | "bias"
  | "culture"
  | "sourcing"
  | "interview"
  | "offer"
  | "speed"
  | "cx";

export const COMPETENCIES: { key: CompetencyKey; label: string; short: string }[] = [
  { key: "fraud", label: "Fraud Detection", short: "Fraud" },
  { key: "skill", label: "Skill Validation", short: "Skills" },
  { key: "ai", label: "AI Judgment", short: "AI" },
  { key: "bias", label: "Bias Awareness", short: "Bias" },
  { key: "culture", label: "Culture & Behavioral Read", short: "Culture" },
  { key: "sourcing", label: "Sourcing Strategy", short: "Sourcing" },
  { key: "interview", label: "Interview Design", short: "Interview" },
  { key: "offer", label: "Offer & Negotiation", short: "Offer" },
  { key: "speed", label: "Speed vs Quality Balance", short: "Speed" },
  { key: "cx", label: "Candidate Experience", short: "CX" },
];

export interface Avatar {
  skin: number; // 0-5 index into palette
  hair: "short" | "long" | "bun" | "curly" | "bald" | "wavy" | "hijab" | "turban";
  hairColor: number; // 0-5
  accessory?: "glasses" | "earrings" | "beard" | "none";
  bg: number; // 0-5
}

export interface Role3 {
  title: string;
  company: string; // fictional only
  from: string; // "2019-04"
  to: string; // "2021-06" | "present"
  note?: string; // e.g. "team of 5"
}

export interface InterviewAnswer {
  text: string;
  reveals?: FlagType; // reveals a hidden flag
  clears?: string; // clears a false suspicion — explanation
}

export interface Candidate {
  id: string;
  name: string;
  pronoun?: string;
  age?: number;
  title: string;
  location: string;
  avatar: Avatar;
  roles: Role3[];
  skills: string[];
  education: string;
  blind_education: string; // shown in Blind Mode
  aria_score: number;
  aria_reason: string;
  interview: { lines: string[]; sentiment: "Confident" | "Positive" | "Neutral" | "Guarded" | "Defensive" | "Enthusiastic" };
  details: {
    references: string;
    notice_period: string;
    salary_expectation_lpa: number;
    current_ctc_lpa: number;
    activity: string;
  };
  flags: { type: FlagType; explanation: string }[];
  suspicion?: string; // a thing that LOOKS like a red flag but isn't (false suspicion)
  bias_pair?: { group: string; attribute: string }; // two candidates with same group = equal-substance pair
  interview_answers: Record<string, InterviewAnswer>; // keyed by question id
  reference_quote: string;
  offer: {
    competing_offer_lpa: number;
    accept_prob: { match: number; middle: number; hold: number; perks: number };
    ghost_prob: number; // P(accepted-then-ghosted | accepted)
  };
  true_quality: number; // 0-100 hidden performance prediction
  is_best_hire: boolean;
  hire_outcome: string; // what happens 6 months later if hired
}

export interface InterviewQuestion {
  id: string;
  text: string;
  kind: "structured" | "behavioral" | "technical" | "generic";
}

export interface Round {
  id: string;
  title: string; // role being hired
  level: "easy" | "medium" | "hard";
  seconds: number;
  role_key: string; // sourcing table key
  brief: string[]; // ARIA briefing bubbles
  rookie_tip: string;
  budget_lpa: { min: number; max: number };
  bad_hire_cost_lpa: number;
  questions: InterviewQuestion[];
  candidates: Candidate[];
  aria_mistake: string; // explanation of ARIA's error (or confirmation when ARIA right)
  best_hire_explanation: string;
  allow_blind?: boolean;
}

export interface RolePack {
  id: string;
  name: string;
  industry: string;
  description: string;
  rounds: Round[];
}

export interface SourcingChannel {
  id: string;
  label: string;
  emoji: string;
}

export interface SourcingRoleFx {
  [channelId: string]: { quality: number; cost_k: number; days: number };
}

export interface SourcingTable {
  channels: SourcingChannel[];
  roles: Record<string, { optimal: string[]; fx: SourcingRoleFx; why: string }>;
}

export interface MicroLesson {
  id: string;
  competency: CompetencyKey;
  title: string;
  minutes: number;
  body: string[];
  takeaway: string;
  sponsor_slot?: boolean;
}

export interface VolumeCard {
  id: string;
  name: string;
  avatar: Avatar;
  title: string;
  summary: string;
  skills: string[];
  aria_score: number;
  interview_line: string;
  flags: { type: FlagType; explanation: string }[];
}

export interface VolumePack {
  id: string;
  role: string;
  seconds: number;
  hires: number;
  brief: string[];
  cards: VolumeCard[];
}

// ── Sponsors ────────────────────────────────────────────────
export type SponsorSlot =
  | "splash"
  | "wall"
  | "ats_header"
  | "transition"
  | "round_reveal"
  | "results_native"
  | "share_footer"
  | "lesson";

export const SPONSOR_SLOTS: { key: SponsorSlot; label: string }[] = [
  { key: "splash", label: "Splash “Powered by”" },
  { key: "wall", label: "Office wall screen" },
  { key: "ats_header", label: "ATS header bar (card UI)" },
  { key: "transition", label: "Round transition screen" },
  { key: "round_reveal", label: "Round reveal badge" },
  { key: "results_native", label: "Results native ad card" },
  { key: "share_footer", label: "Share card + certificate footer" },
  { key: "lesson", label: "Micro-lesson “Lesson by”" },
];

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  click_url: string;
  tagline?: string;
  headline?: string;
  cta?: string;
  slots: SponsorSlot[];
  start: string; // ISO date
  end: string; // ISO date
  priority: number;
  active: boolean;
}

// ── Gameplay telemetry (what the client records) ────────────
export type Difficulty = "rookie" | "pro" | "expert";
export type Mode = "classic" | "volume" | "team";
export type OfferChoice = "match" | "middle" | "hold" | "perks" | "walk";
export type OfferOutcome = "accepted" | "declined" | "ghosted" | "walked";
export type RejectChoice = "none" | "generic" | "personal" | "pool";

export interface CardAction {
  candidateId: string;
  action: "shortlist" | "skip" | "flag";
  flagReason?: FlagType;
  viewedDetails: boolean;
  dwellMs: number;
}

export interface RoundLog {
  roundId: string;
  sourcing: string[];
  sourcingTimedOut: boolean;
  actions: Record<string, CardAction>; // final action per candidate
  questions: { candidateId: string; questionId: string }[];
  references: string[];
  hireId: string | null;
  confidence: number; // 1-5
  offerChoice: OfferChoice | null;
  offerOutcome: OfferOutcome | null;
  offerFinalLpa: number | null;
  runnerUpId: string | null;
  rejectChoice: RejectChoice | null;
  secondsTotal: number;
  secondsLeft: number;
  timedOut: boolean;
  blind: boolean;
}

export interface VolumeLog {
  actions: Record<string, { action: "hire" | "skip" | "flag"; flagReason?: FlagType }>;
  secondsLeft: number;
  secondsTotal: number;
}

export interface Badge {
  firstName: string;
  role: string;
  company: string;
}

export interface CompetencyScores {
  fraud: number | null;
  skill: number | null;
  ai: number | null;
  bias: number | null;
  culture: number | null;
  sourcing: number | null;
  interview: number | null;
  offer: number | null;
  speed: number | null;
  cx: number | null;
}

export type ArchetypeKey = "detective" | "speedster" | "loyalist" | "maverick" | "advocate" | "strategic";

export interface RoundResult {
  roundId: string;
  title: string;
  correctHire: boolean;
  hireName: string | null;
  bestName: string;
  ariaPickName: string;
  ariaWasRight: boolean;
  overruled: boolean;
  points: { label: string; pts: number }[];
  roundPoints: number;
  flagsCaught: { candidate: string; type: FlagType; explanation: string; exact: boolean }[];
  flagsMissed: { candidate: string; type: FlagType; explanation: string }[];
  falseFlags: { candidate: string; reason: FlagType }[];
  explanation: string;
  ariaMistake: string;
  kpis: {
    qualityOfHire: number;
    timeToHireDays: number;
    costPerHireK: number;
    offerOutcome: OfferOutcome | "none";
    brandDelta: number;
    badHireCostAvoidedLpa: number;
    badHireCostIncurredLpa: number;
    funnel: { sourced: number; screened: number; interviewed: number; offered: number; joined: number };
  };
  biasGap: number | null;
  biasAttribute: string | null;
}

export interface GameResult {
  mode: Mode;
  difficulty: Difficulty;
  packId: string;
  totalScore: number;
  baseScore: number;
  streak: boolean;
  rank: string;
  archetype: ArchetypeKey;
  competencies: CompetencyScores;
  rounds: RoundResult[];
  accuracy: number; // % correct hires (or flag accuracy in volume)
  ai: { followed: number; total: number; followedWhenWrong: number; correctOverrules: number; wrongOverrules: number };
  bias: { pairs: { attribute: string; gap: number }[]; avgGap: number | null; blindAccuracy: number | null; nonBlindAccuracy: number | null };
  calibration: { avgConfidence: number; accuracy: number; verdict: "well-calibrated" | "over-confident" | "under-confident" };
  kpis: {
    qualityOfHire: number;
    timeToHireDays: number;
    costPerHireK: number;
    offerAcceptance: number;
    employerBrand: number;
    badHireCostAvoidedLpa: number;
    funnel: { sourced: number; screened: number; interviewed: number; offered: number; joined: number };
  };
  strengths: { key: CompetencyKey; moment: string }[];
  blindSpots: { key: CompetencyKey; moment: string }[];
  actionPlan: string[];
  certificateLevel: number | null;
}

export interface LeadInput {
  sessionId: string;
  email: string;
  phone?: string;
  companySize: string;
  hiringVolume: string;
  pains: string[];
  consentScrini: boolean;
  consentPartner: boolean;
  leaderboardOptIn?: boolean;
}

/** Lower-case a label for mid-sentence use, keeping acronyms. */
export const lc = (s: string) => s.toLowerCase().replace(/\bcv\b/g, "CV");

// Lead scoring (0–100) per spec §6.
import type { CompetencyScores } from "../types";

export interface LeadSignals {
  role?: string;
  companySize?: string;
  hiringVolume?: string;
  pains?: string[];
  demoClicked?: boolean;
  teamPlayed?: boolean;
  teamInviteSent?: boolean;
  competencies?: CompetencyScores | null;
  ats?: string;
  agencyPct?: string;
  certificateDownloaded?: boolean;
}

export const DECISION_ROLES = ["TA Lead", "HR Head", "Founder", "Staffing Agency Owner"];
export const LEGACY_ATS = ["None / spreadsheets", "Legacy / in-house", "Naukri RMS", "Other legacy ATS"];
export const HIGH_AGENCY = ["25–50%", "50%+"];
export const HOT_PAINS = ["screening time", "fake candidates", "offer drop-outs"];

export function leadScore(s: LeadSignals): { score: number; tag: "Hot" | "Warm" | "Cold"; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const add = (n: number, why: string) => {
    score += n;
    reasons.push(`+${n} ${why}`);
  };
  if (s.role && DECISION_ROLES.includes(s.role)) add(25, `decision-maker role (${s.role})`);
  if (s.companySize === "201–1000" || s.companySize === "1000+") add(20, `company size ${s.companySize}`);
  if (s.hiringVolume === "50–200" || s.hiringVolume === "200+") add(20, `hiring volume ${s.hiringVolume}/month`);
  if (s.pains?.some((p) => HOT_PAINS.includes(p))) add(15, "pain point matches (screening / fake candidates / drop-outs)");
  if (s.demoClicked) add(20, "clicked Book demo");
  if (s.teamPlayed || s.teamInviteSent) add(20, "Team mode / team invite");
  const lowAiOrSpeed = (s.competencies?.ai ?? 100) < 60 || (s.competencies?.speed ?? 100) < 60;
  if (lowAiOrSpeed && (s.hiringVolume === "50–200" || s.hiringVolume === "200+")) add(15, "low AI-judgment/speed + high volume");
  if ((s.ats && LEGACY_ATS.includes(s.ats)) || (s.agencyPct && HIGH_AGENCY.includes(s.agencyPct))) add(10, "legacy ATS or high agency dependency");
  if (s.certificateDownloaded) add(5, "downloaded certificate");
  score = Math.min(100, score);
  return { score, tag: score >= 70 ? "Hot" : score >= 40 ? "Warm" : "Cold", reasons };
}

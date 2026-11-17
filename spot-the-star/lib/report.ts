// Shared helpers for building the report (client + server).
import type { GameResult, MicroLesson } from "./types";
import { COMPETENCIES } from "./types";

export function lessonsFor(result: GameResult, lessons: MicroLesson[], n = 3): MicroLesson[] {
  const weakest = COMPETENCIES.filter((c) => result.competencies[c.key] !== null)
    .sort((a, b) => (result.competencies[a.key] as number) - (result.competencies[b.key] as number))
    .map((c) => c.key);
  const out: MicroLesson[] = [];
  for (const k of weakest) {
    const l = lessons.find((x) => x.competency === k && !out.includes(x));
    if (l) out.push(l);
    if (out.length >= n) break;
  }
  return out;
}

export const fmtMoney = (lpa: number, cur: "INR" | "USD") =>
  cur === "INR" ? `₹${lpa} LPA` : `$${Math.round((lpa * 100000) / 84 / 1000)}k`;

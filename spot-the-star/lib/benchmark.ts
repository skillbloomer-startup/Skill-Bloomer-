// Peer benchmark: percentile of a player's competency scores vs. completed sessions,
// filterable by role / company size / industry. With few peers, blends a seeded baseline
// distribution (mean 55, sd 18) so early players still get a meaningful (and labelled) benchmark.
import "server-only";
import { db } from "./db";
import { COMPETENCIES, CompetencyKey } from "./types";

function normCdf(x: number, mean: number, sd: number) {
  const z = (x - mean) / (sd * Math.SQRT2);
  // erf approximation
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
  return 0.5 * (1 + Math.sign(z) * y);
}

export async function benchmark(sessionId: string, filter: { role?: string; size?: string; industry?: string }) {
  const me = await db().getSession(sessionId);
  if (!me?.competencies) return null;
  const [sessions, leads] = await Promise.all([db().listSessions(), db().listLeads()]);
  const leadBy = new Map(leads.map((l) => [l.session_id, l]));
  const peers = sessions.filter(
    (s) =>
      s.completed &&
      s.id !== sessionId &&
      s.mode !== "volume" &&
      s.competencies &&
      (!filter.role || s.role === filter.role) &&
      (!filter.size || leadBy.get(s.id)?.company_size === filter.size) &&
      (!filter.industry || leadBy.get(s.id)?.industry === filter.industry)
  );
  const out: Partial<Record<CompetencyKey, number>> = {};
  const BASE_N = 20;
  for (const c of COMPETENCIES) {
    const mine = me.competencies[c.key];
    if (mine === null || mine === undefined) continue;
    const vals = peers.map((p) => p.competencies![c.key]).filter((v): v is number => typeof v === "number");
    const below = vals.filter((v) => v < mine).length + vals.filter((v) => v === mine).length * 0.5;
    const realP = vals.length ? below / vals.length : 0;
    const baseP = normCdf(mine, 55, 18);
    const w = Math.min(1, vals.length / BASE_N);
    out[c.key] = Math.round(Math.min(99, Math.max(1, (realP * w + baseP * (1 - w)) * 100)));
  }
  return { percentiles: out, peers: peers.length, baselineBlended: peers.length < BASE_N, filter };
}

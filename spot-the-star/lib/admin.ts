// Admin aggregations: leads table, funnel, teams, sponsor report, anonymised industry insights.
import "server-only";
import { db, LeadRow, SessionRow } from "./db";
import { COMPETENCIES, FLAG_LABELS, FlagType, GameResult } from "./types";
import { avg } from "./engine/rng";

export const FUNNEL_STAGES = [
  { key: "landing", label: "Landing" },
  { key: "badge", label: "Badge created" },
  { key: "r1", label: "Round 1 started" },
  { key: "r3", label: "Round 3 started" },
  { key: "gate", label: "Lead gate seen" },
  { key: "submitted", label: "Lead submitted" },
  { key: "demo", label: "Demo clicked" },
  { key: "share", label: "Shared" },
] as const;

export async function adminData(sinceIso?: string) {
  const [sessions, leads, events, deletions] = await Promise.all([db().listSessions(), db().listLeads(), db().listEvents(sinceIso), db().listDeletions()]);
  const sessBy = new Map(sessions.map((s) => [s.id, s]));

  // Leads table
  const leadRows = leads
    .map((l) => {
      const s = sessBy.get(l.session_id);
      return { ...l, device: s?.device, difficulty: s?.difficulty, mode: s?.mode, play_count: s?.play_count, competencies: s?.competencies, rank: s?.rank, demo_clicked: s?.demo_clicked, team_invite_sent: s?.team_invite_sent, certificate_downloaded: s?.certificate_downloaded, referral_code: s?.referral_code, last_screen: s?.last_screen };
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  // Funnel (distinct sessions per stage)
  const stage: Record<string, Set<string>> = Object.fromEntries(FUNNEL_STAGES.map((f) => [f.key, new Set<string>()]));
  for (const e of events) {
    const p = (e.props ?? {}) as Record<string, unknown>;
    if (e.name === "screen_view" && p.screen === "landing") stage.landing.add(e.session_id);
    if (e.name === "badge_created") stage.badge.add(e.session_id);
    if (e.name === "round_start" && p.round === 1) stage.r1.add(e.session_id);
    if (e.name === "round_start" && p.round === 3) stage.r3.add(e.session_id);
    if (e.name === "screen_view" && p.screen === "lead_gate") stage.gate.add(e.session_id);
    if (e.name === "lead_submitted") stage.submitted.add(e.session_id);
    if (e.name === "demo_clicked") stage.demo.add(e.session_id);
    if (e.name === "share_clicked") stage.share.add(e.session_id);
  }
  const funnel = FUNNEL_STAGES.map((f) => ({ ...f, count: stage[f.key].size }));

  // Drop-off by last screen (sessions that never completed)
  const dropOff: Record<string, number> = {};
  for (const s of sessions) if (!s.completed) dropOff[s.last_screen ?? "unknown"] = (dropOff[s.last_screen ?? "unknown"] ?? 0) + 1;

  // Teams: team_id OR same company, 3+ completed players
  const teamMap = new Map<string, SessionRow[]>();
  for (const s of sessions) {
    if (!s.completed || s.mode === "volume") continue;
    const key = s.team_id ? `team:${s.team_id}` : s.company ? `co:${s.company.trim().toLowerCase()}` : null;
    if (!key) continue;
    (teamMap.get(key) ?? teamMap.set(key, []).get(key)!).push(s);
  }
  const teams = [...teamMap.entries()]
    .filter(([, v]) => v.length >= 3)
    .map(([key, v]) => ({
      key,
      name: key.startsWith("team:") ? `${v[0].company ?? "Team"} (${key.slice(5)})` : v[0].company!,
      players: v.length,
      avgScore: Math.round(avg(v.map((s) => s.total_score ?? 0))),
      radar: Object.fromEntries(COMPETENCIES.map((c) => [c.key, Math.round(avg(v.map((s) => (s.competencies?.[c.key] as number) ?? 0)))])),
      leaderboard: [...v].sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0)).map((s) => ({ name: s.first_name, role: s.role, score: s.total_score, archetype: s.archetype })),
    }))
    .sort((a, b) => b.players - a.players);

  // Sponsor report
  const sp: Record<string, { sponsor: string; slot: string; impressions: number; clicks: number }> = {};
  for (const e of events) {
    if (e.name !== "ad_impression" && e.name !== "ad_click") continue;
    const p = (e.props ?? {}) as { sponsor?: string; slot?: string };
    const k = `${p.sponsor}|${p.slot}`;
    sp[k] ||= { sponsor: p.sponsor ?? "?", slot: p.slot ?? "?", impressions: 0, clicks: 0 };
    if (e.name === "ad_impression") sp[k].impressions++;
    else sp[k].clicks++;
  }
  const sponsorReport = Object.values(sp)
    .map((r) => ({ ...r, ctr: r.impressions ? Math.round((r.clicks / r.impressions) * 1000) / 10 : 0 }))
    .sort((a, b) => b.impressions - a.impressions);

  const insights = industryInsights(sessions, leads);

  const leaderboard = sessions
    .filter((s) => s.completed && s.leaderboard_opt_in)
    .sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0))
    .slice(0, 50)
    .map((s) => ({ id: s.id, name: s.first_name, company: s.company, score: s.total_score, hidden: !!s.leaderboard_hidden, mode: s.mode }));

  return {
    db: db().kind,
    totals: { sessions: sessions.length, completed: sessions.filter((s) => s.completed).length, leads: leads.length, hot: leads.filter((l) => l.lead_tag === "Hot").length, events: events.length },
    leads: leadRows,
    funnel,
    dropOff,
    teams,
    sponsorReport,
    insights,
    leaderboard,
    deletions,
  };
}

export function industryInsights(sessions: SessionRow[], leads: LeadRow[]) {
  const done = sessions.filter((s) => s.completed && s.mode !== "volume" && s.result);
  const n = done.length;
  const leadBy = new Map(leads.map((l) => [l.session_id, l]));
  // Flag miss rates
  const flagSeen: Record<string, number> = {};
  const flagMissed: Record<string, number> = {};
  for (const s of done) {
    const r = s.result as GameResult;
    for (const rr of r.rounds) {
      for (const f of rr.flagsCaught) flagSeen[f.type] = (flagSeen[f.type] ?? 0) + 1;
      for (const f of rr.flagsMissed) {
        flagSeen[f.type] = (flagSeen[f.type] ?? 0) + 1;
        flagMissed[f.type] = (flagMissed[f.type] ?? 0) + 1;
      }
    }
  }
  const flagMissRates = Object.keys(flagSeen).map((t) => ({ type: t, label: FLAG_LABELS[t as FlagType], missRate: Math.round(((flagMissed[t] ?? 0) / flagSeen[t]) * 100) })).sort((a, b) => b.missRate - a.missRate);

  const blindFollowers = done.filter((s) => (s.result as GameResult).rounds.some((r) => !r.ariaWasRight && !r.overruled && r.hireName)).length;
  const byRole: Record<string, SessionRow[]> = {};
  for (const s of done) (byRole[s.role ?? "Unknown"] ||= []).push(s);
  const roles = Object.entries(byRole).map(([role, v]) => ({
    role,
    players: v.length,
    avgScore: Math.round(avg(v.map((s) => s.total_score ?? 0))),
    avgBiasGap: Math.round(avg(v.map((s) => (s.result as GameResult).bias.avgGap ?? 0))),
    blindFollowPct: Math.round((v.filter((s) => (s.result as GameResult).rounds.some((r) => !r.ariaWasRight && !r.overruled && r.hireName)).length / v.length) * 100),
    ...Object.fromEntries(COMPETENCIES.map((c) => [c.key, Math.round(avg(v.map((s) => (s.competencies?.[c.key] as number) ?? 0)))])),
  }));
  const archetypes: Record<string, number> = {};
  for (const s of done) archetypes[s.archetype ?? "?"] = (archetypes[s.archetype ?? "?"] ?? 0) + 1;
  const bySize: Record<string, number[]> = {};
  for (const s of done) {
    const size = leadBy.get(s.id)?.company_size;
    if (size) (bySize[size] ||= []).push(s.total_score ?? 0);
  }
  const headlines: string[] = [];
  const overlap = flagMissRates.find((f) => f.type === "fake_experience");
  if (n) {
    if (overlap) headlines.push(`${overlap.missRate}% of recruiters missed fake / overlapping experience on a CV.`);
    headlines.push(`${Math.round((blindFollowers / n) * 100)}% hired the AI's top pick at least once when the AI was wrong.`);
    const gaps = done.map((s) => (s.result as GameResult).bias.avgGap ?? 0);
    headlines.push(`Average rating gap between equally qualified candidates: ${Math.round(avg(gaps))} points.`);
    const blindUsers = done.filter((s) => s.blind_used);
    if (blindUsers.length) headlines.push(`${Math.round((blindUsers.length / n) * 100)}% chose Blind Mode for the leadership round.`);
  }
  return {
    players: n,
    headlines,
    flagMissRates,
    roles,
    archetypes,
    scoreBySize: Object.fromEntries(Object.entries(bySize).map(([k, v]) => [k, Math.round(avg(v))])),
  };
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

import { db } from "@/lib/db";
import { bad, isId, json } from "@/lib/api";
import { getPack, getSourcing, getVolume } from "@/lib/content";
import { computeGame, runnerUpFor } from "@/lib/engine/scoring";
import { computeVolume } from "@/lib/engine/volume";
import { resolveOffer } from "@/lib/engine/offer";
import type { Difficulty, Mode, RoundLog, VolumeLog } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Server is the source of truth: recompute the full result from the raw gameplay log. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !isId(b.sessionId)) return bad("invalid");
  const s = await db().getSession(b.sessionId);
  if (!s) return bad("unknown session", 404);
  const difficulty: Difficulty = ["rookie", "pro", "expert"].includes(b.difficulty) ? b.difficulty : "pro";
  const mode: Mode = ["classic", "volume", "team"].includes(b.mode) ? b.mode : "classic";

  if (mode === "volume") {
    const pack = await getVolume();
    const log = b.volumeLog as VolumeLog;
    if (!log?.actions) return bad("missing log");
    log.secondsTotal = pack.seconds;
    log.secondsLeft = Math.max(0, Math.min(pack.seconds, Number(log.secondsLeft) || 0));
    const result = computeVolume(pack, log, difficulty, pack.id);
    await db().upsertSession({ id: s.id, completed: true, total_score: result.totalScore, rank: result.rank, archetype: result.archetype, accuracy: result.accuracy, competencies: result.competencies as never, result, gameplay: log, last_screen: "complete" });
    return json({ result });
  }

  const pack = await getPack(b.packId);
  const sourcing = await getSourcing();
  const logs = (Array.isArray(b.logs) ? b.logs : []) as RoundLog[];
  if (logs.length !== pack.rounds.length) return bad("incomplete game");
  logs.forEach((l, i) => {
    const r = pack.rounds[i];
    if (l.roundId !== r.id) throw new Error("round mismatch");
    l.secondsLeft = Math.max(0, Math.min(l.secondsTotal, Number(l.secondsLeft) || 0));
    l.confidence = Math.max(1, Math.min(5, Math.round(Number(l.confidence) || 3)));
    const hire = r.candidates.find((c) => c.id === l.hireId);
    if (hire && l.offerChoice) {
      const o = resolveOffer(s.id, r, hire, l.offerChoice, difficulty); // ignore client-claimed outcome
      l.offerOutcome = o.outcome;
      l.offerFinalLpa = o.amount;
    }
    l.runnerUpId = runnerUpFor(r, l)?.id ?? null;
  });
  const result = computeGame(pack.rounds, logs, { sessionId: s.id, difficulty, sourcing, mode, packId: pack.id });
  await db().upsertSession({
    id: s.id,
    completed: true,
    total_score: result.totalScore,
    rank: result.rank,
    archetype: result.archetype,
    accuracy: result.accuracy,
    competencies: result.competencies as never,
    result,
    gameplay: logs,
    blind_used: logs.some((l) => l.blind),
    last_screen: "complete",
  });
  return json({ result });
}

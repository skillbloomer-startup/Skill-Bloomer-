"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Badge, Difficulty, GameResult, MicroLesson, Mode, RolePack, RoundLog, RoundResult, SourcingTable, Sponsor, VolumeLog, VolumePack } from "@/lib/types";
import { computeGame, scoreRound } from "@/lib/engine/scoring";
import { computeVolume } from "@/lib/engine/volume";
import { flush, setAnalyticsContext, track } from "@/lib/client/analytics";
import { setMuted, sfx } from "@/lib/client/sound";
import { getPref, hasPlayed, markPlayed, playerId as getPlayerId, pushHistory, resetPlayer, setPref, uid } from "@/lib/client/storage";
import Landing from "./Landing";
import BadgeScreen from "./BadgeScreen";
import Briefing from "./Briefing";
import RoundPlayer from "./RoundPlayer";
import RoundReveal from "./RoundReveal";
import Transition from "./Transition";
import LeadGate from "./LeadGate";
import Report from "./Report";
import VolumeGame from "./VolumeGame";
import { WallScreen } from "../ui/SponsorSlot";

export interface Settings {
  difficulty: Difficulty;
  mode: Mode;
  packId: string;
  blind: boolean;
  currency: "INR" | "USD";
  muted: boolean;
  booth: boolean;
}

export interface Shared {
  sessionId: string;
  playerId: string;
  sponsors: Sponsor[];
  settings: Settings;
  sourcing: SourcingTable;
  lessons: MicroLesson[];
  calendlyUrl: string;
  appUrl: string;
  teamId: string | null;
  firstPlay: boolean;
}

type Screen =
  | { s: "landing" }
  | { s: "badge" }
  | { s: "briefing"; round: number }
  | { s: "round"; round: number }
  | { s: "reveal"; round: number; result: RoundResult }
  | { s: "transition"; round: number }
  | { s: "vbriefing" }
  | { s: "volume" }
  | { s: "finishing" }
  | { s: "lead_gate" }
  | { s: "report"; full: boolean };

interface Props {
  packs: RolePack[];
  defaultPackId: string;
  volume: VolumePack;
  sourcing: SourcingTable;
  lessons: MicroLesson[];
  sponsors: Sponsor[];
  calendlyUrl: string;
  appUrl: string;
}

export default function Game(p: Props) {
  const [screen, setScreen] = useState<Screen>({ s: "landing" });
  const [settings, setSettings] = useState<Settings>({ difficulty: "pro", mode: "classic", packId: p.defaultPackId, blind: false, currency: "INR", muted: false, booth: false });
  const [sessionId, setSessionId] = useState("");
  const [pid, setPid] = useState("");
  const [badge, setBadge] = useState<Badge | null>(null);
  const [logs, setLogs] = useState<RoundLog[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const [reportToken, setReportToken] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [firstPlay, setFirstPlay] = useState(true);
  const urlInfo = useRef<{ ref?: string; utm: Record<string, string>; referrer: string }>({ utm: {}, referrer: "" });

  const pack = useMemo(() => p.packs.find((x) => x.id === settings.packId) ?? p.packs[0], [p.packs, settings.packId]);

  // Boot: URL params, prefs, ids
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const booth = q.get("booth") === "1";
    const team = q.get("team");
    urlInfo.current = {
      ref: q.get("ref") ?? undefined,
      utm: { source: q.get("utm_source") ?? "", medium: q.get("utm_medium") ?? "", campaign: q.get("utm_campaign") ?? "" },
      referrer: document.referrer,
    };
    const muted = getPref("muted", false);
    setMuted(muted);
    setSettings((s) => ({
      ...s,
      booth,
      muted,
      currency: getPref("currency", "INR"),
      mode: team ? "team" : q.get("mode") === "volume" ? "volume" : s.mode,
      difficulty: (["rookie", "pro", "expert"].includes(q.get("difficulty") ?? "") ? q.get("difficulty") : s.difficulty) as Difficulty,
    }));
    if (team) setTeamId(team.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 40));
    const sid = uid();
    const player = getPlayerId();
    setSessionId(sid);
    setPid(player);
    setFirstPlay(!hasPlayed());
    setAnalyticsContext({ sessionId: sid, playerId: player });
  }, []);

  // screen_view analytics (drop-off tracking)
  useEffect(() => {
    if (sessionId) track("screen_view", { screen: screen.s, ...("round" in screen ? { round: screen.round + 1 } : {}) });
  }, [screen.s, sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSettings = (patch: Partial<Settings>) => {
    setSettings((s) => {
      const n = { ...s, ...patch };
      if (patch.muted !== undefined) {
        setMuted(patch.muted);
        setPref("muted", patch.muted);
      }
      if (patch.currency) setPref("currency", patch.currency);
      return n;
    });
  };

  const shared: Shared = {
    sessionId,
    playerId: pid,
    sponsors: p.sponsors,
    settings,
    sourcing: p.sourcing,
    lessons: p.lessons,
    calendlyUrl: p.calendlyUrl,
    appUrl: p.appUrl || (typeof window !== "undefined" ? window.location.origin : ""),
    teamId,
    firstPlay,
  };

  const startShift = () => {
    track("game_start", { mode: settings.mode, difficulty: settings.difficulty, pack: settings.packId });
    sfx.whoosh();
    if (settings.mode === "team" && !teamId) setTeamId(`t-${uid().slice(0, 6)}`);
    setScreen({ s: "badge" });
  };

  const onBadge = async (b: Badge) => {
    setBadge(b);
    track("badge_created", { role: b.role });
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sessionId, playerId: pid, badge: b, settings, teamId, ref: urlInfo.current.ref, utm: urlInfo.current.utm, referrer: urlInfo.current.referrer }),
    }).catch(() => null);
    setScreen(settings.mode === "volume" ? { s: "vbriefing" } : { s: "briefing", round: 0 });
  };

  const onRoundDone = (round: number, log: RoundLog) => {
    const r = pack.rounds[round];
    const res = scoreRound(r, log, { sessionId, difficulty: settings.difficulty, sourcing: p.sourcing }, round + 1);
    setLogs((l) => {
      const n = [...l];
      n[round] = log;
      return n;
    });
    track("round_complete", { round: round + 1, correct: res.correctHire, points: res.roundPoints, seconds_left: log.secondsLeft });
    res.correctHire ? sfx.good() : sfx.bad();
    setScreen({ s: "reveal", round, result: res });
  };

  const finish = useCallback(
    async (payload: { logs?: RoundLog[]; volumeLog?: VolumeLog }) => {
      setScreen({ s: "finishing" });
      const local =
        settings.mode === "volume"
          ? computeVolume(p.volume, payload.volumeLog!, settings.difficulty, p.volume.id)
          : computeGame(pack.rounds, payload.logs!, { sessionId, difficulty: settings.difficulty, sourcing: p.sourcing, mode: settings.mode, packId: pack.id });
      let final = local;
      try {
        const res = await fetch("/api/session/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, mode: settings.mode, difficulty: settings.difficulty, packId: pack.id, ...payload }),
        });
        if (res.ok) final = (await res.json()).result as GameResult;
      } catch {
        /* offline: keep local result */
      }
      setResult(final);
      markPlayed();
      pushHistory({ date: new Date().toISOString(), total: final.totalScore, mode: settings.mode, competencies: final.competencies });
      flush();
      setScreen({ s: "lead_gate" });
    },
    [settings, p.volume, p.sourcing, pack, sessionId]
  );

  const next = (round: number) => {
    if (round + 1 < pack.rounds.length) setScreen({ s: "transition", round: round + 1 });
    else finish({ logs });
  };

  const playAgain = (hardReset = false) => {
    track("play_again");
    flush();
    if (hardReset) resetPlayer();
    const sid = uid();
    const player = getPlayerId();
    setSessionId(sid);
    setPid(player);
    setAnalyticsContext({ sessionId: sid, playerId: player });
    setLogs([]);
    setResult(null);
    setReportToken(null);
    setFirstPlay(!hasPlayed());
    if (hardReset) setBadge(null);
    setScreen({ s: "landing" });
  };

  // Booth mode: auto-reset after inactivity on the final screens
  useEffect(() => {
    if (!settings.booth || (screen.s !== "report" && screen.s !== "lead_gate")) return;
    let t = setTimeout(() => playAgain(true), 90_000);
    const bump = () => {
      clearTimeout(t);
      t = setTimeout(() => playAgain(true), 90_000);
    };
    window.addEventListener("pointerdown", bump);
    window.addEventListener("keydown", bump);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("keydown", bump);
    };
  }, [settings.booth, screen.s]); // eslint-disable-line react-hooks/exhaustive-deps

  const roundNo = "round" in screen ? screen.round : -1;

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      <div className="grid-floor pointer-events-none fixed inset-0 opacity-60" aria-hidden />
      {/* top bar */}
      <header className="relative z-20 mx-auto flex max-w-5xl items-center justify-between px-4 pt-[max(12px,env(safe-area-inset-top))]">
        <button onClick={() => screen.s !== "landing" && confirm("Quit this shift and return to the start?") && playAgain()} className="flex items-center gap-2 text-sm font-bold tracking-tight" aria-label="Spot the Star home">
          <span className="text-lg">⭐</span>
          <span className="hidden sm:inline">Spot the Star</span>
          <span className="rounded bg-neon-pink/20 px-1.5 py-0.5 font-mono text-[10px] text-neon-pink">2031</span>
        </button>
        <div className="flex items-center gap-2">
          {roundNo >= 0 && settings.mode !== "volume" && (
            <div className="font-mono text-xs text-white/60" aria-live="polite">
              Round {roundNo + 1}/{pack.rounds.length}
            </div>
          )}
          <button onClick={() => updateSettings({ currency: settings.currency === "INR" ? "USD" : "INR" })} className="chip text-xs" aria-label="Toggle currency">
            {settings.currency === "INR" ? "₹" : "$"}
          </button>
          <button onClick={() => updateSettings({ muted: !settings.muted })} className="chip text-xs" aria-label={settings.muted ? "Unmute sound" : "Mute sound"} aria-pressed={settings.muted}>
            {settings.muted ? "🔇" : "🔊"}
          </button>
        </div>
      </header>
      {(screen.s === "round" || screen.s === "briefing") && sessionId && (
        <div className="pointer-events-none fixed right-6 top-20 z-0">
          <WallScreen sponsors={p.sponsors} sessionId={sessionId} />
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          <motion.div key={screen.s + ("round" in screen ? screen.round : "")} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {screen.s === "landing" && <Landing shared={shared} packs={p.packs} onSettings={updateSettings} onStart={startShift} />}
            {screen.s === "badge" && <BadgeScreen shared={shared} onDone={onBadge} />}
            {screen.s === "briefing" && (
              <Briefing
                shared={shared}
                round={pack.rounds[screen.round]}
                roundNo={screen.round}
                showTutorial={screen.round === 0}
                onBlind={(b) => updateSettings({ blind: b })}
                onStart={() => {
                  track("round_start", { round: screen.round + 1 });
                  setScreen({ s: "round", round: screen.round });
                }}
              />
            )}
            {screen.s === "round" && <RoundPlayer key={screen.round} shared={shared} round={pack.rounds[screen.round]} roundNo={screen.round} onDone={(l) => onRoundDone(screen.round, l)} />}
            {screen.s === "reveal" && <RoundReveal shared={shared} result={screen.result} roundNo={screen.round} total={pack.rounds.length} onNext={() => next(screen.round)} />}
            {screen.s === "transition" && <Transition shared={shared} nextTitle={pack.rounds[screen.round].title} onDone={() => setScreen({ s: "briefing", round: screen.round })} />}
            {screen.s === "vbriefing" && (
              <Briefing
                shared={shared}
                volume={p.volume}
                roundNo={0}
                showTutorial
                onBlind={() => {}}
                onStart={() => {
                  track("round_start", { round: 1, mode: "volume" });
                  setScreen({ s: "volume" });
                }}
              />
            )}
            {screen.s === "volume" && <VolumeGame shared={shared} pack={p.volume} onDone={(volumeLog) => finish({ volumeLog })} />}
            {screen.s === "finishing" && (
              <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan" />
                <p className="font-mono text-sm text-white/70">Sequencing your Recruiter DNA…</p>
              </div>
            )}
            {screen.s === "lead_gate" && result && badge && (
              <LeadGate
                shared={shared}
                badge={badge}
                result={result}
                onSubmitted={(token) => {
                  setReportToken(token);
                  setScreen({ s: "report", full: true });
                }}
                onSkip={() => setScreen({ s: "report", full: false })}
              />
            )}
            {screen.s === "report" && result && badge && (
              <Report shared={shared} badge={badge} result={result} full={screen.full} token={reportToken} onUnlock={() => setScreen({ s: "lead_gate" })} onPlayAgain={() => playAgain(settings.booth)} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="relative z-10 mx-auto max-w-5xl px-4 pb-6 text-center text-[11px] text-white/40">
        This is a learning simulation, not a formal assessment. All candidates and companies are fictional. ·{" "}
        <a className="underline hover:text-white" href="/privacy">
          Privacy & data deletion
        </a>
      </footer>
    </div>
  );
}

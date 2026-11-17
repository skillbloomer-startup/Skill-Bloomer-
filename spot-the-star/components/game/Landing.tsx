"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import type { Difficulty, Mode, RolePack } from "@/lib/types";
import type { Settings, Shared } from "./Game";
import { SponsorBadge } from "../ui/SponsorSlot";
import { sfx } from "@/lib/client/sound";

const DIFFS: { k: Difficulty; label: string; d: string }[] = [
  { k: "rookie", label: "Rookie", d: "+30% time, hints on" },
  { k: "pro", label: "Pro", d: "The standard shift" },
  { k: "expert", label: "Expert", d: "Subtler flags, −25% time" },
];
const MODES: { k: Mode; label: string; d: string }[] = [
  { k: "classic", label: "Classic", d: "3 rounds · 5–8 min" },
  { k: "volume", label: "Volume Hiring", d: "30 cards · 3 min · hire 5" },
  { k: "team", label: "Team", d: "Invite link · team leaderboard" },
];

export default function Landing({ shared, packs, onSettings, onStart }: { shared: Shared; packs: RolePack[]; onSettings: (p: Partial<Settings>) => void; onStart: () => void }) {
  const s = shared.settings;
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => {
    if (!s.booth) return;
    const url = `${window.location.origin}/?utm_source=booth&utm_medium=qr&utm_campaign=event`;
    QRCode.toDataURL(url, { margin: 1, width: 220, color: { dark: "#05060f", light: "#ffffff" } }).then(setQr).catch(() => null);
  }, [s.booth]);

  return (
    <section className="flex min-h-[calc(100dvh-110px)] flex-col items-center justify-center py-8 text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }} className="mb-4 font-mono text-xs uppercase tracking-[.3em] text-neon-cyan">
        Noida · Year 2031 · Talent Ops Floor 42
      </motion.div>
      <h1 className="text-[2.6rem] font-bold leading-[1.02] sm:text-6xl md:text-7xl">
        <span className="neon-text">Can you out-hire</span>
        <br />
        the AI?
      </h1>
      <p className="mt-4 max-w-xl text-white/70">
        ARIA, your AI recruiter, has shortlisted the candidates. Catch the red flags it missed, pick the star, close the offer.
        <span className="block mt-1 font-semibold text-white">AI shortlists. Humans make the call.</span>
      </p>

      <div className="mt-8 w-full max-w-xl space-y-4 text-left">
        <fieldset>
          <legend className="label mb-2">Mode</legend>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((m) => (
              <button key={m.k} onClick={() => (sfx.tap(), onSettings({ mode: m.k }))} aria-pressed={s.mode === m.k} className={`glass px-3 py-3 text-left transition ${s.mode === m.k ? "!border-neon-cyan bg-neon-cyan/10" : "hover:bg-white/10"}`}>
                <div className="text-sm font-semibold">{m.label}</div>
                <div className="text-[11px] text-white/50">{m.d}</div>
              </button>
            ))}
          </div>
          {s.mode === "team" && (
            <p className="mt-2 text-xs text-neon-lime">
              {shared.teamId ? `You're joining team ${shared.teamId}. Your score goes on the team leaderboard.` : "We'll create a team code for you — share the invite link from your report."}
            </p>
          )}
        </fieldset>
        <fieldset>
          <legend className="label mb-2">Difficulty</legend>
          <div className="grid grid-cols-3 gap-2">
            {DIFFS.map((d) => (
              <button key={d.k} onClick={() => (sfx.tap(), onSettings({ difficulty: d.k }))} aria-pressed={s.difficulty === d.k} className={`glass px-3 py-3 text-left transition ${s.difficulty === d.k ? "!border-neon-pink bg-neon-pink/10" : "hover:bg-white/10"}`}>
                <div className="text-sm font-semibold">{d.label}</div>
                <div className="text-[11px] text-white/50">{d.d}</div>
              </button>
            ))}
          </div>
        </fieldset>
        {packs.length > 1 && s.mode !== "volume" && (
          <label className="block">
            <span className="label mb-2 block">Role pack / industry</span>
            <select className="input" value={s.packId} onChange={(e) => onSettings({ packId: e.target.value })}>
              {packs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.industry}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onStart} disabled={!shared.sessionId} className="btn-primary mt-8 w-full max-w-xl py-4 text-lg">
        Start Shift →
      </motion.button>

      <div className="mt-6 flex flex-col items-center gap-2">
        {shared.sessionId && <SponsorBadge sponsors={shared.sponsors} slot="splash" sessionId={shared.sessionId} prefix="Powered by" />}
        <div className="text-[11px] text-white/40">A Scrini AI experience · Agentic Hiring OS · Noida, India</div>
      </div>

      {s.booth && (
        <div className="glass mt-8 flex items-center gap-4 p-4 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qr && <img src={qr} alt="QR code to play on your phone" className="h-28 w-28 rounded-lg" />}
          <div>
            <div className="label">Booth mode</div>
            <p className="text-sm">Scan to play on your phone — or tap Start Shift. The game resets automatically after each player.</p>
          </div>
        </div>
      )}
    </section>
  );
}

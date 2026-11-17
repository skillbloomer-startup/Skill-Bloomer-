"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Badge, GameResult } from "@/lib/types";
import type { Shared } from "./Game";
import { track } from "@/lib/client/analytics";
import { ARCHETYPES } from "@/lib/engine/scoring";

const FREE = ["gmail.com", "yahoo.com", "yahoo.co.in", "hotmail.com", "outlook.com", "live.com", "icloud.com", "rediffmail.com", "aol.com", "proton.me", "protonmail.com", "ymail.com"];
export const SIZES = ["1–50", "51–200", "201–1000", "1000+"];
export const VOLUMES = ["<10", "10–50", "50–200", "200+"];
export const PAINS = ["sourcing", "screening time", "fake candidates", "interview scheduling", "quality of hire", "offer drop-outs"];
const CODES = [
  ["+91", "🇮🇳 India"],
  ["+1", "🇺🇸 US/Canada"],
  ["+44", "🇬🇧 UK"],
  ["+971", "🇦🇪 UAE"],
  ["+65", "🇸🇬 Singapore"],
  ["+61", "🇦🇺 Australia"],
  ["+49", "🇩🇪 Germany"],
  ["+966", "🇸🇦 Saudi Arabia"],
  ["+880", "🇧🇩 Bangladesh"],
  ["+977", "🇳🇵 Nepal"],
];

export default function LeadGate({ shared, badge, result, onSubmitted, onSkip }: { shared: Shared; badge: Badge; result: GameResult; onSubmitted: (token: string | null) => void; onSkip: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState("");
  const [volume, setVolume] = useState("");
  const [pains, setPains] = useState<string[]>([]);
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [lb, setLb] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const free = FREE.includes(domain);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const arch = ARCHETYPES[result.archetype];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validEmail || !c1 || !size || !volume) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: shared.sessionId, email, phone: phone ? `${code} ${phone}` : "", companySize: size, hiringVolume: volume, pains, consentScrini: c1, consentPartner: c2, leaderboardOptIn: lb }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Something went wrong");
      track("lead_submitted", { company_size: size, hiring_volume: volume, pains, free_email: free });
      onSubmitted(j.token ?? null);
    } catch (e2) {
      setErr((e2 as Error).message);
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg py-6">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong relative overflow-hidden p-5 text-center">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink" />
        <div className="label">Shift complete, {badge.firstName}</div>
        <div className="mt-2 font-mono text-5xl font-black text-neon-cyan">{result.totalScore}</div>
        <div className="mt-1 font-semibold">
          {result.rank} · {arch.emoji} {arch.name}
        </div>
        <div className="mt-3 flex justify-center gap-1 blur-[3px]" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="w-3 rounded-sm bg-gradient-to-t from-neon-cyan to-neon-violet" style={{ height: 14 + ((i * 13) % 30) }} />
          ))}
        </div>
      </motion.div>
      <h2 className="mt-6 text-2xl font-bold">Your Recruiter DNA Report is ready. Where should we send it?</h2>
      <p className="mt-1 text-sm text-white/60">10-competency radar, archetype, peer benchmark, blind spots with replays, micro-lessons, action plan{result.certificateLevel ? " and your certificate 🎓" : ""}.</p>
      <form className="mt-5 space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="label">Work email *</span>
          <input className="input mt-1" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          {free && <span className="mt-1 block text-xs text-neon-amber">Tip: a work email gets you a company-level benchmark. Personal email works too.</span>}
        </label>
        <label className="block">
          <span className="label">Phone (optional)</span>
          <div className="mt-1 flex gap-2">
            <select className="input !w-32" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Country code">
              {CODES.map(([c, n]) => (
                <option key={c} value={c}>
                  {c} {n}
                </option>
              ))}
            </select>
            <input className="input" type="tel" inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ""))} placeholder="98765 43210" />
          </div>
        </label>
        <Chips label="Company size *" options={SIZES} value={size} onChange={setSize} />
        <Chips label="Monthly hiring volume *" options={VOLUMES} value={volume} onChange={setVolume} />
        <fieldset>
          <legend className="label mb-1">Biggest hiring pain (pick any)</legend>
          <div className="flex flex-wrap gap-2">
            {PAINS.map((p) => {
              const on = pains.includes(p);
              return (
                <button type="button" key={p} aria-pressed={on} onClick={() => setPains(on ? pains.filter((x) => x !== p) : [...pains, p])} className={`chip capitalize ${on ? "chip-on" : ""}`}>
                  {on && "✓ "}
                  {p}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#22e4ff]" checked={c1} onChange={(e) => setC1(e.target.checked)} required />
          <span>
            I agree to Scrini AI processing my details to send this report and contacting me about hiring solutions, as described in the{" "}
            <a className="underline" href="/privacy" target="_blank">
              Privacy Policy
            </a>
            . I can withdraw consent or request deletion anytime. *
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-white/80">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#22e4ff]" checked={c2} onChange={(e) => setC2(e.target.checked)} />
          <span>Send me offers from Scrini AI's sponsors and partners (optional).</span>
        </label>
        <label className="flex items-start gap-3 text-sm text-white/80">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#22e4ff]" checked={lb} onChange={(e) => setLb(e.target.checked)} />
          <span>Show my first name, company and score on the public leaderboard.</span>
        </label>
        {err && (
          <p className="text-sm text-neon-pink" role="alert">
            {err}
          </p>
        )}
        <button className="btn-primary w-full py-4" disabled={busy || !validEmail || !c1 || !size || !volume}>
          {busy ? "Sending…" : "Unlock my full report 🧬"}
        </button>
        <button type="button" className="w-full text-center text-sm text-white/50 underline" onClick={onSkip}>
          Skip — just show my basic score
        </button>
      </form>
    </section>
  );
}

function Chips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="label mb-1">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {options.map((o) => (
          <button type="button" role="radio" aria-checked={value === o} key={o} onClick={() => onChange(o)} className={`chip ${value === o ? "chip-on" : ""}`}>
            {value === o && "✓ "}
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

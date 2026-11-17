"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Badge } from "@/lib/types";
import type { Shared } from "./Game";
import { savedBadge, saveBadge } from "@/lib/client/storage";
import { sfx } from "@/lib/client/sound";

export const JOB_ROLES = ["Recruiter", "TA Lead", "HR Head", "Founder", "Staffing Agency Owner", "Other"];

export function IdBadge({ badge, compact = false }: { badge: Badge; compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-neon-cyan/50 bg-gradient-to-br from-ink-800 via-ink-900 to-[#1a0f2e] ${compact ? "p-4" : "p-6"} shadow-glow`}>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-violet/30 blur-2xl" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink" />
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.25em] text-neon-cyan">
        <span>Recruiter ID</span>
        <span>2031</span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className={`${compact ? "h-12 w-12 text-xl" : "h-16 w-16 text-2xl"} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-violet font-bold text-ink-950`}>{badge.firstName.slice(0, 1).toUpperCase()}</div>
        <div className="min-w-0 text-left">
          <div className={`${compact ? "text-lg" : "text-2xl"} truncate font-bold`}>{badge.firstName}</div>
          <div className="text-sm text-neon-pink">Senior Recruiter, 2031</div>
          <div className="truncate text-xs text-white/60">
            {badge.role} · {badge.company}
          </div>
        </div>
      </div>
      {!compact && (
        <div className="mt-5 flex items-end justify-between">
          <div className="flex gap-[3px]" aria-hidden>
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className="block w-[2px] bg-white/70" style={{ height: 10 + ((i * 7) % 18) }} />
            ))}
          </div>
          <span className="font-mono text-[10px] text-white/40">CLEARANCE: TALENT-OPS</span>
        </div>
      )}
    </div>
  );
}

export default function BadgeScreen({ shared, onDone }: { shared: Shared; onDone: (b: Badge) => void }) {
  const [b, setB] = useState<Badge>({ firstName: "", role: "Recruiter", company: "" });
  const [printed, setPrinted] = useState(false);
  const first = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const prev = savedBadge();
    if (prev && !shared.settings.booth) setB(prev);
    first.current?.focus();
  }, [shared.settings.booth]);
  const valid = b.firstName.trim().length >= 1 && b.company.trim().length >= 1;

  if (printed)
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-8">
        <motion.div initial={{ rotateX: 80, y: -120, opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 90, damping: 12 }} style={{ perspective: 800 }}>
          <IdBadge badge={b} />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 text-center text-white/70">
          Badge activated. Welcome to the floor, {b.firstName}.
        </motion.p>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="btn-primary mt-6" onClick={() => onDone({ firstName: b.firstName.trim(), role: b.role, company: b.company.trim() })} autoFocus>
          Report for duty →
        </motion.button>
      </section>
    );

  return (
    <section className="mx-auto max-w-md py-8">
      <div className="label">Step 1 of 2 · 10 seconds</div>
      <h2 className="mt-1 text-3xl font-bold">Print your Recruiter ID</h2>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          if (!shared.settings.booth) saveBadge(b);
          sfx.star();
          setPrinted(true);
        }}
      >
        <label className="block">
          <span className="label">First name</span>
          <input ref={first} className="input mt-1" maxLength={30} autoComplete="given-name" value={b.firstName} onChange={(e) => setB({ ...b, firstName: e.target.value })} placeholder="e.g. Ankita" required />
        </label>
        <fieldset>
          <legend className="label mb-1">Job role</legend>
          <div className="flex flex-wrap gap-2">
            {JOB_ROLES.map((r) => (
              <button type="button" key={r} onClick={() => setB({ ...b, role: r })} aria-pressed={b.role === r} className={`chip ${b.role === r ? "chip-on" : ""}`}>
                {b.role === r && "✓ "}
                {r}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="label">Company name</span>
          <input className="input mt-1" maxLength={60} autoComplete="organization" value={b.company} onChange={(e) => setB({ ...b, company: e.target.value })} placeholder="e.g. Acme Talent Co." required />
        </label>
        <button className="btn-primary w-full" disabled={!valid}>
          Print my badge 🪪
        </button>
      </form>
    </section>
  );
}

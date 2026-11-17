"use client";
import { useEffect } from "react";
import type { Candidate, FlagType, Sponsor } from "@/lib/types";
import { FLAG_LABELS } from "@/lib/types";
import Avatar from "../ui/Avatar";
import { SponsorBadge } from "../ui/SponsorSlot";
import { fmtMoney } from "@/lib/report";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtDate = (d: string) => (d === "present" ? "present" : `${MONTHS[Number(d.slice(5, 7)) - 1] ?? ""} ${d.slice(0, 4)}`);

export const blindName = (idx: number) => `Candidate ${String.fromCharCode(65 + idx)}`;

export function displayName(c: Candidate, idx: number, blind: boolean) {
  return blind ? blindName(idx) : c.name;
}

const SENT_COLOR: Record<string, string> = {
  Confident: "text-neon-cyan border-neon-cyan/40",
  Positive: "text-neon-lime border-neon-lime/40",
  Enthusiastic: "text-neon-lime border-neon-lime/40",
  Neutral: "text-white/70 border-white/30",
  Guarded: "text-neon-amber border-neon-amber/40",
  Defensive: "text-neon-pink border-neon-pink/40",
};

export function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`ARIA match score ${score} out of 100`} role="img">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.1)" strokeWidth="4" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#ringg)" strokeWidth="4" fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} strokeLinecap="round" />
        <defs>
          <linearGradient id="ringg">
            <stop offset="0" stopColor="#22e4ff" />
            <stop offset="1" stopColor="#8b5cff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-base font-bold leading-none">{score}</span>
        <span className="text-[8px] uppercase tracking-wider text-white/50">ARIA</span>
      </div>
    </div>
  );
}

export interface CardProps {
  c: Candidate;
  idx: number;
  ariaRank: number;
  blind: boolean;
  expert: boolean;
  currency: "INR" | "USD";
  sponsors: Sponsor[];
  sessionId: string;
  showDetails: boolean;
  onToggleDetails: () => void;
  revealed?: FlagType[];
}

export default function CandidateCard({ c, idx, ariaRank, blind, expert, currency, sponsors, sessionId, showDetails, onToggleDetails, revealed = [] }: CardProps) {
  const name = displayName(c, idx, blind);
  return (
    <article className="glass-strong flex h-full flex-col overflow-hidden" aria-label={`Candidate card: ${name}`}>
      {/* ATS header bar — sponsor slot 3 */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[10px] text-white/50">
        <span>ATS://scrini-os/v9 · req#{c.id.toUpperCase()}</span>
        <SponsorBadge sponsors={sponsors} slot="ats_header" sessionId={sessionId} prefix="" className="!text-[10px] [&_img]:!h-3.5" />
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-4 pt-3" style={{ touchAction: "pan-y" }}>
        <header className="flex items-start gap-3">
          <Avatar a={c.avatar} size={60} blind={blind} label={blind ? "Hidden in Blind Mode" : `Illustrated avatar of ${c.name}`} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold">{name}</h3>
            <p className="text-sm leading-snug text-white/70">{blind ? c.title.replace(/,.*$/, "") : c.title}</p>
            <p className="mt-0.5 text-[11px] text-white/40">
              {!blind && c.location}
              {!blind && c.age ? ` · ${c.age}y` : ""}
            </p>
          </div>
          <ScoreRing score={c.aria_score} />
        </header>

        <div className="mt-3 rounded-xl border border-neon-violet/30 bg-neon-violet/10 px-3 py-2 text-[13px]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neon-violet">ARIA rank #{ariaRank}</span>
          <p className="text-white/85">“{c.aria_reason}”</p>
        </div>

        {revealed.length > 0 && (
          <div className="mt-2 rounded-xl border border-neon-pink/50 bg-neon-pink/10 px-3 py-2 text-[13px] text-neon-pink" role="status">
            🚩 Revealed in interview: {revealed.map((r) => FLAG_LABELS[r]).join(", ")}
          </div>
        )}

        <section className="mt-3">
          <div className="label mb-1">Experience</div>
          <ol className="space-y-1.5">
            {c.roles.map((r, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" aria-hidden />
                <span>
                  <span className="font-semibold">{r.title}</span> · {r.company}
                  {r.note && <span className="text-white/50"> ({r.note})</span>}
                  <span className="block font-mono text-[11px] text-white/50">
                    {fmtDate(r.from)} – {fmtDate(r.to)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-3">
          <div className="label mb-1">Top skills</div>
          <div className="flex flex-wrap gap-1.5">
            {c.skills.map((s) => (
              <span key={s} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[12px]">
                {s}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-white/60">🎓 {blind ? c.blind_education : c.education}</p>
        </section>

        <section className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
          <div className="flex items-center justify-between">
            <span className="label">Interview clip</span>
            {!expert && <span className={`rounded-full border px-2 py-0.5 text-[10px] ${SENT_COLOR[c.interview.sentiment]}`}>Sentiment: {c.interview.sentiment}</span>}
          </div>
          <div className="mt-1.5 space-y-1 font-mono text-[12px] leading-relaxed text-white/80">
            {c.interview.lines.map((l, i) => (
              <p key={i}>
                <span className="text-neon-cyan">&gt;</span> {l}
              </p>
            ))}
          </div>
        </section>

        <button onClick={onToggleDetails} className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-sm hover:bg-white/10" aria-expanded={showDetails}>
          {showDetails ? "Hide details ▲" : "View details ▼"} <span className="font-mono text-[10px] text-white/40">(D)</span>
        </button>
        {showDetails && (
          <dl className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
            <div className="glass p-2">
              <dt className="label">References</dt>
              <dd>{c.details.references}</dd>
            </div>
            <div className="glass p-2">
              <dt className="label">Notice period</dt>
              <dd>{c.details.notice_period}</dd>
            </div>
            <div className="glass p-2">
              <dt className="label">Salary expectation</dt>
              <dd>{fmtMoney(c.details.salary_expectation_lpa, currency)}</dd>
            </div>
            <div className="glass p-2">
              <dt className="label">Current CTC</dt>
              <dd>{c.details.current_ctc_lpa ? fmtMoney(c.details.current_ctc_lpa, currency) : "—"}</dd>
            </div>
            {!expert && (
              <div className="glass col-span-2 p-2">
                <dt className="label">Activity</dt>
                <dd>{c.details.activity}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </article>
  );
}

export function FlagPicker({ onPick, onCancel, name }: { onPick: (f: FlagType) => void; onCancel: () => void; name: string }) {
  const keys = Object.keys(FLAG_LABELS) as FlagType[];
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      const n = Number(e.key);
      if (n >= 1 && n <= keys.length) onPick(keys[n - 1]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [keys, onPick, onCancel]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center" role="dialog" aria-modal aria-label={`Flag ${name}`} onClick={onCancel}>
      <div className="glass-strong w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h4 className="font-bold">🚩 Why are you flagging {name}?</h4>
          <button onClick={onCancel} className="text-white/60" aria-label="Cancel">
            ✕
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {keys.map((k, i) => (
            <button key={k} onClick={() => onPick(k)} className="chip justify-start py-2.5 text-left hover:border-neon-pink hover:bg-neon-pink/10" autoFocus={i === 0}>
              <span className="font-mono text-[10px] text-white/40">{i + 1}</span> {FLAG_LABELS[k]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

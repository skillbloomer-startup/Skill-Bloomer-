"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Badge, CompetencyScores, GameResult } from "@/lib/types";
import { COMPETENCIES } from "@/lib/types";
import type { Shared } from "./Game";
import { IdBadge, JOB_ROLES } from "./BadgeScreen";
import Radar from "../ui/Radar";
import { Kpi } from "./RoundReveal";
import { NativeAd, SponsorBadge } from "../ui/SponsorSlot";
import { ARCHETYPES, SCRINI_PITCH, weakestCompetency } from "@/lib/engine/scoring";
import { lessonsFor } from "@/lib/report";
import { history } from "@/lib/client/storage";
import { flush, track } from "@/lib/client/analytics";
import { SIZES } from "./LeadGate";

const INDUSTRIES = ["IT / SaaS", "BFSI", "Healthcare", "BPO / Volume", "Sales / D2C", "Manufacturing", "Staffing / RPO", "Other"];
const ATS = ["None / spreadsheets", "Legacy / in-house", "Naukri RMS", "Zoho Recruit", "Greenhouse / Lever", "Workday / SuccessFactors", "Darwinbox / Keka", "Other legacy ATS", "Other modern ATS"];
const AGENCY = ["0%", "1–25%", "25–50%", "50%+"];
const YEARS = ["0–2", "3–5", "6–10", "10+"];

export default function Report({ shared, badge, result: r, full, token, onUnlock, onPlayAgain }: { shared: Shared; badge: Badge; result: GameResult; full: boolean; token: string | null; onUnlock: () => void; onPlayAgain: () => void }) {
  const arch = ARCHETYPES[r.archetype];
  const weakest = weakestCompetency(r.competencies);
  const weakLabel = COMPETENCIES.find((c) => c.key === weakest)!.label;
  const lessons = useMemo(() => lessonsFor(r, shared.lessons), [r, shared.lessons]);
  const [bench, setBench] = useState<{ percentiles: Partial<Record<string, number>>; peers: number; baselineBlended: boolean } | null>(null);
  const [filter, setFilter] = useState<{ role: string; size: string; industry: string }>({ role: badge.role, size: "", industry: "" });
  const [calendly, setCalendly] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [extra, setExtra] = useState({ industry: "", years: "", ats: "", agency: "" });
  const [extraSaved, setExtraSaved] = useState(false);
  const [board, setBoard] = useState<{ rank: number; name: string; company: string; score: number }[]>([]);
  const [teamBoard, setTeamBoard] = useState<typeof board>([]);
  const prev = useMemo(() => {
    const h = history().filter((x) => x.mode === r.mode || (x.mode !== "volume" && r.mode !== "volume"));
    return h.length >= 2 ? h[h.length - 2] : null;
  }, [r.mode]);

  const origin = shared.appUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const refCode = shared.sessionId.replace(/-/g, "").slice(0, 8);
  const shareUrl = `${origin}/?ref=${refCode}&utm_source=share&utm_medium=social&utm_campaign=recruiter2031`;
  const challengeUrl = `${origin}/?ref=${refCode}&utm_source=referral&utm_medium=challenge&utm_campaign=recruiter2031`;
  const teamCode = shared.teamId ?? `t-${refCode.slice(0, 6)}`;
  const teamUrl = `${origin}/?team=${teamCode}&utm_source=referral&utm_medium=team_invite&utm_campaign=recruiter2031`;
  const shareImg = `/api/share-card?sid=${shared.sessionId}`;

  useEffect(() => {
    track("report_viewed", { full });
  }, [full]);

  useEffect(() => {
    if (!full || !token) return;
    const q = new URLSearchParams({ sid: shared.sessionId, t: token, role: filter.role, size: filter.size, industry: filter.industry });
    fetch(`/api/benchmark?${q}`)
      .then((x) => (x.ok ? x.json() : null))
      .then(setBench)
      .catch(() => null);
  }, [full, token, filter, shared.sessionId]);

  useEffect(() => {
    if (!full) return;
    const mode = r.mode === "volume" ? "volume" : "classic";
    fetch(`/api/leaderboard?mode=${mode}`).then((x) => x.json()).then((j) => setBoard(j.rows ?? [])).catch(() => null);
    if (shared.teamId) fetch(`/api/leaderboard?team=${shared.teamId}`).then((x) => x.json()).then((j) => setTeamBoard(j.rows ?? [])).catch(() => null);
  }, [full, r.mode, shared.teamId]);

  const copy = async (text: string, what: string, ev: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    setCopied(what);
    track(ev, { via: "copy" });
    flush();
    setTimeout(() => setCopied(null), 2000);
  };

  const nativeShare = async () => {
    track("share_clicked", { via: "native" });
    flush();
    const text = `I scored ${r.totalScore} (${r.rank}) as ${arch.name} in Spot the Star — Recruiter 2031. I beat the AI at hiring. Can you?`;
    try {
      if (navigator.share) {
        let files: File[] | undefined;
        try {
          const blob = await (await fetch(shareImg)).blob();
          const f = new File([blob], "spot-the-star.png", { type: "image/png" });
          if (navigator.canShare?.({ files: [f] })) files = [f];
        } catch {}
        await navigator.share({ title: "Spot the Star — Recruiter 2031", text, url: shareUrl, ...(files ? { files } : {}) });
      } else copy(`${text} ${shareUrl}`, "share", "share_clicked");
    } catch {}
  };

  const demo = () => {
    track("demo_clicked", { weakest });
    flush();
    if (shared.calendlyUrl) setCalendly(true);
    else window.open("https://scrini.ai/?utm_source=spot_the_star&utm_medium=report&utm_campaign=demo", "_blank");
  };

  const saveExtra = async () => {
    if (!token) return;
    await fetch("/api/lead/extra", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: shared.sessionId, token, ...extra }) }).catch(() => null);
    setExtraSaved(true);
    if (extra.industry) setFilter((f) => ({ ...f, industry: extra.industry }));
  };

  const certUrl = token ? `/api/certificate/pdf?sid=${shared.sessionId}&t=${token}` : null;
  const pdfUrl = token ? `/api/report/pdf?sid=${shared.sessionId}&t=${token}` : null;
  const linkedInCert = r.certificateLevel
    ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(`Certified AI-Ready Recruiter 2031 — Level ${r.certificateLevel}`)}&organizationName=${encodeURIComponent("Scrini AI")}&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(`${origin}/verify/${shared.sessionId}`)}&certId=${encodeURIComponent(`STS-${refCode.toUpperCase()}`)}`
    : null;

  return (
    <section className="mx-auto max-w-3xl py-6">
      {/* Header */}
      <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <IdBadge badge={badge} compact />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong relative overflow-hidden p-5">
          <div className="absolute -right-8 -top-8 text-8xl opacity-20" aria-hidden>
            {arch.emoji}
          </div>
          <div className="label">Recruiter DNA · {r.mode === "volume" ? "Volume Hiring" : `${r.difficulty} · ${r.mode}`}</div>
          <div className="mt-1 flex items-end gap-3">
            <span className="font-mono text-5xl font-black text-neon-cyan">{r.totalScore}</span>
            <span className="pb-1 font-semibold">{r.rank}</span>
          </div>
          {r.streak && <div className="mt-1 text-xs font-bold text-neon-lime">🔥 x1.5 streak — all hires correct!</div>}
          <div className="mt-3 text-xl font-bold text-neon-pink">
            {arch.emoji} {arch.name}
          </div>
          <p className="mt-1 text-sm text-white/75">{arch.blurb}</p>
          {prev && <p className="mt-2 font-mono text-xs text-white/50">Last game: {prev.total} → now {r.totalScore} ({r.totalScore - prev.total >= 0 ? "+" : ""}{r.totalScore - prev.total})</p>}
        </motion.div>
      </div>

      {!full ? (
        <div className="glass-strong mt-6 p-6 text-center">
          <div className="text-4xl">🔒</div>
          <h3 className="mt-2 text-xl font-bold">Your full Recruiter DNA Report is locked</h3>
          <p className="mt-1 text-sm text-white/60">10-competency radar, peer benchmark, blind spots with replays, AI & bias insights, micro-lessons, action plan, PDF and certificate.</p>
          <button className="btn-primary mt-4 w-full" onClick={onUnlock}>
            Unlock my full report →
          </button>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="btn-ghost" onClick={onPlayAgain}>
              🔁 Play again
            </button>
            <button className="btn-ghost" onClick={() => copy(challengeUrl, "challenge", "challenge_sent")}>
              {copied === "challenge" ? "Link copied!" : "⚔️ Challenge a colleague"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Radar + competencies */}
          <div className="glass mt-6 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold">10 recruiter competencies</h3>
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noopener" className="chip text-xs">
                  📄 Download PDF report
                </a>
              )}
            </div>
            <div className="mt-2 grid items-center gap-4 md:grid-cols-2">
              <Radar scores={r.competencies} compare={prev?.competencies as CompetencyScores | undefined} />
              <ul className="space-y-2">
                {COMPETENCIES.map((c) => {
                  const v = r.competencies[c.key];
                  const pv = prev?.competencies?.[c.key];
                  const pct = bench?.percentiles?.[c.key];
                  return (
                    <li key={c.key}>
                      <div className="flex justify-between text-[13px]">
                        <span>{c.label}</span>
                        <span className="font-mono">
                          {v ?? "n/a"}
                          {v !== null && typeof pv === "number" && pv !== v && <span className={v > pv ? "text-neon-lime" : "text-neon-pink"}> ({v > pv ? "+" : ""}{v - pv})</span>}
                        </span>
                      </div>
                      <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full ${v === null ? "" : v >= 70 ? "bg-neon-lime" : v >= 45 ? "bg-neon-cyan" : "bg-neon-pink"}`} style={{ width: `${v ?? 0}%` }} />
                      </div>
                      {typeof pct === "number" && <div className="text-[10px] text-white/40">Top {Math.max(1, 100 - pct)}% for {filter.role || "all roles"}</div>}
                    </li>
                  );
                })}
              </ul>
            </div>
            {prev && <p className="mt-2 text-[11px] text-white/40">Dashed pink = your previous game.</p>}
            {/* Peer benchmark */}
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="label">Peer benchmark</div>
              {bench && (() => {
                const best = COMPETENCIES.filter((c) => typeof bench.percentiles[c.key] === "number").sort((a, b) => (bench.percentiles[b.key] ?? 0) - (bench.percentiles[a.key] ?? 0))[0];
                return best ? (
                  <p className="mt-1 text-sm">
                    You're in the <b className="text-neon-cyan">top {Math.max(1, 100 - (bench.percentiles[best.key] ?? 0))}%</b> for <b>{best.label}</b> among {filter.role || "all recruiters"}
                    {filter.size ? ` at ${filter.size}-person companies` : ""}
                    {filter.industry ? ` in ${filter.industry}` : ""}.
                  </p>
                ) : null;
              })()}
              <div className="mt-2 grid grid-cols-3 gap-2">
                <select className="input !py-2 text-xs" value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.target.value })} aria-label="Benchmark role">
                  <option value="">All roles</option>
                  {JOB_ROLES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <select className="input !py-2 text-xs" value={filter.size} onChange={(e) => setFilter({ ...filter, size: e.target.value })} aria-label="Benchmark company size">
                  <option value="">Any size</option>
                  {SIZES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <select className="input !py-2 text-xs" value={filter.industry} onChange={(e) => setFilter({ ...filter, industry: e.target.value })} aria-label="Benchmark industry">
                  <option value="">Any industry</option>
                  {INDUSTRIES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              {bench && <p className="mt-1 text-[10px] text-white/40">Based on {bench.peers} completed games{bench.baselineBlended ? " blended with a baseline distribution while the peer pool grows" : ""}.</p>}
            </div>
          </div>

          {/* Strengths / blind spots */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="glass p-4">
              <h3 className="font-bold text-neon-lime">💪 Top strengths</h3>
              {r.strengths.map((s) => (
                <div key={s.key} className="mt-2">
                  <div className="text-sm font-semibold">{COMPETENCIES.find((c) => c.key === s.key)!.label}</div>
                  <p className="text-[13px] text-white/70">{s.moment}</p>
                </div>
              ))}
            </div>
            <div className="glass p-4">
              <h3 className="font-bold text-neon-pink">🎯 Blind spots</h3>
              {r.blindSpots.map((s) => (
                <div key={s.key} className="mt-2">
                  <div className="text-sm font-semibold">{COMPETENCIES.find((c) => c.key === s.key)!.label}</div>
                  <p className="text-[13px] text-white/70">{s.moment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="glass p-4">
              <h3 className="font-bold">🤖 AI collaboration</h3>
              <p className="mt-1 text-[13px] text-white/75">
                You followed ARIA {r.ai.followed}/{r.ai.total} times; ARIA was wrong in {r.ai.followedWhenWrong} of those.
                {r.mode !== "volume" && ` Correct overrules: ${r.ai.correctOverrules}. Unnecessary overrules: ${r.ai.wrongOverrules}.`}
              </p>
            </div>
            {r.bias.pairs.length > 0 && (
              <div className="glass p-4">
                <h3 className="font-bold">🪞 Bias insight <span className="text-[10px] font-normal text-white/40">(private — never shared)</span></h3>
                {r.bias.pairs.map((p, i) => (
                  <p key={i} className="mt-1 text-[13px] text-white/75">
                    {p.gap >= 15 ? `You rated two equal candidates ${p.gap} points apart. The only difference was ${p.attribute}.` : `Consistent across a ${p.attribute} difference (${p.gap}-pt gap). Nice.`}
                  </p>
                ))}
                {r.bias.blindAccuracy !== null && <p className="mt-1 text-[12px] text-white/50">Blind Mode accuracy {r.bias.blindAccuracy}% vs {r.bias.nonBlindAccuracy ?? 0}% with profiles visible.</p>}
              </div>
            )}
            {r.mode !== "volume" && (
              <div className="glass p-4">
                <h3 className="font-bold">🎚️ Calibration</h3>
                <p className="mt-1 text-[13px] text-white/75">
                  Avg confidence {r.calibration.avgConfidence}/5 vs {r.calibration.accuracy}% accuracy — you're <b>{r.calibration.verdict}</b>.
                </p>
              </div>
            )}
          </div>

          {/* KPIs */}
          <h3 className="label mt-6">Simulated recruitment KPIs</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Kpi label="Quality of hire" value={`${r.kpis.qualityOfHire}/100`} />
            <Kpi label="Avg time-to-hire" value={`${r.kpis.timeToHireDays} days`} />
            <Kpi label="Avg cost-per-hire" value={shared.settings.currency === "INR" ? `₹${r.kpis.costPerHireK}K` : `$${Math.round((r.kpis.costPerHireK * 1000) / 84 / 100) / 10}k`} />
            <Kpi label="Offer acceptance" value={`${r.kpis.offerAcceptance}%`} tone={r.kpis.offerAcceptance >= 67 ? "lime" : "pink"} />
            <Kpi label="Employer brand" value={`${r.kpis.employerBrand}/100`} tone={r.kpis.employerBrand >= 60 ? "lime" : "pink"} />
            <Kpi label="Bad-hire cost avoided" value={shared.settings.currency === "INR" ? `₹${r.kpis.badHireCostAvoidedLpa}L` : `$${Math.round((r.kpis.badHireCostAvoidedLpa * 100000) / 84 / 1000)}k`} tone="lime" />
          </div>
          <div className="glass mt-2 p-3">
            <div className="label mb-2">Funnel</div>
            <div className="flex items-end gap-1">
              {(["sourced", "screened", "interviewed", "offered", "joined"] as const).map((k) => {
                const v = r.kpis.funnel[k];
                const max = Math.max(1, r.kpis.funnel.sourced);
                return (
                  <div key={k} className="flex flex-1 flex-col items-center gap-1">
                    <span className="font-mono text-xs">{v}</span>
                    <div className="w-full rounded-t bg-gradient-to-t from-neon-violet to-neon-cyan" style={{ height: `${Math.max(6, Math.sqrt(v / max) * 80)}px` }} />
                    <span className="text-[10px] capitalize text-white/50">{k}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Micro-lessons */}
          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-lg font-bold">📚 60-second lessons for you</h3>
            <SponsorBadge sponsors={shared.sponsors} slot="lesson" sessionId={shared.sessionId} prefix="Lessons by" />
          </div>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            {lessons.map((l) => (
              <details key={l.id} className="glass group p-4">
                <summary className="cursor-pointer list-none">
                  <div className="label">{COMPETENCIES.find((c) => c.key === l.competency)?.label}</div>
                  <div className="mt-1 font-semibold">{l.title}</div>
                  <div className="mt-1 text-xs text-neon-cyan group-open:hidden">Read in 60s →</div>
                </summary>
                <ul className="mt-2 space-y-1.5 text-[13px] text-white/75">
                  {l.body.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[13px] font-semibold text-neon-lime">→ {l.takeaway}</p>
              </details>
            ))}
          </div>

          {/* Action plan */}
          <div className="glass mt-4 p-4">
            <h3 className="font-bold">🗺️ Your 3-point plan for the next hiring cycle</h3>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[14px] text-white/80">
              {r.actionPlan.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ol>
          </div>

          {/* Certificate */}
          <div className={`mt-4 rounded-2xl border p-4 ${r.certificateLevel ? "border-neon-lime/50 bg-neon-lime/10" : "border-white/10 bg-white/5"}`}>
            {r.certificateLevel ? (
              <>
                <h3 className="font-bold text-neon-lime">🎓 Certified AI-Ready Recruiter 2031 — Level {r.certificateLevel}</h3>
                <p className="text-sm text-white/70">You scored 70+ in all ten competencies.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {certUrl && (
                    <a className="btn-primary text-sm" href={certUrl} onClick={() => track("certificate_downloaded")}>
                      Download certificate (PDF)
                    </a>
                  )}
                  {linkedInCert && (
                    <a className="btn-ghost text-sm" href={linkedInCert} target="_blank" rel="noopener" onClick={() => track("share_clicked", { via: "linkedin_cert" })}>
                      Add to LinkedIn profile
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-white/70">
                🎓 <b>Certificate locked:</b> score 70+ in all ten competencies {r.mode === "volume" ? "in Classic mode " : ""}to earn “Certified AI-Ready Recruiter 2031”. Your lowest: {weakLabel} ({r.competencies[weakest] ?? "n/a"}).
              </p>
            )}
          </div>

          {/* Share card */}
          <div className="glass mt-4 p-4">
            <h3 className="font-bold">📣 Share your result</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shareImg} alt="Your shareable result card" className="mt-2 aspect-[1200/627] w-full rounded-xl border border-white/10 bg-ink-900" loading="lazy" />
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button className="btn-primary text-sm" onClick={nativeShare}>
                Share
              </button>
              <a className="btn-ghost text-sm" target="_blank" rel="noopener" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} onClick={() => (track("share_clicked", { via: "linkedin" }), flush())}>
                LinkedIn
              </a>
              <a className="btn-ghost text-sm" target="_blank" rel="noopener" href={`https://wa.me/?text=${encodeURIComponent(`I beat the AI at hiring (${r.totalScore} pts, ${arch.name}). Can you? ${shareUrl}`)}`} onClick={() => (track("share_clicked", { via: "whatsapp" }), flush())}>
                WhatsApp
              </a>
              <a className="btn-ghost text-sm" href={shareImg} download="spot-the-star.png" onClick={() => track("share_clicked", { via: "download" })}>
                Download PNG
              </a>
            </div>
            <p className="mt-2 text-[11px] text-white/40">Your share card shows your badge, score and archetype only. Bias insights are never shared.</p>
          </div>

          {/* Scrini CTA */}
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-neon-cyan/40 bg-gradient-to-br from-neon-cyan/15 via-neon-violet/10 to-neon-pink/10 p-5">
            <div className="label !text-neon-cyan">Your weakest area: {weakLabel}</div>
            <h3 className="mt-1 text-xl font-bold">{SCRINI_PITCH[weakest]}. See how →</h3>
            <p className="mt-1 text-sm text-white/70">Scrini AI is the Agentic Hiring OS: AI agents that source, screen, verify and schedule — with the evidence behind every score.</p>
            <button className="btn-primary mt-3 w-full sm:w-auto" onClick={demo}>
              Book a Scrini AI demo
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button className="btn-ghost" onClick={onPlayAgain}>
              🔁 Play again
            </button>
            <button className="btn-ghost" onClick={() => copy(challengeUrl, "challenge", "challenge_sent")}>
              {copied === "challenge" ? "✓ Link copied!" : "⚔️ Challenge a colleague"}
            </button>
            <button className="btn-ghost" onClick={() => copy(teamUrl, "team", "team_invite")}>
              {copied === "team" ? "✓ Team link copied!" : "👥 Invite my team"}
            </button>
          </div>

          {/* Personalise benchmark */}
          <details className="glass mt-4 p-4">
            <summary className="cursor-pointer font-semibold">⚙️ Personalise your benchmark (optional)</summary>
            {extraSaved ? (
              <p className="mt-2 text-sm text-neon-lime">Saved — your benchmark is updated.</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Sel label="Industry" v={extra.industry} opts={INDUSTRIES} on={(x) => setExtra({ ...extra, industry: x })} />
                <Sel label="Years of experience" v={extra.years} opts={YEARS} on={(x) => setExtra({ ...extra, years: x })} />
                <Sel label="Current ATS" v={extra.ats} opts={ATS} on={(x) => setExtra({ ...extra, ats: x })} />
                <Sel label="% hiring via agencies" v={extra.agency} opts={AGENCY} on={(x) => setExtra({ ...extra, agency: x })} />
                <button className="btn-primary col-span-2" onClick={saveExtra} disabled={!token}>
                  Update my benchmark
                </button>
              </div>
            )}
          </details>

          {/* Leaderboards */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Board title="🏆 Leaderboard (top 20)" rows={board} me={badge.firstName} />
            {shared.teamId && <Board title={`👥 Team ${shared.teamId}`} rows={teamBoard} me={badge.firstName} empty="Invite your team to fill this board." />}
            <NativeAd sponsors={shared.sponsors} sessionId={shared.sessionId} />
          </div>
        </>
      )}

      {calendly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3" role="dialog" aria-modal aria-label="Book a demo" onClick={() => setCalendly(false)}>
          <div className="glass-strong h-[85dvh] w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <span className="font-semibold">Book a Scrini AI demo</span>
              <button onClick={() => setCalendly(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <iframe title="Scheduling" className="h-full w-full bg-white" src={`${shared.calendlyUrl}${shared.calendlyUrl.includes("?") ? "&" : "?"}name=${encodeURIComponent(badge.firstName)}&utm_source=spot_the_star&utm_content=${weakest}`} />
          </div>
        </div>
      )}
    </section>
  );
}

function Sel({ label, v, opts, on }: { label: string; v: string; opts: string[]; on: (x: string) => void }) {
  return (
    <label className="block text-xs">
      <span className="label">{label}</span>
      <select className="input mt-1 !py-2 text-sm" value={v} onChange={(e) => on(e.target.value)}>
        <option value="">—</option>
        {opts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Board({ title, rows, me, empty = "Be the first on the board!" }: { title: string; rows: { rank: number; name: string; company: string; score: number }[]; me: string; empty?: string }) {
  return (
    <div className="glass p-4">
      <h3 className="font-bold">{title}</h3>
      {rows.length ? (
        <ol className="mt-2 space-y-1 text-sm">
          {rows.map((x) => (
            <li key={x.rank} className={`flex justify-between gap-2 rounded px-2 py-1 ${x.name === me ? "bg-neon-cyan/10" : ""}`}>
              <span className="truncate">
                <span className="font-mono text-white/40">{x.rank}.</span> {x.name} <span className="text-white/40">· {x.company}</span>
              </span>
              <span className="font-mono">{x.score}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-2 text-sm text-white/50">{empty}</p>
      )}
    </div>
  );
}

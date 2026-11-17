"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import type { CompetencyScores, Sponsor, SponsorSlot } from "@/lib/types";
import { COMPETENCIES, SPONSOR_SLOTS } from "@/lib/types";
import Radar from "../ui/Radar";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Data = any;
const TABS = ["Leads", "Funnel", "Teams", "Sponsors", "Insights", "Content", "Leaderboard", "Privacy"] as const;
type Tab = (typeof TABS)[number];

const ARCH: Record<string, string> = { detective: "Detective", speedster: "Speedster", loyalist: "AI Loyalist", maverick: "Gut-Feel Maverick", advocate: "Talent Advocate", strategic: "Strategic Partner" };

export default function AdminDashboard() {
  const [d, setD] = useState<Data | null>(null);
  const [tab, setTab] = useState<Tab>("Leads");
  const [err, setErr] = useState("");
  const load = () =>
    fetch("/api/admin/data")
      .then(async (r) => (r.ok ? setD(await r.json()) : setErr("Failed to load (session expired?)")))
      .catch(() => setErr("Network error"));
  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">⭐ Spot the Star — Admin</h1>
          {d && (
            <p className="text-xs text-white/50">
              Storage: {d.db} · {d.totals.sessions} sessions · {d.totals.completed} completed · {d.totals.leads} leads · {d.totals.hot} hot · {d.totals.events} events
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost !py-2 text-sm" onClick={load}>
            ↻ Refresh
          </button>
          <button className="btn-ghost !py-2 text-sm" onClick={async () => (await fetch("/api/admin/logout", { method: "POST" }), location.reload())}>
            Sign out
          </button>
        </div>
      </header>
      <nav className="mt-4 flex flex-wrap gap-1" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`chip ${tab === t ? "chip-on" : ""}`}>
            {t}
          </button>
        ))}
      </nav>
      {err && <p className="mt-4 text-neon-pink">{err}</p>}
      {!d ? (
        <p className="mt-8 text-white/50">Loading…</p>
      ) : (
        <div className="mt-4">
          {tab === "Leads" && <Leads d={d} />}
          {tab === "Funnel" && <Funnel d={d} />}
          {tab === "Teams" && <Teams d={d} />}
          {tab === "Sponsors" && <Sponsors d={d} reload={load} />}
          {tab === "Insights" && <Insights d={d} />}
          {tab === "Content" && <Content d={d} reload={load} />}
          {tab === "Leaderboard" && <Moderation d={d} reload={load} />}
          {tab === "Privacy" && <Privacy d={d} reload={load} />}
        </div>
      )}
    </main>
  );
}

function csvDownload(rows: Record<string, unknown>[], name: string) {
  if (!rows.length) return;
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const blob = new Blob([[cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

function Leads({ d }: { d: Data }) {
  const [f, setF] = useState({ q: "", tag: "", role: "", size: "", industry: "", archetype: "", weakest: "", utm: "", from: "", to: "" });
  const [open, setOpen] = useState<string | null>(null);
  const uniq = (k: string) => [...new Set(d.leads.map((l: any) => l[k]).filter(Boolean))] as string[];
  const rows = useMemo(
    () =>
      d.leads.filter((l: any) => {
        const q = f.q.toLowerCase();
        if (q && ![l.first_name, l.email, l.company, l.phone].some((x: string) => x?.toLowerCase().includes(q))) return false;
        if (f.tag && l.lead_tag !== f.tag) return false;
        if (f.role && l.role !== f.role) return false;
        if (f.size && l.company_size !== f.size) return false;
        if (f.industry && l.industry !== f.industry) return false;
        if (f.archetype && l.archetype !== f.archetype) return false;
        if (f.weakest && l.weakest !== f.weakest) return false;
        if (f.utm && l.utm_source !== f.utm) return false;
        if (f.from && l.created_at < f.from) return false;
        if (f.to && l.created_at.slice(0, 10) > f.to) return false;
        return true;
      }),
    [d.leads, f]
  );
  const sel = (k: keyof typeof f, label: string, opts: string[], labels?: Record<string, string>) => (
    <select className="input !py-2 text-xs" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-label={label}>
      <option value="">{label}: all</option>
      {opts.map((o) => (
        <option key={o} value={o}>
          {labels?.[o] ?? o}
        </option>
      ))}
    </select>
  );
  return (
    <section>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <input className="input !py-2 text-xs md:col-span-2" placeholder="Search name, email, company…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
        {sel("tag", "Tag", ["Hot", "Warm", "Cold"])}
        {sel("role", "Role", uniq("role"))}
        {sel("size", "Size", uniq("company_size"))}
        {sel("industry", "Industry", uniq("industry"))}
        {sel("archetype", "Archetype", uniq("archetype"), ARCH)}
        {sel("weakest", "Weakest", uniq("weakest"), Object.fromEntries(COMPETENCIES.map((c) => [c.key, c.label])))}
        {sel("utm", "UTM source", uniq("utm_source"))}
        <input type="date" className="input !py-2 text-xs" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} aria-label="From date" />
        <input type="date" className="input !py-2 text-xs" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} aria-label="To date" />
        <button className="btn-primary !py-2 text-xs" onClick={() => csvDownload(rows.map(({ competencies, ...r }: any) => ({ ...r, ...Object.fromEntries(Object.entries(competencies ?? {}).map(([k, v]) => [`comp_${k}`, v])) })), "leads-filtered.csv")}>
          ⬇ CSV ({rows.length})
        </button>
      </div>
      <div className="scrollbar-thin mt-3 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-xs">
          <thead className="text-white/50">
            <tr>
              {["Date", "Score", "Tag", "Name", "Role", "Company", "Email", "Size", "Volume", "Archetype", "Weakest", "Game", "Source", "Demo"].map((h) => (
                <th key={h} className="border-b border-white/10 px-2 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((l: any) => (
              <Fragment key={l.session_id}>
                <tr className="cursor-pointer border-b border-white/5 hover:bg-white/5" onClick={() => setOpen(open === l.session_id ? null : l.session_id)}>
                  <td className="px-2 py-2 font-mono">{l.created_at.slice(0, 10)}</td>
                  <td className="px-2 font-mono font-bold">{l.lead_score}</td>
                  <td className="px-2">
                    <span className={`rounded px-1.5 py-0.5 ${l.lead_tag === "Hot" ? "bg-neon-pink/20 text-neon-pink" : l.lead_tag === "Warm" ? "bg-neon-amber/20 text-neon-amber" : "bg-white/10"}`}>{l.lead_tag}</span>
                  </td>
                  <td className="px-2">{l.first_name}</td>
                  <td className="px-2">{l.role}</td>
                  <td className="px-2">{l.company}</td>
                  <td className="px-2">
                    {l.email}
                    {l.email_is_free && <span className="ml-1 text-neon-amber" title="Free email domain">•</span>}
                  </td>
                  <td className="px-2">{l.company_size}</td>
                  <td className="px-2">{l.hiring_volume}</td>
                  <td className="px-2">{ARCH[l.archetype] ?? l.archetype}</td>
                  <td className="px-2">{COMPETENCIES.find((c) => c.key === l.weakest)?.short ?? l.weakest}</td>
                  <td className="px-2 font-mono">{l.total_score}</td>
                  <td className="px-2">{l.utm_source || "direct"}</td>
                  <td className="px-2">{l.demo_clicked ? "✓" : ""}</td>
                </tr>
                {open === l.session_id && (
                  <tr className="bg-white/5">
                    <td colSpan={14} className="px-3 py-3">
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <div className="label">Why this score</div>
                          <ul className="mt-1 space-y-0.5">{(l.lead_reasons ?? []).map((r: string) => <li key={r}>{r}</li>)}</ul>
                        </div>
                        <div>
                          <div className="label">Details</div>
                          <p>Phone: {l.phone || "—"} · Pains: {(l.pains ?? []).join(", ") || "—"}</p>
                          <p>Industry: {l.industry || "—"} · Exp: {l.years_experience || "—"} · ATS: {l.current_ats || "—"} · Agency: {l.agency_pct || "—"}</p>
                          <p>Consent: Scrini ✓ {l.consent_partner ? "· Partners ✓" : ""} · {l.consent_ts?.slice(0, 16)} · policy {l.policy_version} · {l.ip_country || "—"}</p>
                          <p>Device {l.device} · {l.difficulty}/{l.mode} · plays {l.play_count} · team {l.team_id || "—"} · ref {l.referral_code || "—"}</p>
                        </div>
                        <div>
                          <div className="label">Competencies</div>
                          <p className="font-mono">{COMPETENCIES.map((c) => `${c.short} ${l.competencies?.[c.key] ?? "–"}`).join(" · ")}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="py-6 text-center text-white/50">No leads match.</p>}
      </div>
    </section>
  );
}

function Funnel({ d }: { d: Data }) {
  const max = Math.max(1, ...d.funnel.map((f: any) => f.count));
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="glass p-4">
        <h2 className="font-bold">Funnel (distinct sessions)</h2>
        <div className="mt-3 space-y-2">
          {d.funnel.map((f: any, i: number) => (
            <div key={f.key}>
              <div className="flex justify-between text-xs">
                <span>{f.label}</span>
                <span className="font-mono">
                  {f.count}
                  {i > 0 && d.funnel[i - 1].count ? <span className="text-white/40"> · {Math.round((f.count / d.funnel[i - 1].count) * 100)}%</span> : null}
                </span>
              </div>
              <div className="mt-1 h-5 rounded bg-white/5">
                <div className="h-full rounded bg-gradient-to-r from-neon-cyan to-neon-violet" style={{ width: `${(f.count / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass p-4">
        <h2 className="font-bold">Drop-off screen (unfinished sessions)</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {Object.entries(d.dropOff)
            .sort((a: any, b: any) => b[1] - a[1])
            .map(([k, v]: any) => (
              <li key={k} className="flex justify-between">
                <span>{k}</span>
                <span className="font-mono">{v}</span>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

function Teams({ d }: { d: Data }) {
  if (!d.teams.length) return <p className="text-white/50">No companies with 3+ players yet.</p>;
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {d.teams.map((t: any) => (
        <div key={t.key} className="glass p-4">
          <h2 className="font-bold">{t.name}</h2>
          <p className="text-xs text-white/50">
            {t.players} players · avg score {t.avgScore}
          </p>
          <Radar scores={t.radar as CompetencyScores} size={260} />
          <ol className="mt-2 space-y-0.5 text-sm">
            {t.leaderboard.map((p: any, i: number) => (
              <li key={i} className="flex justify-between">
                <span>
                  {i + 1}. {p.name} <span className="text-white/40">· {p.role} · {ARCH[p.archetype]}</span>
                </span>
                <span className="font-mono">{p.score}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

function Sponsors({ d, reload }: { d: Data; reload: () => void }) {
  const doc = d.content.find((c: any) => c.key === "sponsors");
  const [list, setList] = useState<Sponsor[]>(doc?.value ?? []);
  const [msg, setMsg] = useState("");
  const upd = (i: number, patch: Partial<Sponsor>) => setList(list.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const save = async () => {
    const r = await fetch("/api/admin/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "sponsors", value: list }) });
    setMsg(r.ok ? "Saved ✓ — live on next page load" : (await r.json()).error);
    reload();
  };
  return (
    <section className="space-y-4">
      <div className="glass p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Sponsor report</h2>
          <a className="chip text-xs" href="/api/admin/export?type=sponsors">
            ⬇ CSV
          </a>
        </div>
        <table className="mt-2 w-full text-left text-sm">
          <thead className="text-xs text-white/50">
            <tr>
              <th>Sponsor</th>
              <th>Slot</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>CTR</th>
            </tr>
          </thead>
          <tbody>
            {d.sponsorReport.map((r: any) => (
              <tr key={r.sponsor + r.slot} className="border-t border-white/5">
                <td className="py-1">{r.sponsor}</td>
                <td>{r.slot}</td>
                <td className="font-mono">{r.impressions}</td>
                <td className="font-mono">{r.clicks}</td>
                <td className="font-mono">{r.ctr}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="glass p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Sponsor config</h2>
          <div className="flex gap-2">
            <button
              className="chip text-xs"
              onClick={() => setList([...list, { id: `sponsor-${Date.now().toString(36)}`, name: "New sponsor", logo_url: "/sponsors/scrini.svg", click_url: "https://example.com", tagline: "", headline: "", cta: "Learn more", slots: [], start: new Date().toISOString().slice(0, 10), end: "2099-12-31", priority: 1, active: false }])}
            >
              + Add sponsor
            </button>
            <button className="btn-primary !py-1.5 text-xs" onClick={save}>
              Save
            </button>
          </div>
        </div>
        {msg && <p className="mt-1 text-xs text-neon-lime">{msg}</p>}
        <div className="mt-3 space-y-3">
          {list.map((s, i) => (
            <div key={s.id} className="rounded-xl border border-white/10 p-3">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {(["name", "logo_url", "click_url", "tagline", "headline", "cta"] as const).map((k) => (
                  <label key={k} className="text-xs">
                    <span className="label">{k}</span>
                    <input className="input !py-1.5 text-xs" value={(s[k] as string) ?? ""} onChange={(e) => upd(i, { [k]: e.target.value })} />
                  </label>
                ))}
                <label className="text-xs">
                  <span className="label">start</span>
                  <input type="date" className="input !py-1.5 text-xs" value={s.start} onChange={(e) => upd(i, { start: e.target.value })} />
                </label>
                <label className="text-xs">
                  <span className="label">end</span>
                  <input type="date" className="input !py-1.5 text-xs" value={s.end} onChange={(e) => upd(i, { end: e.target.value })} />
                </label>
                <label className="text-xs">
                  <span className="label">priority</span>
                  <input type="number" className="input !py-1.5 text-xs" value={s.priority} onChange={(e) => upd(i, { priority: Number(e.target.value) })} />
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={s.active} onChange={(e) => upd(i, { active: e.target.checked })} /> Active
                </label>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {SPONSOR_SLOTS.map((sl) => {
                  const on = s.slots.includes(sl.key as SponsorSlot);
                  return (
                    <button key={sl.key} className={`chip text-[11px] ${on ? "chip-on" : ""}`} onClick={() => upd(i, { slots: on ? s.slots.filter((x) => x !== sl.key) : [...s.slots, sl.key as SponsorSlot] })}>
                      {on && "✓ "}
                      {sl.label}
                    </button>
                  );
                })}
                {s.id !== "scrini" && (
                  <button className="chip text-[11px] text-neon-pink" onClick={() => setList(list.filter((_, j) => j !== i))}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-white/40">Scrini AI is the fallback for any slot without an active sponsor. Highest priority active sponsor wins a slot; the wall screen rotates through all of them.</p>
      </div>
    </section>
  );
}

function Insights({ d }: { d: Data }) {
  const i = d.insights;
  return (
    <section className="space-y-4">
      <div className="glass p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Industry insights (anonymised · {i.players} completed games)</h2>
          <a className="chip text-xs" href="/api/admin/export?type=insights">
            ⬇ CSV for marketing
          </a>
        </div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {i.headlines.map((h: string) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass p-4">
          <h3 className="font-bold">Red-flag miss rate</h3>
          {i.flagMissRates.map((f: any) => (
            <div key={f.type} className="mt-2 text-xs">
              <div className="flex justify-between">
                <span>{f.label}</span>
                <span className="font-mono">{f.missRate}%</span>
              </div>
              <div className="mt-0.5 h-2 rounded bg-white/5">
                <div className="h-full rounded bg-neon-pink" style={{ width: `${f.missRate}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="glass p-4">
          <h3 className="font-bold">Archetype mix</h3>
          {Object.entries(i.archetypes).map(([k, v]: any) => (
            <div key={k} className="mt-1 flex justify-between text-sm">
              <span>{ARCH[k] ?? k}</span>
              <span className="font-mono">{v}</span>
            </div>
          ))}
          <h3 className="mt-4 font-bold">Avg score by company size</h3>
          {Object.entries(i.scoreBySize).map(([k, v]: any) => (
            <div key={k} className="mt-1 flex justify-between text-sm">
              <span>{k}</span>
              <span className="font-mono">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="glass scrollbar-thin overflow-x-auto p-4">
        <h3 className="font-bold">By role</h3>
        <table className="mt-2 w-full min-w-[700px] text-left text-xs">
          <thead className="text-white/50">
            <tr>
              <th>Role</th>
              <th>Players</th>
              <th>Avg score</th>
              <th>Avg bias gap</th>
              <th>% blindly followed AI</th>
              {COMPETENCIES.map((c) => (
                <th key={c.key}>{c.short}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {i.roles.map((r: any) => (
              <tr key={r.role} className="border-t border-white/5 font-mono">
                <td className="py-1 font-sans">{r.role}</td>
                <td>{r.players}</td>
                <td>{r.avgScore}</td>
                <td>{r.avgBiasGap}</td>
                <td>{r.blindFollowPct}%</td>
                {COMPETENCIES.map((c) => (
                  <td key={c.key}>{r[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Content({ d, reload }: { d: Data; reload: () => void }) {
  const [key, setKey] = useState<string>(d.content[0]?.key);
  const doc = d.content.find((c: any) => c.key === key);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    setText(doc ? JSON.stringify(doc.value, null, 2) : "");
    setMsg("");
  }, [key, doc]);
  const save = async (value: unknown) => {
    const r = await fetch("/api/admin/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
    setMsg(r.ok ? (value === null ? "Reset to file default ✓" : "Saved ✓ — live on next page load") : `Error: ${(await r.json()).error}`);
    reload();
  };
  return (
    <section className="glass p-4">
      <div className="flex flex-wrap items-center gap-2">
        <select className="input !w-auto !py-2 text-sm" value={key} onChange={(e) => setKey(e.target.value)} aria-label="Content document">
          {d.content.map((c: any) => (
            <option key={c.key} value={c.key}>
              {c.label}
              {c.overridden ? " (edited)" : ""}
            </option>
          ))}
        </select>
        <button
          className="btn-primary !py-2 text-sm"
          onClick={() => {
            try {
              save(JSON.parse(text));
            } catch (e) {
              setMsg(`Invalid JSON: ${(e as Error).message}`);
            }
          }}
        >
          Save
        </button>
        {doc?.overridden && (
          <button className="btn-ghost !py-2 text-sm" onClick={() => confirm("Discard edits and revert to the JSON file?") && save(null)}>
            Reset to file
          </button>
        )}
        {msg && <span className="text-xs text-neon-lime">{msg}</span>}
      </div>
      <p className="mt-2 text-[11px] text-white/40">
        Edit candidates, role packs, micro-lessons, sourcing tables and sponsors. To add a new role pack: add an entry to “Role pack index” with a new id, save, then edit the new “Role pack” document that appears.
      </p>
      <textarea className="input mt-3 h-[60vh] font-mono text-xs" spellCheck={false} value={text} onChange={(e) => setText(e.target.value)} aria-label="JSON editor" />
    </section>
  );
}

function Moderation({ d, reload }: { d: Data; reload: () => void }) {
  const toggle = async (id: string, hidden: boolean) => {
    await fetch("/api/admin/leaderboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, hidden }) });
    reload();
  };
  return (
    <section className="glass p-4">
      <h2 className="font-bold">Leaderboard moderation (opt-in players)</h2>
      <table className="mt-2 w-full text-left text-sm">
        <tbody>
          {d.leaderboard.map((r: any, i: number) => (
            <tr key={r.id} className={`border-t border-white/5 ${r.hidden ? "opacity-40" : ""}`}>
              <td className="py-1.5 font-mono text-white/40">{i + 1}</td>
              <td>{r.name}</td>
              <td className="text-white/60">{r.company}</td>
              <td className="text-white/40">{r.mode}</td>
              <td className="font-mono">{r.score}</td>
              <td className="text-right">
                <button className="chip text-xs" onClick={() => toggle(r.id, !r.hidden)}>
                  {r.hidden ? "Unhide" : "Hide"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!d.leaderboard.length && <p className="text-sm text-white/50">No opted-in players yet.</p>}
    </section>
  );
}

function Privacy({ d, reload }: { d: Data; reload: () => void }) {
  const act = async (r: any) => {
    if (!confirm(`Permanently delete all data for ${r.email}?`)) return;
    await fetch("/api/admin/deletion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: r.id, email: r.email }) });
    reload();
  };
  return (
    <section className="glass p-4">
      <h2 className="font-bold">Data deletion requests (DPDP)</h2>
      <table className="mt-2 w-full text-left text-sm">
        <tbody>
          {d.deletions.map((r: any) => (
            <tr key={r.id} className="border-t border-white/5">
              <td className="py-1.5 font-mono text-xs">{r.created_at.slice(0, 16)}</td>
              <td>{r.email}</td>
              <td>{r.status}</td>
              <td className="text-right">{r.status === "pending" && <button className="chip text-xs text-neon-pink" onClick={() => act(r)}>Delete now</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!d.deletions.length && <p className="text-sm text-white/50">No requests.</p>}
    </section>
  );
}

// Outbound integrations: CRM webhook, Slack hot-lead alerts, transactional email (Resend).
// Every integration is optional and fails soft — the player never sees an error.
import "server-only";
import type { LeadRow, SessionRow } from "./db";
import { appUrl } from "./server";
import { COMPETENCIES } from "./types";

async function post(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${url} → ${res.status} ${await res.text().catch(() => "")}`);
}

export async function fireLeadWebhook(lead: LeadRow, session: SessionRow | null) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return { skipped: true };
  const payload = {
    event: "lead_submitted",
    lead,
    gameplay: session
      ? {
          total_score: session.total_score,
          rank: session.rank,
          archetype: session.archetype,
          accuracy: session.accuracy,
          competencies: session.competencies,
          mode: session.mode,
          difficulty: session.difficulty,
          play_count: session.play_count,
          utm_source: session.utm_source,
          utm_medium: session.utm_medium,
          utm_campaign: session.utm_campaign,
          team_id: session.team_id,
        }
      : null,
  };
  await post(url, payload);
  return { ok: true };
}

function weakestLabel(lead: LeadRow) {
  return COMPETENCIES.find((c) => c.key === lead.weakest)?.label ?? lead.weakest ?? "—";
}

export async function alertHotLead(lead: LeadRow) {
  if (lead.lead_tag !== "Hot") return { skipped: true };
  const text =
    `🔥 *Hot lead* (${lead.lead_score}/100): ${lead.first_name ?? ""} — ${lead.role ?? ""} @ ${lead.company ?? ""}\n` +
    `• ${lead.email}${lead.phone ? ` · ${lead.phone}` : ""}\n` +
    `• Size ${lead.company_size} · Volume ${lead.hiring_volume}/mo · Pains: ${(lead.pains ?? []).join(", ")}\n` +
    `• Archetype: ${lead.archetype} · Weakest: ${weakestLabel(lead)} → open with that pain\n` +
    `• Why hot: ${(lead.lead_reasons ?? []).join("; ")}`;
  const jobs: Promise<unknown>[] = [];
  if (process.env.SLACK_WEBHOOK_URL) jobs.push(post(process.env.SLACK_WEBHOOK_URL, { text }));
  const to = (process.env.SALES_ALERT_EMAILS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (to.length) jobs.push(sendEmail({ to, subject: `🔥 Hot lead: ${lead.company} (${lead.lead_score})`, html: `<pre style="font-family:inherit">${escapeHtml(text)}</pre>` }));
  await Promise.allSettled(jobs);
  return { ok: true };
}

export async function sendEmail(opts: { to: string[]; subject: string; html: string; attachments?: { filename: string; content: string }[] }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email skipped — RESEND_API_KEY not set]", opts.subject, "→", opts.to.join(","));
    return { skipped: true };
  }
  await post(
    "https://api.resend.com/emails",
    { from: process.env.EMAIL_FROM || "Scrini AI <hello@scrini.ai>", to: opts.to, subject: opts.subject, html: opts.html, attachments: opts.attachments },
    { Authorization: `Bearer ${key}` }
  );
  return { ok: true };
}

export async function emailReport(lead: LeadRow, session: SessionRow, links: { report: string; certificate?: string | null }, pdf?: Uint8Array) {
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://scrini.ai";
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#111">
    <h2 style="margin:0 0 8px">Your Recruiter DNA Report is ready, ${escapeHtml(lead.first_name ?? "Recruiter")} 🧬</h2>
    <p>You scored <b>${session.total_score}</b> — <b>${escapeHtml(session.rank ?? "")}</b> — and your archetype is <b>${escapeHtml(archetypeName(session.archetype))}</b>.</p>
    <p>Your weakest area was <b>${escapeHtml(weakestLabel(lead))}</b>. Your full report (attached) includes micro-lessons and a 3-point action plan for your next hiring cycle.</p>
    <p><a href="${links.report}" style="background:#22e4ff;color:#05060f;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Download report (PDF)</a></p>
    ${links.certificate ? `<p><a href="${links.certificate}">🎓 Download your Certified AI-Ready Recruiter 2031 certificate</a></p>` : ""}
    <hr style="border:none;border-top:1px solid #ddd;margin:20px 0"/>
    <p><b>AI shortlists. Humans make the call.</b> Scrini AI is the Agentic Hiring OS that sources, screens and verifies — so you can focus on the decisions.</p>
    <p><a href="${calendly}">Book a 20-minute demo →</a></p>
    <p style="font-size:12px;color:#666">This is a learning simulation, not a formal assessment. All candidates and companies are fictional.
    You received this because you requested your report at ${appUrl()}. <a href="${appUrl()}/privacy#delete">Delete my data</a>.</p>
  </div>`;
  return sendEmail({
    to: [lead.email],
    subject: `Your Recruiter DNA Report — ${session.rank}`,
    html,
    attachments: pdf ? [{ filename: "Recruiter-DNA-Report.pdf", content: Buffer.from(pdf).toString("base64") }] : undefined,
  });
}

export function archetypeName(k?: string | null) {
  const m: Record<string, string> = {
    detective: "The Detective", speedster: "The Speedster", loyalist: "The AI Loyalist",
    maverick: "The Gut-Feel Maverick", advocate: "The Talent Advocate", strategic: "The Strategic Partner",
  };
  return (k && m[k]) || "—";
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

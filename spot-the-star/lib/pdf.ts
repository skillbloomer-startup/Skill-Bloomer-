// Server-side PDF generation (pdf-lib, no headless browser needed).
import "server-only";
import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts, degrees } from "pdf-lib";
import type { GameResult, MicroLesson } from "./types";
import { COMPETENCIES } from "./types";
import { ARCHETYPES } from "./engine/scoring";

const C = {
  ink: rgb(0.02, 0.024, 0.06),
  ink2: rgb(0.07, 0.08, 0.17),
  cyan: rgb(0.13, 0.89, 1),
  violet: rgb(0.55, 0.36, 1),
  pink: rgb(1, 0.24, 0.65),
  lime: rgb(0.71, 1, 0.23),
  white: rgb(1, 1, 1),
  grey: rgb(0.62, 0.66, 0.78),
  dark: rgb(0.12, 0.13, 0.2),
};

/** Standard PDF fonts are WinAnsi only — map/strip everything else. */
export function safe(s: string) {
  return s
    .replace(/₹/g, "Rs ")
    .replace(/[→]/g, "->")
    .replace(/[✓✅]/g, "[ok]")
    .replace(/[❌]/g, "[x]")
    .replace(/[≤]/g, "<=")
    .replace(/[≥]/g, ">=")
    .replace(/[^\x20-\x7E -ÿ–—‘’“”•…€]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = safe(text).split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (font.widthOfTextAtSize(t, size) > width && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

class Writer {
  page!: PDFPage;
  y = 0;
  constructor(public doc: PDFDocument, public f: PDFFont, public b: PDFFont, public footer: string) {
    this.newPage();
  }
  W = 595;
  H = 842;
  M = 44;
  newPage() {
    this.page = this.doc.addPage([this.W, this.H]);
    this.page.drawRectangle({ x: 0, y: 0, width: this.W, height: this.H, color: C.ink });
    this.page.drawRectangle({ x: 0, y: this.H - 6, width: this.W, height: 6, color: C.cyan });
    wrap(this.footer, this.f, 7, this.W - 2 * this.M).forEach((l, i) => this.page.drawText(l, { x: this.M, y: 26 - i * 9, size: 7, font: this.f, color: C.grey }));
    this.y = this.H - 50;
  }
  ensure(h: number) {
    if (this.y - h < 50) this.newPage();
  }
  text(s: string, o: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; x?: number; width?: number; gap?: number } = {}) {
    const size = o.size ?? 10;
    const font = o.bold ? this.b : this.f;
    const x = o.x ?? this.M;
    const lines = wrap(s, font, size, o.width ?? this.W - x - this.M);
    for (const l of lines) {
      this.ensure(size + 4);
      this.page.drawText(l, { x, y: this.y - size, size, font, color: o.color ?? C.white });
      this.y -= size + (o.gap ?? 4);
    }
  }
  h(s: string) {
    this.ensure(40);
    this.y -= 10;
    this.page.drawRectangle({ x: this.M, y: this.y - 16, width: 3, height: 16, color: C.cyan });
    this.text(s, { size: 13, bold: true, x: this.M + 10 });
    this.y -= 4;
  }
  space(n = 8) {
    this.y -= n;
  }
}

function radar(w: Writer, cx: number, cy: number, r: number, values: (number | null)[], labels: string[]) {
  const n = values.length;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v] as const;
  };
  // pdf-lib svg paths use a flipped y axis relative to page coordinates; draw with lines instead.
  for (const ring of [0.25, 0.5, 0.75, 1]) {
    for (let i = 0; i < n; i++) {
      const [x1, y1] = pt(i, ring);
      const [x2, y2] = pt((i + 1) % n, ring);
      w.page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 0.5, color: C.dark });
    }
  }
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i, 1);
    w.page.drawLine({ start: { x: cx, y: cy }, end: { x, y }, thickness: 0.5, color: C.dark });
    const [lx, ly] = pt(i, 1.18);
    const lab = safe(labels[i]);
    const tw = w.f.widthOfTextAtSize(lab, 7.5);
    w.page.drawText(lab, { x: lx - tw / 2, y: ly - 3, size: 7.5, font: w.f, color: C.grey });
  }
  const pts = values.map((v, i) => pt(i, Math.max(0.03, (v ?? 0) / 100)));
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    w.page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 2, color: C.cyan });
    w.page.drawCircle({ x: x1, y: y1, size: 2.2, color: values[i] === null ? C.grey : C.pink });
  }
}

export interface ReportInput {
  result: GameResult;
  name: string;
  role: string;
  company: string;
  lessons: MicroLesson[];
  sponsorName: string;
  benchmark?: Record<string, number> | null;
}

export async function reportPdf(inp: ReportInput) {
  const doc = await PDFDocument.create();
  doc.setTitle("Recruiter DNA Report — Spot the Star 2031");
  doc.setAuthor("Scrini AI");
  const f = await doc.embedFont(StandardFonts.Helvetica);
  const b = await doc.embedFont(StandardFonts.HelveticaBold);
  const r = inp.result;
  const w = new Writer(doc, f, b, `Spot the Star - Recruiter 2031 · by Scrini AI · Results brought to you by ${inp.sponsorName} · Learning simulation, not a formal assessment. All candidates and companies are fictional.`);
  const arch = ARCHETYPES[r.archetype];

  // Header
  w.text("RECRUITER DNA REPORT", { size: 10, bold: true, color: C.cyan });
  w.text(`${inp.name} — Senior Recruiter, 2031`, { size: 22, bold: true });
  w.text(`${inp.role} · ${inp.company}`, { size: 10, color: C.grey });
  w.space(6);
  w.page.drawRectangle({ x: w.M, y: w.y - 74, width: w.W - 2 * w.M, height: 74, color: C.ink2, borderColor: C.violet, borderWidth: 1 });
  const top = w.y;
  w.page.drawText(String(r.totalScore), { x: w.M + 16, y: top - 44, size: 34, font: b, color: C.cyan });
  w.page.drawText(safe(`${r.rank}${r.streak ? "  ·  x1.5 streak" : ""}`), { x: w.M + 16, y: top - 64, size: 10, font: b, color: C.white });
  w.page.drawText(safe(arch.name), { x: w.M + 210, y: top - 30, size: 15, font: b, color: C.pink });
  wrap(arch.blurb, f, 8.5, 270).forEach((l, i) => w.page.drawText(l, { x: w.M + 210, y: top - 46 - i * 11, size: 8.5, font: f, color: C.grey }));
  w.y = top - 90;

  // Radar + competency table
  w.h("10 recruiter competencies");
  const vals = COMPETENCIES.map((c) => r.competencies[c.key]);
  const startY = w.y;
  radar(w, w.M + 120, startY - 125, 92, vals, COMPETENCIES.map((c) => c.short));
  let ty = startY - 10;
  for (const c of COMPETENCIES) {
    const v = r.competencies[c.key];
    w.page.drawText(safe(c.label), { x: 300, y: ty, size: 9, font: f, color: C.white });
    w.page.drawRectangle({ x: 300, y: ty - 8, width: 200, height: 4, color: C.dark });
    if (v !== null) w.page.drawRectangle({ x: 300, y: ty - 8, width: 2 * v, height: 4, color: v >= 70 ? C.lime : v >= 45 ? C.cyan : C.pink });
    const vs = v === null ? "n/a" : String(v);
    const bm = inp.benchmark?.[c.key];
    w.page.drawText(vs + (bm !== undefined ? `  · top ${100 - bm}%` : ""), { x: 508, y: ty, size: 8.5, font: b, color: C.white });
    ty -= 24;
  }
  w.y = Math.min(ty, startY - 250);

  w.h("Strengths");
  for (const s of r.strengths) w.text(`+ ${COMPETENCIES.find((c) => c.key === s.key)!.label}: ${s.moment}`, { size: 9.5 });
  w.h("Blind spots");
  for (const s of r.blindSpots) w.text(`- ${COMPETENCIES.find((c) => c.key === s.key)!.label}: ${s.moment}`, { size: 9.5 });

  w.h("AI collaboration insight");
  w.text(`You followed ARIA's recommendation on ${r.ai.followed}/${r.ai.total} candidates; ARIA was wrong in ${r.ai.followedWhenWrong} of those. Correct overrules: ${r.ai.correctOverrules}. Unnecessary overrules: ${r.ai.wrongOverrules}.`, { size: 9.5 });

  if (r.bias.pairs.length) {
    w.h("Bias insight (private — only you see this)");
    for (const p of r.bias.pairs)
      w.text(p.gap >= 15 ? `You rated two equally qualified candidates ${p.gap} points apart. The only difference was ${p.attribute}.` : `Consistent: you rated two equal candidates within ${p.gap} points despite a difference in ${p.attribute}.`, { size: 9.5 });
    if (r.bias.blindAccuracy !== null) w.text(`Blind-mode accuracy: ${r.bias.blindAccuracy}% vs ${r.bias.nonBlindAccuracy ?? 0}% when profiles were visible.`, { size: 9.5 });
  }

  w.h("Calibration");
  w.text(`Average confidence ${r.calibration.avgConfidence}/5 with ${r.calibration.accuracy}% hiring accuracy — you are ${r.calibration.verdict}.`, { size: 9.5 });

  w.h("Simulated recruitment KPIs");
  const k = r.kpis;
  const kp = [
    ["Quality of Hire", `${k.qualityOfHire}/100`],
    ["Time-to-Hire", `${k.timeToHireDays} days`],
    ["Cost-per-Hire", `Rs ${k.costPerHireK}K`],
    ["Offer Acceptance", `${k.offerAcceptance}%`],
    ["Employer Brand", `${k.employerBrand}/100`],
    ["Bad-hire cost avoided", `Rs ${k.badHireCostAvoidedLpa}L`],
  ];
  kp.forEach(([a, v], i) => {
    const col = i % 3;
    if (col === 0) w.ensure(34);
    const x = w.M + col * 170;
    w.page.drawText(safe(a), { x, y: w.y - 10, size: 8, font: f, color: C.grey });
    w.page.drawText(safe(v), { x, y: w.y - 24, size: 13, font: b, color: C.cyan });
    if (col === 2) w.y -= 34;
  });
  const fn = k.funnel;
  w.text(`Funnel: Sourced ${fn.sourced} -> Screened ${fn.screened} -> Interviewed ${fn.interviewed} -> Offered ${fn.offered} -> Joined ${fn.joined}`, { size: 9, color: C.grey });

  w.h("Round by round");
  for (const rr of r.rounds) {
    w.text(`${rr.title} — ${rr.correctHire ? "[ok] correct hire" : "[x] missed"} · ${rr.roundPoints} pts`, { size: 10, bold: true });
    w.text(rr.explanation, { size: 8.5, color: C.grey });
    if (rr.flagsMissed.length) w.text(`Missed: ${rr.flagsMissed.map((m) => `${m.candidate} (${m.type.replace(/_/g, " ")})`).join(", ")}`, { size: 8.5, color: C.pink });
    w.space(4);
  }

  w.h("Your 3-point action plan");
  r.actionPlan.forEach((a, i) => w.text(`${i + 1}. ${a}`, { size: 9.5 }));

  w.h("Micro-lessons for you");
  for (const l of inp.lessons) {
    w.text(l.title, { size: 10.5, bold: true, color: C.cyan });
    for (const line of l.body) w.text(line, { size: 8.5, color: C.grey, gap: 3 });
    w.text(`Takeaway: ${l.takeaway}`, { size: 9, bold: true });
    w.space(6);
  }

  w.h("AI shortlists. Humans make the call.");
  w.text("Scrini AI is the Agentic Hiring OS: AI agents that source, screen, verify and schedule — with the evidence behind every score, so you know when to overrule. Book a demo at scrini.ai.", { size: 9.5 });
  return doc.save();
}

export async function certificatePdf(o: { name: string; company: string; level: number; date: Date; certId: string; score: number; sponsorName: string; url: string }) {
  const doc = await PDFDocument.create();
  doc.setTitle("Certified AI-Ready Recruiter 2031");
  const f = await doc.embedFont(StandardFonts.Helvetica);
  const b = await doc.embedFont(StandardFonts.HelveticaBold);
  const bi = await doc.embedFont(StandardFonts.TimesRomanBoldItalic);
  const W = 842,
    H = 595;
  const p = doc.addPage([W, H]);
  p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.ink });
  p.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: C.cyan, borderWidth: 2 });
  p.drawRectangle({ x: 32, y: 32, width: W - 64, height: H - 64, borderColor: C.violet, borderWidth: 0.8 });
  for (let i = 0; i < 14; i++) p.drawLine({ start: { x: W - 220 + i * 16, y: 32 }, end: { x: W - 32, y: 220 - i * 16 }, thickness: 0.4, color: C.dark });
  const center = (s: string, y: number, size: number, font: PDFFont, color = C.white) => {
    const t = safe(s);
    p.drawText(t, { x: (W - font.widthOfTextAtSize(t, size)) / 2, y, size, font, color });
  };
  center("SPOT THE STAR · RECRUITER 2031", H - 90, 12, b, C.cyan);
  center("Certified AI-Ready Recruiter 2031", H - 140, 32, b);
  center(`Level ${o.level}`, H - 175, 16, b, C.pink);
  center("This certifies that", H - 225, 12, f, C.grey);
  center(o.name, H - 275, 40, bi, C.white);
  center(o.company, H - 300, 12, f, C.grey);
  center("scored 70+ in all ten recruiter competencies — fraud detection, skill validation, AI judgment,", H - 340, 11, f);
  center("bias awareness, behavioural read, sourcing, interview design, negotiation, speed and candidate experience.", H - 356, 11, f);
  center(`Score ${o.score}  ·  Issued ${o.date.toISOString().slice(0, 10)}  ·  ID ${o.certId}`, H - 395, 10, f, C.grey);
  p.drawText("Scrini AI", { x: 70, y: 80, size: 18, font: b, color: C.white });
  p.drawText("Agentic Hiring OS · Noida, India", { x: 70, y: 64, size: 9, font: f, color: C.grey });
  p.drawText(safe(`Footer partner: ${o.sponsorName}`), { x: W - 300, y: 80, size: 9, font: f, color: C.grey });
  wrap(`Verify: ${o.url}`, f, 7.5, 250).forEach((l, i) => p.drawText(l, { x: W - 300, y: 66 - i * 9, size: 7.5, font: f, color: C.grey }));
  p.drawText(safe("Learning simulation, not a formal assessment."), { x: W - 300, y: 44, size: 7.5, font: f, color: C.grey, rotate: degrees(0) });
  return doc.save();
}

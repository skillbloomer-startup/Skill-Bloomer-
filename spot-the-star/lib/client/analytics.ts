"use client";
// Batched analytics → /api/events (sendBeacon on page hide).
type Ev = { name: string; sessionId: string; playerId?: string; props?: Record<string, unknown>; ts: string };
let queue: Ev[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let ctx: { sessionId: string; playerId: string } = { sessionId: "", playerId: "" };

export function setAnalyticsContext(c: { sessionId: string; playerId: string }) {
  ctx = c;
}

export function track(name: string, props?: Record<string, unknown>) {
  if (!ctx.sessionId) return;
  queue.push({ name, sessionId: ctx.sessionId, playerId: ctx.playerId, props, ts: new Date().toISOString() });
  if (!timer) timer = setTimeout(flush, 2500);
  if (queue.length >= 25) flush();
}

export function flush() {
  if (timer) clearTimeout(timer);
  timer = null;
  if (!queue.length) return;
  const body = JSON.stringify({ events: queue });
  queue = [];
  try {
    if (navigator.sendBeacon && navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }))) return;
  } catch {}
  fetch("/api/events", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
}

import type { Sponsor, SponsorSlot } from "./types";

export const SCRINI_DEFAULT: Sponsor = {
  id: "scrini",
  name: "Scrini AI",
  logo_url: "/sponsors/scrini.svg",
  click_url: "https://scrini.ai/?utm_source=spot_the_star&utm_medium=game",
  tagline: "The Agentic Hiring OS",
  headline: "Let AI agents source, screen and schedule. You make the call.",
  cta: "Book a demo",
  slots: ["splash", "wall", "ats_header", "transition", "round_reveal", "results_native", "share_footer", "lesson"],
  start: "2000-01-01",
  end: "2099-12-31",
  priority: 0,
  active: true,
};

export function activeFor(sponsors: Sponsor[], slot: SponsorSlot, now = new Date()): Sponsor[] {
  const day = now.toISOString().slice(0, 10);
  const list = sponsors
    .filter((s) => s.active && s.slots.includes(slot) && s.start <= day && day <= s.end)
    .sort((a, b) => b.priority - a.priority);
  return list.length ? list : [SCRINI_DEFAULT];
}

/** Highest-priority non-default sponsor wins; Scrini is the fallback. */
export function pickSponsor(sponsors: Sponsor[], slot: SponsorSlot, rotate = 0): Sponsor {
  const list = activeFor(sponsors, slot);
  const paid = list.filter((s) => s.id !== "scrini");
  const pool = paid.length ? paid : list;
  return pool[rotate % pool.length];
}

export function withUtm(url: string, slot: string, sponsorId: string) {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", "spot_the_star");
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", "sponsor");
    u.searchParams.set("utm_content", `${slot}-${sponsorId}`);
    return u.toString();
  } catch {
    return url;
  }
}

"use client";
import type { CompetencyScores } from "../types";

const get = <T,>(k: string, d: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : d;
  } catch {
    return d;
  }
};
const set = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export const uid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`);

export function playerId() {
  let id = get<string>("sts_player", "");
  if (!id) {
    id = uid();
    set("sts_player", id);
  }
  return id;
}
export const resetPlayer = () => {
  try {
    localStorage.removeItem("sts_player");
    localStorage.removeItem("sts_history");
    localStorage.removeItem("sts_badge");
    localStorage.removeItem("sts_played");
  } catch {}
};

export interface HistoryEntry { date: string; total: number; mode: string; competencies: CompetencyScores }
export const history = () => get<HistoryEntry[]>("sts_history", []);
export const pushHistory = (h: HistoryEntry) => set("sts_history", [...history(), h].slice(-20));
export const savedBadge = () => get<{ firstName: string; role: string; company: string } | null>("sts_badge", null);
export const saveBadge = (b: unknown) => set("sts_badge", b);
export const hasPlayed = () => get<boolean>("sts_played", false);
export const markPlayed = () => set("sts_played", true);
export const getPref = <T,>(k: string, d: T) => get<T>(`sts_pref_${k}`, d);
export const setPref = (k: string, v: unknown) => set(`sts_pref_${k}`, v);

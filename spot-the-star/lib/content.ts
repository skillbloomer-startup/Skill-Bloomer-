// Server-side content loader: JSON files in /content, overridden by admin edits stored in the DB.
import "server-only";
import { db } from "./db";
import { fsContent, PackIndex } from "./content-fs";
import type { MicroLesson, RolePack, SourcingTable, Sponsor, VolumePack } from "./types";

export const CONTENT_KEYS = ["packs/index", "sourcing", "lessons", "sponsors"] as const;

async function override<T>(key: string, fallback: () => T): Promise<T> {
  try {
    const v = await db().getConfig<T>(`content:${key}`);
    if (v) return v;
  } catch (e) {
    console.error("content override read failed", key, e);
  }
  return fallback();
}

export async function getIndex(): Promise<PackIndex> {
  return override("packs/index", fsContent.index);
}

export async function getPack(id?: string): Promise<RolePack> {
  const idx = await getIndex();
  const entry = idx.packs.find((p) => p.id === (id || idx.default) && p.enabled) ?? idx.packs.find((p) => p.id === idx.default)!;
  return override(`pack:${entry.id}`, () => fsContent.pack(entry.file));
}

export async function getVolume(): Promise<VolumePack> {
  const idx = await getIndex();
  return override(`volume:${idx.volume}`, () => fsContent.volume(idx.volume));
}

export const getSourcing = () => override<SourcingTable>("sourcing", fsContent.sourcing);
export const getLessons = () => override<MicroLesson[]>("lessons", fsContent.lessons);
export const getSponsors = () => override<Sponsor[]>("sponsors", fsContent.sponsors);

/** Resolve the editable content documents (for the admin content manager). */
export async function listEditable() {
  const idx = await getIndex();
  const docs: { key: string; label: string; value: unknown; overridden: boolean }[] = [];
  const push = async (key: string, label: string, fallback: () => unknown) => {
    const o = await db().getConfig(`content:${key}`);
    docs.push({ key, label, value: o ?? fallback(), overridden: !!o });
  };
  await push("packs/index", "Role pack index", fsContent.index);
  for (const p of idx.packs) {
    let fb: () => unknown = () => ({});
    try {
      fsContent.pack(p.file);
      fb = () => fsContent.pack(p.file);
    } catch {
      /* pack only exists in DB */
    }
    await push(`pack:${p.id}`, `Role pack: ${p.name}`, fb);
  }
  await push(`volume:${idx.volume}`, "Volume Hiring pack", () => fsContent.volume(idx.volume));
  await push("sourcing", "Sourcing channels", fsContent.sourcing);
  await push("lessons", "Micro-lessons", fsContent.lessons);
  await push("sponsors", "Sponsors", fsContent.sponsors);
  return docs;
}

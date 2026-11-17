// Reads content JSON from /content at runtime (no rebuild needed to add packs).
import fs from "fs";
import path from "path";
import type { MicroLesson, RolePack, SourcingTable, Sponsor, VolumePack } from "./types";

const ROOT = path.join(process.cwd(), "content");
const read = <T,>(rel: string): T => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")) as T;

export interface PackIndex {
  default: string;
  volume: string;
  packs: { id: string; file: string; name: string; industry: string; enabled: boolean }[];
}

export const fsContent = {
  index: () => read<PackIndex>("packs/index.json"),
  pack: (file: string) => read<RolePack>(`packs/${file}`),
  volume: (id: string) => read<VolumePack>(`${id}.json`),
  sourcing: () => read<SourcingTable>("sourcing.json"),
  lessons: () => read<MicroLesson[]>("lessons.json"),
  sponsors: () => read<Sponsor[]>("sponsors.json"),
};

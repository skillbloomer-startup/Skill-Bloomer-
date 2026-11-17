// Validates every role pack + content file. Run: npm run validate-content
import { fsContent } from "../lib/content-fs";
import { ariaRanking } from "../lib/engine/scoring";
import { FLAG_LABELS, FlagType } from "../lib/types";

let errors = 0;
const err = (m: string) => (errors++, console.error("✗", m));
const idx = fsContent.index();
const sourcing = fsContent.sourcing();
const lessons = fsContent.lessons();

for (const entry of idx.packs) {
  const pack = fsContent.pack(entry.file);
  if (pack.id !== entry.id) err(`${entry.file}: id "${pack.id}" ≠ index id "${entry.id}"`);
  pack.rounds.forEach((r, i) => {
    const where = `${pack.id}/${r.id}`;
    if (r.candidates.filter((c) => c.is_best_hire).length !== 1) err(`${where}: needs exactly one is_best_hire`);
    if (i >= 1 && ariaRanking(r)[0].is_best_hire) err(`${where}: ARIA's top pick must NOT be the best hire (rounds 2+)`);
    if (!sourcing.roles[r.role_key]) err(`${where}: role_key "${r.role_key}" missing from sourcing.json`);
    const groups: Record<string, number> = {};
    const qids = new Set(r.questions.map((q) => q.id));
    for (const c of r.candidates) {
      for (const f of c.flags) if (!(f.type in FLAG_LABELS)) err(`${where}/${c.id}: unknown flag ${f.type}`);
      for (const [q, a] of Object.entries(c.interview_answers)) {
        if (!qids.has(q)) err(`${where}/${c.id}: answer for unknown question ${q}`);
        if (a.reveals && !c.flags.some((f) => f.type === (a.reveals as FlagType))) err(`${where}/${c.id}: ${q} reveals ${a.reveals} but candidate lacks that flag`);
      }
      if (c.bias_pair) groups[c.bias_pair.group] = (groups[c.bias_pair.group] ?? 0) + 1;
      if (c.is_best_hire && c.flags.length) err(`${where}/${c.id}: best hire has red flags`);
    }
    for (const [g, n] of Object.entries(groups)) if (n !== 2) err(`${where}: bias pair "${g}" has ${n} members (needs 2)`);
  });
  console.log(`✓ ${pack.id}: ${pack.rounds.length} rounds, ${pack.rounds.reduce((s, r) => s + r.candidates.length, 0)} candidates`);
}
const vol = fsContent.volume(idx.volume);
console.log(`✓ volume ${vol.id}: ${vol.cards.length} cards, ${vol.cards.filter((c) => c.flags.length).length} with red flags`);
const comps = new Set(lessons.map((l) => l.competency));
console.log(`✓ lessons: ${lessons.length} covering ${comps.size} competencies`);
console.log(`✓ sponsors: ${fsContent.sponsors().length}`);
if (errors) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}

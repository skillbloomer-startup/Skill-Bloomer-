import { COMPETENCIES, CompetencyScores } from "@/lib/types";

/** Accessible SVG radar chart of the 10 competencies (values also listed in text elsewhere). */
export default function Radar({ scores, compare, size = 300 }: { scores: CompetencyScores; compare?: CompetencyScores | null; size?: number }) {
  const n = COMPETENCIES.length;
  const c = size / 2;
  const r = size / 2 - 42;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v];
  };
  const poly = (s: CompetencyScores) =>
    COMPETENCIES.map((k, i) => pt(i, Math.max(0.04, (s[k.key] ?? 0) / 100)).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px] mx-auto" role="img" aria-label={`Radar chart: ${COMPETENCIES.map((k) => `${k.label} ${scores[k.key] ?? "n/a"}`).join(", ")}`}>
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon key={ring} points={COMPETENCIES.map((_, i) => pt(i, ring).join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,.1)" />
      ))}
      {COMPETENCIES.map((k, i) => {
        const [x, y] = pt(i, 1);
        const [lx, ly] = pt(i, 1.2);
        return (
          <g key={k.key}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="rgba(255,255,255,.08)" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="10.5" fill="rgba(255,255,255,.65)">
              {k.short}
            </text>
          </g>
        );
      })}
      {compare && <polygon points={poly(compare)} fill="rgba(255,62,165,.12)" stroke="#ff3ea5" strokeDasharray="4 3" strokeWidth="1.5" />}
      <polygon points={poly(scores)} fill="rgba(34,228,255,.22)" stroke="#22e4ff" strokeWidth="2" />
      {COMPETENCIES.map((k, i) => {
        const v = scores[k.key];
        const [x, y] = pt(i, Math.max(0.04, (v ?? 0) / 100));
        return <circle key={k.key} cx={x} cy={y} r="3.5" fill={v === null ? "#555" : "#ff3ea5"} />;
      })}
    </svg>
  );
}

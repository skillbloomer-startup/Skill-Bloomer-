const ROW = [
  'Helion Labs',
  'Quantix',
  'Northwind',
  'Lattice AI',
  'Orbital',
  'Pendulum',
  'Vertex Dynamics',
  'Aurora',
  'Spectra',
  'Magnetic',
  'Halo',
  'Kestrel',
];

export default function LogosMarquee() {
  return (
    <section className="relative py-14 border-y border-white/5 bg-[color:var(--color-ink-2)]/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-[color:var(--color-fg-mute)] mb-8">
          Trusted by builders at fast-moving teams
        </p>
        <div className="relative overflow-hidden mask-fade-x">
          <div className="flex w-max marquee gap-12 items-center">
            {[...ROW, ...ROW].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.02] whitespace-nowrap"
              >
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] opacity-80" />
                <span className="font-display text-lg text-white/70">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

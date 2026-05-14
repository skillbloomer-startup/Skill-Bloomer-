import { motion } from 'motion/react';
import { Check, Cpu, Layers, Zap } from 'lucide-react';

const POINTS = [
  { icon: Cpu, title: 'Research-grade rigor', desc: 'Methodical evaluation, ablations and clean baselines before anything ships.' },
  { icon: Layers, title: 'Composable architecture', desc: 'Modular agents and pipelines that evolve with your roadmap, not against it.' },
  { icon: Zap, title: 'Outcome obsessed', desc: 'We measure success in retention, revenue and reduced cost — not vibes.' },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative gradient-border rounded-3xl overflow-hidden">
            <div className="relative aspect-[4/5] bg-[color:var(--color-ink-2)] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80&auto=format&fit=crop"
                alt="Abstract AI network visualization"
                className="absolute inset-0 h-full w-full object-cover opacity-70"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060d] via-[#05060d]/40 to-transparent" />
              <div className="absolute inset-0 grid-overlay opacity-40" />

              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-9 w-9 rounded-full border-2 border-[color:var(--color-ink-2)] bg-gradient-to-br from-[#7c5cff] to-[#22d3ee]"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="font-display text-lg">A team of senior engineers</div>
                    <div className="text-xs text-white/50">PhDs · ex-FAANG · founders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute -top-6 -right-4 sm:-right-10 glass rounded-3xl p-5 max-w-[220px]"
          >
            <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Avg. ROI</div>
            <div className="font-display text-4xl">7.2×</div>
            <div className="mt-2 text-xs text-white/50">
              Reported by partners 12 months post-launch
            </div>
          </motion.div>
        </motion.div>

        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-fg-dim)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#22d3ee]" />
            Who we are
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display mt-4 text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight"
          >
            A small studio that thinks <span className="gradient-text">big</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 text-[color:var(--color-fg-dim)] text-lg max-w-xl"
          >
            We partner with founders and product teams to translate cutting-edge
            research into systems your customers actually feel. No fluff, no
            hand-waving — just careful engineering wrapped in a soul.
          </motion.p>

          <div className="mt-10 space-y-5">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="flex gap-4"
              >
                <div className="shrink-0 h-11 w-11 rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] p-[1px]">
                  <div className="h-full w-full rounded-2xl bg-[color:var(--color-ink-2)] flex items-center justify-center">
                    <p.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-display text-lg">{p.title}</div>
                  <div className="text-[color:var(--color-fg-dim)] mt-1">{p.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a href="#work" className="btn-primary">See our work</a>
            <div className="flex items-center gap-2 text-sm text-[color:var(--color-fg-dim)]">
              <Check className="h-4 w-4 text-emerald-400" />
              Avg. 4-week prototype turnaround
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

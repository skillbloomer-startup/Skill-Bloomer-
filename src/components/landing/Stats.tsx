import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

type Stat = { value: number; suffix?: string; prefix?: string; label: string; desc?: string };

const STATS: Stat[] = [
  { value: 240, suffix: '+', label: 'Models trained', desc: 'across vision, speech and language' },
  { value: 12, suffix: 'M', prefix: '$', label: 'Revenue unlocked', desc: 'for our partners in 2025' },
  { value: 99.99, suffix: '%', label: 'Production uptime', desc: 'over the last 12 rolling months' },
  { value: 38, suffix: ' ms', label: 'Avg inference latency', desc: 'on our optimized stack' },
];

function Counter({ stat }: { stat: Stat }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const target = stat.value;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  const formatted =
    stat.value % 1 === 0 ? Math.round(val).toLocaleString() : val.toFixed(2);

  return (
    <span ref={ref}>
      {stat.prefix}
      {formatted}
      {stat.suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="gradient-border rounded-3xl">
          <div className="relative rounded-3xl bg-[color:var(--color-ink-2)]/70 p-8 sm:p-12 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#7c5cff]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#22d3ee]/20 blur-3xl" />

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <div className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight">
                    <span className="gradient-text">
                      <Counter stat={s} />
                    </span>
                  </div>
                  <div className="mt-3 font-medium">{s.label}</div>
                  {s.desc && (
                    <div className="mt-1 text-sm text-[color:var(--color-fg-dim)]">{s.desc}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

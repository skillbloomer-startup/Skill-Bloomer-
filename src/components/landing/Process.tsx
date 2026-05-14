import { motion } from 'motion/react';
import { Search, Pencil, Rocket, LineChart } from 'lucide-react';
import SectionHeading from './SectionHeading';

const STEPS = [
  {
    icon: Search,
    n: '01',
    title: 'Discover',
    desc: 'We unpack the problem space, audit your data, and align on the metric that actually moves the business.',
  },
  {
    icon: Pencil,
    n: '02',
    title: 'Design',
    desc: 'Architect the system end-to-end — agents, models, guardrails and UX — before a line of production code.',
  },
  {
    icon: Rocket,
    n: '03',
    title: 'Build',
    desc: 'Tight 2-week iterations with live demos, transparent eval dashboards and zero surprise releases.',
  },
  {
    icon: LineChart,
    n: '04',
    title: 'Operate',
    desc: 'Observability, retraining, and feature evolution so your system gets sharper every single week.',
  },
];

export default function Process() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title={
            <>
              From signal to <span className="gradient-text">shipped</span> in four steps
            </>
          }
          subtitle="A predictable system honed across hundreds of engagements — calm, transparent and outcome-driven."
        />

        <div className="mt-20 relative">
          <div className="hidden lg:block absolute left-0 right-0 top-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="relative"
              >
                <div className="relative h-24 flex items-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] p-[1px] glow-ring">
                    <div className="h-full w-full rounded-full bg-[color:var(--color-ink)] flex items-center justify-center">
                      <s.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <span className="absolute right-0 top-0 font-display text-6xl text-white/5 select-none">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-2xl font-medium">{s.title}</h3>
                <p className="mt-3 text-[color:var(--color-fg-dim)] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import SectionHeading from './SectionHeading';

const ITEMS = [
  {
    q: 'How quickly can we see something working?',
    a: 'Most engagements have a working prototype on real data within 3 to 4 weeks. We use tight 2-week iterations with live demos so you always see progress.',
  },
  {
    q: 'Do you work with non-technical founders?',
    a: 'Yes. About a third of our partners are non-technical operators. We bring the engineering, you bring the business clarity — together we move fast and safely.',
  },
  {
    q: 'Who owns the IP we build together?',
    a: 'You do. All code, models, and training artifacts are transferred to your organization at the end of the engagement, with no strings attached.',
  },
  {
    q: 'Can you work inside our existing stack?',
    a: 'Absolutely. We meet you where you are — TypeScript, Python, Rust, AWS, GCP, Azure, on-prem, hybrid. We adapt to your tooling, not the other way around.',
  },
  {
    q: 'How do you handle data privacy and compliance?',
    a: 'We can operate under your SSO, sign DPAs, and run everything inside your VPC. We have shipped systems under HIPAA, SOC 2, and EU AI Act constraints.',
  },
  {
    q: 'What happens after launch?',
    a: 'We stick around for monitoring, retraining, and iteration. Most partners stay with us in a lighter ongoing engagement after the initial build.',
  },
];

function Row({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="border-b border-white/10"
    >
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="font-display text-lg sm:text-xl text-white/90 group-hover:text-white transition-colors">
          {q}
        </span>
        <span
          className={`shrink-0 h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 ${
            open ? 'rotate-45 bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] border-transparent' : ''
          }`}
        >
          <Plus className="h-4 w-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 text-[color:var(--color-fg-dim)] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions you might be <span className="gradient-text">thinking</span>
            </>
          }
        />
        <div className="mt-14">
          {ITEMS.map((it, i) => (
            <Row key={it.q} q={it.q} a={it.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

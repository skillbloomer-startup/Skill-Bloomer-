import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import SectionHeading from './SectionHeading';

const QUOTES = [
  {
    quote:
      'Nexora dropped into a tangled problem and shipped a working agent in three weeks. The team is rare — equal parts research depth and product taste.',
    name: 'Priya Shah',
    role: 'VP Product, Helion Labs',
    color: 'from-[#7c5cff] to-[#22d3ee]',
  },
  {
    quote:
      'They rebuilt our automation stack and the cost-per-ticket dropped by 61 percent. No theatrics, no shifting timelines — just careful engineering.',
    name: 'Marcus Lee',
    role: 'Director of Engineering, Quantix',
    color: 'from-[#22d3ee] to-[#ff6ad5]',
  },
  {
    quote:
      'The eval rigor alone was worth the engagement. We finally trust our model in front of customers — and the numbers keep climbing each week.',
    name: 'Sarah Okafor',
    role: 'CTO, Aurora Health',
    color: 'from-[#ff6ad5] to-[#7c5cff]',
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % QUOTES.length);
  const prev = () => setI((p) => (p - 1 + QUOTES.length) % QUOTES.length);
  const q = QUOTES[i];

  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              Loved by teams who <span className="gradient-text">ship</span>
            </>
          }
        />

        <div className="mt-16 relative gradient-border rounded-3xl">
          <div className="relative rounded-3xl bg-[color:var(--color-ink-2)]/80 p-8 sm:p-14 overflow-hidden">
            <Quote className="absolute -top-6 -left-2 h-32 w-32 text-white/[0.04]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-[#ffd35a] text-[#ffd35a]" />
                  ))}
                </div>
                <p className="mt-6 font-display text-2xl sm:text-3xl md:text-4xl leading-snug tracking-tight text-balance">
                  "{q.quote}"
                </p>
                <div className="mt-10 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${q.color}`} />
                  <div>
                    <div className="font-medium">{q.name}</div>
                    <div className="text-sm text-[color:var(--color-fg-dim)]">{q.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex items-center justify-between">
              <div className="flex gap-1.5">
                {QUOTES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    aria-label={`Show testimonial ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === i ? 'w-8 bg-white' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="h-11 w-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="h-11 w-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

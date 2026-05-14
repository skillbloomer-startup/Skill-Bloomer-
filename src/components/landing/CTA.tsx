import { motion } from 'motion/react';
import { ArrowRight, CalendarClock } from 'lucide-react';

export default function CTA() {
  return (
    <section id="contact" className="relative py-28 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9 }}
          className="relative overflow-hidden rounded-[2rem] gradient-border"
        >
          <div className="relative rounded-[2rem] bg-[color:var(--color-ink-2)]/80 px-6 py-16 sm:px-12 sm:py-20 md:py-28">
            <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[#7c5cff]/30 blur-[120px] animate-blob" />
            <div className="absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full bg-[#22d3ee]/25 blur-[120px] animate-blob" style={{ animationDelay: '5s' }} />
            <div className="absolute inset-0 grid-overlay opacity-20" />

            <div className="relative text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-fg-dim)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22d3ee]" />
                Let's build
              </span>

              <h2 className="font-display mt-6 text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight text-balance">
                Have an ambitious idea?{' '}
                <span className="gradient-text">We'd love to hear it.</span>
              </h2>

              <p className="mt-6 text-[color:var(--color-fg-dim)] text-lg text-balance">
                Tell us where you're headed and we'll come back within one
                business day with a concrete plan, a fixed timeline, and a
                fixed price.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <a href="mailto:hello@nexora.ai" className="btn-primary group">
                  Start a project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="#contact" className="btn-ghost">
                  <CalendarClock className="h-4 w-4" />
                  Book a 30-min intro
                </a>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[color:var(--color-fg-dim)]">
                <span>hello@nexora.ai</span>
                <span className="hidden sm:block h-1 w-1 rounded-full bg-white/20" />
                <span>San Francisco · Berlin · Remote</span>
                <span className="hidden sm:block h-1 w-1 rounded-full bg-white/20" />
                <span>Mon–Fri · 9 to 6 your time</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

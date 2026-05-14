import { motion } from 'motion/react';
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import ParticleField from './ParticleField';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] pt-32 pb-24 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-overlay opacity-60" />
        <div className="absolute top-[-10%] left-[-10%] h-[55%] w-[55%] rounded-full bg-[#7c5cff]/20 blur-[120px] animate-blob" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[60%] w-[60%] rounded-full bg-[#22d3ee]/15 blur-[140px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[30%] right-[20%] h-[35%] w-[35%] rounded-full bg-[#ff6ad5]/10 blur-[120px] animate-blob" style={{ animationDelay: '8s' }} />
        <ParticleField />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-[color:var(--color-fg-dim)] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Now Onboarding Q3 Partners — Limited Slots
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          className="font-display text-center text-balance mx-auto max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight"
        >
          Engineering the{' '}
          <span className="gradient-text">future</span> with <br className="hidden sm:block" />
          <span className="relative inline-block">
            intelligent
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.8 }}
              viewBox="0 0 300 14"
              className="absolute -bottom-3 left-0 w-full h-3"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M2 8 C 80 2, 220 14, 298 6"
                stroke="url(#g1)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#7c5cff" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>{' '}
          systems.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-8 mx-auto max-w-2xl text-center text-base sm:text-lg text-[color:var(--color-fg-dim)] text-balance"
        >
          Nexora is a futurist AI studio building autonomous agents, intelligent
          workflows, and tailor-made models that turn ambitious ideas into
          measurable outcomes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#contact" className="btn-primary group">
            Start a project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#work" className="btn-ghost group">
            <PlayCircle className="h-4 w-4" />
            Watch showreel
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="gradient-border rounded-3xl overflow-hidden glow-ring">
            <div className="relative aspect-[16/9] bg-[color:var(--color-ink-2)] overflow-hidden">
              <div className="absolute inset-0 grid-overlay opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#7c5cff]/15 via-transparent to-[#22d3ee]/15" />

              <div className="relative h-full w-full flex items-center justify-center">
                <div className="relative h-64 w-64 sm:h-80 sm:w-80">
                  <div className="absolute inset-0 rounded-full border border-white/10 animate-spin-slow" />
                  <div className="absolute inset-6 rounded-full border border-white/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '24s' }} />
                  <div className="absolute inset-12 rounded-full border border-white/10 animate-spin-slow" style={{ animationDuration: '14s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] shadow-[0_0_80px_-10px_rgba(124,92,255,0.9)] flex items-center justify-center animate-float">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.8)]"
                      style={{
                        transform: `rotate(${i * 90}deg) translateY(-128px)`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute top-6 left-6 right-6 flex items-center gap-2 text-xs text-white/40">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <span className="ml-2 font-mono">nexora.ai / live</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                {[
                  { k: 'Latency', v: '38 ms' },
                  { k: 'Throughput', v: '12k r/s' },
                  { k: 'Uptime', v: '99.99%' },
                ].map((m) => (
                  <div key={m.k} className="glass rounded-2xl px-4 py-3">
                    <div className="text-[10px] uppercase tracking-widest text-white/40">{m.k}</div>
                    <div className="font-display text-lg">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -left-6 hidden md:block">
            <div className="glass rounded-2xl px-4 py-3 shimmer">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Models trained</div>
              <div className="font-display text-2xl">240+</div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 hidden md:block">
            <div className="glass rounded-2xl px-4 py-3 shimmer">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Agents deployed</div>
              <div className="font-display text-2xl">1.2k</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

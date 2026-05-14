import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const PROJECTS = [
  {
    title: 'Atlas — Sales Copilot',
    cat: 'Agent · SaaS',
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop',
    gradient: 'from-[#7c5cff]/40 to-[#22d3ee]/30',
    stat: '+38% pipeline',
  },
  {
    title: 'Mira — Healthcare NLP',
    cat: 'NLP · Healthcare',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop',
    gradient: 'from-[#22d3ee]/40 to-[#ff6ad5]/30',
    stat: '4.1× faster triage',
  },
  {
    title: 'Vortex — Industrial Vision',
    cat: 'Computer Vision',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop',
    gradient: 'from-[#ff6ad5]/40 to-[#7c5cff]/30',
    stat: '99.3% defect recall',
  },
  {
    title: 'Lumen — Voice Assistant',
    cat: 'Conversational',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop',
    gradient: 'from-[#7c5cff]/40 to-[#ff6ad5]/30',
    stat: '92% CSAT',
  },
  {
    title: 'Halo — Trading Signals',
    cat: 'Quant · ML',
    img: 'https://images.unsplash.com/photo-1640161339667-44dbc4d7f632?w=1200&q=80&auto=format&fit=crop',
    gradient: 'from-[#22d3ee]/40 to-[#7c5cff]/30',
    stat: '+18% Sharpe',
  },
  {
    title: 'Nova — Creative Studio',
    cat: 'Generative · Media',
    img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80&auto=format&fit=crop',
    gradient: 'from-[#ff6ad5]/40 to-[#22d3ee]/30',
    stat: '12k assets/mo',
  },
];

export default function Portfolio() {
  return (
    <section id="work" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Selected Work"
            title={
              <>
                Recent things we've <span className="gradient-text">shipped</span>
              </>
            }
            subtitle="A small sample of the work we're allowed to talk about."
          />
          <a href="#contact" className="btn-ghost">
            All case studies <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.title}
              href="#contact"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
              className="group relative rounded-3xl overflow-hidden gradient-border"
            >
              <div className="relative aspect-[4/5] bg-[color:var(--color-ink-2)]">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} mix-blend-overlay`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060d] via-[#05060d]/30 to-transparent" />
                <div className="absolute inset-0 grid-overlay opacity-30" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <span className="rounded-full glass px-3 py-1 text-[11px] uppercase tracking-widest text-white/70">
                    {p.cat}
                  </span>
                  <span className="rounded-full glass px-3 py-1 text-xs text-white">
                    {p.stat}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <h3 className="font-display text-2xl font-medium text-balance pr-4">
                    {p.title}
                  </h3>
                  <span className="shrink-0 h-11 w-11 rounded-full glass flex items-center justify-center transition-all duration-300 group-hover:rotate-45 group-hover:bg-white/15">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

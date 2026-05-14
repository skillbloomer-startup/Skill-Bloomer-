import { motion } from 'motion/react';
import {
  Bot,
  BrainCircuit,
  Workflow,
  Eye,
  MessagesSquare,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const SERVICES = [
  {
    icon: Bot,
    title: 'Autonomous Agents',
    desc: 'Goal-driven agents that research, reason, and act across your tools without hand-holding.',
    tags: ['LangGraph', 'Tools', 'RAG'],
    accent: 'from-[#7c5cff] to-[#22d3ee]',
  },
  {
    icon: BrainCircuit,
    title: 'Custom Model Training',
    desc: 'Domain-tuned models on your proprietary data with rigorous eval and safety pipelines.',
    tags: ['Fine-tune', 'LoRA', 'Eval'],
    accent: 'from-[#22d3ee] to-[#7c5cff]',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    desc: 'End-to-end intelligent automation that connects systems, removes toil, and compounds value.',
    tags: ['n8n', 'Zapier', 'APIs'],
    accent: 'from-[#ff6ad5] to-[#7c5cff]',
  },
  {
    icon: Eye,
    title: 'Computer Vision',
    desc: 'Detection, OCR, and generative vision systems engineered for production environments.',
    tags: ['YOLO', 'OCR', 'Diffusion'],
    accent: 'from-[#7c5cff] to-[#ff6ad5]',
  },
  {
    icon: MessagesSquare,
    title: 'Conversational AI',
    desc: 'Voice and chat experiences with grounded retrieval, persona control, and analytics.',
    tags: ['Voice', 'NLU', 'RAG'],
    accent: 'from-[#22d3ee] to-[#ff6ad5]',
  },
  {
    icon: ShieldCheck,
    title: 'AI Governance',
    desc: 'Guardrails, red-team testing, and observability so you ship AI with confidence.',
    tags: ['Safety', 'Audit', 'Observability'],
    accent: 'from-[#ff6ad5] to-[#22d3ee]',
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              What we <span className="gradient-text">build</span> for you
            </>
          }
          subtitle="A full-stack AI studio — from research and prototyping to production rollouts that run reliably at scale."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.a
              href="#contact"
              key={s.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group relative gradient-border rounded-3xl p-[1px] overflow-hidden"
            >
              <div className="relative rounded-3xl bg-[color:var(--color-ink-2)]/80 p-6 sm:p-8 h-full">
                <div className={`absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${s.accent} blur-2xl -z-10`} />
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.accent} p-[1px]`}>
                  <div className="h-full w-full rounded-2xl bg-[color:var(--color-ink-2)] flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                <h3 className="font-display mt-6 text-2xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 text-[color:var(--color-fg-dim)] leading-relaxed">{s.desc}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="text-xs rounded-full border border-white/10 px-3 py-1 text-white/60">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">Learn more</span>
                  <span className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:rotate-45">
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

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';

type Tier = {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  features: string[];
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Starter',
    tagline: 'For founders validating an AI hypothesis fast.',
    monthly: 3900,
    yearly: 39000,
    features: [
      '1 dedicated senior engineer',
      'Working prototype in 4 weeks',
      'Slack channel + weekly review',
      'Lightweight evaluation suite',
      '30 hours / month',
    ],
  },
  {
    name: 'Studio',
    tagline: 'For teams building a real product on AI rails.',
    monthly: 9800,
    yearly: 98000,
    highlight: true,
    features: [
      'Pod of 3 engineers + 1 researcher',
      'Production-grade rollout',
      'Custom evals + observability',
      'On-call coverage during launch',
      '120 hours / month',
      'Quarterly strategy review',
    ],
  },
  {
    name: 'Scale',
    tagline: 'For org-wide AI transformation, end to end.',
    monthly: 24000,
    yearly: 240000,
    features: [
      'Embedded multi-disciplinary team',
      'Bespoke model training',
      'Security & compliance support',
      'Dedicated infra and tooling',
      'Unlimited hours',
      'Executive workshops',
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              Engagements that <span className="gradient-text">scale</span> with you
            </>
          }
          subtitle="Transparent monthly subscriptions. Pause or cancel any time — no hidden fees, no surprise invoices."
        />

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm transition-colors ${
                !yearly ? 'bg-white text-[#05060d]' : 'text-[color:var(--color-fg-dim)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                yearly ? 'bg-white text-[#05060d]' : 'text-[color:var(--color-fg-dim)]'
              }`}
            >
              Yearly
              <span className={`text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 ${yearly ? 'bg-[#05060d] text-white' : 'bg-white/10 text-white/80'}`}>
                -2 months
              </span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((t, i) => {
            const price = yearly ? t.yearly : t.monthly;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className={`relative rounded-3xl p-[1px] ${
                  t.highlight
                    ? 'bg-gradient-to-br from-[#7c5cff] via-[#22d3ee] to-[#ff6ad5]'
                    : 'gradient-border'
                }`}
              >
                <div className="relative h-full rounded-3xl bg-[color:var(--color-ink-2)]/85 p-7 sm:p-9 overflow-hidden">
                  {t.highlight && (
                    <div className="absolute top-5 right-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" />
                        Most popular
                      </span>
                    </div>
                  )}

                  <h3 className="font-display text-2xl font-medium">{t.name}</h3>
                  <p className="mt-2 text-[color:var(--color-fg-dim)] text-sm">{t.tagline}</p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-5xl tracking-tight">
                      ${price.toLocaleString()}
                    </span>
                    <span className="text-sm text-[color:var(--color-fg-dim)]">
                      / {yearly ? 'year' : 'month'}
                    </span>
                  </div>

                  <a
                    href="#contact"
                    className={`mt-8 w-full ${t.highlight ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Start with {t.name}
                  </a>

                  <div className="my-7 h-px bg-white/5" />

                  <ul className="space-y-3.5">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] p-[1px] shrink-0">
                          <span className="h-full w-full rounded-full bg-[color:var(--color-ink-2)] flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </span>
                        </span>
                        <span className="text-white/85">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

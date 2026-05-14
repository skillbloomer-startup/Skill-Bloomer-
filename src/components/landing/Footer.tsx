import { Sparkles, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const COLS = [
  {
    title: 'Studio',
    links: ['About', 'Process', 'Careers', 'Press kit'],
  },
  {
    title: 'Services',
    links: ['Agents', 'Custom models', 'Automation', 'Computer vision', 'Voice'],
  },
  {
    title: 'Resources',
    links: ['Case studies', 'Blog', 'Open source', 'Newsletter'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Imprint'],
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <a href="#home" className="flex items-center gap-2">
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl font-semibold tracking-tight">
                Nexora<span className="text-[#22d3ee]">.</span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-[color:var(--color-fg-dim)] text-balance">
              A futurist AI studio building intelligent agents, models and
              automation for ambitious teams. Built with care, in public.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 pl-5"
            >
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
              />
              <button className="btn-primary py-2 px-4 text-sm" type="submit">
                Subscribe
              </button>
            </form>

            <div className="mt-8 flex items-center gap-2">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="h-10 w-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {COLS.map((c) => (
              <div key={c.title}>
                <div className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-fg-mute)] mb-5">
                  {c.title}
                </div>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-white/75 hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[color:var(--color-fg-mute)]">
          <p>© {new Date().getFullYear()} Nexora Studio. Crafted with discipline.</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

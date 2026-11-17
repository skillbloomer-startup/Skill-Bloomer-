import { db } from "@/lib/db";
import type { GameResult } from "@/lib/types";
import { certId } from "@/lib/reportServer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verify certificate — Spot the Star 2031" };

/** Public certificate verification. Shows only name, company, level and date — nothing private. */
export default async function Verify({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = /^[a-zA-Z0-9-]{6,64}$/.test(id) ? await db().getSession(id) : null;
  const level = (s?.result as GameResult | undefined)?.certificateLevel;
  return (
    <main className="mx-auto flex min-h-[80dvh] max-w-md flex-col justify-center px-4 text-center">
      {s && level ? (
        <div className="glass-strong p-6">
          <div className="text-5xl">🎓</div>
          <h1 className="mt-2 text-2xl font-bold">Valid certificate</h1>
          <p className="mt-2">
            <b>{s.first_name}</b> ({s.company}) is a <b>Certified AI-Ready Recruiter 2031 — Level {level}</b>.
          </p>
          <p className="mt-1 text-sm text-white/60">
            ID {certId(s.id)} · issued {s.updated_at.slice(0, 10)} by Scrini AI
          </p>
          <p className="mt-4 text-[11px] text-white/40">Learning simulation, not a formal assessment.</p>
        </div>
      ) : (
        <div className="glass p-6">
          <h1 className="text-xl font-bold">Certificate not found</h1>
        </div>
      )}
      <a href="/" className="btn-primary mt-6">
        Take the challenge →
      </a>
    </main>
  );
}

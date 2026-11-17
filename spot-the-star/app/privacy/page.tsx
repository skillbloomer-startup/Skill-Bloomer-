import DeleteForm from "./DeleteForm";

export const metadata = { title: "Privacy Policy — Spot the Star 2031" };

export default function Privacy() {
  const v = process.env.NEXT_PUBLIC_POLICY_VERSION || "2026-11-v1";
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-[15px] leading-relaxed text-white/85">
      <a href="/" className="text-sm text-neon-cyan underline">
        ← Back to the game
      </a>
      <h1 className="mt-4 text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-1 text-xs text-white/50">Version {v} · Data Fiduciary: Scrini AI, Noida, Uttar Pradesh, India</p>

      <h2 className="mt-6 text-xl font-semibold text-white">1. What this is</h2>
      <p>Spot the Star — Recruiter 2031 is a learning simulation, not a formal assessment. All candidates and companies in the game are fictional.</p>

      <h2 className="mt-6 text-xl font-semibold text-white">2. What we collect and why (purpose limitation)</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li><b>Badge details</b> (first name, job role, company) — to personalise your game, badge, report and certificate.</li>
        <li><b>Gameplay data</b> (decisions, timings, scores) — to compute your Recruiter DNA Report and anonymised, aggregated industry insights.</li>
        <li><b>Contact details</b> (work email, optional phone, company size, hiring volume, pain points and optional profile fields) — only if you request the full report. Used to email your report and, with your consent, to contact you about Scrini AI hiring solutions.</li>
        <li><b>Technical data</b> (approximate country from IP, device type, referral/UTM source) — for analytics and fraud prevention. We do not store your full IP address.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold text-white">3. Consent (DPDP Act, 2023)</h2>
      <p>We process personal data on the basis of your free, specific, informed and unambiguous consent given through a clear, unticked checkbox. Partner/sponsor communications require a separate optional consent. We record the consent timestamp and this policy version. You may withdraw consent at any time — withdrawal is as easy as giving it (use the form below or reply to any email).</p>

      <h2 className="mt-6 text-xl font-semibold text-white">4. Bias insights stay private</h2>
      <p>Your bias-consistency results are shown only to you, in your private report. They are never shown on leaderboards, share cards or to sponsors, and are used for analytics only in anonymised, aggregated form.</p>

      <h2 className="mt-6 text-xl font-semibold text-white">5. Sharing</h2>
      <p>We do not sell your data. Sponsors receive only aggregated impression/click counts — never your contact details — unless you separately opt in to partner offers. Service providers (hosting, database, email) process data on our behalf under contract.</p>

      <h2 className="mt-6 text-xl font-semibold text-white">6. Retention</h2>
      <p>Lead data is retained for up to 24 months from your last interaction, or until you withdraw consent or ask us to delete it, whichever is earlier. Anonymised aggregates may be retained longer.</p>

      <h2 className="mt-6 text-xl font-semibold text-white">7. Your rights</h2>
      <p>You may access, correct, or erase your personal data, withdraw consent, nominate a person to exercise your rights, and raise a grievance with our Grievance Officer (privacy@scrini.ai). If unresolved, you may approach the Data Protection Board of India.</p>

      <h2 id="delete" className="mt-8 text-xl font-semibold text-white">8. Delete my data</h2>
      <p>Enter the email you used. We'll email you a confirmation link that permanently deletes your sessions, report and lead record.</p>
      <DeleteForm />
    </main>
  );
}

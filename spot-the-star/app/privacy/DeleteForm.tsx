"use client";
import { useState } from "react";

export default function DeleteForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "emailed" | "queued" | "error">("idle");
  return (
    <form
      className="mt-3 flex flex-col gap-2 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        const r = await fetch("/api/delete-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
        const j = r?.ok ? await r.json() : null;
        setState(!j ? "error" : j.emailed ? "emailed" : "queued");
      }}
    >
      <input className="input" type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email for data deletion" />
      <button className="btn-pink shrink-0" disabled={state === "busy"}>
        Request deletion
      </button>
      {state === "emailed" && <p className="text-sm text-neon-lime">Check your inbox for the confirmation link.</p>}
      {state === "queued" && <p className="text-sm text-neon-lime">Request received. Our team will delete your data within 7 days and confirm by email.</p>}
      {state === "error" && <p className="text-sm text-neon-pink">Something went wrong. Email privacy@scrini.ai instead.</p>}
    </form>
  );
}

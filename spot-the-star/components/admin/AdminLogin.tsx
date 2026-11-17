"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <main className="mx-auto flex min-h-[80dvh] max-w-sm flex-col justify-center px-4">
      <form
        className="glass-strong space-y-3 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
          if (r.ok) location.reload();
          else setErr("Wrong password");
        }}
      >
        <h1 className="text-xl font-bold">🔐 Spot the Star — Admin</h1>
        <input className="input" type="password" autoFocus placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} aria-label="Admin password" />
        {err && <p className="text-sm text-neon-pink">{err}</p>}
        <button className="btn-primary w-full">Sign in</button>
      </form>
    </main>
  );
}

// src/app/signin/page.tsx (snippet)
import { Suspense } from "react";
import { SignInInner } from "./signin-inner";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInInner />
    </Suspense>
  );
}





/*"use client";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (r.ok) window.location.href = "/dashboard";
    else alert((await r.json()).error || "Error");
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full rounded bg-black text-white py-2">Sign in</button>
      </form>
    </main>
  );
}
*/
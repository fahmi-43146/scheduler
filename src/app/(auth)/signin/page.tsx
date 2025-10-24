"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleButton } from "@/components/icons/Google";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data?.error ?? "signin failed");
      setLoading(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-sm mx-auto p-6">
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        disabled={loading}
        className="rounded bg-black text-white px-3 py-2"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <GoogleButton />
    </form>
  );
}

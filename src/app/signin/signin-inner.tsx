"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export function SignInInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const created = sp.get("created") === "1";
  const from = sp.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    const payload = {
      email: email.trim().toLowerCase(),
      password,
    };

    if (!payload.email || !payload.password) {
      setErr("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // same-origin, so cookies will be set; this is explicit just in case:
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        let msg = "Invalid credentials.";
        try {
          const data = await r.json();
          if (data?.error) msg = data.error;
        } catch {}
        setErr(msg);
        return;
      }

      // logged in – go to intended page or dashboard
      router.replace(from);
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Sign in</h1>

      {created && (
        <div className="mb-4 rounded-md bg-emerald-50 text-emerald-800 p-3 text-sm">
          Account created. You can sign in, but creating events is blocked until an admin approves you.
        </div>
      )}

      {err && (
        <div className="mb-3 rounded-md bg-red-50 text-red-800 p-3 text-sm">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="block text-sm mb-1">Email</span>
          <input
            className="w-full border p-2 rounded"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            type="email"
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Password</span>
          <input
            className="w-full border p-2 rounded"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-gray-600 mt-3">
          Don’t have an account?{" "}
          <a href="/signup" className="text-black underline underline-offset-4">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}

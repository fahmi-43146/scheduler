// app/signup/SignupForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        name,
        password,
      }),
    });

    if (res.status === 409) {
      setErr(
        "An account with this email already exists. Do you want to sign in?"
      );
      setLoading(false);
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data?.error ?? "Signup failed");
      setLoading(false);
      return;
    }

    // auto-logged in by server → go to app
    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-sm mx-auto p-6">
      <input
        className="w-full border px-3 py-2 rounded-md"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full border px-3 py-2 rounded-md"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border px-3 py-2 rounded-md"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {err && (
        <p className="text-sm text-red-600">
          {err}{" "}
          <Link href="/signin" className="underline">
            Go to sign in
          </Link>
        </p>
      )}

      <button
        disabled={loading}
        className="rounded bg-black text-white px-3 py-2"
      >
        {loading ? "Creating…" : "Create account"}
      </button>

      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/signin" className="underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

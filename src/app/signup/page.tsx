// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    console.log("[signup] submit clicked");

    if (!email || !pw) {
      console.warn("[signup] missing email/password", { email });
      return setErr("Email and password are required.");
    }
    if (pw !== pw2) {
      console.warn("[signup] password mismatch");
      return setErr("Passwords do not match.");
    }
    if (pw.length < 8) {
      console.warn("[signup] weak password (len < 8)");
      return setErr("Password must be at least 8 characters.");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pw }),
      });
      
      console.log("[signup] response status:", res.status);
      console.log("[signup] response type:", res.headers.get("content-type"));

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[signup] Non-JSON response received");
        setErr("Unexpected response from server");
        return;
      }

      const data = await res.json();
      
      if (!res.ok) {
        console.error("[signup] Error response:", data);
        setErr(data.error || "Sign up failed.");
        return;
      }

      // Success → send to signin with a hint
      router.push("/signin?created=1");
    } catch (error) {
      console.error("[signup] Request failed:", error);
      setErr("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
      <p className="text-sm text-gray-600 mb-6">
        After you sign up, an admin must approve your account before you can create events.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name (optional)</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm password</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-sm text-gray-600 mt-3">
          Already have an account?{" "}
          <a href="/signin" className="text-black underline underline-offset-4">Sign in</a>
        </p>
      </form>
    </main>
  );
}

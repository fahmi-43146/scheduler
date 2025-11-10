"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(fd.get("password") || "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Connexion échouée (${res.status})`);
      }
      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 grid place-items-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Se connecter
        </h1>

        {/* Google FIRST */}
        <a
          href="/api/auth/google"
          className="w-full h-12 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition mb-5"
          aria-label="Se connecter avec Google"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.4 31.7 29.1 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.9l5.7-5.7C33.5 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 19.5-9 19.5-20c0-1.5-.1-2.6-.3-4.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 16.5 18.9 14 24 14c2.8 0 5.4 1.1 7.4 2.9l5.7-5.7C33.5 7.1 28.9 5 24 5 16.1 5 9.5 9.4 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 45c4.9 0 9.5-1.9 12.9-5l-6-5.1c-2 1.4-4.6 2.2-6.9 2.2-5 0-9.3-3.3-10.8-7.8l-6.7 5.2C9.7 39.9 16.3 45 24 45z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.9-5.1 7-9.3 7-5 0-9.3-3.3-10.8-7.8l-6.7 5.2C9.7 39.9 16.3 45 24 45c9.4 0 18.5-6.9 18.5-20 0-1.5-.1-2.6-.3-4.5z"
            />
          </svg>
          <span className="font-medium">Se connecter avec Google</span>
        </a>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-slate-900 px-2 text-xs text-slate-500">
              ou
            </span>
          </div>
        </div>

        {/* Email / Mot de passe */}
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-12 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-slate-900 dark:text-slate-100"
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="h-12 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full h-12 rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition"
          >
            {pending ? "Connexion en cours…" : "Se connecter"}
          </button>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Vous n&#39;avez pas de compte&nbsp;?{" "}
          <Link
            href="/signup"
            className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

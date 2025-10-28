import Link from "next/link";

export const metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 grid place-items-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Create account
        </h1>

        {/* Google FIRST */}
        <a
          href="/api/auth/google"
          className="block w-full h-12 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition mb-5"
          aria-label="Sign up with Google"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
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
          <span className="font-medium">Continue with Google</span>
        </a>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-slate-900 px-2 text-xs text-slate-500">
              or
            </span>
          </div>
        </div>

        {/* Email signup — posts to your API */}
        <form method="post" action="/api/auth/signup" className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="h-12 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-slate-900 dark:text-slate-100"
            />
          </div>

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
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Password
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
            className="w-full h-12 rounded-md bg-linear-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

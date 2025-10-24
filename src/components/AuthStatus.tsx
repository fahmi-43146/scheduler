"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <Link
        href="/signup"
        className="no-underline rounded-md px-3 py-1.5 bg-white/10 hover:bg-white/20"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm/none opacity-90">{session.user?.email}</span>
      <form action="/api/auth/signout" method="POST">
        <button className="rounded-md px-3 py-1.5 bg-white/10 hover:bg-white/20">
          Sign Out
        </button>
      </form>
    </div>
  );
}

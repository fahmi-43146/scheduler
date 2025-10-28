import type React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/(auth)/actions";

// Narrow type for what we actually read
type AppUser = {
  email?: string | null;
  name?: string | null;
  role?: string | null;
  isAdmin?: boolean | null;
} | null;

function isAdminUser(user: AppUser): boolean {
  const role = user?.role?.toUpperCase?.();
  return user?.isAdmin === true || role === "ADMIN";
}

export default async function Header() {
  const me = (await getCurrentUser()) as AppUser; // assertion to our safe shape
  const isAdmin = isAdminUser(me);

  const NavLink = ({
    href,
    children,
    className = "",
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Link
      href={href}
      className={`no-underline rounded-md px-3 py-2 text-sm font-medium text-foreground/80
                  hover:text-foreground hover:bg-muted transition-colors duration-200 ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <header
      className="sticky top-0 z-50 border-b border-border
             bg-linear-to-r from-primary via-primary to-[#166FE5]
             dark:from-primary dark:via-primary dark:to-[#166FE5]
             backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-primary-foreground hover:opacity-80 transition-opacity"
          >
            Dr Affef Najjari
          </Link>

          {/* Primary nav */}
          <nav className="hidden sm:flex items-center gap-0.5">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/calendar">Calendar</NavLink>
            <NavLink href="/about">About</NavLink>
            {isAdmin && <NavLink href="/admin/users">Admin</NavLink>}
          </nav>

          {/* Auth / user area */}
          {!me ? (
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs sm:text-sm leading-none text-primary-foreground/70 truncate max-w-48">
                {me?.name ?? ""}
              </span>
              <form action={signOut}>
                <button
                  className="rounded-md px-3 py-2 text-sm font-medium
                         bg-muted text-muted-foreground hover:bg-muted/80
                         transition-colors duration-200"
                >
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

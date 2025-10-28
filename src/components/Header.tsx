import type React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/(auth)/actions";
import AdminMenu from "./AdminMenu";

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
  const me = (await getCurrentUser()) as AppUser;
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
      className={`text-sm hover:text-primary transition-colors no-underline rounded-md px-3 py-2 ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              UT
            </div>
            <span className="text-lg font-semibold">
              University of Tunis El Manar
            </span>
          </Link>

          {/* Primary nav (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/dashboard">Dashboard</NavLink>
            {/*<NavLink href="/calendar">Calendar</NavLink>*/}
            <NavLink href="/about">About</NavLink>
            {isAdmin ? <AdminMenu /> : null}
          </div>

          {/* Auth area (always server-rendered) */}
          {!me ? (
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm leading-none text-foreground/70 truncate max-w-48">
                {me?.name ?? ""}
              </span>
              <form action={signOut}>
                <button className="rounded-md px-3 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

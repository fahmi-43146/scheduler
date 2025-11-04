import type React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/(auth)/actions";
import AdminMenu from "./AdminMenu";
import MobileMenu from "./MobileMenu";

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
      className={`text-sm font-medium hover:text-primary transition-colors rounded-md px-3 py-2 ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* === BRAND (Always Visible) === */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              UT
            </div>
            <span className="hidden sm:inline text-lg font-semibold text-foreground">
              Université de Tunis
            </span>
            <span className="sm:hidden text-lg font-semibold text-foreground">
              UT
            </span>
          </Link>

          {/* === DESKTOP NAV (≥768px) === */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center">
            <NavLink href="/dashboard">Tableau de bord</NavLink>
            {/* <NavLink href="/calendar">Calendrier</NavLink> */}
            <NavLink href="/about">À propos</NavLink>
            {isAdmin && <AdminMenu />}
          </div>

          {/* === AUTH AREA (Always Visible) === */}
          <div className="flex items-center gap-3">
            {!me ? (
              <Link
                href="/signup"
                className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Se connecter
              </Link>
            ) : (
              <>
                {/* User name — hidden on mobile */}
                <span className="hidden sm:inline text-sm text-foreground/70 truncate max-w-32">
                  {me.name ?? ""}
                </span>

                {/* Sign Out Button */}
                <form action={signOut}>
                  <button className="rounded-md px-3 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                    Se déconnecter
                  </button>
                </form>
              </>
            )}
          </div>

          {/* === MOBILE MENU BUTTON (≤767px) === */}
          <div className="md:hidden">
            <MobileMenu isAdmin={isAdmin} me={me} />
          </div>
        </div>
      </div>
    </nav>
  );
}

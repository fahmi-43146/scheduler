// src/components/MobileMenu.tsx
// src/components/MobileMenu.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";

type MobileMenuProps = {
  isAdmin: boolean;
  me: { name?: string | null } | null;
};

/* ------------------------------------------------------------------ */
/*  Simple link component – closes the mobile menu when clicked       */
/* ------------------------------------------------------------------ */
function NavLink({
  href,
  children,
  onClose,
}: {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*                         MOBILE MENU COMPONENT                      */
/* ------------------------------------------------------------------ */
export default function MobileMenu({ isAdmin, me }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  /* ---- close on click outside ---- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* ---- close on route change ---- */
  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md hover:bg-muted/50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border  bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-200 shadow-2xl z-50">
          <div className="p-3 space-y-1">
            <NavLink href="/dashboard" onClose={close}>
              Mon espace
            </NavLink>

            <NavLink href="/about" onClose={close}>
              À propos
            </NavLink>
            <NavLink href="/" onClose={close}>
              Planificateur
            </NavLink>

            {/* ---------- ADMIN LINKS (no dropdown) ---------- */}
            {isAdmin && (
              <>
                <NavLink href="/admin/events" onClose={close}>
                  Events
                </NavLink>

                <NavLink href="/admin/users" onClose={close}>
                  Users
                </NavLink>
              </>
            )}

            {/* ---------- USER / SIGN‑OUT ---------- */}
            <div className="border-t border-border pt-2 mt-2">
              {me && (
                <div className="px-3 py-2 text-sm text-foreground/70 truncate">
                  {me.name ?? ""}
                </div>
              )}

              {me ? (
                <form action={signOut} className="w-full">
                  <button
                    type="submit"
                    onClick={close}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              ) : (
                <NavLink href="/signin" onClose={close}>
                  Se connecter
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/(auth)/actions";
import AdminMenu from "./AdminMenu";

type MobileMenuProps = {
  isAdmin: boolean;
  me: { name?: string | null } | null;
};

export default function MobileMenu({ isAdmin, me }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
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

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-white dark:bg-slate-900 shadow-2xl z-50">
          <div className="p-3 space-y-1">
            <MobileNavLink href="/dashboard" onClose={() => setOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/about" onClose={() => setOpen(false)}>
              About
            </MobileNavLink>
            {isAdmin && (
              <div className="px-3 py-2">
                <AdminMenu />
              </div>
            )}

            <div className="border-t border-border pt-2 mt-2">
              {me && (
                <div className="px-3 py-2 text-sm text-foreground/70 truncate">
                  {me.name ?? ""}
                </div>
              )}
              <form action={signOut} className="w-full">
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavLink({
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
      className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
      onClick={onClose}
    >
      {children}
    </Link>
  );
}

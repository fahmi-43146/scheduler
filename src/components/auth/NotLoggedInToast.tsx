"use client";

import { useEffect } from "react";
//import Link from "next/link";
//import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * Show a one-time toast per tab/session if the user is not logged in.
 * Pass a boolean `isLoggedIn` from your auth state (cookie, context, etc.).
 */
export default function NotLoggedInToast({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  useEffect(() => {
    if (isLoggedIn) return;

    // avoid showing on every render
    const KEY = "shownNotLoggedInToast";
    if (sessionStorage.getItem(KEY) === "1") return;

    sessionStorage.setItem(KEY, "1");
    toast("You're not signed in", {
      description: "Sign in to save bookings and manage your schedule.",
      duration: 6000,
      action: {
        label: "Sign in",
        onClick: () => {
          window.location.href = "/signin";
        },
      },
    });
  }, [isLoggedIn]);

  return null;
}

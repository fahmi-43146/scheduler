// components/icons/GoogleButton.tsx
"use client";
import Image from "next/image";
import { Button } from "../ui/button";

export function GoogleButton() {
  return (
    <Button
      asChild
      variant="outline"
      className="gap-2"
      aria-label="Continue with Google"
    >
      <a href="/api/auth/google">
        <Image src="/google.png" alt="Google" width={20} height={20} />
        Continue with Google
      </a>
    </Button>
  );
}

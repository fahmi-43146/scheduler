"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function AdminMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 px-3 py-2 text-sm rounded-md hover:bg-muted">
          Admin <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-44 rounded-md border border-border bg-popover text-popover-foreground shadow-lg z-50"
      >
        <DropdownMenuItem asChild>
          <Link href="/admin/events">Events</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/users">Users</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

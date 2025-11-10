// src/components/EventHoverCard.tsx
"use client";

import type React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Clock, MapPin, Tag, User } from "lucide-react";
import { useState } from "react";

interface EventHoverCardProps {
  event: {
    organizerName?: string | null;
    start: Date;
    end: Date;
    type: "PHD" | "THESIS" | "OTHER";
    typeOtherName?: string | null;
    description?: string | null;
  };
  roomName: string;
  children: React.ReactNode;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatTimeRange = (start: Date, end: Date) => {
  return `${pad(start.getHours())}:${pad(start.getMinutes())} – ${pad(
    end.getHours()
  )}:${pad(end.getMinutes())}`;
};

export default function EventHoverCard({
  event,
  roomName,
  children,
}: EventHoverCardProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-event-menu]")) return;
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <HoverCard
      open={open}
      onOpenChange={setOpen}
      openDelay={100}
      closeDelay={150}
    >
      <HoverCardTrigger asChild>
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        side="top"
        align="center"
        sideOffset={8}
        className="w-72 p-4 z-50 bg-[var(--card)] text-[var(--popover-foreground)] border-[var(--border)] shadow-xl rounded-lg
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
          data-[side=top]:slide-in-from-bottom-2"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            {/* Organisateur */}
            {event.organizerName && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Organisateur
                  </p>
                  <p className="font-semibold text-foreground truncate">
                    {event.organizerName}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Salle */}
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">
                  Salle
                </p>
                <p className="font-semibold text-foreground">{roomName}</p>
              </div>
            </div>

            {/* Horaire */}
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">
                  Horaire
                </p>
                <p className="font-semibold text-foreground">
                  {formatTimeRange(event.start, event.end)}
                </p>
              </div>
            </div>
          </div>

          {/* Type d'événement – PRO handling of long text */}
          <div className="pt-3 border-t border-border/30">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold max-w-full">
              <Tag className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {event.type === "PHD" && "Mastère"}
                {event.type === "THESIS" && "Thèse"}
                {event.type === "OTHER" && (
                  <>
                    {event.typeOtherName ? (
                      <span className="break-words">{event.typeOtherName}</span>
                    ) : (
                      "Autre"
                    )}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

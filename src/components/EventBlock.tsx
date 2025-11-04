import type React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Clock, MapPin, Tag, User } from "lucide-react";

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
  return (
    <HoverCard openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      <HoverCardContent
        className="w-50 p-4 z-50
             bg-[var(--card)] text-[var(--popover-foreground)]
             border-[var(--border)] shadow-md backdrop-blur-none rounded-lg overflow-hidden
             transition-all duration-300 ease-out
             data-[state=open]:animate-in data-[state=closed]:animate-out
             data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
             data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
             data-[side=bottom]:slide-in-from-top-2"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            {/* Organizer */}
            {event.organizerName && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Organizer
                  </p>
                  <p className="font-semibold text-foreground truncate">
                    {event.organizerName}
                  </p>
                </div>
              </div>
            )}

            {event.description && (
              <div className="pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Room */}
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">
                  Room
                </p>
                <p className="font-semibold text-foreground">{roomName}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">
                  Time
                </p>
                <p className="font-semibold text-foreground">
                  {formatTimeRange(event.start, event.end)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                <Tag className="w-3 h-3" />
                {event.type}
                {event.type === "OTHER" && event.typeOtherName && (
                  <span className="text-primary/70">
                    – {event.typeOtherName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

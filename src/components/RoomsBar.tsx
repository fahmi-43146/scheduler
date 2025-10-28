// src/components/RoomsBar.tsx
"use client";

import * as React from "react";

type RoomItem = { name: string; icon?: React.ReactNode | string | null };

export type RoomsBarProps = {
  rooms: RoomItem[];
  selectedRoomName?: string;
  onSelect: (name: string) => void;
  /** Make the bar sticky with blur & auto shadow on scroll (default: true) */
  sticky?: boolean;
  /** Extra class for the outer container */
  className?: string;
  /** Optional: trailing action (e.g. tiny Add button) */
  trailing?: React.ReactNode;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function RoomsBar({
  rooms,
  selectedRoomName,
  onSelect,
  sticky = true,
  className,
  trailing,
}: RoomsBarProps) {
  const barRef = React.useRef<HTMLDivElement>(null);
  const [elevated, setElevated] = React.useState(false);

  React.useEffect(() => {
    if (!sticky) return;
    const onScroll = () => setElevated(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  React.useEffect(() => {
    if (!barRef.current || !selectedRoomName) return;
    const el = barRef.current.querySelector<HTMLButtonElement>(
      `[data-room="${CSS.escape(selectedRoomName)}"]`
    );
    el?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedRoomName]);

  return (
    <div
      ref={barRef}
      className={cx(
        "w-full",
        sticky &&
          "sticky top-0 z-30 -mx-1 md:mx-0 px-2 py-2 border-b border-slate-200/70 dark:border-slate-800/60 " +
            "bg-white/85 dark:bg-gray-900/80 backdrop-blur supports-backdrop-filter:bg-white/60 supports-backdrop-filter:dark:bg-gray-900/60",
        elevated && sticky && "shadow-sm",
        "transition-shadow duration-300",
        className
      )}
      style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="
            flex-1 min-w-0 w-full max-w-full
            overflow-x-auto whitespace-nowrap scrollbar-hide touch-pan-x
            snap-x snap-mandatory
          "
          role="tablist"
          aria-label="Rooms"
        >
          <div className="inline-flex min-w-max gap-2 px-1 py-1">
            {rooms.map((r) => {
              const active = r.name === selectedRoomName;
              return (
                <button
                  key={r.name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-room={r.name}
                  onClick={() => onSelect(r.name)}
                  className={cx(
                    "shrink-0 snap-start rounded-full px-3 py-1.5 text-sm border transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300",
                    active
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white dark:bg-gray-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                  title={r.name}
                >
                  {typeof r.icon === "string" ? (
                    <span className="mr-1">{r.icon}</span>
                  ) : r.icon ? (
                    <span className="mr-1 inline-flex items-center">
                      {r.icon}
                    </span>
                  ) : null}
                  {r.name}
                </button>
              );
            })}
          </div>
        </div>

        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </div>
  );
}

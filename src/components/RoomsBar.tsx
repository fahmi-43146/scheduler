// src/components/RoomsBar.tsx
"use client";

import * as React from "react";

type RoomItem = { name: string; icon?: React.ReactNode | string | null };

export type RoomsBarProps = {
  rooms: RoomItem[];
  selectedRoomName?: string;
  onSelect: (name: string) => void;
  sticky?: boolean;
  className?: string;
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
          "sticky top-0 z-30 px-2 py-2 border-b border-slate-200/70 dark:border-slate-800/60 " +
            "bg-white dark:bg-slate-950 backdrop-blur-sm supports-backdrop-filter:bg-white/90 supports-backdrop-filter:dark:bg-slate-950/90",
        elevated && sticky && "shadow-sm",
        "transition-shadow duration-300",
        className
      )}
      style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}
    >
      <div className="flex items-center gap-2">
        {/* SCROLL CONTAINER */}
        <div
          className="
    flex-1 overflow-x-auto scrollbar-hide [-webkit-overflow-scrolling:touch]
    snap-x snap-mandatory min-w-0
  "
          role="tablist"
          aria-label="Rooms"
        >
          <div className="flex gap-2 px-1 py-1 min-w-fit whitespace-nowrap">
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
                    "shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                    active
                      ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                  title={r.name}
                >
                  {typeof r.icon === "string" ? (
                    <span className="mr-1.5">{r.icon}</span>
                  ) : r.icon ? (
                    <span className="mr-1.5 inline-flex items-center">
                      {r.icon}
                    </span>
                  ) : null}
                  {r.name}
                </button>
              );
            })}
          </div>
        </div>

        {trailing ? <div className="shrink-0 pl-2">{trailing}</div> : null}
      </div>
    </div>
  );
}

// src/components/Rooms.tsx
"use client";

type RoomsProps = {
  selectedRoomName?: string;
  onSelect: (name: string) => void;
  orientation?: "vertical" | "horizontal";
  rooms?: { name: string; icon?: string | null }[];
};

export default function Rooms({
  selectedRoomName,
  onSelect,
  orientation = "vertical",
  rooms = [],
}: RoomsProps) {
  if (orientation === "horizontal") {
    return (
      <div
        className="
          w-full max-w-full overflow-x-auto overscroll-x-contain scrollbar-hide
          whitespace-nowrap [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]
        "
        role="tablist"
        aria-label="Rooms"
      >
        <div className="inline-flex min-w-max gap-2 px-1 py-2">
          {rooms.map((r) => {
            const active = r.name === selectedRoomName;
            return (
              <button
                key={r.name}
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(r.name)}
                className={[
                  "shrink-0 rounded-full px-3 py-1.5 text-sm border transition-colors",
                  active
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white dark:bg-gray-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
                ].join(" ")}
                title={r.name}
              >
                {r.icon ? <span className="mr-1">{r.icon}</span> : null}
                {r.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // vertical fallback
  return (
    <div className="flex flex-col gap-2">
      {rooms.map((r) => {
        const active = r.name === selectedRoomName;
        return (
          <button
            key={r.name}
            onClick={() => onSelect(r.name)}
            className={[
              "rounded-lg px-3 py-2 text-sm border text-left transition-colors",
              active
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white dark:bg-gray-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            {r.name}
          </button>
        );
      })}
    </div>
  );
}

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
  // REPLACE the entire `if (orientation === "horizontal")` block
  if (orientation === "horizontal") {
    return (
      <div
        className="
        w-full overflow-x-auto overscroll-x-contain
        scrollbar-hide [-webkit-overflow-scrolling:touch]
        py-1
        md:overflow-x-visible md:flex md:flex-wrap md:gap-2
      "
        role="tablist"
        aria-label="Rooms"
      >
        <div className="flex gap-2 px-1 min-w-fit whitespace-nowrap">
          {rooms.map((r) => {
            const active = r.name === selectedRoomName;
            return (
              <button
                key={r.name}
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(r.name)}
                className={`
                shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200
                ${
                  active
                    ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                }
              `}
                title={r.name}
              >
                {r.icon ? <span className="mr-1.5">{r.icon}</span> : null}
                {r.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical layout (mobile sidebar, etc.)
  return (
    <div className="flex flex-col gap-1.5">
      {rooms.map((r) => {
        const active = r.name === selectedRoomName;
        return (
          <button
            key={r.name}
            onClick={() => onSelect(r.name)}
            className={[
              "rounded-lg px-4 py-2.5 text-sm font-medium border text-left transition-all duration-200",
              active
                ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600",
            ].join(" ")}
          >
            {r.icon ? <span className="mr-2">{r.icon}</span> : null}
            {r.name}
          </button>
        );
      })}
    </div>
  );
}

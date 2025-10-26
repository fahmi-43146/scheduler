"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontal,
} from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import DatePicker from "./DatePicker";
import { useAdminEventActions } from "@/hooks/useAdminEventActions";

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  status?: "ACTIVE" | "CANCELLED"; // optional but recommended
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfWeekMonday(d = new Date()) {
  const x = new Date(d);
  const diff = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const minsSince = (d: Date, startHour: number) => {
  const totalEventMinutes = d.getHours() * 60 + d.getMinutes();
  const startMinutes = startHour * 60;
  return totalEventMinutes - startMinutes;
};

export default function Scheduler({
  selectedRoomName,
  events = [],
  onSlotClick,
  onWeekChange,
  isAdmin = false,
  updateEvents, // 👈 new prop for optimistic updates
}: {
  selectedRoomName?: string;
  events?: EventItem[];
  onSlotClick?: (isoDate: string, hour: number) => void;
  onWeekChange?: (weekStart: Date, weekEnd: Date) => void;
  isAdmin?: boolean;
  updateEvents?: (fn: (draft: EventItem[]) => void) => void;
}) {
  // wire updater into the shared hook
  const { cancel, restore, hardDelete, isLoading } =
    useAdminEventActions<EventItem>({
      updateEvents,
    });
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const roomName = selectedRoomName || "Mathematics";
  const startHour = 8;
  const endHour = 20;
  const pxPerMinute = 0.35;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const weekStart = useMemo(
    () => startOfWeekMonday(selectedDate),
    [selectedDate]
  );
  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const lastRangeKeyRef = useRef<string>("");
  useEffect(() => {
    if (!onWeekChange) return;
    const key = `${weekStart.toISOString()}|${weekEnd.toISOString()}`;
    if (lastRangeKeyRef.current !== key) {
      lastRangeKeyRef.current = key;
      onWeekChange(weekStart, weekEnd);
    }
  }, [onWeekChange, weekStart, weekEnd]);

  const eventsByDay = useMemo(() => {
    const buckets = new Map<number, EventItem[]>();
    weekDays.forEach((_, i) => buckets.set(i, []));
    for (const ev of events) {
      const idx = weekDays.findIndex((d) => sameDay(d, ev.start));
      if (idx >= 0) buckets.get(idx)!.push(ev);
    }
    for (const arr of buckets.values()) arr.sort((a, b) => +a.start - +b.start);
    return buckets;
  }, [events, weekDays]);

  const totalMinutes = (endHour - startHour) * 60;
  const gridHeightPx = totalMinutes * pxPerMinute;
  const clampY = (y: number) => Math.max(0, Math.min(y, gridHeightPx - 2));

  const isCurrentWeek = sameDay(weekStart, startOfWeekMonday(new Date()));
  const now = new Date();
  const nowY =
    isCurrentWeek && now.getHours() >= startHour && now.getHours() < endHour
      ? clampY(minsSince(now, startHour) * pxPerMinute)
      : null;

  useEffect(() => {
    setMenuOpenId(null);
  }, [weekStart.toISOString()]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="font-semibold text-orange-600 dark:text-orange-400 text-sm">
          {roomName}
        </div>
        <DatePicker onSelect={(d: Date) => setSelectedDate(d)} />
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Week of{" "}
            {weekStart.toLocaleDateString(undefined, {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedDate((d) => addDays(d, -7))}
              className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={() => setSelectedDate((d) => addDays(d, 7))}
              className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-[88px_repeat(7,1fr)] bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs">
        <div className="px-3 py-2 text-slate-600 dark:text-slate-400 font-semibold">
          Time
        </div>
        {weekDays.map((d, i) => (
          <div key={i} className="px-2 py-2 text-center">
            <div className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
              {DAYS[i]}
            </div>
            <div className="text-slate-500 dark:text-slate-500 text-xs mt-0.5">
              {d.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="relative overflow-x-auto">
        <div className="grid grid-cols-[88px_repeat(7,1fr)]">
          {/* Time rail */}
          <div
            className="relative bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-700"
            style={{ height: gridHeightPx }}
          >
            {Array.from(
              { length: endHour - startHour + 1 },
              (_, i) => startHour + i
            ).map((_, i) => {
              const y = clampY(i * 60 * pxPerMinute);
              return (
                <div
                  key={`line-${i}`}
                  className={`absolute left-0 right-0 ${
                    i % 2 === 0
                      ? "border-t border-slate-300 dark:border-slate-700"
                      : "border-t border-slate-200 dark:border-slate-800"
                  }`}
                  style={{ top: y }}
                />
              );
            })}

            {/* Centered hour labels */}
            {Array.from(
              { length: endHour - startHour },
              (_, i) => startHour + i
            ).map((h, i) => {
              const centerY = clampY((i * 60 + 30) * pxPerMinute);
              return (
                <div
                  key={`label-${h}`}
                  className="absolute left-0 right-0"
                  style={{ top: centerY }}
                >
                  <div
                    className="ml-2 inline-flex items-center rounded bg-white dark:bg-slate-800
                     px-2 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200
                     -translate-y-1/2"
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day columns */}
          {weekDays.map((d, dayIdx) => (
            <div
              key={dayIdx}
              className="relative bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-700"
              style={{ height: gridHeightPx }}
            >
              {/* Clickable hour slots */}
              {Array.from({ length: endHour - startHour }, (_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const iso = `${d.getFullYear()}-${String(
                      d.getMonth() + 1
                    ).padStart(2, "0")}-${String(d.getDate()).padStart(
                      2,
                      "0"
                    )}`;
                    onSlotClick?.(iso, startHour + i);
                  }}
                  className={`absolute left-0 right-0 cursor-pointer transition-colors border-t 
                              border-slate-200 dark:border-slate-800 hover:border-orange-400 
                              hover:bg-orange-50 dark:hover:bg-orange-950/30 ${
                                (eventsByDay.get(dayIdx) || []).some((ev) => {
                                  const hourStart = new Date(d);
                                  hourStart.setHours(startHour + i, 0, 0, 0);
                                  const hourEnd = new Date(hourStart);
                                  hourEnd.setMinutes(hourEnd.getMinutes() + 60);
                                  return (
                                    ev.start < hourEnd && ev.end > hourStart
                                  );
                                })
                                  ? "bg-orange-50/50 dark:bg-orange-950/15"
                                  : ""
                              }`}
                  style={{
                    top: i * 60 * pxPerMinute,
                    height: 60 * pxPerMinute,
                  }}
                />
              ))}

              {/* Current time line */}
              {isCurrentWeek && sameDay(d, new Date()) && nowY !== null && (
                <div
                  className="absolute left-0 right-0 h-0.5 bg-orange-500 shadow-sm"
                  style={{ top: nowY }}
                />
              )}

              {/* Events */}
              <div className="absolute inset-0 pointer-events-none">
                {(eventsByDay.get(dayIdx) || []).map((ev) => {
                  const startY = minsSince(ev.start, startHour) * pxPerMinute;
                  const endY = minsSince(ev.end, startHour) * pxPerMinute;
                  const top = clampY(startY);
                  const bottom = clampY(endY);
                  const height = Math.max(16, bottom - top);
                  if (bottom <= top) return null;

                  const isCancelled = (ev.status ?? "ACTIVE") === "CANCELLED";

                  return (
                    <div
                      key={ev.id}
                      className={`absolute left-1 right-1 rounded-md border border-opacity-20 text-xs leading-snug text-white p-1.5 pointer-events-auto shadow-md hover:shadow-lg transition-shadow ${
                        ev.color || "bg-orange-600"
                      } ${
                        isCancelled
                          ? "opacity-70 grayscale"
                          : "hover:brightness-110"
                      }`}
                      style={{ top, height }}
                      title={`${ev.title} — ${pad2(ev.start.getHours())}:${pad2(
                        ev.start.getMinutes()
                      )}–${pad2(ev.end.getHours())}:${pad2(
                        ev.end.getMinutes()
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="font-semibold truncate text-xs">
                            {ev.title}
                          </div>
                          <div className="opacity-90 truncate text-[11px]">
                            {pad2(ev.start.getHours())}:
                            {pad2(ev.start.getMinutes())} –{" "}
                            {pad2(ev.end.getHours())}:
                            {pad2(ev.end.getMinutes())}
                          </div>
                          {isCancelled && (
                            <span className="mt-0.5 inline-block rounded bg-black/20 px-1 py-[1px] text-[10px] uppercase">
                              Cancelled
                            </span>
                          )}
                        </div>

                        {/* Admin actions */}
                        {isAdmin && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenId(
                                  menuOpenId === ev.id ? null : ev.id
                                );
                              }}
                              className="pointer-events-auto rounded p-1 hover:bg-black/10"
                              aria-label="Event actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {menuOpenId === ev.id && (
                              <div
                                className="absolute right-0 z-10 mt-1 w-36 rounded-md border bg-white p-1 text-xs text-black shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {isCancelled ? (
                                  <button
                                    onClick={() => {
                                      restore(ev.id);
                                      setMenuOpenId(null);
                                    }}
                                    disabled={isLoading(ev.id)}
                                    className="block w-full rounded px-2 py-1 text-left hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    {isLoading(ev.id)
                                      ? "Restoring…"
                                      : "Restore"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      cancel(ev.id);
                                      setMenuOpenId(null);
                                    }}
                                    disabled={isLoading(ev.id)}
                                    className="block w-full rounded px-2 py-1 text-left hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    {isLoading(ev.id)
                                      ? "Cancelling…"
                                      : "Cancel"}
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Delete this event permanently?"
                                      )
                                    ) {
                                      hardDelete(ev.id);
                                      setMenuOpenId(null);
                                    }
                                  }}
                                  disabled={isLoading(ev.id)}
                                  className="mt-1 block w-full rounded px-2 py-1 text-left text-red-600 hover:bg-red-100 disabled:opacity-50"
                                >
                                  {isLoading(ev.id) ? "Deleting…" : "Delete"}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

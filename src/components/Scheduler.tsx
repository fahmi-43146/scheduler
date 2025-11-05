"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontal,
} from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import DatePicker from "./DatePicker";
import { useAdminEventActions } from "@/hooks/useAdminEventActions";
import EventHoverCard from "./EventBlock";
import EventItem from "@/types/event";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

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
  updateEvents,
  hourHeight = 48,
}: {
  selectedRoomName?: string;
  events?: EventItem[];
  onSlotClick?: (isoDate: string, hour: number) => void;
  onWeekChange?: (weekStart: Date, weekEnd: Date) => void;
  isAdmin?: boolean;
  updateEvents?: (fn: (draft: EventItem[]) => void) => void;
  hourHeight?: number;
}) {
  const { cancel, restore, hardDelete, isLoading } =
    useAdminEventActions<EventItem>({ updateEvents });
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const roomName = selectedRoomName || "Mathematics";
  const startHour = 8;
  const endHour = 20;
  const pxPerMinute = hourHeight / 60;

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
  const weekStartKey = useMemo(() => weekStart.getTime(), [weekStart]);
  const lastRangeKeyRef = useRef<string>("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = (d: Date) => sameDay(d, today);

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

  useEffect(() => setMenuOpenId(null), [weekStartKey]);

  // Click outside & Escape
  useEffect(() => {
    if (!menuOpenId) return;
    const clickOut = (e: MouseEvent) => {
      const menu = document.querySelector(`[data-event-menu="${menuOpenId}"]`);
      if (
        menu &&
        !(e.target as HTMLElement).closest(`[data-event-menu="${menuOpenId}"]`)
      )
        setMenuOpenId(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpenId(null);
    document.addEventListener("mousedown", clickOut, true);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", clickOut, true);
      document.removeEventListener("keydown", esc);
    };
  }, [menuOpenId]);

  // Long press
  const handleLongPress = (evId: string) => {
    if (!isAdmin) return;
    setMenuOpenId(menuOpenId === evId ? null : evId);
  };
  const startLongPress = (evId: string) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => handleLongPress(evId), 500);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // Pinch-to-zoom disable (mobile only)
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener("touchmove", preventZoom, { passive: false });
    return () => document.removeEventListener("touchmove", preventZoom);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-950 shadow-xl touch-none">
      {/* ── STICKY HEADER ONLY ── */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-950">
        <header className="flex flex-col xs:flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3 gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {roomName}
          </h2>
          <div className="flex items-center gap-2">
            <DatePicker onSelect={(d: Date) => setSelectedDate(d)} />
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setSelectedDate((d) => addDays(d, -7))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Semaine précédente"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedDate((d) => addDays(d, 7))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Semaine suivante"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Semaine du{" "}
            {weekStart.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </header>
      </div>

      {/* ── SCROLLABLE GRID: Headers + Time + Days ── */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
        <div
          className="grid grid-cols-[72px_repeat(7,minmax(120px,1fr))] md:grid-cols-[88px_repeat(7,minmax(140px,1fr))]"
          style={{ minWidth: "fit-content" }}
        >
          {/* DAY HEADERS */}
          <div className="col-span-1 px-3 py-2 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 sticky left-0 z-10">
            Heure
          </div>
          {weekDays.map((d, i) => (
            <div
              key={i}
              className={`
                px-2 py-2 text-center bg-gray-50 dark:bg-gray-900
                ${i >= 5 ? "opacity-60" : ""}  /* Weekend dim */
                ${isToday(d) ? "ring-2 ring-blue-500 ring-inset" : ""}
              `}
            >
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {DAYS[i]}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                {d.getDate()}
              </div>
            </div>
          ))}

          {/* TIME RAIL */}
          <div
            className="relative bg-gray-50 dark:bg-gray-900/70 border-r border-gray-200 dark:border-gray-800 sticky left-0 z-10"
            style={{ gridRow: "2 / -1", height: gridHeightPx }}
          >
            {Array.from(
              { length: endHour - startHour + 1 },
              (_, i) => startHour + i
            ).map((_, i) => {
              const y = clampY(i * 60 * pxPerMinute);
              return (
                <div
                  key={`line-${i}`}
                  className={`absolute inset-x-0 h-px ${
                    i % 2 === 0
                      ? "bg-gray-300 dark:bg-gray-700"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                  style={{ top: y }}
                />
              );
            })}

            {Array.from(
              { length: endHour - startHour },
              (_, i) => startHour + i
            ).map((h, i) => {
              const centerY = clampY((i * 60 + 30) * pxPerMinute);
              return (
                <div
                  key={`label-${h}`}
                  className="absolute inset-x-0"
                  style={{ top: centerY }}
                >
                  <div className="ml-2 inline-flex items-center rounded bg-white dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 -translate-y-1/2">
                    {String(h).padStart(2, "0")}:00
                  </div>
                </div>
              );
            })}
          </div>

          {/* DAY COLUMNS */}
          {weekDays.map((d, dayIdx) => (
            <div
              key={dayIdx}
              className={`
                relative bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800
                ${dayIdx >= 5 ? "opacity-75" : ""}  /* Weekend dim */
                ${isToday(d) ? "bg-blue-50/20 dark:bg-blue-900/20" : ""}
              `}
              style={{ gridRow: "2 / -1", height: gridHeightPx }}
            >
              {/* Slots */}
              {Array.from({ length: endHour - startHour }, (_, i) => {
                const hasEvent = (eventsByDay.get(dayIdx) || []).some((ev) => {
                  const hourStart = new Date(d);
                  hourStart.setHours(startHour + i, 0, 0, 0);
                  const hourEnd = new Date(hourStart);
                  hourEnd.setMinutes(hourEnd.getMinutes() + 60);
                  return ev.start < hourEnd && ev.end > hourStart;
                });

                return (
                  <div
                    key={i}
                    onClick={() => {
                      const iso = `${d.getFullYear()}-${pad2(
                        d.getMonth() + 1
                      )}-${pad2(d.getDate())}`;
                      onSlotClick?.(iso, startHour + i);
                    }}
                    className={`
                      absolute inset-x-0 cursor-pointer border-t border-gray-200 dark:border-gray-800
                      hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-800/30
                      ${hasEvent ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}
                    `}
                    style={{
                      top: i * 60 * pxPerMinute,
                      height: 60 * pxPerMinute,
                    }}
                  />
                );
              })}

              {/* Current time */}
              {isCurrentWeek && sameDay(d, new Date()) && nowY !== null && (
                <div
                  className="absolute inset-x-0 h-0.5 bg-red-500 shadow-sm z-20"
                  style={{ top: nowY }}
                />
              )}

              {/* Events */}
              <div className="absolute inset-0 pointer-events-none">
                {(eventsByDay.get(dayIdx) || []).map((ev) => {
                  const startY = minsSince(ev.start, startHour) * pxPerMinute;
                  const endY = minsSince(ev.end, startHour) * pxPerMinute;
                  const top = clampY(startY);
                  const height = Math.max(44, clampY(endY) - top);
                  if (height < 44) return null;

                  const cancelled = (ev.status ?? "ACTIVE") === "CANCELLED";

                  return (
                    <div
                      key={ev.id}
                      className="absolute left-1 right-1 pointer-events-auto"
                      style={{ top, height }}
                      onTouchStart={() => isAdmin && startLongPress(ev.id)}
                      onTouchEnd={cancelLongPress}
                      onTouchMove={cancelLongPress}
                      onMouseDown={() => isAdmin && startLongPress(ev.id)}
                      onMouseUp={cancelLongPress}
                      onMouseLeave={cancelLongPress}
                    >
                      {/* === EVENT BLOCK CONTAINER === */}
                      <div className="relative h-full">
                        {/* === HOVERCARD: Only content === */}
                        <EventHoverCard event={ev} roomName={roomName}>
                          <div
                            className={`
                              h-full rounded-xl p-2 text-white shadow-lg hover:shadow-xl transition-shadow
                              min-h-[44px] text-sm sm:text-xs flex flex-col justify-between cursor-pointer
                              ${ev.color || "bg-blue-600"} ${
                              cancelled
                                ? "opacity-70 grayscale"
                                : "hover:brightness-110"
                            }
                            `}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {ev.title}
                              </div>
                              <div className="text-xs opacity-90 truncate">
                                {pad2(ev.start.getHours())}:
                                {pad2(ev.start.getMinutes())} –{" "}
                                {pad2(ev.end.getHours())}:
                                {pad2(ev.end.getMinutes())}
                              </div>
                            </div>
                          </div>
                        </EventHoverCard>

                        {/* === STATUS BADGE === */}
                        {cancelled && (
                          <span className="absolute top-1 left-1 inline-block rounded bg-red-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm z-10">
                            Annulé
                          </span>
                        )}

                        {/* === ADMIN MENU BUTTON === */}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(
                                menuOpenId === ev.id ? null : ev.id
                              );
                            }}
                            className="absolute top-1 right-1 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
                            aria-label="Actions"
                          >
                            <MoreHorizontal className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>

                      {/* === ADMIN DROPDOWN === */}
                      {isAdmin && menuOpenId === ev.id && (
                        <div
                          data-event-menu={ev.id}
                          className="absolute right-0 top-10 z-50 w-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 text-sm shadow-2xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {cancelled ? (
                            <button
                              onClick={() => {
                                restore(ev.id);
                                setMenuOpenId(null);
                              }}
                              disabled={isLoading(ev.id)}
                              className="block w-full rounded px-3 py-1.5 text-left text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                              {isLoading(ev.id) ? "Restauration…" : "Restaurer"}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                cancel(ev.id);
                                setMenuOpenId(null);
                              }}
                              disabled={isLoading(ev.id)}
                              className="block w-full rounded px-3 py-1.5 text-left text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                              {isLoading(ev.id) ? "Annulation…" : "Annuler"}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Supprimer cet événement définitivement ?"
                                )
                              ) {
                                hardDelete(ev.id);
                                setMenuOpenId(null);
                              }
                            }}
                            disabled={isLoading(ev.id)}
                            className="mt-1 block w-full rounded px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                          >
                            {isLoading(ev.id) ? "Suppression…" : "Supprimer"}
                          </button>
                        </div>
                      )}
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

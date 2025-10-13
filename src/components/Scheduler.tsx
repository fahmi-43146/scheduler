"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import DatePicker from "./DatePicker";

type EventItem = {
  id: string;
  title: string;
  start: Date; // within the displayed week
  end: Date;   // within the displayed week
  color?: string; // Tailwind class like "bg-blue-600"
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ---------- tiny utils ---------- */
function startOfWeekMonday(d = new Date()) {
  const x = new Date(d);
  const diff = (x.getDay() + 6) % 7; // Mon=0
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
const minsSince = (d: Date, startHour: number) => d.getHours() * 60 + d.getMinutes() - startHour * 60;

/* ---------- the demo component ---------- */
export default function WeekScheduleDemo({ selectedRoomName, events = [], onSlotClick }: { selectedRoomName?: string; events?: EventItem[]; onSlotClick?: (isoDate: string, hour: number) => void }) {
  // demo config
  const roomName = selectedRoomName || "Orion — 3rd Floor";
  const startHour = 8;
  const endHour = 20; // exclusive bottom
  const pxPerMinute = 1; // 1px per minute ⇒ 720px tall if 12h

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const weekStart = useMemo(() => startOfWeekMonday(selectedDate), [selectedDate]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // events are provided by parent (per selected room)

  // bucket events by day index
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
  const isCurrentWeek = sameDay(weekStart, startOfWeekMonday(new Date()));
  const now = new Date();
  const nowY =
    isCurrentWeek && now.getHours() >= startHour && now.getHours() < endHour
      ? minsSince(now, startHour) * pxPerMinute
      : null;

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 border-b px-4 py-3">
        <div className="font-semibold">{roomName}</div>
        <div className="mt-2">
            <DatePicker onSelect={(d: Date) => setSelectedDate(d)} />
          </div>
       <div className="flex flex-col items-center gap-2">
                
                      <div className="text-sm text-gray-600">
                          Week of{" "}
                          {weekStart.toLocaleDateString(undefined, {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                          })}
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setSelectedDate(d => addDays(d, -7))} aria-label="Previous week">
                          <ChevronLeftIcon className="w-4 h-4 cursor-pointer" />
                        </button>
                        <button type="button" onClick={() => setSelectedDate(d => addDays(d, 7))} aria-label="Next week">
                          <ChevronRightIcon className="w-4 h-4 cursor-pointer" />
                        </button>
                      </div>
            
          {/* Inline date picker */}
          
       </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-white border-b text-sm">
        <div className="px-2 py-2 text-gray-500">Time</div>
        {weekDays.map((d, i) => (
          <div key={i} className="px-2 py-2 text-center font-medium">
            <div>{DAYS[i]}</div>
            <div className="text-gray-500 font-normal">{d.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Grid (scrollable) */}
      <div className="relative max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Time labels */}
          <div className="relative" style={{ height: totalMinutes * pxPerMinute }}>
            {Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i).map((h, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-gray-100 text-[11px] text-gray-400"
                style={{ top: i * 60 * pxPerMinute }}
              >
                <div className="-mt-2 ml-1 bg-white px-1 w-min rounded">{pad2(h)}:00</div>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((d, dayIdx) => (
            <div
              key={dayIdx}
              className="relative bg-white border-l border-gray-100"
              style={{ height: totalMinutes * pxPerMinute }}
            >
              {/* Hour lines */}
              {Array.from({ length: endHour - startHour }, (_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    // Build local YYYY-MM-DD to avoid UTC shifting a day back
                    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    onSlotClick?.(iso, startHour + i);
                  }}
                  className={`absolute left-0 right-0 cursor-pointer transition-colors border-t border-gray-200 hover:border-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700 ${
                    (eventsByDay.get(dayIdx) || []).some((ev) => {
                      const hourStart = new Date(d);
                      hourStart.setHours(startHour + i, 0, 0, 0);
                      const hourEnd = new Date(hourStart);
                      hourEnd.setMinutes(hourEnd.getMinutes() + 60);
                      return ev.start < hourEnd && ev.end > hourStart;
                    })
                      ? "bg-amber-50"
                      : ""
                  }`}
                  style={{ top: i * 60 * pxPerMinute, height: 60 * pxPerMinute }}
                  aria-label={`Hour ${startHour + i}:00`}
                />
              ))}

              {/* Today indicator */}
              {isCurrentWeek && sameDay(d, new Date()) && nowY !== null && (
                <div className="absolute left-0 right-0 h-px bg-red-500" style={{ top: nowY }} />
              )}

              {/* Events */}
              <div className="absolute inset-0 pointer-events-none">
                {(eventsByDay.get(dayIdx) || []).map((ev) => {
                  const top = Math.max(0, minsSince(ev.start, startHour) * pxPerMinute);
                  const height = Math.max(20, ((+ev.end - +ev.start) / 60000) * pxPerMinute);
                  return (
                    <div
                      key={ev.id}
                      className={`absolute left-1 right-1 rounded-md shadow-sm border text-xs text-white p-2 pointer-events-auto ${
                        ev.color || "bg-blue-600"
                      }`}
                      style={{ top, height }}
                      title={`${ev.title} — ${pad2(ev.start.getHours())}:${pad2(
                        ev.start.getMinutes()
                      )}–${pad2(ev.end.getHours())}:${pad2(ev.end.getMinutes())}`}
                    >
                      <div className="font-semibold truncate">{ev.title}</div>
                      <div className="opacity-90 truncate">
                        {pad2(ev.start.getHours())}:{pad2(ev.start.getMinutes())} –{" "}
                        {pad2(ev.end.getHours())}:{pad2(ev.end.getMinutes())}
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

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
const minsSince = (d: Date, startHour: number) => {
  const eventHour = d.getHours();
  const eventMinutes = d.getMinutes();
  const totalEventMinutes = eventHour * 60 + eventMinutes;
  const startMinutes = startHour * 60;
  return totalEventMinutes - startMinutes;
};

/* ---------- the demo component ---------- */
export default function WeekScheduleDemo({ selectedRoomName, events = [], onSlotClick }: { selectedRoomName?: string; events?: EventItem[]; onSlotClick?: (isoDate: string, hour: number) => void }) {
  // demo config
  const roomName = selectedRoomName || "Mathematics";
  const startHour = 8;
  const endHour = 18; // exclusive bottom (8 AM to 6 PM)
  const pxPerMinute = 0.8; // 0.8px per minute ⇒ ~480px tall for 10h

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
    <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="font-semibold text-slate-900 dark:text-slate-100">{roomName}</div>
        <div className="mt-2">
            <DatePicker onSelect={(d: Date) => setSelectedDate(d)} />
          </div>
       <div className="flex flex-col items-center gap-2">
                
                      <div className="text-sm text-slate-600 dark:text-slate-300">
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
      <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-700 text-sm">
        <div className="px-2 py-2 text-slate-500 dark:text-slate-400">Time</div>
        {weekDays.map((d, i) => (
          <div key={i} className="px-2 py-2 text-center font-medium">
            <div className="text-slate-900 dark:text-slate-100">{DAYS[i]}</div>
            <div className="text-slate-500 dark:text-slate-400 font-normal">{d.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Grid (scrollable) */}
      <div className="relative max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Time labels */}
          <div className="relative" style={{ height: totalMinutes * pxPerMinute }}>
            {Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i).map((h, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400"
                style={{ top: i * 60 * pxPerMinute }}
              >
                <div className={`ml-1 bg-white dark:bg-gray-900 px-1 w-min rounded text-slate-600 dark:text-slate-300 ${i === 0 ? 'mt-1' : '-mt-2'}`}>{pad2(h)}:00</div>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((d, dayIdx) => (
            <div
              key={dayIdx}
              className="relative bg-white dark:bg-gray-900 border-l border-slate-100 dark:border-slate-800"
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
                  className={`absolute left-0 right-0 cursor-pointer transition-colors border-t border-slate-200 dark:border-slate-800 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 ${
                    (eventsByDay.get(dayIdx) || []).some((ev) => {
                      const hourStart = new Date(d);
                      hourStart.setHours(startHour + i, 0, 0, 0);
                      const hourEnd = new Date(hourStart);
                      hourEnd.setMinutes(hourEnd.getMinutes() + 60);
                      return ev.start < hourEnd && ev.end > hourStart;
                    })
                      ? "bg-orange-50 dark:bg-orange-950/10"
                      : ""
                  }`}
                  style={{ top: i * 60 * pxPerMinute, height: 60 * pxPerMinute }}
                  aria-label={`Hour ${startHour + i}:00`}
                />
              ))}

              {/* Today indicator */}
              {isCurrentWeek && sameDay(d, new Date()) && nowY !== null && (
                <div className="absolute left-0 right-0 h-px bg-orange-500" style={{ top: nowY }} />
              )}

              {/* Events */}
              <div className="absolute inset-0 pointer-events-none">
                {(eventsByDay.get(dayIdx) || []).map((ev) => {
                  const top = Math.max(0, minsSince(ev.start, startHour) * pxPerMinute);
                  const height = Math.max(16, ((+ev.end - +ev.start) / 60000) * pxPerMinute);
                  return (
                    <div
                      key={ev.id}
                      className={`absolute left-1 right-1 rounded-md shadow-sm border text-[10px] text-white p-1 pointer-events-auto ${
                        ev.color || "bg-orange-600"
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

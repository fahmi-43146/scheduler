"use client";

import React, { useMemo } from "react";

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
export default function WeekScheduleDemo() {
  // demo config
  const roomName = "Orion — 3rd Floor";
  const startHour = 8;
  const endHour = 20; // exclusive bottom
  const pxPerMinute = 1; // 1px per minute ⇒ 720px tall if 12h

  const weekStart = useMemo(() => startOfWeekMonday(), []);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // demo events
  const events: EventItem[] = useMemo(() => {
    const d = weekStart;
    return [
      {
        id: "e1",
        title: "Standup",
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 9, 0),
        end:   new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 9, 45),
        color: "bg-blue-600",
      },
      {
        id: "e2",
        title: "Thesis Rehearsal",
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2, 10, 0),
        end:   new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2, 12, 0),
        color: "bg-emerald-600",
      },
      {
        id: "e3",
        title: "Client Call",
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3, 14, 0),
        end:   new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3, 15, 0),
        color: "bg-fuchsia-600",
      },
    ];
  }, [weekStart]);

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
        <div className="text-sm text-gray-600">
          Week of{" "}
          {weekStart.toLocaleDateString(undefined, {
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
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

      {/* Grid */}
      <div className="relative">
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
              {Array.from({ length: endHour - startHour + 1 }, (_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-gray-100"
                  style={{ top: i * 60 * pxPerMinute }}
                />
              ))}

              {/* Today indicator */}
              {isCurrentWeek && sameDay(d, new Date()) && nowY !== null && (
                <div className="absolute left-0 right-0 h-px bg-red-500" style={{ top: nowY }} />
              )}

              {/* Events */}
              <div className="absolute inset-0">
                {(eventsByDay.get(dayIdx) || []).map((ev) => {
                  const top = Math.max(0, minsSince(ev.start, startHour) * pxPerMinute);
                  const height = Math.max(20, ((+ev.end - +ev.start) / 60000) * pxPerMinute);
                  return (
                    <div
                      key={ev.id}
                      className={`absolute left-1 right-1 rounded-md shadow-sm border text-xs text-white p-2 ${
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

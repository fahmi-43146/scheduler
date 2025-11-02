// src/components/EventForm.tsx
"use client";

import { useState } from "react";
import { Calendar, Clock, Palette } from "lucide-react";

export type NewEvent = {
  title: string;
  organizer: string;
  date: string; // yyyy-mm-dd
  start: string; // HH:MM
  end: string; // HH:MM
  color?: string;
};

const COLORS = [
  { value: "bg-blue-600", label: "Blue", icon: "Blue" },
  { value: "bg-emerald-600", label: "Green", icon: "Green" },
  { value: "bg-amber-600", label: "Yellow", icon: "Yellow" },
  { value: "bg-fuchsia-600", label: "Pink", icon: "Pink" },
  { value: "bg-cyan-600", label: "Cyan", icon: "Cyan" },
];

export default function EventForm({
  onSubmit,
  onCancel,
  defaultDate,
  defaultStart,
  defaultEnd,
}: {
  onSubmit: (ev: NewEvent) => void;
  onCancel: () => void;
  defaultDate?: string;
  defaultStart?: string;
  defaultEnd?: string;
}) {
  const [form, setForm] = useState<NewEvent>({
    title: "",
    organizer: "",
    date: defaultDate || new Date().toISOString().slice(0, 10),
    start: defaultStart || "09:00",
    end: defaultEnd || "10:00",
    color: "bg-blue-600",
  });

  const update = <K extends keyof NewEvent>(key: K, value: NewEvent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {/* Title + Organizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="sr-only">Title</span>
            <span>Title</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="Event title"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="sr-only">Organizer</span>
            <span>Organizer</span>
          </label>
          <input
            type="text"
            required
            value={form.organizer}
            onChange={(e) => update("organizer", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="Your name"
          />
        </div>
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="h-4 w-4" />
            Date
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4" />
            Start
          </label>
          <input
            type="time"
            required
            value={form.start}
            onChange={(e) => update("start", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4" />
            End
          </label>
          <input
            type="time"
            required
            value={form.end}
            onChange={(e) => update("end", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Palette className="h-4 w-4" />
          Color
        </label>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update("color", c.value)}
              className={`
                relative h-10 w-full rounded-lg border-2 transition-all
                ${
                  form.color === c.value
                    ? "border-orange-600 ring-2 ring-orange-600 ring-offset-2 ring-offset-background"
                    : "border-border"
                }
                hover:scale-105
              `}
            >
              <div className={`h-full w-full rounded-md ${c.value}`} />
              <span className="sr-only">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Add Event
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";

export type NewEvent = {
  title: string;
  organizer: string;
  date: string; // yyyy-mm-dd
  start: string; // HH:MM
  end: string; // HH:MM
  color?: string;
};

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

  // Typed updater to avoid `any`
  function update<K extends keyof NewEvent>(key: K, value: NewEvent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Strongly-typed field config (no `any`)
  type TimeFieldKey = "date" | "start" | "end";
  const timeFields = [
    { label: "Date", type: "date", key: "date" as const },
    { label: "Start", type: "time", key: "start" as const },
    { label: "End", type: "time", key: "end" as const },
  ] satisfies Array<{
    label: string;
    type: "date" | "time";
    key: TimeFieldKey;
  }>;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 
                       bg-white dark:bg-gray-900 px-2 py-1.5 text-sm
                       focus-visible:ring-2 focus-visible:ring-orange-400 outline-none transition"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Organizer
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 
                       bg-white dark:bg-gray-900 px-2 py-1.5 text-sm
                       focus-visible:ring-2 focus-visible:ring-orange-400 outline-none transition"
            value={form.organizer}
            onChange={(e) => update("organizer", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {timeFields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {f.label}
            </label>
            <input
              type={f.type}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 
                         bg-white dark:bg-gray-900 px-2 py-1.5 text-sm
                         focus-visible:ring-2 focus-visible:ring-orange-400 outline-none transition"
              value={form[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Color
        </label>
        <select
          className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 
                     bg-white dark:bg-gray-900 px-2 py-1.5 text-sm
                     focus-visible:ring-2 focus-visible:ring-orange-400 outline-none transition"
          value={form.color}
          onChange={(e) => update("color", e.target.value)}
        >
          <option value="bg-blue-600">Blue</option>
          <option value="bg-emerald-600">Green</option>
          <option value="bg-amber-600">Amber</option>
          <option value="bg-fuchsia-600">Fuchsia</option>
          <option value="bg-cyan-600">Cyan</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600
                     text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
                     transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 
                     text-white text-sm font-medium transition-colors focus-visible:ring-2 
                     focus-visible:ring-orange-400"
        >
          Add Event
        </button>
      </div>
    </form>
  );
}

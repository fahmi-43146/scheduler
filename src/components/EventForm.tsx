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

  return (
    <form
      className="space-y-3 p-4 rounded-md border border-gray-200 bg-white dark:bg-gray-900"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Title</label>
          <input
            className="mt-1 w-full rounded border border-gray-300 bg-background px-2 py-1"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm">Organizer</label>
          <input
            className="mt-1 w-full rounded border border-gray-300 bg-background px-2 py-1"
            value={form.organizer}
            onChange={(e) => setForm({ ...form, organizer: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-sm">Date</label>
          <input
            type="date"
            className="mt-1 w-full rounded border border-gray-300 bg-background px-2 py-1"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm">Start</label>
          <input
            type="time"
            className="mt-1 w-full rounded border border-gray-300 bg-background px-2 py-1"
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm">End</label>
          <input
            type="time"
            className="mt-1 w-full rounded border border-gray-300 bg-background px-2 py-1"
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <label className="text-sm">Color</label>
        <select
          className="mt-1 w-full rounded border border-gray-300 bg-background px-2 py-1"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        >
          <option value="bg-blue-600">Blue</option>
          <option value="bg-emerald-600">Green</option>
          <option value="bg-amber-600">Amber</option>
          <option value="bg-fuchsia-600">Fuchsia</option>
          <option value="bg-cyan-600">Cyan</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="px-3 py-1 rounded border" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="px-3 py-1 rounded bg-black text-white">
          Add Event
        </button>
      </div>
    </form>
  );
}



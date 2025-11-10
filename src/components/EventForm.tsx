// src/components/EventForm.tsx
"use client";

import { useState } from "react";
import { Calendar, Clock, Palette, GraduationCap } from "lucide-react";

export type NewEvent = {
  title: string;
  date: string;
  start: string;
  end: string;
  color?: string;
  type: "PHD" | "THESIS" | "OTHER";
  typeOtherName?: string;
};

const COLORS = [
  { value: "bg-blue-600", label: "Bleu" },
  { value: "bg-emerald-600", label: "Vert" },
  { value: "bg-amber-600", label: "Jaune" },
  { value: "bg-fuchsia-600", label: "Rose" },
  { value: "bg-cyan-600", label: "Cyan" },
];

const EVENT_TYPES = [
  { value: "PHD", label: "Mastère" },
  { value: "THESIS", label: "Thèse" },
  { value: "OTHER", label: "Autre" },
] as const;

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
    date: defaultDate || new Date().toISOString().slice(0, 10),
    start: defaultStart || "09:00",
    end: defaultEnd || "10:00",
    color: "bg-blue-600",
    type: "PHD",
    typeOtherName: "",
  });

  const update = <K extends keyof NewEvent>(key: K, value: NewEvent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-h-[78vh] overflow-y-auto px-1 sm:px-0">
      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Titre */}
        <div>
          <label className="text-sm font-medium text-foreground">
            Titre de l&#39;événement
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Ex : Soutenance de thèse"
          />
        </div>

        {/* Type d'événement */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            Type d&#39;événement
          </label>
          <div className="mt-1.5 space-y-1.5">
            {EVENT_TYPES.map((t) => (
              <label
                key={t.value}
                className="flex items-center gap-2 cursor-pointer rounded-md border border-border
                           bg-background px-3 py-1.5 text-sm has-[:checked]:border-orange-500
                           has-[:checked]:bg-orange-50/40 dark:has-[:checked]:bg-orange-950/10"
              >
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={form.type === t.value}
                  onChange={(e) => {
                    const val = e.target.value as "PHD" | "THESIS" | "OTHER";
                    update("type", val);
                    if (val !== "OTHER") update("typeOtherName", undefined);
                  }}
                  className="h-3.5 w-3.5 text-orange-600 focus:ring-orange-500"
                  required
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>

          {form.type === "OTHER" && (
            <input
              type="text"
              required
              value={form.typeOtherName || ""}
              onChange={(e) => update("typeOtherName", e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Précisez le type..."
            />
          )}
        </div>

        {/* Date & Heure */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-foreground">
              <Calendar className="h-3 w-3" /> Date
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-foreground">
              <Clock className="h-3 w-3" /> Début
            </label>
            <input
              type="time"
              required
              value={form.start}
              onChange={(e) => update("start", e.target.value)}
              className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-foreground">
              <Clock className="h-3 w-3" /> Fin
            </label>
            <input
              type="time"
              required
              value={form.end}
              onChange={(e) => update("end", e.target.value)}
              className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </div>
        </div>

        {/* Couleur */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Palette className="h-3.5 w-3.5" />
            Couleur
          </label>
          <div className="mt-1.5 grid grid-cols-5 gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => update("color", c.value)}
                className={`relative h-8 w-full rounded-md border-2 transition-all
                  ${
                    form.color === c.value
                      ? "border-orange-600 ring-2 ring-orange-600 ring-offset-1 ring-offset-background"
                      : "border-border"
                  } hover:scale-105`}
              >
                <div className={`h-full w-full rounded-[4px] ${c.value}`} />
                <span className="sr-only">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Boutons */}
        <div className="sticky bottom-0 -mx-1 bg-[var(--card)] px-1 pt-2 pb-3 shadow-[0_-8px_16px_-12px_rgba(0,0,0,0.3)]">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium"
            >
              Ajouter l&#39;événement
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// app/calendar/page.tsx
import type { Metadata } from "next";
// app/calendar/page.tsx
import CalendarClient from "@/components/ClendarClient";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Browse rooms and schedule events",
};

export default function CalendarPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-8">
      {/* Scheduler only (clean card) */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="p-4 md:p-6">
          <CalendarClient />
        </div>
      </section>
    </main>
  );
}

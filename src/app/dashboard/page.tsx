import { getCurrentUser } from "@/lib/auth";

export default async function Dashboard() {
  const me = await getCurrentUser();

  const role = me?.role ?? "USER";
  const status = me?.status ?? "PENDING";
  const canCreate = status === "APPROVED" || role === "ADMIN";

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-10">
      {/* Hero / Welcome */}
      <section className="relative overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-sm">
        {/* subtle pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-15 [background:radial-gradient(circle_at_20%_20%,white_2px,transparent_2px)_0_0/24px_24px]" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Welcome{me?.name ? `, ${me.name}` : ""}
              </h1>
              <p className="mt-2 text-white/90">
                Manage rooms, schedule events, and keep your calendar organized.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                  Role: {role}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    canCreate
                      ? "bg-emerald-500/20 text-emerald-50"
                      : "bg-amber-500/20 text-amber-50"
                  }`}
                >
                  Status: {status}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/calendar"
                className="inline-flex items-center rounded-xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60 outline-none"
              >
                Open Calendar
              </a>
              <a
                href={canCreate ? "/calendar#new" : "/settings"}
                className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 outline-none ${
                  canCreate
                    ? "bg-white text-orange-700 hover:opacity-90 focus-visible:ring-white/60"
                    : "bg-black/20 text-white/90 hover:bg-black/30 focus-visible:ring-white/40"
                }`}
                title={canCreate ? "Create an event" : "Pending approval"}
              >
                {canCreate ? "Create Event" : "Pending Approval"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "This Week’s Events", value: "—" },
          { label: "Active Rooms", value: "—" },
          { label: "Pending Requests", value: "—" },
          { label: "Your Role", value: role },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 p-4 shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {s.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {s.value}
            </div>
          </div>
        ))}
      </section>

      {/* Two-column content */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
              Upcoming Events
            </h2>
            <a
              href="/calendar"
              className="text-sm font-medium text-orange-700 dark:text-orange-400 hover:underline underline-offset-4"
            >
              View calendar
            </a>
          </div>
          <div className="p-4">
            {/* Empty state (no data fetch here) */}
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                No events to show here yet.
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Create an event from the calendar view.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <a
              href="/settings"
              className="group inline-flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm transition hover:bg-slate-50 dark:hover:bg-gray-800"
            >
              <span className="text-slate-700 dark:text-slate-200">
                Account Settings
              </span>
              <span className="text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                →
              </span>
            </a>
            <a
              href="/rooms"
              className="group inline-flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm transition hover:bg-slate-50 dark:hover:bg-gray-800"
            >
              <span className="text-slate-700 dark:text-slate-200">
                Manage Rooms
              </span>
              <span className="text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                →
              </span>
            </a>
            <a
              href="/calendar"
              className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold transition ${
                canCreate
                  ? "bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-2 focus-visible:ring-orange-400 outline-none"
                  : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400 cursor-not-allowed"
              }`}
            >
              New Event
            </a>

            {/* Status Notice */}
            {!canCreate ? (
              <div className="mt-2 rounded-lg border border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 px-3 py-2 text-xs">
                Your account is pending approval. You can browse but cant create
                events yet.
              </div>
            ) : (
              <div className="mt-2 rounded-lg border border-emerald-400/40 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 px-3 py-2 text-xs">
                You can create events.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

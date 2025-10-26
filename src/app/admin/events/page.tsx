import { headers, cookies } from "next/headers";
import { toast } from "sonner"; // SSR-safe usage not needed; we'll use client for toasts
import EventsPageClient, { type AdminEventRow } from "./EventsPageClient";

export const dynamic = "force-dynamic";

type EventsResponse = { events: AdminEventRow[] };

export default async function AdminEventsPage() {
  const h = await headers();
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const host = h.get("host");
  const url = `${proto}://${host}/api/admin/events`;

  const c = await cookies();
  const cookieHeader = c
    .getAll()
    .map((ck) => `${ck.name}=${encodeURIComponent(ck.value)}`)
    .join("; ");

  let events: AdminEventRow[] = [];
  let error: string | null = null;

  const res = await fetch(url, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (!res.ok) {
    try {
      const data = (await res.json()) as { error?: string };
      error = data?.error ?? "Failed to load events";
    } catch {
      error = "Failed to load events";
    }
  } else {
    const data = (await res.json()) as EventsResponse;
    events = data.events;
  }

  return <EventsPageClient events={events} error={error} />;
}

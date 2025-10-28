// src/hooks/useWeekEvents.ts
"use client";

import { useEffect, useState, useCallback } from "react";

export type EventDto = {
  id: string;
  title: string;
  description?: string | null;
  color?: string | null;
  startTime: string; // ISO
  endTime: string; // ISO
  roomId: string;
  status: "ACTIVE" | "CANCELLED";


};

export type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  status: "ACTIVE" | "CANCELLED";


};

export function useWeekEvents(opts: {
  roomId?: string;
  weekStart: Date;
  weekEnd: Date;
}) {
  const { roomId, weekStart, weekEnd } = opts;
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!roomId) {
      setEvents([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/events", window.location.origin);
      url.searchParams.set("roomId", roomId);
      url.searchParams.set("from", weekStart.toISOString());
      url.searchParams.set("to", weekEnd.toISOString());

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data: EventDto[] = (await res.json()).events;

      setEvents(
        data.map((e) => ({
          id: e.id,
          title: e.title,
          color: e.color ?? undefined,
          status: e.status,
          start: new Date(e.startTime),
          end: new Date(e.endTime),
        }))
      );
    }catch (e: unknown) {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("Failed to load events");
  }
  setEvents([]);
} finally {
  setLoading(false);
}


  }, [roomId, weekStart, weekEnd]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents, setEvents };
}

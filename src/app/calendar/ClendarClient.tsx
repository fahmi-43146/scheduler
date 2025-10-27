"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
// (Rooms import not needed for logic anymore, but leaving your other logic intact)
//import Rooms from "@/components/Rooms";
import Scheduler from "@/components/Scheduler";
import EventForm, { NewEvent } from "@/components/EventForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWeekEvents } from "@/hooks/useWeekEvents";

type RoomDto = { id: string; name: string; icon?: string | null };

// tiny helper
const addDays = (d: Date, days: number) => {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
};

export default function CalendarClient() {
  const [mounted, setMounted] = useState(false);

  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
  const selectedRoomName = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId)?.name,
    [rooms, selectedRoomId]
  );

  // visible week range, controlled by Scheduler on navigation
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [weekEnd, setWeekEnd] = useState<Date>(addDays(new Date(), 7));

  // modal + defaults for quick create
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<{
    date?: string;
    start?: string;
    end?: string;
  }>({});

  // events for (room, week)
  const { events, loading, error, setEvents } = useWeekEvents({
    roomId: selectedRoomId,
    weekStart,
    weekEnd,
  });

  useEffect(() => setMounted(true), []);

  // load rooms
  useEffect(() => {
    if (!mounted) return;
    (async () => {
      const res = await fetch("/api/rooms", { cache: "no-store" });
      if (!res.ok) return;
      const data: RoomDto[] = await res.json();
      setRooms(data);
      const preferred = data.find((r) => r.name === "Mathematics") ?? data[0];
      setSelectedRoomId(preferred?.id);
    })();
  }, [mounted]);

  const handleWeekChange = useCallback((ws: Date, we: Date) => {
    setWeekStart((prev) =>
      prev && prev.getTime() === ws.getTime() ? prev : ws
    );
    setWeekEnd((prev) => (prev && prev.getTime() === we.getTime() ? prev : we));
  }, []);

  async function handleCreateEvent(e: NewEvent) {
    if (!selectedRoomId) return;

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: selectedRoomId,
        title: e.title,
        description: e.organizer ? `Organizer: ${e.organizer}` : undefined,
        color: e.color,
        date: e.date, // YYYY-MM-DD
        start: e.start, // HH:mm
        end: e.end, // HH:mm
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      if (res.status === 401) {
        toast("You must sign in to create events", {
          description: "Please sign in and try again.",
          duration: 6000,
          action: {
            label: "Sign in",
            onClick: () => {
              window.location.href = "/signin";
            },
          },
        });
      } else {
        toast("Failed to create event", {
          description: errorText,
          duration: 6000,
        });
      }
      return;
    }

    const created = await res.json();
    setEvents((prev) => [
      ...prev,
      {
        id: created.id,
        title: created.title,
        color: created.color ?? undefined,
        start: new Date(created.startTime),
        end: new Date(created.endTime),
      },
    ]);
    setIsDialogOpen(false);
  }

  if (!mounted) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  /* ===== CSS-only fixes below =====
     - Remove the 4-column grid (no sidebar),
     - Make the scheduler card full-width,
     - Tighten spacing, unify radius/border/shadow,
     - Add a gentle page-height for nicer feel. */
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label
            htmlFor="room"
            className="text-sm text-slate-600 dark:text-slate-300"
          >
            Room
          </label>
          <select
            id="room"
            className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm
                       text-slate-700 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-orange-400 outline-none"
            value={selectedRoomId || ""}
            onChange={(e) => setSelectedRoomId(e.target.value)}
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white focus-visible:ring-2 focus-visible:ring-orange-400"
              disabled={!selectedRoomId}
            >
              Add event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event for {selectedRoomName || "the selected room"}
                .
              </DialogDescription>
            </DialogHeader>
            <EventForm
              onSubmit={handleCreateEvent}
              onCancel={() => {}}
              defaultDate={formDefaults.date}
              defaultStart={formDefaults.start}
              defaultEnd={formDefaults.end}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Line */}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm text-slate-500">Loading events…</div>}

      {/* Scheduler Card (full width) */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-sm min-h-[60vh]">
        <Scheduler
          selectedRoomName={selectedRoomName}
          events={events}
          onSlotClick={(isoDate: string, hour: number) => {
            const start = `${String(hour).padStart(2, "0")}:00`;
            const end = `${String(hour + 1).padStart(2, "0")}:00`;
            setFormDefaults({ date: isoDate, start, end });
            setIsDialogOpen(true);
          }}
          onWeekChange={handleWeekChange}
        />
      </section>
    </div>
  );
}

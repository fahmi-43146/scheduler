// src/components/HomeClient.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import RoomsBar from "@/components/RoomsBar";
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
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useWeekEvents } from "@/hooks/useWeekEvents";

function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

type RoomDto = { id: string; name: string; icon?: string | null };

export default function HomeClient({ isAdmin = false }: { isAdmin?: boolean }) {
  const [mounted, setMounted] = useState(false);

  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(
    undefined
  );

  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [weekEnd, setWeekEnd] = useState<Date>(addDays(new Date(), 7));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<{
    date?: string;
    start?: string;
    end?: string;
  }>({});

  const { events, loading, error, setEvents } = useWeekEvents({
    roomId: selectedRoomId,
    weekStart,
    weekEnd,
  });

  useEffect(() => setMounted(true), []);

  // Load rooms and preselect a room
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

  const selectedRoomName = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId)?.name,
    [rooms, selectedRoomId]
  );

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
        date: e.date,
        start: e.start,
        end: e.end,
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
            onClick: () => (window.location.href = "/signin"),
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
        status: "ACTIVE" as const,
      },
    ]);

    setIsDialogOpen(false);
  }

  // Optimistic updater for admin actions in Scheduler
  const updateEvents = (fn: (draft: typeof events) => void) => {
    setEvents((prev) => {
      const copy = prev.map((e) => ({ ...e })); // shallow clone
      fn(copy);
      return copy;
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-background">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 md:py-4 flex flex-col gap-3">
        {/* Sticky, blurred, auto-elevating Rooms bar with tiny desktop button */}
        <RoomsBar
          rooms={rooms.map((r) => ({ name: r.name, icon: r.icon ?? null }))}
          selectedRoomName={selectedRoomName}
          onSelect={(name) => {
            const r = rooms.find((x) => x.name === name);
            setSelectedRoomId(r?.id);
          }}
          sticky
          trailing={
            <div className="hidden md:block">
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20"
                onClick={() => setIsDialogOpen(true)}
                disabled={!selectedRoomId}
                aria-label="Add event"
                title="Add event"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          }
        />

        {/* Status line */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading && (
          <div className="text-sm text-slate-500">Loading events…</div>
        )}

        {/* Scheduler area (give it lots of height) */}
        <div className="flex-1 h-[calc(100vh-150px)] md:h-[calc(100vh-190px)]">
          <Scheduler
            selectedRoomName={selectedRoomName}
            events={events}
            isAdmin={isAdmin}
            updateEvents={updateEvents}
            hourHeight={64} // taller hour rows; tweak to 56/60/72 as you like
            onSlotClick={(isoDate: string, hour: number) => {
              const start = `${String(hour).padStart(2, "0")}:00`;
              const end = `${String(hour + 1).padStart(2, "0")}:00`;
              setFormDefaults({ date: isoDate, start, end });
              setIsDialogOpen(true);
            }}
            onWeekChange={handleWeekChange}
          />
        </div>
      </div>

      {/* Floating Add (+) FAB on mobile */}
      <div className="md:hidden fixed right-4 bottom-20 sm:bottom-24 z-40">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30"
          onClick={() => setIsDialogOpen(true)}
          disabled={!selectedRoomId}
          aria-label="Add event"
          title="Add event"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Single dialog instance shared by both buttons */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event for {selectedRoomName || "the selected room"}.
            </DialogDescription>
          </DialogHeader>
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setIsDialogOpen(false)}
            defaultDate={formDefaults.date}
            defaultStart={formDefaults.start}
            defaultEnd={formDefaults.end}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

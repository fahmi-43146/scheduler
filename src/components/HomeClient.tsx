"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Rooms from "@/components/Rooms";
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

function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

type RoomDto = { id: string; name: string; icon?: string | null };

export default function HomeClient() {
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
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-8 flex flex-col md:flex-row gap-6">
        {/* Rooms column */}
        <aside className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:w-64 md:shrink-0">
          <h2 className="text-heading-3 mb-3 text-slate-900 dark:text-slate-100">
            Rooms
          </h2>
          <div className="flex flex-col">
            <Rooms
              selectedRoomName={selectedRoomName}
              onSelect={(name) => {
                const r = rooms.find((x) => x.name === name);
                setSelectedRoomId(r?.id);
              }}
            />
          </div>
        </aside>

        {/* Scheduler column */}
        <main className="flex-1 h-[82vh] bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="mb-3 flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 focus-visible:ring-2 focus-visible:ring-orange-300 text-white transition-colors"
                  disabled={!selectedRoomId}
                >
                  Add event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for{" "}
                    {selectedRoomName || "the selected room"}.
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

          {/* status line */}
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          {loading && (
            <div className="text-sm text-slate-500 mb-2">Loading events…</div>
          )}

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
        </main>
      </div>
    </div>
  );
}

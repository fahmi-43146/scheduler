"use client";

import { useState } from "react";
import Rooms from "@/components/Rooms";
import Scheduler from "@/components/Scheduler";
import EventForm, { NewEvent } from "@/components/EventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
};

export default function HomeClient() {
  const [selectedRoomName, setSelectedRoomName] = useState<string | undefined>(
    "Mathematics"
  );
  const [formDefaults, setFormDefaults] = useState<{
    date?: string;
    start?: string;
    end?: string;
  }>({});
  const [eventsByRoom, setEventsByRoom] = useState<Record<string, EventItem[]>>(
    {}
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const events: EventItem[] = selectedRoomName
    ? eventsByRoom[selectedRoomName] || []
    : [];

  function handleCreateEvent(e: NewEvent) {
    if (!selectedRoomName) return;
    const start = new Date(`${e.date}T${e.start}:00`);
    const end = new Date(`${e.date}T${e.end}:00`);
    const newItem: EventItem = {
      id: Math.random().toString(36).slice(2),
      title: e.title,
      organizer: e.organizer,
      start,
      end,
      color: e.color,
    } as any;
    setEventsByRoom((prev) => ({
      ...prev,
      [selectedRoomName]: [...(prev[selectedRoomName] || []), newItem],
    }));
    setIsDialogOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6">
      <div className="bg-white dark:bg-gray-900 p-4 md:flex-1">
        <h2 className="text-heading-2 mb-4 text-center text-orange-600 dark:text-slate-100">
          Rooms
        </h2>
        <div className="flex flex-row items-center justify-center  md:flex-col md:items-start">
          <Rooms
            selectedRoomName={selectedRoomName}
            onSelect={(name) => {
              setSelectedRoomName(name);
            }}
          />
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 text-center md:flex-[5]">
        {/*<h2 className="text-heading-2 mb-4 text-slate-900 dark:text-slate-100">Scheduler</h2>*/}
        <div className="mb-3 flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 text-white"
                disabled={!selectedRoomName}
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
        <Scheduler
          selectedRoomName={selectedRoomName}
          events={events}
          onSlotClick={(isoDate: string, hour: number) => {
            const start = `${String(hour).padStart(2, "0")}:00`;
            const endHour = hour + 1;
            const end = `${String(endHour).padStart(2, "0")}:00`;
            setFormDefaults({ date: isoDate, start, end });
            setIsDialogOpen(true);
          }}
        />
      </div>
    </div>
  );
}

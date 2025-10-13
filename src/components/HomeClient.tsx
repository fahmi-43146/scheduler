"use client";

import { useState } from "react";
import Rooms from "@/components/Rooms";
import Scheduler from "@/components/Scheduler";
import EventForm, { NewEvent } from "@/components/EventForm";

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
};

export default function HomeClient() {
  const [selectedRoomName, setSelectedRoomName] = useState<string | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [formDefaults, setFormDefaults] = useState<{ date?: string; start?: string; end?: string }>({});
  const [eventsByRoom, setEventsByRoom] = useState<Record<string, EventItem[]>>({});

  const events: EventItem[] = selectedRoomName ? (eventsByRoom[selectedRoomName] || []) : [];

  function handleCreateEvent(e: NewEvent) {
    if (!selectedRoomName) return setShowForm(false);
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
    setShowForm(false);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6">
      <div className="bg-white dark:bg-gray-900 p-4 md:flex-1">
        <h2 className="text-heading-2 mb-4 text-center">Rooms</h2>
        <div className="flex flex-col items-start">
          <Rooms
            selectedRoomName={selectedRoomName}
            onSelect={(name) => {
              setSelectedRoomName(name);
              setShowForm(false);
            }}
          />
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 text-center md:flex-[5]">
        <h2 className="text-heading-2 mb-4">Dr Affef Najjari</h2>
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
            disabled={!selectedRoomName}
            onClick={() => setShowForm(true)}
          >
            Add event
          </button>
        </div>
        {showForm && (
          <div className="mb-4">
            <EventForm
              onSubmit={handleCreateEvent}
              onCancel={() => setShowForm(false)}
              defaultDate={formDefaults.date}
              defaultStart={formDefaults.start}
              defaultEnd={formDefaults.end}
            />
          </div>
        )}
        <Scheduler
          selectedRoomName={selectedRoomName}
          events={events}
          onSlotClick={(isoDate: string, hour: number) => {
            const start = `${String(hour).padStart(2, "0")}:00`;
            const endHour = hour + 1;
            const end = `${String(endHour).padStart(2, "0")}:00`;
            setFormDefaults({ date: isoDate, start, end });
            setShowForm(true);
          }}
        />
      </div>
    </div>
  );
}



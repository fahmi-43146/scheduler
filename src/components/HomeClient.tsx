"use client";

import { useState } from "react";
import Rooms from "@/components/Rooms";
import Scheduler from "@/components/Scheduler";

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
};

export default function HomeClient() {
  const [selectedRoomName, setSelectedRoomName] = useState<string | undefined>(undefined);
  // Future: store events per room here, e.g., const roomIdToEvents: Record<string, EventItem[]> = {...}
  const events: EventItem[] = [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6">
      <div className="bg-white dark:bg-gray-900 p-4 md:flex-1">
        <h2 className="text-heading-2 mb-4 text-center">Rooms</h2>
        <div className="flex flex-col items-start">
          <Rooms
            selectedRoomName={selectedRoomName}
            onSelect={(name) => setSelectedRoomName(name)}
          />
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 text-center md:flex-[5]">
        <h2 className="text-heading-2 mb-4">Scheduler</h2>
        <Scheduler selectedRoomName={selectedRoomName} events={events} />
      </div>
    </div>
  );
}



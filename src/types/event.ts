// src/types/event.ts
import { EventType } from "@prisma/client";

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  status?: "ACTIVE" | "CANCELLED";
  type:  EventType; // ADD
  typeOtherName?: string | null;
  description?: string | null; // ← ADD
  organizerName?: string | null; // ← ADD
};
export default EventItem;
// app/api/events/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const listSchema = z.object({
  roomId: z.string().cuid().optional(),
  roomName: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  status: z.enum(["ACTIVE", "CANCELLED"]).optional(),
});

type EventFindManyArgs = Parameters<typeof prisma.event.findMany>[0];
type EventWhere = NonNullable<EventFindManyArgs>["where"];
type EventOrderBy = NonNullable<EventFindManyArgs>["orderBy"];

export async function GET(req: NextRequest) {
  // const user = await getCurrentUser();
  // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = new URL(req.url).searchParams;
  const input = listSchema.parse({
    roomId: sp.get("roomId") ?? undefined,
    roomName: sp.get("roomName") ?? undefined,
    from: sp.get("from") ?? undefined,
    to: sp.get("to") ?? undefined,
    status: (sp.get("status") as "ACTIVE" | "CANCELLED" | null) ?? undefined,
  });

  const where: EventWhere = {
    status: input.status,
    roomId: input.roomId,
    room: input.roomName ? { name: input.roomName } : undefined,
    startTime: input.from ? { gte: new Date(input.from) } : undefined,
    endTime: input.to ? { lte: new Date(input.to) } : undefined,
  };

  const orderBy: EventOrderBy = { startTime: "asc" };

  const events = await prisma.event.findMany({
    where,
    orderBy,
    select: {
  id: true,
  title: true,
  color: true,         // ✅ Add this line
  status: true,
  startTime: true,
  endTime: true,
  room: { select: { id: true, name: true } },
}

,
  });

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = me.role === "ADMIN";
  const isApproved = me.status === "APPROVED";
  if (!isAdmin && !isApproved) {
    return NextResponse.json({ error: "Account pending approval" }, { status: 403 });
  }

  const { title, description, roomId, startTime, endTime, color } = await req.json();
  
  if (!title || !roomId || !startTime || !endTime) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  
  if (new Date(startTime) >= new Date(endTime)) {
    return NextResponse.json({ error: "Invalid time range" }, { status: 400 });
  }
  
  const event = await prisma.event.create({
    data: {
      title,
      description,
      roomId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color,
      createdById: me.id,
    },
  });

  return NextResponse.json({ event });
}
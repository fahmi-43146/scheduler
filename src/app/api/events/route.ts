// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";
const listSchema = z.object({
  roomId: z.string().cuid().optional(),
  roomName: z.string().min(1).optional(),       // fallback if you only have names in UI
  from: z.string().datetime().optional(),       // ISO
  to: z.string().datetime().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parse = listSchema.safeParse({
    roomId: searchParams.get("roomId") || undefined,
    roomName: searchParams.get("roomName") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  });
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid query", details: parse.error.flatten() }, { status: 400 });
  }
  const { roomId, roomName, from, to } = parse.data;

  // Resolve room by name if no id was provided
  let roomFilter: { id: string } | undefined;
  if (roomId) {
    roomFilter = { id: roomId };
  } else if (roomName) {
    const room = await prisma.room.findUnique({ where: { name: roomName }, select: { id: true } });
    if (!room) return NextResponse.json([], { headers: { "Cache-Control": "no-store" } });
    roomFilter = { id: room.id };
  }

  const where: Prisma.EventWhereInput = {};


  if (roomFilter) where.roomId = roomFilter.id;
  if (from || to) {
    where.startTime = {};
    if (from) where.startTime.gte = new Date(from);
    if (to) where.startTime.lte = new Date(to);
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      color: true,
      startTime: true,
      endTime: true,
      roomId: true,
      createdById: true,
    },
  });

  return NextResponse.json(events, { headers: { "Cache-Control": "no-store" } });
}

const createSchema = z.object({
  roomId: z.string().cuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  color: z.string().max(32).optional(),
  // From your EventForm: date "YYYY-MM-DD", time "HH:mm"
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function POST(req: Request) {
  // Auth (JWT cookie)
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (me.status !== "APPROVED") return NextResponse.json({ error: "Not approved" }, { status: 403 });

  const body = await req.json();
  const parse = createSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid body", details: parse.error.flatten() }, { status: 400 });
  }
  const { roomId, title, description, color, date, start, end } = parse.data;

  // Build timestamps. Choose one strategy and stick to it:
  // (A) UTC storage: `${date}T${start}:00Z` (simple, consistent)
  const startTime = new Date(`${date}T${start}:00Z`);
  const endTime = new Date(`${date}T${end}:00Z`);
  if (!(endTime > startTime)) {
    return NextResponse.json({ error: "End must be after start" }, { status: 400 });
  }

  const created = await prisma.event.create({
    data: {
      title,
      description: description ?? null,
      color: color ?? "#EA580C",
      startTime,
      endTime,
      room: { connect: { id: roomId } },
      createdBy: { connect: { id: me.id } },
    },
    select: {
      id: true, title: true, description: true, color: true,
      startTime: true, endTime: true, roomId: true,
    },
  });

  return NextResponse.json(created, {
    status: 201,
    headers: { "Cache-Control": "no-store" },
  });
}


/*import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = me.role === "ADMIN";
  const isApproved = me.status === "APPROVED";
  if (!isAdmin && !isApproved) {
    return NextResponse.json({ error: "Account pending approval" }, { status: 403 });
  }

  const { title, description, roomId, startTime, endTime, color } = await req.json();
  if (!title || !roomId || !startTime || !endTime)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (new Date(startTime) >= new Date(endTime))
    return NextResponse.json({ error: "Invalid time range" }, { status: 400 });

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







/*import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/events - Get events with optional room filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    
    if (roomId) {
      where.roomId = roomId
    }

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        room: true
      },
      orderBy: { startTime: 'asc' }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, organizer, description, startTime, endTime, color, roomId } = body

    if (!title || !organizer || !startTime || !endTime || !roomId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for overlapping events
    const overlappingEvents = await prisma.event.findMany({
      where: {
        roomId,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } }
            ]
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } }
            ]
          },
          {
            AND: [
              { startTime: { gte: new Date(startTime) } },
              { endTime: { lte: new Date(endTime) } }
            ]
          }
        ]
      }
    })

    if (overlappingEvents.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        organizer,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        color: color || 'bg-orange-600',
        roomId
      },
      include: {
        room: true
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
*/

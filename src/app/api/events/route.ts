import { NextResponse } from "next/server";
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

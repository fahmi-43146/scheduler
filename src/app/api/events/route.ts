// app/api/events/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache"; // ← ADD

const listSchema = z.object({
  roomId: z.string().cuid().optional(),
  roomName: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  status: z.enum(["ACTIVE", "CANCELLED"]).optional(),
});

export async function GET(req: NextRequest) {
  console.log("Incoming query:", Object.fromEntries(new URL(req.url).searchParams.entries()));
  
  try {
    const sp = new URL(req.url).searchParams;
    const result = listSchema.safeParse({
      roomId: sp.get("roomId") ?? undefined,
      roomName: sp.get("roomName") ?? undefined,
      from: sp.get("from") ?? undefined,
      to: sp.get("to") ?? undefined,
      status: (sp.get("status") as "ACTIVE" | "CANCELLED" | null) ?? undefined,
    });

    if (!result.success) {
      console.warn("Invalid params:", result.error.format());
      return NextResponse.json({ events: [] }, { status: 200 });
    }

    const input = result.data;

    const where = {
      status: input.status,
      roomId: input.roomId,
      room: input.roomName ? { name: input.roomName } : undefined,
      startTime: input.from ? { gte: new Date(input.from) } : undefined,
      endTime: input.to ? { lte: new Date(input.to) } : undefined,
    };

    const events = await prisma.event.findMany({
      where,
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        title: true,
        color: true,
        status: true,
        startTime: true,
        endTime: true,
        room: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      { events },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("GET /api/events failed:", err);
    return NextResponse.json({ events: [] }, { status: 200 });
  }
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

  revalidatePath('/api/events'); // ← ADD THIS

  return NextResponse.json({ event });
}
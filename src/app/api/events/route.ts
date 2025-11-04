// app/api/events/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache"; // ← ADD
import { Prisma } from "@prisma/client";

const listSchema = z.object({
  roomId: z.string().min(1).optional(),
  roomName: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  color: z.string().optional(),
  status: z.enum(["ACTIVE", "CANCELLED"]).optional(),
  type: z.enum(["PHD", "THESIS", "OTHER"]).optional(), // ← optional, no default
  typeOtherName: z.string().min(1).optional(),       // ← optional
});
export async function GET(req: NextRequest) {
 
  
  try {
    const sp = new URL(req.url).searchParams;
    const result = listSchema.safeParse({
      roomId: sp.get("roomId") ?? undefined,
      roomName: sp.get("roomName") ?? undefined,
      from: sp.get("from") ?? undefined,
      to: sp.get("to") ?? undefined,
      color: sp.get("color") ?? undefined,// UNUSED but kept for future
      status: (sp.get("status") as "ACTIVE" | "CANCELLED" | null) ?? undefined,// UNUSED but kept for future
      type: (sp.get("type") as "PHD" | "THESIS" | "OTHER" | null) ?? undefined,// NEW
      typeOtherName: sp.get("typeOtherName") ?? undefined,// NEW
    });

    if (!result.success) {
     
      return NextResponse.json({ events: [] }, { status: 200 });
    }

    const input = result.data;
       



   

// ...

const where: Prisma.EventWhereInput = {
  ...(input.status && { status: input.status }),
  ...(input.roomId && { roomId: input.roomId }),
  ...(input.roomName && { room: { name: input.roomName } }),
  ...(input.from && { startTime: { gte: new Date(input.from) } }),
  ...(input.to && { endTime: { lte: new Date(input.to) } }),
  ...(input.color && { color: input.color }),
  ...(input.type && { type: input.type }),
  ...(input.type === "OTHER" && input.typeOtherName && { typeOtherName: input.typeOtherName }),
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
        type: true,                   // NEW
        typeOtherName: true, 
        createdBy: {
      select: {
        id: true,
        name: true,         
        // email: true,     
      },
    },
         
              // NEW  
      },
      
    });
  


    return NextResponse.json(
      { events },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
   
    return NextResponse.json({ events: [] }, { status: 200 });
  }
}






// Define schema outside the handler (for reuse + performance)
const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  roomId: z.string().min(1, "Room ID is required"),
  startTime: z.string().datetime({ message: "Invalid start time" }),
  endTime: z.string().datetime({ message: "Invalid end time" }),
  color: z.string().optional(),
  type: z.enum(["PHD", "THESIS", "OTHER"]).default("PHD"),
  typeOtherName: z.string().min(1).optional(),
}).superRefine((data, ctx) => {
  // 1. typeOtherName required only if type === "OTHER"
  if (data.type === "OTHER" && !data.typeOtherName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["typeOtherName"],
      message: "Description is required for 'Other' event type",
    });
  }

  // 2. endTime must be after startTime
  if (new Date(data.startTime) >= new Date(data.endTime)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endTime"],
      message: "End time must be after start time",
    });
  }
});

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = me.role === "ADMIN";
  const isApproved = me.status === "APPROVED";
  if (!isAdmin && !isApproved) {
    return NextResponse.json({ error: "Account pending approval" }, { status: 403 });
  }
  // 1. Parse JSON safely
  const body = await req.json().catch(() => ({}));




  // 2. Validate with Zod
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  
 
    const { title, description, roomId, startTime, endTime, color,type,typeOtherName } = parsed.data;

  


  const event = await prisma.event.create({
    data: {
      title,
      description ,
      roomId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color,
      createdById: me.id,
      type,                   // NEW
      typeOtherName: type === "OTHER" ? typeOtherName : null,         // NEW
    },
  });



  revalidatePath('/api/events'); // ← ADD THIS

  return NextResponse.json({ event });
}
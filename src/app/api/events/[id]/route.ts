// app/api/events/[id]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { EventStatus, EventType } from "@prisma/client";

// ---------- DELETE /api/events/[id] ----------
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } // Next.js 15: params is a Promise
) {
  try {
    const { id } = await context.params;

    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.event.delete({ where: { id } });

    // 204 is a clean response for delete, but keeping JSON for your UI:
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string; status?: number };
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Internal error" },
      { status: e?.status ?? 500 }
    );
  }
}

// ---------- PATCH /api/events/[id] ----------
const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  color: z.string().max(32).optional(),
  startTime: z.string().datetime().optional(), // RFC3339 datetime
  endTime: z.string().datetime().optional(),
   status: z.nativeEnum(EventStatus).optional(),   // NEW
    type: z.nativeEnum(EventType).optional(),       // NEW
    typeOtherName: z.string().min(1).optional(), // NEW
  
}).superRefine((data, ctx) => {
    if (data.type === "OTHER" && !data.typeOtherName) {
      ctx.addIssue({
        path: ["typeOtherName"],
        code: z.ZodIssueCode.custom,
        message: "typeOtherName is required when type is OTHER",
      });
    }
  });// NEW


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await context.params;

    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, color, startTime, endTime,status,
      type,
      typeOtherName, } = parsed.data;

    const current = await prisma.event.findUnique({
      where: { id },
      select: { startTime: true, endTime: true },
    });
    if (!current) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const newStart = startTime ? new Date(startTime) : current.startTime;
    const newEnd   = endTime   ? new Date(endTime)   : current.endTime;
    if (!(newEnd > newStart)) {
      return NextResponse.json({ error: "End must be after start" }, { status: 400 });
    }

   // after computing newStart/newEnd and validating them...
const updated = await prisma.event.update({
  where: { id },
  data: {
    title: title ?? undefined,
    description: description ?? undefined,
    color: color ?? undefined,

    // use the validated, effective times
    startTime: startTime ? newStart : undefined,
    endTime: endTime ? newEnd : undefined,

    status: status ?? undefined,
    type: type ?? undefined,

    // keep label when OTHER; clear it when switching away; or update if provided alone
    typeOtherName:
      typeof type !== "undefined"
        ? (type === "OTHER" ? (typeOtherName ?? "") : null)
        : (typeof typeOtherName !== "undefined" ? typeOtherName : undefined),
  },
  select: {
    id: true,
    title: true,
    description: true,
    color: true,
    status: true,
    type: true,
    typeOtherName: true,
    startTime: true,
    endTime: true,
    roomId: true,
  },
});


    return NextResponse.json(updated, { headers: { "Cache-Control": "no-store" } });
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string; status?: number };
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Internal error" },
      { status: e?.status ?? 500 }
    );
  }
}

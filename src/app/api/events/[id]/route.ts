// app/api/events/[id]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

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
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Next.js 15: params is a Promise
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

    const { title, description, color, startTime, endTime } = parsed.data;

    if (startTime && endTime) {
      const s = new Date(startTime);
      const e = new Date(endTime);
      if (!(e > s)) {
        return NextResponse.json({ error: "End must be after start" }, { status: 400 });
      }
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        color: color ?? undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
      select: {
        id: true,
        title: true,
        description: true,
        color: true,
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

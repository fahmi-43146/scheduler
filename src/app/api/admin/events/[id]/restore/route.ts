// app/api/admin/events/[id]/restore/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    if (!eventId) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    await requireAdmin();

    const { id } = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: "ACTIVE", // ✅ Prisma v5: use string literal instead of importing EventStatus
        // cancelledAt: null, // <- uncomment if you added this field to your schema
      },
      select: { id: true },
    });

    return NextResponse.json({ success: true, eventId: id });
  } catch (err: unknown) {
    const e = err as { code?: string; status?: number; message?: string };
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: e?.status ?? 500 });
  }
}

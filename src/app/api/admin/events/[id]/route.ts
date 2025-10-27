// app/api/admin/events/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: eventId } = await params;
    if (!eventId) return NextResponse.json({ error: "Missing event id" }, { status: 400 });

    await requireAdmin();

    await prisma.event.delete({ where: { id: eventId } });
    return NextResponse.json({ success: true, eventId });
  } catch (err: unknown) {
    const e = err as { code?: string; status?: number; message?: string };
    if (e?.code === "P2025") return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: e?.status ?? 500 });
  }
}

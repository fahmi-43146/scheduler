// app/api/admin/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const roomId = searchParams.get("roomId") ?? undefined;
    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

    const events = await prisma.event.findMany({
      where: {
        ...(roomId ? { roomId } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { startTime: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        status: true,
        startTime: true,
        endTime: true,
        roomId: true,
        room: { select: { name: true } },
        createdById: true,
        createdBy: { select: { email: true, name: true } },
      },
    });

    return NextResponse.json({ events });
  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ error: e?.message ?? "Unauthorized" }, { status: e?.status ?? 401 });
  }
}

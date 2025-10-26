// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards"; // ← fix path

export const dynamic = "force-dynamic"; // optional, but keeps the list fresh

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: true,
        createdAt: true,
        deletedAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    return NextResponse.json(
      { error: e?.message ?? "Unauthorized" },
      { status: e?.status ?? 401 } // 401 if not signed in, 403 if guard set it
    );
  }
}

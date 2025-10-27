// app/api/admin/users/[id]/restore/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import type { Prisma } from "@prisma/client"; // types only

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const admin = await requireAdmin();

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, deletedAt: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (existing.deletedAt == null) {
      return NextResponse.json({ error: "User is not deleted" }, { status: 409 });
    }

    const resultId = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const u = await tx.user.update({
        where: { id: userId },
        data: { deletedAt: null, status: "APPROVED" },
        select: { id: true },
      });

      await tx.userApproval.create({
        data: {
          userId,
          adminId: admin.id,
          decision: "RESTORE",
          reason: "Restored by admin",
        },
      });

      return u.id; // string
    });

    return NextResponse.json({ success: true, userId: resultId });
  } catch (err: unknown) {
    // Narrow Prisma known error if you want:
    // if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") { ... }
    const e = err as { code?: string; status?: number; message?: string };
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: e?.status ?? 500 });
  }
}

// app/api/admin/users/[id]/restore/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserStatus, ApprovalDecision } from "@prisma/client";
import { requireAdmin } from "@/lib/guards";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params; // Next 15: await params
    if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

    const admin = await requireAdmin();

    const resultId = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: userId },
        data: { deletedAt: null, status: UserStatus.APPROVED },
        select: { id: true },
      });

      await tx.userApproval.create({
        data: {
          userId,
          adminId: admin.id,
          decision: ApprovalDecision.RESTORE,
          reason: "Restored by admin",
        },
      });

      return u.id; // string
    });

    return NextResponse.json({ success: true, userId: resultId });
  } catch (err: unknown) {
    const e = err as { code?: string; status?: number; message?: string };
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Internal error" },
      { status: e?.status ?? 500 }
    );
  }
}

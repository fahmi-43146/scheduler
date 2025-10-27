// app/api/admin/users/[id]/reject/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import type { Prisma } from "@prisma/client"; // <-- types only

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

    const admin = await requireAdmin();
    const body = (await req.json().catch(() => ({}))) as { reason?: string };
    const reason = body?.reason ?? "Rejected by admin";

    const resultId = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const u = await tx.user.update({
        where: { id: userId },
        data: { status: "SUSPENDED" }, // Prisma v5: string literal
        select: { id: true },
      });

      await tx.userApproval.create({
        data: { userId, adminId: admin.id, decision: "REJECT", reason },
      });

      return u.id;
    });

    return NextResponse.json({ success: true, userId: resultId });
  } catch (err: unknown) {
    const e = err as { code?: string; status?: number; message?: string };
    if (e?.code === "P2025") return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: e?.status ?? 500 });
  }
}

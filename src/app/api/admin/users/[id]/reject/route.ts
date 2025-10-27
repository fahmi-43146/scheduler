// app/api/admin/users/[id]/reject/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserStatus, ApprovalDecision } from "@prisma/client";
import { requireAdmin } from "@/lib/guards";
// import { Prisma } from "@prisma/client"; // (optional) if you want typed Prisma error narrowing

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;
    if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

    const admin = await requireAdmin();
    const body = await req.json().catch(() => ({} as { reason?: string }));
    const reason = body?.reason ?? "Rejected by admin";

    const resultId = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: userId },
        data: { status: UserStatus.SUSPENDED },
        select: { id: true },
      });

      await tx.userApproval.create({
        data: { userId, adminId: admin.id, decision: ApprovalDecision.REJECT, reason },
      });

      return u.id; // ← returns a string
    });

    return NextResponse.json({ success: true, userId: resultId });
  } catch (err: unknown) {
    // If you want Prisma-typed narrowing, uncomment import and use this:
    // if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

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

// app/api/admin/users/[id]/soft-delete/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;
  if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const admin = await requireAdmin();

  const [u] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), status: "SUSPENDED" }, // enum literal
      select: { id: true },
    }),
    prisma.userApproval.create({
      data: {
        userId,
        adminId: admin.id,
        decision: "DELETE", // enum literal
        reason: "Soft-deleted by admin",
      },
    }),
  ]);

  return NextResponse.json({ success: true, userId: u.id });
}

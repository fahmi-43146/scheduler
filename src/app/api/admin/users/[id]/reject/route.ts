// app/api/admin/users/[id]/reject/route.ts
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;
  if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const admin = await requireAdmin();
  const body = (await req.json().catch(() => ({}))) as { reason?: string };
  const reason = body?.reason ?? "Rejected by admin";

  const [u] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { status: "SUSPENDED" }, // enum literal
      select: { id: true },
    }),
    prisma.userApproval.create({
      data: { userId, adminId: admin.id, decision: "REJECT", reason }, // enum literal
    }),
  ]);

  return NextResponse.json({ success: true, userId: u.id });
}

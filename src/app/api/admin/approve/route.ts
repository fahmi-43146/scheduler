import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, reason } = await req.json();

  const [, approval] = await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { status: "APPROVED" } }),
    prisma.userApproval.create({
      data: { userId, adminId: admin.id, decision: "APPROVE", reason },
    }),
  ]);

  return NextResponse.json({ ok: true, approval });
}

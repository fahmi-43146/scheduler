/*import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { approved: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json({ error: 'Failed to approve user' }, { status: 500 })
  }
}*/
export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;           // ← await params (your pattern)
    if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

    const admin = await requireAdmin();            // ← unified admin check

    const { id } = await prisma.user.update({
      where: { id: userId },
      data: { status: "APPROVED", deletedAt: null },
      select: { id: true },
    });

    // If you DO have an audit table, keep this block; otherwise delete it.
     await prisma.userApproval.create({
      data: { userId, adminId: admin.id, decision: "APPROVE", reason: "Approved by admin" },
    });

    return NextResponse.json({ success: true, userId: id });
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

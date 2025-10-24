// app/api/admin/users/[id]/soft-delete/route.ts
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { TokenPayload } from "@/types/tokenPayload";

export async function POST(_: NextRequest,context: { params: { id: string }}) {
  try {
    const {id :userId} = await context.params;
    const adminId = await getAdminId();
    

    const result = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: userId },
        data: { deletedAt: new Date(), status: "SUSPENDED" }
      });
      await tx.userApproval.create({
        data: {
          userId,
          adminId,
          decision: "DELETE",
          reason: "Soft-deleted by admin"
        }
      });
      return u.id;
    });

    return NextResponse.json({ success: true, userId: result });
  } catch (error) {
    const message = (error as Error).message;
    const status =
      message.includes("Missing") ? 401 :
      message.includes("Invalid") ? 403 :
      message.includes("Forbidden") ? 403 :
      500;

    return NextResponse.json({ error: message }, { status });
  }
}

async function getAdminId(): Promise<string> {
  const cookieStore = await cookies();
  const cookieName = process.env.COOKIE_NAME ?? '';
  const token = cookieStore.get(cookieName)?.value;

  if (!token) throw new Error("Missing or invalid token");

  const payload = await verifyToken(token) as TokenPayload | null;
  if (!payload) throw new Error("Invalid token payload");

  if (payload.role !== "ADMIN") throw new Error("Forbidden: Admins only");

  return payload.userId;
}
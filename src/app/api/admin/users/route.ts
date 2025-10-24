/*import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, approved: true, role: true, createdAt: true }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error listing users:', error)
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
  }
}
*/

// app/api/admin/users/route.ts
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as "PENDING"|"APPROVED"|"SUSPENDED"|null;
  const includeDeleted = searchParams.get("includeDeleted") === "1";

  const users = await prisma.user.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    select: { id: true, email: true, name: true, status: true, role: true, createdAt: true, deletedAt: true },
    orderBy: [{ deletedAt: "asc" }, { createdAt: "asc" }],
  });
  users.forEach(user => console.log(user.role));
  console.log(users);
  return NextResponse.json({ users });
}



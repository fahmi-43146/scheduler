// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { setTokenCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name, 
      passwordHash,
      status: "PENDING",
      role: "USER",
    },
  });

  const token = await signToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({ success: true });
  setTokenCookie(res, token); // auto-signin after signup
  return res;
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { setTokenCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({ success: true });
  setTokenCookie(res, token);
  return res;
}





/*import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { setTokenCookie } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // signup example
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const passwordHash = await hash(password, 12);
    user = await prisma.user.create({
      data: { email, passwordHash, status: 'PENDING', role: 'USER' },
    });
  } else {
    // signin path
    const ok = await compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({ success: true });
  setTokenCookie(res, token);
  return res;
}*/

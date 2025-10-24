import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: process.env.COOKIE_NAME!,
    value: '',
    path: '/',
    maxAge: 0,
  });
  return res;
}

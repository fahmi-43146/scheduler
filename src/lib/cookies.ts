//src\lib\cookies.ts
import { NextResponse } from 'next/server';

export function setTokenCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: process.env.COOKIE_NAME!,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 *7, 
  });
}

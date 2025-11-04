// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const isAdminArea = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminArea) return NextResponse.next();

  const token = req.cookies.get(process.env.COOKIE_NAME!)?.value;
  if (!token) return NextResponse.redirect(new URL("/signin", req.url));

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
   
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/signup", req.url));
  }
  
}

export const config = { matcher: ["/admin/:path*"] };

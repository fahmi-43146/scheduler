import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const COOKIE_Name = "session";
const JWT_SECRET = process.env.JWT_SECRET!;

// 🔐 Create a signed JWT token for user sessions
export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// 🍪 Attach the JWT token to a secure session cookie
export function setSessionCookie(res: Response, token: string) {
  // You'll use NextResponse in routes to set cookies; just exporting the name
}

// 🕵️‍♂️ Read the session cookie, verify the token, and fetch the logged-in user
export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_Name)?.value;
  if (!token) return null;
  try {
    const { sub } = jwt.verify(token, JWT_SECRET) as { sub: string };
    return  await prisma.user.findUnique({
      where: { id: sub },
      select: { id: true, email: true, name: true, role: true, status: true },
    });
  } catch  {
    return null;
  }
}

// 🧁 Configuration for secure session cookie behavior
export const SESSION_COOKIE = {
  name: COOKIE_Name,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  },
};
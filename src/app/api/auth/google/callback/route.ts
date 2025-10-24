// app/api/auth/google/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { setTokenCookie } from "@/lib/cookies";

function form(body: Record<string, string>) {
  return new URLSearchParams(body).toString();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies(); // Next 15: await

  const savedState = jar.get("g_state")?.value;
  const verifier = jar.get("g_code_verifier")?.value;

  if (!code || !state || !savedState || !verifier || state !== savedState) {
    return NextResponse.redirect("/auth/error?reason=oauth_state");
  }

  // one-time cookies — clean up
  jar.delete("g_state");
  jar.delete("g_code_verifier");

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const appBase = process.env.APP_BASE_URL!;
  const redirectUri = `${appBase}/api/auth/google/callback`;

  // 1) exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  });
  if (!tokenRes.ok) return NextResponse.redirect("/auth/error?reason=token_exchange");
  const tokens = await tokenRes.json();

  // 2) get profile
  const meRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!meRes.ok) return NextResponse.redirect("/auth/error?reason=userinfo");
  const profile = await meRes.json() as { email?: string; name?: string; id?: string; verified_email?: boolean };

  const email = (profile.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.redirect("/auth/error?reason=no_email");

  // 3) upsert user in your schema
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: profile.name ?? undefined },
    create: { email, name: profile.name ?? null },
    select: { id: true, email: true, name: true },
  });

  // 4) issue your SAME JWT payload + cookie
  const jwt = await signToken({ userId: user.id, email: user.email, provider: "google" });
  const res = NextResponse.redirect(new URL("/", req.url));
  setTokenCookie(res, jwt); // reuses your helper
  return res;
}

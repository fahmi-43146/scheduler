// app/api/auth/google/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/* base64url helper     
 🔐 randomString(len)
Generates a random string using secure random bytes,
 encoded in base64url format.*/

function b64url(bytes: ArrayBuffer | Uint8Array) {
  return Buffer.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
    .toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/**
 * 🔐 sha256(input)
Hashes the input using SHA-256 and encodes it in base64url.
 This is used to create a code challenge from a code verifier

 */
async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return b64url(digest);
}
function randomString(len = 64) {
  return b64url(crypto.getRandomValues(new Uint8Array(len)));
}

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const appBase = process.env.APP_BASE_URL!;
  const redirectUri = `${appBase}/api/auth/google/callback`;

  const state = randomString(32);
  const codeVerifier = randomString(64);
  const codeChallenge = await sha256(codeVerifier);

  const jar = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };
  jar.set("g_state", state, opts);
  jar.set("g_code_verifier", codeVerifier, opts);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    // access_type: "offline", // include if you want refresh_token
    // prompt: "consent",      // force consent each time (optional)
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

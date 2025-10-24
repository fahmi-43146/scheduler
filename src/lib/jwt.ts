//src\lib\jwt.ts

import { SignJWT, jwtVerify } from 'jose';

// ✅ Encode secret once and reuse it
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * Signs a JWT with the given payload and expiration.
 * @param payload - The data to include in the token.
 * @param expiresIn - Expiration time (e.g., '1h', '3600s'). Defaults to env value.
 * @returns A signed JWT string.
 */
export async function signToken(
  payload: Record<string, unknown>,
  expiresIn: string = process.env.JWT_EXPIRES_IN || '1h' // ✅ Default fallback
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn) // ✅ Accepts string or timestamp
    .sign(secret);
}

/**
 * Verifies a JWT and returns its payload.
 * @param token - The JWT string to verify.
 * @returns The decoded payload, or null if invalid.
 */
export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error); // ✅ Clear error logging
    return null; // ✅ Graceful fallback
  }
}
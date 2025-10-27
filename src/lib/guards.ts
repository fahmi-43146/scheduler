import { getCurrentUser } from "./auth";

type GuardError = Error & { status?: number };
const httpErr = (msg: string, status: number) => Object.assign(new Error(msg), { status }) as GuardError;

export async function requireAdmin() {
  const user = await getCurrentUser();         // uses await cookies() and verifyToken()
  if (!user) throw httpErr("Not authenticated", 401);
  if (user.role !== "ADMIN") throw httpErr("Forbidden: Admins only", 403);
  return user;                                  // { id, email, role, status, ... }
}

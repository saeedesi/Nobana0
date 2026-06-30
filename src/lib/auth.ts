// Node-runtime auth helpers (password hashing + cookie access).
// Do NOT import this from middleware — use auth-edge.ts there instead.
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, signSession, verifySession, type SessionPayload } from "./auth-edge";

export { SESSION_COOKIE, signSession, verifySession };
export type { SessionPayload };

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Write the session cookie (call from a Route Handler / Server Action).
export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// Read & verify the current admin session (Server Components / Route Handlers).
export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

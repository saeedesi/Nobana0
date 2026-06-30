// Edge-safe auth helpers (no Node-only deps) — usable from middleware.
// Only `jose` is used here so it runs in the Edge runtime.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "nobana_session";
const ISSUER = "nobana";
const AUDIENCE = "nobana-admin";

export interface SessionPayload {
  sub: string; // admin id
  email: string;
  role: "admin";
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET is missing or too short (set it in .env)");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (payload.role !== "admin" || typeof payload.sub !== "string") return null;
    return { sub: payload.sub, email: String(payload.email ?? ""), role: "admin" };
  } catch {
    return null;
  }
}

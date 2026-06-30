import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return Response.json({ ok: false, error: "VALIDATION" }, { status: 422 });
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  // Always run a comparison to reduce timing differences between
  // "no such user" and "wrong password".
  const hash = admin?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const valid = await verifyPassword(password, hash);

  if (!admin || !valid) {
    return Response.json({ ok: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const token = await signSession({ sub: String(admin.id), email: admin.email, role: "admin" });
  await setSessionCookie(token);

  return Response.json({ ok: true });
}

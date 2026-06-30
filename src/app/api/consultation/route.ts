import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Basic Iranian mobile check (09xxxxxxxxx) — kept lenient.
function normalizePhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.length < 8) return null;
  return digits;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phoneRaw = String(body.phone ?? "").trim();
  const phone = normalizePhone(phoneRaw);

  if (name.length < 2 || !phone) {
    return Response.json({ ok: false, error: "VALIDATION" }, { status: 422 });
  }

  const areaNum = Number(body.area);
  const area = Number.isFinite(areaNum) && areaNum > 0 ? Math.round(areaNum) : null;

  try {
    await prisma.consultationRequest.create({
      data: {
        name,
        phone,
        email: body.email ? String(body.email).trim() : null,
        projectType: body.projectType ? String(body.projectType).trim() : null,
        city: body.city ? String(body.city).trim() : null,
        area,
        description: body.description ? String(body.description).trim() : null,
      },
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("consultation create failed", err);
    return Response.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}

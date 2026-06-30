import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = { title: "داشبورد مدیریت | نوبنا" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getStats() {
  const [projects, newLeads, clients] = await Promise.all([
    prisma.project.count(),
    prisma.consultationRequest.count({ where: { status: "NEW" } }),
    prisma.client.count({ where: { isActive: true } }),
  ]);
  return { projects, newLeads, clients };
}

export default async function AdminDashboard() {
  const session = await getAdminSession();
  const stats = await getStats();

  const cards = [
    { label: "پروژه‌ها", value: stats.projects, href: "/admin/projects" },
    { label: "درخواست‌های جدید", value: stats.newLeads, href: "/admin/consultations" },
    { label: "کارفرمایان فعال", value: stats.clients, href: "/admin/clients" },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-[#0a0a0a] text-white px-6 md:px-10 py-10">
      <div className="max-w-[1100px] mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm tracking-[0.3em] text-primary mb-1 font-light">پنل مدیریت</p>
            <h1 className="text-2xl md:text-3xl font-light">داشبورد</h1>
            {session?.email && (
              <p className="text-white/50 text-sm mt-1" dir="ltr">{session.email}</p>
            )}
          </div>
          <LogoutButton />
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {cards.map((c) => (
            <div
              key={c.label}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <p className="text-white/60 text-sm mb-3">{c.label}</p>
              <p className="text-4xl md:text-5xl font-light text-primary tabular-nums">
                {c.value.toLocaleString("fa-IR")}
              </p>
            </div>
          ))}
        </section>

        <p className="text-white/40 text-sm mt-12">
          مدیریت پروژه‌ها، درخواست‌ها و کارفرمایان در گام‌های بعدی اضافه می‌شود.
        </p>
      </div>
    </main>
  );
}

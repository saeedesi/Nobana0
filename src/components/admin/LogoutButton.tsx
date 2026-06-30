"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
    >
      <LogOut className="w-4 h-4" />
      خروج
    </button>
  );
}

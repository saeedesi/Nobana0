import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "پنل کارفرمایان | نوبنا",
  description: "پنل اختصاصی کارفرمایان نوبنا برای پیگیری شفاف پروژه — به‌زودی.",
};

export default function PanelComingSoon() {
  return (
    <main
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6 text-center"
    >
      <h2 className="text-sm tracking-[0.3em] text-primary mb-4 font-light">پنل کارفرمایان</h2>
      <h1 className="text-3xl md:text-5xl font-light mb-6">
        به‌زودی
      </h1>
      <p className="text-white/60 max-w-md leading-relaxed mb-10">
        پنل اختصاصی کارفرمایان برای پیگیری شفاف و لحظه‌ای پروژه در حال آماده‌سازی است.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-3 border border-primary/50 rounded-lg hover:bg-primary hover:text-black transition-colors text-sm tracking-wide"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به صفحه اصلی
      </Link>
    </main>
  );
}

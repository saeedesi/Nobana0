"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

// Always-visible primary CTA so the main conversion action is reachable from
// anywhere on the page (the hero CTA only appears at the end of its scroll).
export default function FloatingConsultCTA() {
  return (
    <Link
      href="#consultation"
      aria-label="درخواست مشاوره"
      className="fixed bottom-8 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full border border-primary/50 bg-black/60 backdrop-blur-md text-white text-sm hover:bg-primary hover:text-black transition-colors glow"
    >
      <MessageCircle className="w-4 h-4" />
      <span>درخواست مشاوره</span>
    </Link>
  );
}

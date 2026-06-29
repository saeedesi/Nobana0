import type { Metadata } from "next";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nobana | نوبنا",
  description: "طراحی، اجرا، و مدیریت پیمان - نوبنا، تجربه‌ای روشن‌تر از اجرا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark antialiased scroll-smooth">
      <body className="font-sans bg-[#0a0a0a] text-foreground selection:bg-amber-500/30">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}

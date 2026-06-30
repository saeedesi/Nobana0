import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        
        {/* Brand Info */}
        <div className="flex flex-col gap-6">
          <div className="relative w-32 h-16 opacity-80">
            <Image 
              src="/images/logo-trimmed.webp" 
              alt="لوگوی نوبنا" 
              fill 
              className="object-contain grayscale contrast-125 brightness-150 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            />
          </div>
          <p className="text-white/50 text-sm leading-relaxed font-light">
            نوبنا، تجربه‌ای روشن‌تر از اجرا. ما با رویکردی شفاف و سیستم‌محور، پروژه‌های معماری شما را از ایده تا تحویل نهایی همراهی می‌کنیم.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all text-white/60">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all text-white/60">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6 lg:pl-10">
          <h4 className="text-white font-medium text-lg">دسترسی سریع</h4>
          <ul className="flex flex-col gap-3 text-sm text-white/60 font-light">
            <li><Link href="#services" className="hover:text-primary transition-colors">خدمات ما</Link></li>
            <li><Link href="#portfolio" className="hover:text-primary transition-colors">پروژه‌های شاخص</Link></li>
            <li><Link href="#about" className="hover:text-primary transition-colors">درباره ما</Link></li>
            <li><Link href="/panel" className="hover:text-primary transition-colors">پنل کارفرمایان</Link></li>
            <li><Link href="#consultation" className="hover:text-primary transition-colors">درخواست مشاوره</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white font-medium text-lg">حوزه‌های فعالیت</h4>
          <ul className="flex flex-col gap-3 text-sm text-white/60 font-light">
            <li>مدیریت پیمان پروژه‌های لوکس</li>
            <li>طراحی و اجرای ویلا</li>
            <li>بازسازی ساختمان‌های مسکونی</li>
            <li>طراحی و اجرای فضای اداری و تجاری</li>
            <li>دکوراسیون داخلی</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white font-medium text-lg">ارتباط با ما</h4>
          <ul className="flex flex-col gap-4 text-sm text-white/60 font-light">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span className="leading-relaxed">تهران، زعفرانیه، خیابان الف، مجتمع اداری نوبنا، طبقه ۵</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span dir="ltr">021 - 22 00 00 00</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span dir="ltr">info@nobana.ir</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <span>شنبه تا چهارشنبه: ۹ صبح الی ۶ عصر</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/55 text-xs">
          تمامی حقوق برای برند <span className="text-white/60">نوبنا</span> محفوظ است. © {new Date().getFullYear().toLocaleString("fa-IR", { useGrouping: false })}
        </p>
        <p className="text-white/55 text-xs">
          طراحی و توسعه با <span className="text-red-500">♥</span>
        </p>
      </div>
    </footer>
  );
}

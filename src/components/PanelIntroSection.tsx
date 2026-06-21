import { LayoutDashboard, FileText, CalendarClock, Camera } from "lucide-react";
import Link from "next/link";

export default function PanelIntroSection() {
  const features = [
    {
      title: "گزارش‌های تصویری مستمر",
      description: "مشاهده روند پیشرفت پروژه از طریق تصاویر و ویدیوهای ثبت‌شده در مقاطع مختلف.",
      icon: <Camera className="w-6 h-6 text-primary" />
    },
    {
      title: "تایم‌لاین و برنامه‌ریزی",
      description: "پیگیری دقیق زمان‌بندی فازهای اجرایی و آگاهی از وضعیت فعلی پروژه نسبت به برنامه.",
      icon: <CalendarClock className="w-6 h-6 text-primary" />
    },
    {
      title: "مدیریت مالی و صورت‌وضعیت‌ها",
      description: "دسترسی شفاف به تمامی اسناد مالی، فاکتورها، و صورت‌وضعیت‌های تایید شده.",
      icon: <FileText className="w-6 h-6 text-primary" />
    },
    {
      title: "اسناد و قراردادها",
      description: "آرشیو امن تمامی نقشه‌های اجرایی، قراردادها و اسناد فنی پروژه شما.",
      icon: <LayoutDashboard className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <section className="relative w-full py-24 md:py-32 px-4 md:px-8 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Visual Mockup Side */}
        <div className="relative order-2 lg:order-1 h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-6 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="w-full h-full rounded-xl bg-[#111] border border-white/10 overflow-hidden shadow-2xl relative flex flex-col">
            {/* Fake Browser Header */}
            <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="ml-4 h-5 rounded bg-white/5 flex-1 max-w-[200px]"></div>
            </div>
            {/* Fake Dashboard Content */}
            <div className="flex-1 p-6 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="w-32 h-6 bg-white/10 rounded"></div>
                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-primary/10 border border-primary/20 rounded-lg"></div>
                <div className="h-20 bg-white/5 rounded-lg"></div>
                <div className="h-20 bg-white/5 rounded-lg"></div>
              </div>
              <div className="flex-1 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* Floating Element */}
          <div className="absolute -bottom-6 -right-6 bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hidden md:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-white font-medium">پروژه در حال اجرا</p>
                <p className="text-white/50 text-sm">بروزرسانی: ۳ ساعت پیش</p>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2 flex flex-col">
          <h3 className="text-sm tracking-[0.3em] text-primary mb-4 font-light">شفافیت به سبک نوبنا</h3>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight">
            پنل اختصاصی کارفرمایان
          </h2>
          <p className="text-xl md:text-2xl font-light text-white/80 mb-8 leading-relaxed">
            دسترسی آنلاین و لحظه‌ای به اطلاعات پروژه
          </p>
          
          <p className="text-white/60 font-light text-base md:text-lg leading-relaxed text-justify md:text-right mb-12">
            این سیستم با هدف ایجاد شفافیت مطلق، دسترسی آسان و همراهی مستمر با کارفرما طراحی شده است تا روند پیشرفت پروژه در هر مرحله، به‌صورت کاملاً دقیق، مستند و قابل پیگیری در دستان شما باشد.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {feature.icon}
                </div>
                <h4 className="text-white font-medium text-lg">{feature.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <Link href="/panel" className="self-start px-10 py-4 bg-white text-black font-medium rounded-lg hover:bg-primary transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(226,232,240,0.3)]">
            ورود به پنل کارفرمایان
          </Link>
        </div>

      </div>
    </section>
  );
}

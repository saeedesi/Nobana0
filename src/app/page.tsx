import Image from "next/image";
import Navbar from "@/components/Navbar";
import ScrollHero from "@/components/ScrollHero";
import ServicesSection from "@/components/ServicesSection";
import ServicesSectionV2 from "@/components/ServicesSectionV2";
import ServicesSectionV3 from "@/components/ServicesSectionV3";
import AboutFounder from "@/components/AboutFounder";
import PanelIntroSection from "@/components/PanelIntroSection";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30 font-sans" dir="rtl">
      
      {/* Header / Navbar (Sticky & Shrinking) */}
      <Navbar />

      {/* 1. Hero Section (Scroll Animated) */}
      <ScrollHero />

      {/* 2. Services Section */}
      <ServicesSection />
      
      {/* 2.5 Services Section V2 (3D Coverflow Variant) */}
      <ServicesSectionV2 />

      {/* 2.6 Services Section V3 (Reversed Angles Variant) */}
      <ServicesSectionV3 />

      {/* 3. Signature Projects Section */}
      <section id="portfolio" className="relative z-20 max-w-[1400px] mx-auto px-4 md:px-8 py-24 md:py-32">
        <div className="flex flex-col items-center mb-16 md:mb-24">
          <h3 className="text-sm tracking-[0.3em] text-primary mb-4 font-light">آثار برگزیده</h3>
          <h2 className="text-3xl md:text-5xl font-light text-white text-center">
            پروژه‌های شاخص
          </h2>
          <div className="w-16 h-[2px] bg-primary mt-6 opacity-80 shadow-[0_0_10px_rgba(226,232,240,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Project Card 1 */}
          <div className="group relative h-[450px] md:h-[550px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 bg-white/5 backdrop-blur-sm cursor-pointer">
            <Image
              src="/images/project1.png"
              alt="برج زنیت"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
            
            <div className="absolute bottom-0 right-0 w-full p-8 md:p-10 flex flex-col text-right">
              <h4 className="text-2xl md:text-3xl font-light text-primary mb-2">برج زنیت</h4>
              <p className="text-sm text-white/50 font-light mb-6 tracking-widest">
                مجتمع مسکونی لوکس
              </p>
              <p className="text-sm md:text-base text-white/80 font-light mb-8 line-clamp-3 leading-relaxed opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                طراحی و اجرای کامل برج مسکونی با رویکرد معماری پایدار و مدیریت پیمان شفاف. تلفیقی از متریال‌های مدرن و چشم‌انداز شهری.
              </p>
              <button className="self-end px-6 py-3 text-xs border border-white/20 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-md bg-black/40 text-white">
                جزئیات پروژه
              </button>
            </div>
          </div>
          
          {/* Empty Placeholder Cards */}
          {[2, 3].map((i) => (
            <div key={i} className="group relative h-[450px] md:h-[550px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 bg-white/5 backdrop-blur-sm cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent opacity-90 z-10 transition-opacity duration-500 group-hover:opacity-70" />
              <div className="absolute bottom-0 right-0 w-full p-8 md:p-10 flex flex-col text-right z-20">
                <h4 className="text-2xl md:text-3xl font-light text-primary mb-2">ویلای مدرن {i}</h4>
                <p className="text-sm text-white/50 font-light mb-6 tracking-widest">
                  ویلای خصوصی
                </p>
                <p className="text-sm md:text-base text-white/80 font-light mb-8 line-clamp-3 leading-relaxed opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  در حال پیاده‌سازی زیرساخت و طراحی داخلی با نظارت کامل کارفرما. استفاده از نور طبیعی و متریال‌های ارگانیک.
                </p>
                <button className="self-end px-6 py-3 text-xs border border-white/20 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-md bg-black/40 text-white">
                  جزئیات پروژه
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. About Founder Section */}
      <AboutFounder />

      {/* 5. Employers Panel Intro Section */}
      <PanelIntroSection />

      {/* 6. Consultation Form Section */}
      <ConsultationForm />

      {/* 7. Footer */}
      <Footer />

    </main>
  );
}

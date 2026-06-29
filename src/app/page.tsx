import Navbar from "@/components/Navbar";
import ScrollHero from "@/components/ScrollHero";
import ServicesSection from "@/components/ServicesSection";
import CircularGallery from "@/components/CircularGallery";
import AboutFounder from "@/components/AboutFounder";
import PanelIntroSection from "@/components/PanelIntroSection";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/components/Footer";

// Test projects for the Circular Gallery (swap images/titles for real ones later).
const projects = [
  { image: "/images/projects/project-1.jpg", text: "برج زنیت" },
  { image: "/images/projects/project-2.jpg", text: "ویلا کاسپین" },
  { image: "/images/projects/project-3.jpg", text: "مجتمع آرکا" },
  { image: "/images/projects/project-4.jpg", text: "دفتر مرکزی هورامان" },
  { image: "/images/projects/project-5.jpg", text: "بازسازی نیاوران" },
  { image: "/images/projects/project-6.jpg", text: "پنت‌هاوس الوند" },
  { image: "/images/projects/project-7.jpg", text: "لابی هتل درسا" },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-[#0a0a0a] text-white selection:bg-primary/30 font-sans" dir="rtl">
      
      {/* Header / Navbar (Sticky & Shrinking) */}
      <Navbar />

      {/* 1. Hero Section (Scroll Animated) */}
      <ScrollHero />

      {/* 2. Services Section */}
      <ServicesSection />

      {/* 3. Signature Projects Section (Circular Gallery) */}
      <section id="portfolio" className="relative z-20 py-24 md:py-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col items-center mb-12 md:mb-16">
          <h3 className="text-sm tracking-[0.3em] text-primary mb-4 font-light">آثار برگزیده</h3>
          <h2 className="text-3xl md:text-5xl font-light text-white text-center">
            پروژه‌های شاخص
          </h2>
          <div className="w-16 h-[2px] bg-primary mt-6 opacity-80 shadow-[0_0_10px_rgba(226,232,240,0.5)]"></div>
        </div>

        <div className="h-[520px] md:h-[640px] w-full">
          <CircularGallery
            items={projects}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            font="bold 30px Vazirmatn"
            scrollSpeed={2}
            scrollEase={0.05}
          />
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

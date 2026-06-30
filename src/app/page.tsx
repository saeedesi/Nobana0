import Navbar from "@/components/Navbar";
import ScrollHero from "@/components/ScrollHero";
import HeroStats from "@/components/HeroStats";
import ServicesSection from "@/components/ServicesSection";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import AboutFounder from "@/components/AboutFounder";
import PanelIntroSection from "@/components/PanelIntroSection";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-[#0a0a0a] text-white selection:bg-primary/30 font-sans" dir="rtl">
      
      {/* Header / Navbar (Sticky & Shrinking) */}
      <Navbar />

      {/* 1. Hero Section (Scroll Animated) */}
      <ScrollHero />

      {/* 1.5 Hero Stats Counter */}
      <HeroStats />

      {/* 2. Services Section */}
      <ServicesSection />

      {/* 3. Signature Projects Section (Circular Gallery) */}
      <section id="portfolio" className="relative z-20 py-24 md:py-32 overflow-hidden">
        <Reveal className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col items-center mb-12 md:mb-16">
          <h3 className="text-sm tracking-[0.3em] text-primary mb-4 font-light">آثار برگزیده</h3>
          <h2 className="text-3xl md:text-5xl font-light text-white text-center">
            پروژه‌های شاخص
          </h2>
          <div className="w-16 h-[2px] bg-primary mt-6 opacity-80 glow"></div>
        </Reveal>

        <ProjectsShowcase />
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

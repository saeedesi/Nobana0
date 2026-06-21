"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "نوبنا", href: "#hero" },
  { name: "خدمات", href: "#services" },
  { name: "پروژه‌ها", href: "#portfolio" },
  { name: "درباره ما", href: "#about" },
  { name: "درخواست مشاوره", href: "#consultation" }
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hasShotLight, setHasShotLight] = useState(false);

  // Track scroll for shrinking header and timing the light shoot
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const scrolled = latest > 60;
      setIsScrolled(scrolled);
      
      if (!scrolled) {
        setHasShotLight(false);
      }
    });
  }, [scrollY]);

  // Set hasShotLight to true slightly after the light peaks its glow on Nobana (1s + 0.3s delay = 1.3s)
  useEffect(() => {
    if (isScrolled) {
      const timer = setTimeout(() => {
        setHasShotLight(true);
      }, 1300); // 1.3 seconds so it appears exactly during the explosion/glow
      return () => clearTimeout(timer);
    }
  }, [isScrolled]);

  // Track active section for shine effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.substring(1));
      let current = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is at or above the middle of the screen
          // and the bottom is below the middle of the screen
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? "top-0 px-0" : "top-6 px-4 md:px-8"
        }`}
      >
        <div 
          className={`relative overflow-hidden mx-auto flex items-center justify-between backdrop-blur-xl border-white/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl ${
            isScrolled 
              ? "max-w-full bg-black/60 border-b py-2 px-6 md:px-12 rounded-none" 
              : "max-w-[1400px] bg-black/20 border py-3 md:py-4 px-6 md:px-10 rounded-3xl"
          }`}
        >
          
          {/* Shine Sweep Effect on Shrink (Desktop Only) */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:flex absolute top-0 bottom-0 w-[200px] pointer-events-none z-0 flex-col justify-center animate-sweep-light right-[100vw]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-[4px] skew-x-12" />
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Nav Links (First child -> Right side in RTL) */}
          <nav 
            className={`hidden md:flex items-center tracking-wide text-white/80 transition-all duration-500 ${
              isScrolled ? "gap-8 text-[13px]" : "gap-12 text-[15px]"
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`relative hover:text-white transition-colors ${isScrolled ? "py-1" : "py-2"}`}
                >
                  {item.name}
                  {/* Active Shine Line with Framer Motion layout transition */}
                  {isActive && isScrolled && hasShotLight && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
            
            {/* Employer Panel Link */}
            <Link 
              href="/panel" 
              className={`border border-white/20 rounded-full text-white/90 hover:bg-white/10 hover:border-white/40 transition-all font-medium ${
                isScrolled ? "mr-4 px-5 py-1.5 text-xs" : "mr-6 px-7 py-2.5 text-sm"
              }`}
            >
              ورود کارفرمایان
            </Link>
          </nav>

          {/* Mobile Hamburger Menu Toggle (First visible child on Mobile -> Right side) */}
          <button 
            className="md:hidden relative z-50 p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

          {/* Logo (Second child -> Left side in RTL) */}
          <div className="flex items-center gap-3 relative z-50">
            <div 
              className={`relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isScrolled 
                  ? "w-12 h-14 md:w-16 md:h-[65px]" 
                  : "w-16 h-20 md:w-20 md:h-24"
              }`}
            >
              <Image 
                src="/images/logo-trimmed.webp" 
                alt="لوگوی نوبنا" 
                fill 
                className="object-contain grayscale contrast-125 brightness-150 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                priority
              />
            </div>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-10 text-2xl font-light text-white/80">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a 
                    key={item.href}
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative transition-colors ${isActive ? "text-white" : "hover:text-white"}`}
                  >
                    {item.name}
                    {isActive && (!isScrolled || hasShotLight) && (
                      <motion.div
                        layoutId="activeMobileNavLine"
                        className="absolute left-0 right-0 -bottom-3 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      />
                    )}
                  </a>
                );
              })}
              
              <Link 
                href="/panel" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-6 border border-white/20 rounded-full text-white/90 px-10 py-4 text-xl hover:bg-white/10 transition-all"
              >
                ورود کارفرمایان
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

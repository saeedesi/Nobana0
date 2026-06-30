"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const texts = [
  {
    title: "نوبنـا",
    subtitle: "معماران و سازندگان",
    description: "شفافیت در اجرا. ساخت فضاهای ماندگار.\nمدیریت پیمان و اجرای پروژه‌های لوکس با رویکردی کاملا سیستم‌محور و قابل اعتماد."
  },
  {
    title: "یکپارچگی",
    subtitle: "از طراحی تا تحویل",
    description: "تمام مراحل پروژه شما تحت نظارت سیستم هوشمند نوبنا.\nتجربه‌ای بی‌دغدغه و لذت‌بخش برای کارفرما در تمامی مراحل ساخت."
  },
  {
    title: "ارزش‌آفرینی",
    subtitle: "کیفیت و دوام",
    description: "ما فقط ساختمان نمی‌سازیم، ما ارزش خلق می‌کنیم.\nتلفیقی از هنر معماری، مهندسی دقیق و متریال‌های پایدار برای آینده."
  }
];

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate opacities and Y transforms for the 3 texts with explicit full ranges to prevent extrapolation bugs
  const opacity1 = useTransform(scrollYProgress, [0, 0.25, 0.35, 1], [1, 1, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25, 0.35, 1], [0, 0, -50, -50]);

  const opacity2 = useTransform(scrollYProgress, [0, 0.25, 0.35, 0.5, 0.6, 0.7, 1], [0, 0, 1, 1, 1, 0, 0]);
  const y2 = useTransform(scrollYProgress, [0, 0.25, 0.35, 0.5, 0.6, 0.7, 1], [50, 50, 0, 0, 0, -50, -50]);

  const opacity3 = useTransform(scrollYProgress, [0, 0.6, 0.75, 1], [0, 0, 1, 1]);
  const y3 = useTransform(scrollYProgress, [0, 0.6, 0.75, 1], [50, 50, 0, 0]);

  // Very subtle zoom effect on the background image as user scrolls down
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Respect reduced-motion: keep the opacity crossfade but drop parallax/zoom.
  const reduced = useReducedMotion();

  return (
    <section id="hero" ref={containerRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* Background Image */}
        <motion.div className="absolute inset-0 z-0 origin-center" style={{ scale: reduced ? 1 : scaleBg }}>
          <Image
            src="/images/hero.png"
            alt="پروژه لوکس نوبنا"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent" />
        </motion.div>

        {/* Hero Content Container */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 w-full h-full">
          
          {/* Text 1 */}
          <motion.div 
            style={{ opacity: opacity1, y: reduced ? 0 : y1 }}
            className="absolute flex flex-col items-center justify-center w-full px-4"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold text-white drop-shadow-2xl mb-4">
              {texts[0].title}
            </h1>
            <h2 className="text-xl md:text-3xl font-light tracking-widest text-primary mb-6">
              {texts[0].subtitle}
            </h2>
            <p className="text-base md:text-lg font-light text-white/90 max-w-3xl leading-relaxed whitespace-pre-line">
              {texts[0].description}
            </p>
          </motion.div>

          {/* Text 2 */}
          <motion.div 
            initial={{ opacity: 0 }}
            style={{ opacity: opacity2, y: reduced ? 0 : y2 }}
            className="absolute flex flex-col items-center justify-center w-full px-4"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold text-white drop-shadow-2xl mb-4">
              {texts[1].title}
            </h1>
            <h2 className="text-xl md:text-3xl font-light tracking-widest text-primary mb-6">
              {texts[1].subtitle}
            </h2>
            <p className="text-base md:text-lg font-light text-white/90 max-w-3xl leading-relaxed whitespace-pre-line">
              {texts[1].description}
            </p>
          </motion.div>

          {/* Text 3 */}
          <motion.div 
            initial={{ opacity: 0 }}
            style={{ opacity: opacity3, y: reduced ? 0 : y3 }}
            className="absolute flex flex-col items-center justify-center w-full px-4"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold text-white drop-shadow-2xl mb-4">
              {texts[2].title}
            </h1>
            <h2 className="text-xl md:text-3xl font-light tracking-widest text-primary mb-6">
              {texts[2].subtitle}
            </h2>
            <p className="text-base md:text-lg font-light text-white/90 max-w-3xl leading-relaxed whitespace-pre-line mb-10">
              {texts[2].description}
            </p>
            {/* The button appears at the end of the scroll sequence */}
            <button className="px-10 py-4 border border-primary/60 bg-black/30 backdrop-blur-md text-white/90 text-sm tracking-widest transition-all hover:bg-primary hover:text-black rounded-lg cursor-pointer pointer-events-auto">
              مشاهده پروژه‌ها
            </button>
          </motion.div>

        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: opacity1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
        >
          <span className="text-xs text-white/50 tracking-widest mb-2 font-light">اسکرول کنید</span>
          <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

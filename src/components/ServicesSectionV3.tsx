"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Briefcase, Paintbrush, Building2, ArrowLeft } from "lucide-react";

const services = [
  {
    title: "مدیریت پیمان سیستم‌محور",
    subtitle: "شفافیت، دقت و نظم در اجرا",
    description: "نظارت و اجرای پروژه‌ها با رویکردی کاملاً سیستم‌محور. ما با ایجاد یک جریان کار شفاف و مستند، تمام دغدغه‌های اجرایی را برطرف می‌کنیم.",
    features: [
      "گزارش‌دهی تصویری و آنلاین مستمر",
      "کنترل دقیق بودجه و صورت‌وضعیت‌ها",
      "زمان‌بندی مهندسی‌شده و فازبندی",
      "تیم اجرایی متعهد و متخصص"
    ],
    icon: <Briefcase className="w-10 h-10 text-primary" />
  },
  {
    title: "طراحی و مهندسی معماری",
    subtitle: "از کانسپت تا خلق فضا",
    description: "همراهی شما از ایده اولیه تا تحویل نهایی کلید. تیم مهندسی نوبنا با در نظر گرفتن استانداردهای روز دنیا رویای شما را خلق می‌کند.",
    features: [
      "طراحی کانسپت و رندرینگ سه‌بعدی",
      "طراحی نما، محوطه و لنداسکیپ",
      "ارائه نقشه‌های دقیق اجرایی (فاز ۲)",
      "تطابق کامل با ضوابط نظام مهندسی"
    ],
    icon: <Building2 className="w-10 h-10 text-primary" />
  },
  {
    title: "بازسازی و دکوراسیون",
    subtitle: "ارتقای کیفیت و ارزش ملک",
    description: "ارتقای کیفیت فضا و خلق ارزش افزوده برای املاک مسکونی، تجاری و اداری شما با استفاده از متریال‌های پایدار و هوشمندانه.",
    features: [
      "تخریب، مقاوم‌سازی و نوسازی اصولی",
      "طراحی داخلی بر اساس ترندهای روز",
      "انتخاب و تامین متریال‌های لوکس",
      "افزایش چشمگیر ارزش سرمایه‌ای ملک"
    ],
    icon: <Paintbrush className="w-10 h-10 text-primary" />
  }
];

export default function ServicesSectionV3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section className="relative w-full bg-[#050505] h-[500vh]" ref={containerRef}>
      
      {/* Label for comparison */}
      <div className="absolute top-4 right-4 z-50 bg-white text-black px-4 py-2 rounded font-bold text-sm">
        مدل پیشنهادی ۳ (زاویه و عمق برعکس)
      </div>

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
        
        {/* Title layer */}
        <div className="absolute top-16 left-0 w-full text-center z-50 pointer-events-none">
          <h3 className="text-sm tracking-[0.3em] text-white/50 mb-2 font-light">نسخه معکوس</h3>
          <h2 className="text-3xl md:text-5xl font-light text-white/20 tracking-wide">
            کارت‌ها از جلو به عقب
          </h2>
        </div>

        {/* 3D Scene Container */}
        <div 
          className="relative w-full max-w-[1200px] h-[600px] mt-20 flex items-center justify-center"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
        >
          {services.map((service, i) => (
            <CoverflowCardReversed 
              key={i} 
              index={i} 
              service={service} 
              progress={scrollYProgress} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}

interface CoverflowCardProps {
  index: number;
  service: typeof services[0];
  progress: MotionValue<number>;
}

function CoverflowCardReversed({ index, service, progress }: CoverflowCardProps) {
  // In V3, we REVERSE the angles (facing outwards) 
  // but keep the Center card CLOSE (z=150) and side cards FAR (z=-300) so the center card ZOOMS.
  
  let xInput = [0, 0.2, 0.4, 0.6, 1];
  let xOutput = ["0%", "0%", "0%", "0%", "0%"];
  let zOutput = ["0px", "0px", "0px", "0px", "0px"];
  let rotateYOutput = ["0deg", "0deg", "0deg", "0deg", "0deg"];
  let opacityOutput = [1, 1, 1, 1, 1];
  let scaleOutput = [1, 1, 1, 1, 1];
  let detailsOpacityOutput = [0, 0, 0, 0, 0];
  let zIndexOutput = [10, 10, 10, 10, 10];

  if (index === 0) {
    xInput =               [0,      0.2,      0.4,      0.6,      1];
    xOutput =              ["0%",   "0%",     "130%",   "260%",   "260%"];
    zOutput =              ["150px","150px",  "-300px", "-600px", "-600px"];
    rotateYOutput =        ["0deg", "0deg",   "45deg",  "60deg",  "60deg"];
    opacityOutput =        [1,      1,        0.2,      0,        0];
    scaleOutput =          [1.15,   1.15,     0.8,      0.8,      0.8];
    detailsOpacityOutput = [1,      1,        0,        0,        0];
    zIndexOutput =         [50,     50,       10,       10,       10];
  } else if (index === 1) {
    xInput =               [0,        0.2,       0.4,       0.6,       0.8,      1];
    xOutput =              ["-260%",  "-130%",   "0%",      "0%",      "130%",   "260%"];
    zOutput =              ["-600px", "-300px",  "150px",   "150px",   "-300px", "-600px"];
    rotateYOutput =        ["-60deg", "-45deg",  "0deg",    "0deg",    "45deg",  "60deg"];
    opacityOutput =        [0,        0.2,       1,         1,         0.2,      0];
    scaleOutput =          [0.8,      0.8,       1.15,      1.15,      0.8,      0.8];
    detailsOpacityOutput = [0,        0,         1,         1,         0,        0];
    zIndexOutput =         [10,       10,        50,        50,        10,       10];
  } else if (index === 2) {
    xInput =               [0,        0.4,       0.6,       0.8,       1];
    xOutput =              ["-260%",  "-260%",   "-130%",   "0%",      "0%"];
    zOutput =              ["-600px", "-600px",  "-300px",  "150px",   "150px"];
    rotateYOutput =        ["-60deg", "-60deg",  "-45deg",  "0deg",    "0deg"];
    opacityOutput =        [0,        0,         0.2,       1,         1];
    scaleOutput =          [0.8,      0.8,       0.8,       1.15,      1.15];
    detailsOpacityOutput = [0,        0,         0,         1,         1];
    zIndexOutput =         [10,       10,        10,        50,        50];
  }

  const x = useTransform(progress, xInput, xOutput);
  const z = useTransform(progress, xInput, zOutput);
  const rotateY = useTransform(progress, xInput, rotateYOutput);
  const opacity = useTransform(progress, xInput, opacityOutput);
  const scale = useTransform(progress, xInput, scaleOutput);
  const detailsOpacity = useTransform(progress, xInput, detailsOpacityOutput);
  const zIndex = useTransform(progress, xInput, zIndexOutput);
  
  return (
    <motion.div 
      className="absolute w-[320px] md:w-[400px] h-[550px] rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-zinc-900 to-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col p-8"
      style={{ 
        x, 
        z, 
        rotateY, 
        opacity,
        scale,
        zIndex,
        transformOrigin: "center center"
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-start text-center pt-4">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] shrink-0">
          {service.icon}
        </div>
        
        <h3 className="text-primary text-xs tracking-[0.2em] mb-2">{service.subtitle}</h3>
        <h2 className="text-2xl font-light text-white mb-4">{service.title}</h2>
        
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          {service.description}
        </p>

        <motion.div 
          style={{ opacity: detailsOpacity }}
          className="w-full flex flex-col items-start text-right bg-white/5 rounded-2xl p-4 border border-white/5"
        >
          <ul className="w-full flex flex-col gap-3">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-white/80 text-sm font-light">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.button 
          style={{ opacity: detailsOpacity }}
          className="mt-auto flex items-center gap-2 text-white hover:text-primary transition-colors group"
        >
          <span className="text-sm font-medium tracking-wide">مشاهده نمونه‌پروژه‌ها</span>
          <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary transition-all">
            <ArrowLeft className="w-3 h-3" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

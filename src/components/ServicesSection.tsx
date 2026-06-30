"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Briefcase, Paintbrush, Building2, ArrowLeft } from "lucide-react";
import Image from "next/image";

const services = [
  {
    title: "مدیریت پیمان سیستم‌محور",
    subtitle: "شفافیت، دقت و نظم در اجرا",
    description: "نظارت و اجرای پروژه‌ها با رویکردی کاملاً سیستم‌محور. ما با ایجاد یک جریان کار شفاف و مستند، تمام دغدغه‌های اجرایی، مالی و زمانی کارفرما را برطرف می‌کنیم. شما در هر لحظه می‌دانید پروژه در چه وضعیتی است.",
    icon: <Briefcase className="w-12 h-12 text-primary" />,
    image: "/images/project1.png", // We reuse existing images for the luxury card background
    color: "from-zinc-900 to-black"
  },
  {
    title: "طراحی و مهندسی معماری",
    subtitle: "از کانسپت تا خلق فضا",
    description: "همراهی شما از ایده اولیه و کانسپت تا تحویل نهایی کلید. تیم مهندسی نوبنا با در نظر گرفتن استانداردهای روز دنیا، زیبایی‌شناسی مینیمال و پایداری متریال، رویای شما را روی کاغذ و سپس در واقعیت خلق می‌کند.",
    icon: <Building2 className="w-12 h-12 text-primary" />,
    image: "/images/hero.png",
    color: "from-zinc-900/90 to-black"
  },
  {
    title: "بازسازی و دکوراسیون داخلی",
    subtitle: "ارتقای کیفیت و ارزش ملک",
    description: "ارتقای کیفیت فضا و خلق ارزش افزوده برای املاک مسکونی، تجاری و اداری شما. ما با بازطراحی هوشمندانه و استفاده از متریال‌های پایدار، جانی دوباره به فضاهای قدیمی می‌بخشیم.",
    icon: <Paintbrush className="w-12 h-12 text-primary" />,
    image: "/images/project1.png",
    color: "from-zinc-800 to-black"
  }
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section id="services" ref={containerRef} className="relative w-full bg-[#0a0a0a] h-[400vh]">
      
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 md:px-8 py-20">
        
        {/* Title layer (behind cards) */}
        <div className="absolute top-12 left-0 w-full text-center z-0">
          <h3 className="text-sm tracking-[0.3em] text-primary mb-2 font-light">خدمات تخصصی</h3>
          <h2 className="text-3xl md:text-5xl font-light text-white/55 tracking-wide">
            حوزه‌های فعالیت نوبنـا
          </h2>
        </div>

        {/* Cards Container */}
        <div className="relative w-full max-w-[1200px] h-[70vh] md:h-[600px] mt-12 flex items-center justify-center">
          {services.map((service, index) => {
            const targetScale = 1 - ( (services.length - index) * 0.05 );
            return (
              <ServiceCard 
                key={index} 
                index={index} 
                service={service} 
                progress={scrollYProgress} 
                range={[index * 0.33, 1]} 
                targetScale={targetScale}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}

interface ServiceCardProps {
  index: number;
  service: typeof services[0];
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}

function ServiceCard({ index, service, progress, range, targetScale }: ServiceCardProps) {
  // Card movement logic:
  // Each card slides up from bottom when its range starts.
  // Exception: Card 0 is already there.
  
  const isFirst = index === 0;

  // For card sliding in
  const y = useTransform(
    progress,
    [range[0] - 0.33, range[0]], 
    [isFirst ? 0 : 1000, 0] // 1000px down to 0
  );

  // For card scaling down when next card comes over it
  const scale = useTransform(
    progress,
    [range[0], range[0] + 0.33],
    [1, targetScale]
  );

  // For dimming the card when pushed back
  const opacity = useTransform(
    progress,
    [range[0], range[0] + 0.33],
    [1, 0.4]
  );

  // Overlay darkness derived from the dimming value (hoisted out of JSX)
  const overlayOpacity = useTransform(opacity, [1, 0.4], [0, 0.6]);

  return (
    <motion.div 
      className="absolute top-0 w-full h-full flex items-center justify-center origin-top"
      style={{ y, scale }}
    >
      <div className={`relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row bg-gradient-to-br ${service.color}`}>
        
        {/* Dimming overlay */}
        <motion.div 
          className="absolute inset-0 bg-black z-20 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        {/* Text Content */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center z-10 relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2" />
          
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-md">
            {service.icon}
          </div>
          
          <h3 className="text-primary text-sm tracking-[0.2em] mb-2">{service.subtitle}</h3>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight">{service.title}</h2>
          
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl text-justify mb-10">
            {service.description}
          </p>

          <button className="flex items-center gap-3 text-white hover:text-primary transition-colors group self-start">
            <span className="text-sm font-medium tracking-wide">اطلاعات بیشتر</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Image Content */}
        <div className="hidden md:block relative w-[40%] h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10" />
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover grayscale opacity-50"
          />
        </div>

      </div>
    </motion.div>
  );
}

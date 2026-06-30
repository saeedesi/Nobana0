'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const stats = [
  { value: 20, label: 'سال تجربه' },
  { value: 50, label: 'پروژه اجراشده' },
  { value: 40, label: 'کارفرمای راضی' }
];

function toFa(n: number): string {
  return n.toLocaleString('fa-IR', { useGrouping: false });
}

function Counter({ value, active }: { value: number; active: boolean }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active || reduced) return;
    let raf = 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, reduced]);
  // Reduced motion: show the final number immediately (no count-up).
  const display = reduced ? value : n;
  return (
    <span className="text-glow tabular-nums">
      {toFa(display)}
      <span className="text-primary/70">+</span>
    </span>
  );
}

export default function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  return (
    <section className="relative z-20 bg-[#0a0a0a] border-y border-white/5 py-14 md:py-20 px-4 md:px-8">
      <motion.div
        ref={ref}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduced ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1100px] mx-auto grid grid-cols-3 gap-4 md:gap-8 text-center"
      >
        {stats.map(s => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-2 md:gap-3 border-white/10 [&:not(:last-child)]:border-l"
          >
            <div className="text-4xl md:text-6xl lg:text-7xl font-light text-primary leading-none">
              <Counter value={s.value} active={inView} />
            </div>
            <p className="text-xs md:text-sm text-white/50 font-light tracking-widest">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

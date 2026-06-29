'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxProject {
  text: string;
  subtitle?: string;
  images: string[];
}

interface ProjectLightboxProps {
  project: LightboxProject;
  onClose: () => void;
}

function toFa(n: number): string {
  return n.toLocaleString('fa-IR', { useGrouping: false });
}

export default function ProjectLightbox({ project, onClose }: ProjectLightboxProps) {
  const images = project.images;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex(i => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // RTL: Left arrow advances, Right arrow goes back.
      else if (e.key === 'ArrowLeft') paginate(1);
      else if (e.key === 'ArrowRight') paginate(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, paginate]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        dir="rtl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-6 left-6 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/40 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl md:text-3xl font-light text-primary">{project.text}</h3>
          {project.subtitle && (
            <p className="text-sm text-white/50 mt-1 tracking-widest">{project.subtitle}</p>
          )}
        </div>

        {/* Stage */}
        <div
          className="relative w-full max-w-[960px] aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-white/5"
          onClick={e => e.stopPropagation()}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              className="absolute inset-0"
              initial={{ opacity: 0, x: direction >= 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -80 : 80 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) paginate(1);
                else if (info.offset.x > 80) paginate(-1);
              }}
            >
              <Image
                src={images[index]}
                alt={`${project.text} - تصویر ${toFa(index + 1)}`}
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                className="object-cover pointer-events-none select-none"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next (RTL: next on the left, previous on the right) */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => paginate(1)}
                aria-label="بعدی"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => paginate(-1)}
                aria-label="قبلی"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Counter + dots */}
        {images.length > 1 && (
          <div className="mt-6 flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`تصویر ${toFa(i + 1)}`}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-6 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <span className="text-white/50 text-sm tracking-widest">
              {toFa(index + 1)} / {toFa(images.length)}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

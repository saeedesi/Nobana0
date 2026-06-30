'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

export interface LightboxProject {
  text: string;
  subtitle?: string;
  images: string[];
}

interface ProjectLightboxProps {
  project: LightboxProject;
  onClose: () => void;
  /** Element id to scroll back to on close (robust against orientation changes). */
  anchorId?: string;
}

function toFa(n: number): string {
  return n.toLocaleString('fa-IR', { useGrouping: false });
}

export default function ProjectLightbox({ project, onClose, anchorId }: ProjectLightboxProps) {
  const images = project.images;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex(i => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    const getFocusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter(n => !n.hasAttribute('disabled'));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        paginate(1); // RTL: Left advances
      } else if (e.key === 'ArrowRight') {
        paginate(-1); // RTL: Right goes back
      } else if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const list = getFocusable();
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (active && !dialogRef.current?.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);

    // Move focus into the dialog, and restore it to the opener on close.
    const opener = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => getFocusable()[0]?.focus(), 0);

    // Desktop: mouse wheel flips one image per gesture. A trackpad fires a long
    // burst of events, so we lock on the first and only unlock once the wheel
    // has been quiet for a moment (trailing debounce) — avoids skipping two.
    let wheelLock = false;
    let wheelEndTimer = 0;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 8) return;
      window.clearTimeout(wheelEndTimer);
      wheelEndTimer = window.setTimeout(() => {
        wheelLock = false;
      }, 140);
      if (wheelLock) return;
      wheelLock = true;
      paginate(delta > 0 ? 1 : -1);
    };
    window.addEventListener('wheel', onWheel, { passive: true });

    // Robust scroll lock (works on iOS Safari, where body overflow:hidden is
    // ignored): pin the body in place and restore the scroll position on close.
    const body = document.body;
    const root = document.documentElement;
    const scrollY = window.scrollY;
    const openLandscape = window.innerWidth > window.innerHeight;
    // Signal the locked state so scroll-driven UI (e.g. the navbar) can ignore
    // the transient scroll reset and not replay its animations on close.
    root.classList.add('lightbox-open');
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
      window.clearTimeout(focusTimer);
      opener?.focus?.({ preventScroll: true });
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      // Restore instantly (html uses scroll-smooth). Normally restore the exact
      // scroll position so the same gallery item stays centered. Only if the
      // orientation flipped while open (the pixel value is now invalid and can
      // land at the page bottom) fall back to the section anchor.
      const prevBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      const nowLandscape = window.innerWidth > window.innerHeight;
      const anchor = anchorId ? document.getElementById(anchorId) : null;
      if (nowLandscape !== openLandscape && anchor) {
        anchor.scrollIntoView({ block: 'center' });
      } else {
        window.scrollTo(0, scrollY);
      }
      root.style.scrollBehavior = prevBehavior;
      root.classList.remove('lightbox-open');
    };
  }, [onClose, paginate, anchorId]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`گالری تصاویر پروژه ${project.text}`}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden overscroll-none bg-black/90 backdrop-blur-xl landscape-mobile:p-0 ${
          expanded ? 'p-0' : 'px-4 py-16'
        }`}
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

        {/* Expand / collapse (desktop only) */}
        <button
          onClick={e => {
            e.stopPropagation();
            setExpanded(v => !v);
          }}
          aria-label={expanded ? 'کوچک‌کردن' : 'بزرگ‌کردن'}
          className="hidden md:flex absolute top-6 left-20 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/40 items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {expanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>

        {/* Title */}
        <div className={`mb-6 text-center landscape-mobile:hidden ${expanded ? 'hidden' : ''}`}>
          <h3 className="text-2xl md:text-3xl font-light text-primary">{project.text}</h3>
          {project.subtitle && (
            <p className="text-sm text-white/50 mt-1 tracking-widest">{project.subtitle}</p>
          )}
        </div>

        {/* Stage */}
        <div
          className={`relative overflow-hidden bg-white/5 landscape-mobile:max-w-none landscape-mobile:h-full landscape-mobile:aspect-auto landscape-mobile:rounded-none landscape-mobile:border-0 landscape-mobile:bg-transparent ${
            expanded
              ? 'w-full h-full max-w-none rounded-none border-0 bg-transparent'
              : 'w-full max-w-[960px] aspect-[4/3] rounded-2xl border border-white/10'
          }`}
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
                className={`pointer-events-none select-none landscape-mobile:object-contain ${
                  expanded ? 'object-contain' : 'object-cover'
                }`}
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
          <div
            className={`flex flex-col items-center gap-4 landscape-mobile:absolute landscape-mobile:bottom-3 landscape-mobile:mt-0 ${
              expanded ? 'absolute bottom-4 mt-0' : 'mt-6'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`تصویر ${toFa(i + 1)}`}
                  aria-current={i === index}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className="group flex items-center justify-center min-w-[24px] min-h-[24px]"
                >
                  <span
                    className={`block h-2 rounded-full transition-all ${
                      i === index ? 'w-6 bg-primary' : 'w-2 bg-white/40 group-hover:bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-white/50 text-sm tracking-widest">
              {toFa(index + 1)} / {toFa(images.length)}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

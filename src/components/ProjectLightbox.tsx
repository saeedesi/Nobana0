'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Info } from 'lucide-react';

export interface LightboxProject {
  text: string;
  subtitle?: string;
  images: string[];
  /** Spec rows shown in the info panel (location, client, year, area, …). */
  details?: { label: string; value: string }[];
  /** Description paragraphs shown in the info panel. */
  description?: string[];
  /** Optional per-image badge (same order as `images`). */
  captions?: (string | null)[];
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

type FsDoc = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void };
const fsElement = () => document.fullscreenElement ?? (document as FsDoc).webkitFullscreenElement ?? null;
const exitNativeFs = () => {
  if (!fsElement()) return;
  const d = document as FsDoc;
  if (d.exitFullscreen) d.exitFullscreen().catch(() => {});
  else d.webkitExitFullscreen?.();
};

type Pt = { x: number; y: number };
type Xf = { s: number; x: number; y: number };
const MAX_ZOOM = 4;
const TAP_ZOOM = 2.5;

/**
 * Pinch / double-tap zoom + pan, and horizontal swipe to change image.
 * Pointer-event based so it works for touch and mouse; `touch-none` keeps the
 * browser from turning the gesture into a page zoom/scroll.
 */
function ZoomPan({
  children,
  onSwipe
}: {
  children: React.ReactNode;
  onSwipe: (dir: 1 | -1) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [xf, setXf] = useState<Xf>({ s: 1, x: 0, y: 0 });
  const [smooth, setSmooth] = useState(false);
  const xfRef = useRef<Xf>({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, Pt>());
  const g = useRef({
    type: 'none' as 'none' | 'pan' | 'pinch' | 'swipe',
    start: { s: 1, x: 0, y: 0 } as Xf,
    p0: { x: 0, y: 0 } as Pt,
    dist0: 1,
    mid0: { x: 0, y: 0 } as Pt,
    moved: false,
    t0: 0
  });
  const lastTap = useRef({ t: 0, x: 0, y: 0 });

  const apply = (n: Xf, anim = false) => {
    xfRef.current = n;
    setSmooth(anim);
    setXf(n);
  };
  const clamp = (n: Xf): Xf => {
    const el = ref.current;
    if (!el) return n;
    const s = Math.min(MAX_ZOOM, Math.max(1, n.s));
    const mx = ((s - 1) * el.clientWidth) / 2;
    const my = ((s - 1) * el.clientHeight) / 2;
    return { s, x: Math.max(-mx, Math.min(mx, n.x)), y: Math.max(-my, Math.min(my, n.y)) };
  };
  // Keep the content point under `p` fixed while changing scale.
  const zoomAround = (from: Xf, p: Pt, s: number): Xf => {
    const cx = (p.x - from.x) / from.s;
    const cy = (p.y - from.y) / from.s;
    return { s, x: p.x - cx * s, y: p.y - cy * s };
  };
  const local = (e: React.PointerEvent): Pt => {
    const r = ref.current!.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  };
  const two = () => {
    const [a, b] = Array.from(pointers.current.values());
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    };
  };
  const beginSingle = (p: Pt) => {
    const cur = xfRef.current;
    g.current.type = cur.s > 1.01 ? 'pan' : 'swipe';
    g.current.start = cur;
    g.current.p0 = p;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    if (pointers.current.size === 2) {
      const { dist, mid } = two();
      g.current = { ...g.current, type: 'pinch', start: xfRef.current, dist0: dist, mid0: mid, moved: true };
    } else if (pointers.current.size === 1) {
      beginSingle(p);
      g.current.moved = false;
      g.current.t0 = performance.now();
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    const st = g.current;
    if (st.type === 'pinch' && pointers.current.size >= 2) {
      const { dist, mid } = two();
      const s = Math.min(MAX_ZOOM, Math.max(1, (st.start.s * dist) / st.dist0));
      const z = zoomAround(st.start, st.mid0, s);
      apply(clamp({ s, x: z.x + (mid.x - st.mid0.x), y: z.y + (mid.y - st.mid0.y) }));
      return;
    }
    const dx = p.x - st.p0.x;
    const dy = p.y - st.p0.y;
    if (Math.hypot(dx, dy) > 8) st.moved = true;
    if (st.type === 'pan') {
      apply(clamp({ s: st.start.s, x: st.start.x + dx, y: st.start.y + dy }));
    } else if (st.type === 'swipe') {
      apply({ s: 1, x: dx, y: 0 });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    const p = local(e);
    pointers.current.delete(e.pointerId);
    const st = g.current;

    if (st.type === 'pinch') {
      if (pointers.current.size === 1) {
        // One finger left: continue as a pan without jumping.
        beginSingle(Array.from(pointers.current.values())[0]);
        g.current.moved = true;
      } else if (pointers.current.size === 0) {
        st.type = 'none';
        if (xfRef.current.s < 1.05) apply({ s: 1, x: 0, y: 0 }, true);
      }
      return;
    }
    if (pointers.current.size > 0) return;

    if (st.type === 'swipe') {
      const dx = p.x - st.p0.x;
      if (Math.abs(dx) > 60) {
        onSwipe(dx < 0 ? 1 : -1);
        st.type = 'none';
        return;
      }
      apply({ s: 1, x: 0, y: 0 }, true);
    }
    st.type = 'none';

    // Double tap / double click toggles zoom at the tapped point.
    if (!st.moved && performance.now() - st.t0 < 300) {
      const now = performance.now();
      const lt = lastTap.current;
      if (now - lt.t < 320 && Math.hypot(p.x - lt.x, p.y - lt.y) < 40) {
        const cur = xfRef.current;
        apply(cur.s > 1.01 ? { s: 1, x: 0, y: 0 } : clamp(zoomAround(cur, p, TAP_ZOOM)), true);
        lastTap.current = { t: 0, x: 0, y: 0 };
      } else {
        lastTap.current = { t: now, x: p.x, y: p.y };
      }
    }
  };

  return (
    <div
      ref={ref}
      className={`absolute inset-0 touch-none select-none ${xf.s > 1.01 ? 'cursor-grab' : 'cursor-zoom-in'}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${xf.x}px, ${xf.y}px, 0) scale(${xf.s})`,
          transition: smooth ? 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProjectLightbox({ project, onClose, anchorId }: ProjectLightboxProps) {
  const images = project.images;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [expanded, setExpanded] = useState(false);
  // True while we hold the browser's native fullscreen (Fullscreen API).
  const nativeFsRef = useRef(false);
  const [showInfo, setShowInfo] = useState(false);
  const showInfoRef = useRef(false);
  useEffect(() => {
    showInfoRef.current = showInfo;
  }, [showInfo]);
  const hasInfo = Boolean(project.details?.length || project.description?.length);
  const dialogRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);


  // Fullscreen button: expands the photo to the whole window and, where the
  // browser allows it (Android/desktop; not iPhone Safari), also enters native
  // fullscreen so the browser UI disappears.
  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      const el = dialogRef.current as FsEl | null;
      try {
        if (el?.requestFullscreen) {
          el.requestFullscreen()
            .then(() => (nativeFsRef.current = true))
            .catch(() => {});
        } else if (el?.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
          nativeFsRef.current = true;
        }
      } catch {
        /* layout-only fullscreen still applies */
      }
    } else {
      nativeFsRef.current = false;
      exitNativeFs();
    }
  };

  // Leaving native fullscreen via Esc / back gesture also leaves expanded mode.
  useEffect(() => {
    const onFsChange = () => {
      if (!fsElement() && nativeFsRef.current) {
        nativeFsRef.current = false;
        setExpanded(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      exitNativeFs();
    };
  }, []);
  useEffect(() => {
    const el = thumbsRef.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [index]);

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
        if (showInfoRef.current) setShowInfo(false);
        else onClose();
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
      // Let the info panel scroll natively instead of flipping images.
      if (showInfoRef.current) return;
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
        className={`fixed inset-0 z-[100] flex flex-col items-center overflow-hidden overscroll-none bg-black/90 backdrop-blur-xl landscape-mobile:p-0 landscape-mobile:justify-center ${
          expanded ? 'p-0 justify-center' : 'pt-20 pb-4 justify-start md:px-4 md:py-16 md:justify-center'
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
          className="absolute top-6 left-6 z-30 w-11 h-11 rounded-full border border-white/20 bg-black/40 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleExpanded();
          }}
          aria-label={expanded ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}
          aria-pressed={expanded}
          className="flex absolute top-6 left-20 z-30 w-11 h-11 rounded-full border border-white/20 bg-black/40 items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {expanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>

        {/* Project info toggle */}
        {hasInfo && (
          <button
            onClick={e => {
              e.stopPropagation();
              setShowInfo(v => !v);
            }}
            aria-label={showInfo ? 'بستن جزئیات پروژه' : 'جزئیات پروژه'}
            aria-pressed={showInfo}
            className={`absolute top-6 left-[8.5rem] z-30 h-11 px-3 sm:px-4 rounded-full border flex items-center gap-2 text-sm transition-colors ${
              showInfo
                ? 'border-primary/60 bg-primary/15 text-primary'
                : 'border-white/20 bg-black/40 text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="hidden sm:inline">جزئیات پروژه</span>
          </button>
        )}

        {/* Title */}
        <div className={`mb-3 md:mb-6 px-4 text-center landscape-mobile:hidden ${expanded ? 'hidden' : ''}`}>
          <h3 className="text-xl md:text-3xl font-light text-primary">{project.text}</h3>
          {project.subtitle && (
            <p className="text-xs md:text-sm text-white/50 mt-1 tracking-widest">{project.subtitle}</p>
          )}
        </div>

        {/* Stage */}
        <div
          className={`relative overflow-hidden md:bg-white/5 landscape-mobile:max-w-none landscape-mobile:h-full landscape-mobile:aspect-auto landscape-mobile:rounded-none landscape-mobile:border-0 landscape-mobile:bg-transparent ${
            expanded
              ? 'w-full h-full max-w-none rounded-none border-0 bg-transparent'
              : 'w-full flex-1 min-h-0 md:flex-none md:max-w-[960px] md:aspect-[4/3] md:max-h-[calc(100dvh-19rem)] md:rounded-2xl md:border md:border-white/10'
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
            >
              <ZoomPan onSwipe={paginate}>
              <Image
                src={images[index]}
                alt={`${project.text} - تصویر ${toFa(index + 1)}`}
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                // Always show the full photo (no cropping) — letterbox instead.
                className="pointer-events-none select-none object-contain"
                draggable={false}
                priority
              />
              </ZoomPan>
            </motion.div>
          </AnimatePresence>

          {/* Per-image badge, e.g. «قبل از بازسازی» */}
          {project.captions?.[index] && !showInfo && (
            <span className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs md:text-sm text-white/90 pointer-events-none">
              {project.captions[index]}
            </span>
          )}

          {/* Info panel (overlays the stage so the layout never overflows) */}
          <AnimatePresence>
            {hasInfo && showInfo && (
              <motion.div
                key="info"
                className={`absolute inset-0 z-20 overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-md p-6 md:p-10 text-right landscape-mobile:pt-20 ${
                  expanded ? 'pt-24 md:pt-24' : ''
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h4 className="text-xl md:text-2xl font-light text-primary">{project.text}</h4>
                  <button
                    onClick={() => setShowInfo(false)}
                    aria-label="بستن جزئیات پروژه"
                    className="shrink-0 w-10 h-10 rounded-full border border-white/20 bg-black/40 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {project.details && project.details.length > 0 && (
                  <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 mb-8">
                    {project.details.map(d => (
                      <div key={d.label} className="border-r border-white/15 pr-3">
                        <dt className="text-xs text-white/45 mb-1">{d.label}</dt>
                        <dd className="text-sm md:text-base text-white/90">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {project.description?.map((para, i) => (
                  <p key={i} className="text-sm md:text-base leading-8 text-white/75 mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prev / Next (RTL: next on the left, previous on the right) */}
          {images.length > 1 && !showInfo && (
            <>
              <button
                onClick={() => paginate(1)}
                aria-label="بعدی"
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-md items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => paginate(-1)}
                aria-label="قبلی"
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-md items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Counter + thumbnails */}
        {images.length > 1 && (
          <div
            className={`w-full max-w-[960px] flex flex-col items-center gap-2 md:gap-3 landscape-mobile:absolute landscape-mobile:bottom-2 landscape-mobile:mt-0 ${
              expanded ? 'absolute bottom-4 mt-0' : 'mt-3 md:mt-5'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div
              ref={thumbsRef}
              className={`${expanded ? 'hidden' : 'flex'} gap-2 max-w-full overflow-x-auto px-3 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
            >
              {images.map((src, i) => (
                <button
                  key={src}
                  aria-label={`تصویر ${toFa(i + 1)}`}
                  aria-current={i === index}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`relative shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden border-2 transition-all ${
                    i === index ? 'border-primary opacity-100' : 'border-transparent opacity-45 hover:opacity-80'
                  }`}
                >
                  <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
            <span className="text-white/50 text-xs md:text-sm tracking-widest">
              {toFa(index + 1)} / {toFa(images.length)}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

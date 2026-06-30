'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CircularGallery, { type CircularGalleryHandle } from '@/components/CircularGallery';
import ProjectLightbox from '@/components/ProjectLightbox';

interface Project {
  text: string;
  subtitle: string;
  image: string;
  images: string[];
}

const projects: Project[] = [
  {
    text: 'برج زنیت',
    subtitle: 'مجتمع مسکونی لوکس',
    image: '/images/projects/zenith_tower_1782773624285.jpg',
    images: [
      '/images/projects/zenith_tower_1782773624285.jpg',
      '/images/projects/zenith_tower_lobby_1782774571011.jpg',
      '/images/projects/zenith_tower_apt_1782774580394.jpg'
    ]
  },
  {
    text: 'ویلا کاسپین',
    subtitle: 'ویلای خصوصی',
    image: '/images/projects/caspian_villa_1782773635794.jpg',
    images: [
      '/images/projects/caspian_villa_1782773635794.jpg',
      '/images/projects/caspian_villa_living_1782774590178.jpg',
      '/images/projects/caspian_villa_pool_1782774599979.jpg'
    ]
  },
  {
    text: 'مجتمع آرکا',
    subtitle: 'تجاری',
    image: '/images/projects/arca_complex_1782773649478.jpg',
    images: [
      '/images/projects/arca_complex_1782773649478.jpg',
      '/images/projects/arca_complex_atrium_1782774610333.jpg',
      '/images/projects/arca_complex_dining_1782774621444.jpg'
    ]
  },
  {
    text: 'دفتر مرکزی هورامان',
    subtitle: 'اداری',
    image: '/images/projects/houraman_hq_1782773660467.jpg',
    images: [
      '/images/projects/houraman_hq_1782773660467.jpg',
      '/images/projects/houraman_hq_workspace_1782774631366.jpg',
      '/images/projects/houraman_hq_boardroom_1782774824942.jpg'
    ]
  },
  {
    text: 'بازسازی نیاوران',
    subtitle: 'بازسازی و دکوراسیون',
    image: '/images/projects/niavaran_renovation_1782773671312.jpg',
    images: [
      '/images/projects/niavaran_renovation_1782773671312.jpg',
      '/images/projects/niavaran_kitchen_1782774834944.jpg',
      '/images/projects/niavaran_bedroom_1782774844954.jpg'
    ]
  },
  {
    text: 'پنت‌هاوس الوند',
    subtitle: 'مسکونی لوکس',
    image: '/images/projects/alvand_penthouse_1782773681642.jpg',
    images: [
      '/images/projects/alvand_penthouse_1782773681642.jpg',
      '/images/projects/project-6-2.jpg',
      '/images/projects/project-6-3.jpg'
    ]
  },
  {
    text: 'لابی هتل درسا',
    subtitle: 'دکوراسیون داخلی',
    image: '/images/projects/dorsa_hotel_lobby_1782773692288.jpg',
    images: [
      '/images/projects/dorsa_hotel_lobby_1782773692288.jpg',
      '/images/projects/project-7-2.jpg',
      '/images/projects/project-7-3.jpg'
    ]
  }
];

export default function ProjectsShowcase() {
  const [selected, setSelected] = useState<number | null>(null);
  // Mobile gets a softer bend and scroll-linked rotation (vertical page scroll
  // spins the gallery); desktop keeps the wheel/drag interaction.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const apply = () => setIsMobile(window.innerWidth < 768);
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  const bend = isMobile ? 1 : 3;

  const galleryRef = useRef<CircularGalleryHandle>(null);
  const items = useMemo(() => projects.map(p => ({ image: p.image, text: p.text })), []);
  const handleItemClick = useCallback((index: number) => setSelected(index), []);
  // On close, snap the gallery back to the project that was opened so it never
  // jumps to a different item (e.g. on mobile where scroll drives rotation).
  const handleClose = useCallback(() => {
    setSelected(prev => {
      if (prev !== null) {
        const idx = prev;
        // Slight delay so this wins over the scroll event fired by the
        // lightbox's scroll-position restore.
        window.setTimeout(() => galleryRef.current?.centerItem(idx), 60);
      }
      return null;
    });
  }, []);

  return (
    <>
      <div className="h-[520px] md:h-[640px] w-full">
        <CircularGallery
          ref={galleryRef}
          items={items}
          bend={bend}
          textColor="#ffffff"
          borderRadius={0.05}
          font="bold 30px Vazirmatn"
          scrollSpeed={2}
          scrollEase={0.05}
          scrollLinked={isMobile}
          onItemClick={handleItemClick}
        />
      </div>
      <p className="mt-6 text-center text-white/60 text-xs md:text-sm tracking-widest">
        برای مشاهده‌ی تصاویر هر پروژه روی کارت میانی ضربه بزنید
      </p>

      {/* Accessible / SEO fallback: the gallery labels live inside a WebGL
          canvas and are invisible to crawlers and screen readers. */}
      <ul className="sr-only">
        {projects.map((p, i) => (
          <li key={p.text}>
            <button type="button" onClick={() => setSelected(i)}>
              {p.text} — {p.subtitle}
            </button>
          </li>
        ))}
      </ul>

      {selected !== null && (
        <ProjectLightbox project={projects[selected]} onClose={handleClose} anchorId="portfolio" />
      )}
    </>
  );
}

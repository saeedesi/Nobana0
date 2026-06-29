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
    image: '/images/projects/project-1.jpg',
    images: [
      '/images/projects/project-1.jpg',
      '/images/projects/project-1-2.jpg',
      '/images/projects/project-1-3.jpg'
    ]
  },
  {
    text: 'ویلا کاسپین',
    subtitle: 'ویلای خصوصی',
    image: '/images/projects/project-2.jpg',
    images: [
      '/images/projects/project-2.jpg',
      '/images/projects/project-2-2.jpg',
      '/images/projects/project-2-3.jpg'
    ]
  },
  {
    text: 'مجتمع آرکا',
    subtitle: 'تجاری',
    image: '/images/projects/project-3.jpg',
    images: [
      '/images/projects/project-3.jpg',
      '/images/projects/project-3-2.jpg',
      '/images/projects/project-3-3.jpg'
    ]
  },
  {
    text: 'دفتر مرکزی هورامان',
    subtitle: 'اداری',
    image: '/images/projects/project-4.jpg',
    images: [
      '/images/projects/project-4.jpg',
      '/images/projects/project-4-2.jpg',
      '/images/projects/project-4-3.jpg'
    ]
  },
  {
    text: 'بازسازی نیاوران',
    subtitle: 'بازسازی و دکوراسیون',
    image: '/images/projects/project-5.jpg',
    images: [
      '/images/projects/project-5.jpg',
      '/images/projects/project-5-2.jpg',
      '/images/projects/project-5-3.jpg'
    ]
  },
  {
    text: 'پنت‌هاوس الوند',
    subtitle: 'مسکونی لوکس',
    image: '/images/projects/project-6.jpg',
    images: [
      '/images/projects/project-6.jpg',
      '/images/projects/project-6-2.jpg',
      '/images/projects/project-6-3.jpg'
    ]
  },
  {
    text: 'لابی هتل درسا',
    subtitle: 'دکوراسیون داخلی',
    image: '/images/projects/project-7.jpg',
    images: [
      '/images/projects/project-7.jpg',
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
      <p className="mt-6 text-center text-white/40 text-xs md:text-sm tracking-widest">
        برای مشاهده‌ی تصاویر هر پروژه روی کارت میانی ضربه بزنید
      </p>

      {selected !== null && (
        <ProjectLightbox project={projects[selected]} onClose={handleClose} anchorId="portfolio" />
      )}
    </>
  );
}

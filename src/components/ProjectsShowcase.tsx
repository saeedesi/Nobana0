'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CircularGallery, { type CircularGalleryHandle } from '@/components/CircularGallery';
import ProjectLightbox from '@/components/ProjectLightbox';

interface Project {
  text: string;
  subtitle: string;
  image: string;
  images: string[];
  details?: { label: string; value: string }[];
  description?: string[];
  /** Optional per-image badge (same order as `images`), e.g. «قبل از بازسازی». */
  captions?: (string | null)[];
}

/** Badge list: `before` empty slots followed by `count` copies of `label`. */
const tail = (before: number, count: number, label: string): (string | null)[] => [
  ...Array<null>(before).fill(null),
  ...Array<string>(count).fill(label)
];

const projects: Project[] = [
  {
    text: 'پروژه تجاری آبسرد',
    subtitle: 'تجاری · آبسرد، دماوند',
    image: '/images/projects/absard-commercial-1.jpg',
    images: [
      '/images/projects/absard-commercial-1.jpg',
      '/images/projects/absard-commercial-5.jpg',
      '/images/projects/absard-commercial-2.jpg',
      '/images/projects/absard-commercial-3.jpg',
      '/images/projects/absard-commercial-4.jpg'
    ],
    details: [
      { label: 'موقعیت', value: 'آبسرد، دماوند' },
      { label: 'کارفرما', value: 'آقای نژاد' },
      { label: 'سال اجرا', value: '۱۳۹۸ تا ۱۳۹۹' },
      { label: 'تعداد طبقات', value: 'یک طبقه' },
      { label: 'مساحت زمین', value: '۵۰۰ متر مربع' },
      { label: 'زیربنا', value: '۲۰۰ متر مربع' },
      { label: 'مدیریت و اجرا', value: 'NOBANA' }
    ],
    description: [
      'طراحی پروژه با رویکردی پویا و دعوت‌کننده انجام شد تا نما توجه رهگذران را جلب کرده و آنان را به ورود ترغیب کند. فضای داخلی با رویکردی مینیمال و ساده طراحی شد تا محیطی منظم و هماهنگ با کاربری تجاری ایجاد شود.',
      'شرکت NOBANA مسئولیت مدیریت و اجرای صفر تا صد پروژه را بر عهده داشت و تمامی مراحل را با تمرکز بر هماهنگی تیم‌های اجرایی و کنترل کیفی تا مرحله نهایی پیش برد.',
      'این پروژه نمونه‌ای از رویکرد نوبناست که در آن موقعیت ملک، طراحی، عملکرد و اجرای دقیق در کنار هم قرار می‌گیرند تا یک فضای تجاری متمایز و اثرگذار شکل بگیرد.'
    ]
  },
  {
    text: 'مجموعه فروشگاه‌های برندس',
    subtitle: 'تجاری · فروشگاه پوشاک مردانه',
    image: '/images/projects/brands-store-1.jpg',
    images: [
      '/images/projects/brands-store-1.jpg',
      '/images/projects/brands-store-2.jpg',
      '/images/projects/brands-store-3.jpg',
      '/images/projects/brands-store-4.jpg',
      '/images/projects/brands-store-5.jpg',
      '/images/projects/brands-store-6.jpg',
      '/images/projects/brands-store-7.jpg',
      '/images/projects/brands-store-8.jpg',
      '/images/projects/brands-store-9.jpg',
      '/images/projects/brands-store-10.jpg',
      '/images/projects/brands-store-11.jpg',
      '/images/projects/brands-store-12.jpg',
      '/images/projects/brands-store-13.jpg',
      '/images/projects/brands-store-14.jpg'
    ],
    details: [
      { label: 'کاربری', value: 'فروشگاه تخصصی پوشاک مردانه' },
      { label: 'کارفرما', value: 'آقای مطلق' },
      { label: 'سال اجرا و اتمام', value: '۱۳۹۵' },
      { label: 'مدیریت و اجرا', value: 'NOBANA' }
    ],
    captions: tail(6, 8, 'حین اجرا'),
    description: [
      'این مجموعه با تمرکز بر ایجاد فضایی شیک، منظم و متناسب با هویت یک برند تخصصی اجرا شد.',
      'شرکت NOBANA در تمامی مراحل، با تأکید بر کیفیت اجرا، هماهنگی عوامل و خلق تجربه‌ای متمایز برای مشتریان عمل کرد.',
      'این پروژه نمونه‌ای از رویکرد NOBANA در فضاهای تجاری است؛ جایی که طراحی، هویت برند و عملکرد در کنار هم قرار می‌گیرند تا فضایی اثرگذار خلق شود.'
    ]
  },
  {
    text: 'پروژه اداری DNP',
    subtitle: 'اداری · تهران، خیابان شیخ بهایی',
    image: '/images/projects/dnp-office-1.jpg',
    images: [
      '/images/projects/dnp-office-1.jpg',
      '/images/projects/dnp-office-2.jpg',
      '/images/projects/dnp-office-3.jpg',
      '/images/projects/dnp-office-4.jpg',
      '/images/projects/dnp-office-5.jpg',
      '/images/projects/dnp-office-6.jpg',
      '/images/projects/dnp-office-7.jpg',
      '/images/projects/dnp-office-8.jpg',
      '/images/projects/dnp-office-9.jpg',
      '/images/projects/dnp-office-10.jpg',
      '/images/projects/dnp-office-11.jpg',
      '/images/projects/dnp-office-12.jpg',
      '/images/projects/dnp-office-13.jpg',
      '/images/projects/dnp-office-14.jpg',
      '/images/projects/dnp-office-15.jpg'
    ],
    captions: tail(11, 4, 'قبل از بازسازی'),
    details: [
      { label: 'کاربری', value: 'دفتر واردات و فروش تجهیزات پزشکی' },
      { label: 'کارفرما', value: 'آقای موسوی' },
      { label: 'موقعیت', value: 'تهران، خیابان شیخ بهایی' },
      { label: 'زیربنا', value: '۱۸۰ متر مربع' },
      { label: 'تعداد واحد', value: 'یک واحد' },
      { label: 'طراحی و اجرا', value: 'NOBANA' }
    ],
    description: [
      'این فضا پیش از بازطراحی ظاهری قدیمی و نورپردازی نامناسبی داشت که باعث خستگی چشم و کاهش کیفیت محیط کار می‌شد.',
      'نوبنا با رویکردی مدرن طراحی فضا را بازتعریف کرد و بر اصلاح نور، بهبود کیفیت بصری و چیدمان داخلی تمرکز داشت. پس از تأیید طرح، عملیات اجرا انجام شد و در نهایت محیطی اداری مدرن، کارآمد و متناسب با نیازهای روز شکل گرفت.',
      'این پروژه نمونه‌ای است از نگاه نوبنا به طراحی فضاهای اداری؛ جایی که طراحی داخلی نه فقط به‌عنوان زیبایی، بلکه به‌عنوان ابزاری برای ارتقای کیفیت محیط کار و رضایت کارکنان دیده می‌شود.'
    ]
  },
  {
    text: 'هلدینگ ایرانیان',
    subtitle: 'اداری و بانکی · تهران، سعادت‌آباد',
    image: '/images/projects/iranian-holding-1.jpg',
    images: [
      '/images/projects/iranian-holding-1.jpg',
      '/images/projects/iranian-holding-2.jpg',
      '/images/projects/iranian-holding-3.jpg',
      '/images/projects/iranian-holding-4.jpg',
      '/images/projects/iranian-holding-5.jpg',
      '/images/projects/iranian-holding-6.jpg',
      '/images/projects/iranian-holding-7.jpg',
      '/images/projects/iranian-holding-8.jpg',
      '/images/projects/iranian-holding-9.jpg',
      '/images/projects/iranian-holding-10.jpg',
      '/images/projects/iranian-holding-11.jpg',
      '/images/projects/iranian-holding-12.jpg',
      '/images/projects/iranian-holding-13.jpg'
    ],
    details: [
      { label: 'کارفرما', value: 'شرکت هلدینگ ایرانیان' },
      { label: 'موقعیت', value: 'تهران، سعادت‌آباد' },
      { label: 'متراژ', value: '۱۰۰۰ متر مربع' },
      { label: 'تعداد طبقات', value: 'چهار طبقه' },
      { label: 'کاربری', value: 'یک طبقه بانکی، دو طبقه اداری، یک طبقه مدیریت' },
      { label: 'سال اجرا', value: '۱۳۹۰' },
      { label: 'طراحی', value: 'خانم مهندس روحانی' },
      { label: 'اجرا', value: 'NOBANA' }
    ],
    description: [
      'پروژه اداری شرکت هلدینگ ایرانیان شامل یک طبقه بخش بانکی، دو طبقه فضای اداری و یک طبقه مدیریت است. طراحی پروژه توسط خانم مهندس روحانی انجام شد و اجرای کامل آن بر عهده شرکت NOBANA قرار گرفت.',
      'در طراحی و اجرای بخش بانکی تلاش شد فضایی متفاوت از الگوهای تکراری و خسته‌کننده رایج در شعب بانکی شکل بگیرد و تجربه‌ای به‌روز و متمایز برای مراجعان و کارکنان ایجاد شود.',
      'نوبنا با تمرکز بر دقت در اجرا، کیفیت و هماهنگی کامل با طرح معماری، ایده‌ی طراحی را به فضای واقعی تبدیل کرد و مجموعه‌ای متفاوت و کاربردی پدید آورد که هویت بصری آن از الگوهای معمول فضاهای بانکی فاصله گرفت و نگاه تازه‌ای به طراحی و اجرای محیط‌های اداری و بانکی ارائه داد.'
    ]
  },
  {
    text: 'بوتیک مال ملل',
    subtitle: 'تجاری · تهران، خیابان فرشته',
    image: '/images/projects/mellal-boutique-1.jpg',
    images: [
      '/images/projects/mellal-boutique-1.jpg',
      '/images/projects/mellal-boutique-2.jpg',
      '/images/projects/mellal-boutique-3.jpg',
      '/images/projects/mellal-boutique-4.jpg',
      '/images/projects/mellal-boutique-5.jpg',
      '/images/projects/mellal-boutique-6.jpg'
    ],
    captions: [
      'واحد اول · تاتی',
      'واحد اول · تاتی',
      'واحد اول · تاتی',
      'واحد دوم · راه ابریشم',
      'واحد دوم · راه ابریشم',
      null
    ],
    details: [
      { label: 'کارفرما', value: 'آقای صدقی نسب' },
      { label: 'موقعیت', value: 'تهران، خیابان فرشته' },
      { label: 'سال اجرا', value: '۱۴۰۰' },
      { label: 'واحدها', value: 'دو واحد تجاری حدود ۲۰۰ متری' },
      { label: 'واحد اول', value: 'لوازم خانگی ترکیه، برند Tati' },
      { label: 'واحد دوم', value: 'پوشاک زنانه راه ابریشم' },
      { label: 'اجرا', value: 'NOBANA' }
    ],
    description: [
      'این مجموعه شامل دو واحد تجاری حدود ۲۰۰ متری است: واحد اول فروشگاه تخصصی لوازم خانگی ترکیه با برند Tati و واحد دوم فروشگاه پوشاک زنانه راه ابریشم.',
      'با توجه به تعداد محدود واحدهای تجاری در این مجتمع، اجرای پروژه با چالش‌های زمانی همراه بود و عملیات اجرایی به منظور کاهش مزاحمت برای کسب‌وکارهای اطراف، عمدتاً در ساعات شب انجام شد.',
      'شرکت NOBANA مسئولیت اجرای کامل پروژه را بر عهده داشت و تمرکز اصلی تیم بر دقت در جزئیات، کیفیت متریال و همسویی اجرا با نیاز برند بود.'
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

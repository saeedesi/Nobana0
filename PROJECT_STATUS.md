# گزارش وضعیت پروژه نوبنا
**تاریخ:** ۱۴۰۵/۰۵/۰۵ (2026-07-27) · **مخزن:** آخرین کامیت `bb61c35`

---

## ✅ انجام‌شده

### فاز ۱ — پایه و زیرساخت
- Next.js 16.2.9 + React 19 + TypeScript + Tailwind v4 + App Router (`src/`)
- فونت Vazirmatn به‌صورت self-host، layout با `dir="rtl"`
- پالت برند Platinum Minimal در `globals.css`
- shadcn/ui + Framer Motion نصب و پیکربندی شد
- `prisma/schema.prisma` کامل: `Project`, `ProjectUpdate`, `Client`, `ClientProject`, `Testimonial`, `ConsultationRequest`, `Admin` + enums
- `docker-compose.dev.yml` برای Postgres محلی، `.env.example`

### فاز ۲ — صفحه اصلی
صفحه اصلی به‌صورت One-pager اسمبل شده (`src/app/page.tsx`) با ۶ سکشن:

| سکشن | کامپوننت | وضعیت |
|---|---|---|
| Hero اسکرول‌محور | `ScrollHero` + `HeroStats` | ✅ |
| خدمات (۶ کارت) | `ServicesSection` | ✅ داده استاتیک |
| پروژه‌های منتخب | `ProjectsShowcase` + `CircularGallery` (WebGL/ogl) | ✅ داده استاتیک |
| درباره بنیان‌گذار | `AboutFounder` | ✅ |
| معرفی پنل کارفرما | `PanelIntroSection` | ✅ |
| فرم مشاوره | `ConsultationForm` | ✅ متصل به DB |
| فوتر + CTA شناور | `Footer`, `FloatingConsultCTA`, `ScrollToTop` | ✅ |

**گالری WebGL:** لایت‌باکس تصویر با زوم، paging با wheel در دسکتاپ، swipe در موبایل، چرخش scroll-linked در موبایل، قفل اسکرول iOS-safe، بازگشت دقیق به موقعیت اسکرول پس از بستن. (۱۵+ کامیت رفع باگ روی همین بخش)

### دسترسی‌پذیری (a11y)
- احترام به `prefers-reduced-motion`
- semantics و focus-trap برای دیالوگ‌ها
- اصلاح کنتراست، اندازه هدف لمسی، ساختار heading

### فاز ۴ (بخش پایه) — بک‌اند و ادمین
- `POST /api/consultation` — ذخیره واقعی لید در دیتابیس
- `POST /api/admin/login` و `/api/admin/logout` — JWT (jose, HS256) در کوکی HttpOnly، رمز با bcrypt
- `src/middleware.ts` — محافظت از `/admin/*` در لبه (Edge)
- `/admin/login` و `/admin/dashboard` — داشبورد با آمار زنده (پروژه‌ها، لیدهای جدید، کارفرمایان فعال)
- `prisma/seed.ts` — ساخت اولین ادمین از `.env`
- `BACKEND_SETUP.md` — راهنمای راه‌اندازی

---

## ⏳ باقی‌مانده

### ۱. تکمیل پنل ادمین (اولویت بالا)
- `/admin/projects` — CRUD پروژه + آپلود تصویر در `public/uploads`
- `/admin/consultations` — لیست لیدها + تغییر وضعیت (`NEW → CONTACTED → QUALIFIED → CLOSED`)
- `/admin/clients` — CRUD کارفرما، اختصاص پروژه، ریست رمز
- `/admin/projects/[id]/updates` — ثبت گزارش پیشرفت برای هر پروژه

### ۲. پنل کارفرمایان (فعلاً «به‌زودی»)
`/panel` در حال حاضر فقط صفحه Coming Soon است. نیاز به:
- `POST /api/auth/login` و `logout` مجزا از ادمین + محافظت `/panel/*`
- `/panel/login`، `/panel/dashboard`، `/panel/project/[id]`
- کامپوننت `ProjectTimeline` (فازها + درصد پیشرفت) و `UpdatesList`

### ۳. اتصال محتوای استاتیک به دیتابیس
- `GET /api/projects?featured=true&type=...`
- `ServicesSection` و `ProjectsShowcase` از DB بخوانند
- `TestimonialsMarquee` — نوار نظرات (هنوز ساخته نشده)

### ۴. صفحات عمومی باقی‌مانده
- `/projects` — گرید همه پروژه‌ها با فیلتر مسکونی/اداری/تجاری
- `/projects/[slug]` — جزئیات پروژه
- `/about`, `/catalog` (دانلود PDF), `/collaboration` (همکاری با ما)

### ۵. سئو
متاتگ‌های کامل، OG tags، `sitemap.xml`، `robots.txt`، داده ساختاریافته (JSON-LD)

### ۶. استقرار روی VPS (فاز نهایی)
- `Dockerfile` (multi-stage، `output: 'standalone'`) — **هنوز ساخته نشده**
- `docker-compose.yml` پروداکشن: app + Postgres + Nginx
- کانفیگ Nginx + SSL با Let's Encrypt برای `nobana.ir`
- استراتژی بکاپ دیتابیس

---

## ✅ بدهی فنی رفع‌شده (۱۴۰۵/۰۵/۰۵)

- **pnpm به‌عنوان پکیج‌منیجر رسمی:** `package-lock.json` حذف شد، نسخه با `"packageManager": "pnpm@11.17.0"` پین شد، `engines.node >= 22` اضافه شد.
- **`output: 'standalone'`** در `next.config.ts` فعال شد + `outputFileTracingIncludes` برای موتور Prisma.
- **مسیر تولید کلاینت Prisma تغییر کرد** به `src/generated/prisma` (به‌همراه `binaryTargets` برای Debian).
  دلیل: با pnpm مسیر پیش‌فرض داخل `node_modules/.pnpm/@prisma+client@<hash>/` قرار می‌گیرد و file-tracer نکست آن symlink را در حالت standalone دنبال نمی‌کند. ایمپورت‌ها در `src/lib/prisma.ts` و `prisma/seed.ts` به‌روز شدند.
- **`Dockerfile` چندمرحله‌ای** با corepack + کش store برای pnpm، `node:22-bookworm-slim`، کاربر غیر-root، healthcheck.
- **`docker-compose.yml` پروداکشن:** db (بدون پورت عمومی) + migrate (یک‌بار) + app + nginx + certbot.
- **`nginx/nobana.conf`:** SSL، HSTS، gzip، کش دارایی‌های `_next/static`، مسیر ACME.
- **`.dockerignore`** اضافه شد.

- **بیلد تأیید شد** (`pnpm install && pnpm build` با pnpm 11.17.0):
  موتور `libquery_engine-debian-openssl-3.0.x.so.node` در `.next/standalone/src/generated/prisma/` قرار می‌گیرد — یعنی ایمیج داکر واقعاً می‌تواند به دیتابیس کوئری بزند. حجم standalone: ۱۰۳ مگابایت.

> **هشدار بی‌خطر در بیلد:** Turbopack پیام «whole project was traced» می‌دهد. علت، فراخوانی‌های داینامیک `path.join` داخل `index.js` تولیدشده‌ی Prisma است، نه تنظیمات ما. حذف `outputFileTracingIncludes` هشدار را برنمی‌دارد ولی احتمالاً فایل موتور را از خروجی حذف می‌کند — پس همین‌طور بماند.

## ⚠️ باقی‌مانده در بدهی فنی
1. **پوشه `prisma/migrations` هنوز وجود ندارد** — باید یک‌بار `pnpm db:migrate --name init` اجرا و نتیجه کامیت شود. بدون آن سرویس `migrate` در پروداکشن کاری نمی‌کند.
2. `pnpm-lock.yaml`، `pnpm-workspace.yaml` و فایل‌های داکر هنوز کامیت نشده‌اند.
3. **`src/middleware.ts` → `src/proxy.ts`** — در Next.js 16 قرارداد `middleware` منسوخ شده. همین فایل از `/admin/*` محافظت می‌کند، پس قبل از ارتقا به Next 17 باید منتقل شود.
4. **`package.json#prisma`** (کلید `seed`) منسوخ شده — باید به `prisma.config.ts` منتقل شود.

---

## پیشنهاد ترتیب کار
```
۱. اجرای مایگریشن اولیه و کامیت prisma/migrations  ← گام بعدی
۲. تکمیل CRUD ادمین → محتوا از DB بیاید
۳. پنل کارفرمایان (ارزش اصلی محصول)
۴. صفحات عمومی باقی‌مانده + سئو
۵. انتقال middleware → proxy و prisma.config.ts
۶. استقرار روی VPS با فایل‌های Docker آماده‌شده
```

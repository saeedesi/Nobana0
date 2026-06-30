# 🏗️ معماری فنی پروژه Nobana
> **نقش:** Senior Architect + Product Manager  
> **مخاطب:** Antigravity (ایجنت اجرایی)  
> **استک قطعی:** Next.js 14+ (Standalone) · Tailwind CSS · **shadcn/ui** · **Framer Motion** · PostgreSQL · Prisma ORM · Docker · Nginx  
> **هاستینگ:** VPS ایرانی Self-Hosted  

---

## ۱. هدف اصلی سایت و Feature List

### هدف
وب‌سایت رسمی **نوبنا** — شرکت مدیریت پیمان، طراحی و اجرا، بازسازی و دکوراسیون داخلی.  
هدف اصلی: تبدیل بازدیدکننده به لید از طریق اعتمادسازی، و ارائه پنل شفاف پروژه برای کارفرمایان فعلی.

### Feature List

#### عمومی (Public)
- [ ] **Hero Section** — تیتر اصلی، زیرتیتر، دو دکمه CTA (مشاهده پروژه‌ها / درخواست مشاوره)، کانتر آمار (۵۰+ پروژه، ۴۰+ کارفرما، ۲۰+ سال)
- [ ] **بخش خدمات** — ۶ کارت خدمت با آیکون، عنوان و توضیح کوتاه
- [ ] **نمایش پروژه‌های منتخب** — گالری/اسلایدر با فیلتر (مسکونی / اداری / تجاری)
- [ ] **صفحه جزئیات هر پروژه** — تصاویر، مشخصات (نوع، متراژ، موقعیت، وضعیت)
- [ ] **نوار نظرات کارفرمایان** (Testimonial Marquee)
- [ ] **بخش درباره ما** — معرفی برند + بنیان‌گذار (پدرام رجبی‌مهر)
- [ ] **فرم درخواست مشاوره** — نام، شماره، ایمیل، نوع پروژه، توضیح
- [ ] **بخش همکاری با ما** — جذب معماران و شرکای تجاری
- [ ] **کاتالوگ** — دانلود PDF و مشاهده آنلاین
- [ ] **فوتر** — اطلاعات تماس، لینک‌های سریع، شبکه‌های اجتماعی
- [ ] **دکمه شناور درخواست مشاوره** — در تمام صفحات
- [ ] **سئوی On-page** — متاتگ، OG tags، ساختار H1/H2/H3، sitemap.xml، robots.txt

#### پنل کارفرمایان (Client Panel)
- [ ] **صفحه ورود** — ایمیل + رمز عبور
- [ ] **داشبورد کارفرما** — خلاصه وضعیت پروژه(های) فعال
- [ ] **تایم‌لاین پروژه** — مراحل پروژه و درصد پیشرفت هر فاز
- [ ] **گزارش‌های پروژه** — لیست به‌روزرسانی‌ها با تاریخ و توضیح
- [ ] **خروج از حساب**

#### پنل مدیریت / ادمین (Admin Panel)
- [ ] **ورود ادمین** (مجزا از پنل کارفرما)
- [ ] **مدیریت پروژه‌ها** — CRUD پروژه + آپلود تصاویر
- [ ] **مدیریت درخواست‌های مشاوره** — مشاهده، تغییر وضعیت
- [ ] **مدیریت کارفرمایان** — CRUD کاربر + اختصاص پروژه
- [ ] **مدیریت به‌روزرسانی پروژه** — افزودن گزارش برای هر پروژه

---

## ۲. ساختار صفحات و Routes در Next.js

```
app/
├── (public)/                      # Layout عمومی با Navbar و Footer
│   ├── page.tsx                   # GET /            → صفحه اصلی (One-pager)
│   ├── projects/
│   │   ├── page.tsx               # GET /projects    → همه پروژه‌ها
│   │   └── [slug]/
│   │       └── page.tsx           # GET /projects/[slug] → جزئیات پروژه
│   ├── about/
│   │   └── page.tsx               # GET /about       → درباره ما (کامل)
│   ├── consultation/
│   │   └── page.tsx               # GET /consultation → فرم درخواست مشاوره
│   ├── catalog/
│   │   └── page.tsx               # GET /catalog     → کاتالوگ
│   └── collaboration/
│       └── page.tsx               # GET /collaboration → همکاری با ما
│
├── (panel)/                       # Layout پنل کارفرما (بدون Navbar اصلی)
│   ├── panel/
│   │   ├── login/
│   │   │   └── page.tsx           # GET /panel/login
│   │   ├── dashboard/
│   │   │   └── page.tsx           # GET /panel/dashboard  🔒 Auth Required
│   │   └── project/
│   │       └── [id]/
│   │           └── page.tsx       # GET /panel/project/[id] 🔒 Auth Required
│
├── (admin)/                       # Layout ادمین
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx           # GET /admin/login
│   │   ├── dashboard/
│   │   │   └── page.tsx           # GET /admin/dashboard  🔒 Admin Only
│   │   ├── projects/
│   │   │   ├── page.tsx           # GET /admin/projects
│   │   │   ├── new/page.tsx       # GET /admin/projects/new
│   │   │   └── [id]/page.tsx      # GET /admin/projects/[id]
│   │   ├── consultations/
│   │   │   └── page.tsx           # GET /admin/consultations
│   │   └── clients/
│   │       ├── page.tsx           # GET /admin/clients
│   │       └── [id]/page.tsx      # GET /admin/clients/[id]
│
└── api/                           # API Routes
    ├── auth/
    │   ├── login/route.ts         # POST /api/auth/login
    │   └── logout/route.ts        # POST /api/auth/logout
    ├── consultation/
    │   └── route.ts               # POST /api/consultation
    ├── projects/
    │   └── route.ts               # GET  /api/projects
    └── admin/
        ├── projects/route.ts      # GET/POST /api/admin/projects
        ├── consultations/route.ts # GET/PATCH /api/admin/consultations
        └── clients/route.ts       # GET/POST  /api/admin/clients
```

---

## ۳. طراحی دیتابیس (Prisma Models)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── پروژه ───────────────────────────────────────────────
model Project {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  title       String
  type        ProjectType
  location    String
  area        Int?      // متراژ (مترمربع)
  status      ProjectStatus @default(COMPLETED)
  description String?
  images      String[]  // آرایه‌ای از URLهای تصاویر
  featured    Boolean   @default(false)
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  updates     ProjectUpdate[]
  assignments ClientProject[]
  testimonials Testimonial[]
}

enum ProjectType {
  RESIDENTIAL   // مسکونی
  COMMERCIAL    // تجاری
  OFFICE        // اداری
}

enum ProjectStatus {
  IN_PROGRESS   // در حال اجرا
  COMPLETED     // تکمیل‌شده
  PLANNING      // در حال برنامه‌ریزی
}

// ─── به‌روزرسانی پروژه (برای گزارش کارفرما) ────────────
model ProjectUpdate {
  id          Int       @id @default(autoincrement())
  project     Project   @relation(fields: [projectId], references: [id])
  projectId   Int
  title       String
  description String
  phase       String?   // مثلاً: "فاز اجرا" یا "خرید تجهیزات"
  progress    Int?      // درصد پیشرفت (0–100)
  date        DateTime  @default(now())
  createdAt   DateTime  @default(now())
}

// ─── کارفرما ─────────────────────────────────────────────
model Client {
  id          Int       @id @default(autoincrement())
  name        String
  email       String    @unique
  phone       String?
  passwordHash String
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())

  projects    ClientProject[]
}

// ─── اتصال کارفرما به پروژه ──────────────────────────────
model ClientProject {
  id          Int       @id @default(autoincrement())
  client      Client    @relation(fields: [clientId], references: [id])
  clientId    Int
  project     Project   @relation(fields: [projectId], references: [id])
  projectId   Int
  startDate   DateTime?
  endDate     DateTime?
  contractRef String?   // شماره قرارداد

  @@unique([clientId, projectId])
}

// ─── نظرات کارفرمایان ────────────────────────────────────
model Testimonial {
  id          Int       @id @default(autoincrement())
  clientName  String
  projectType String?
  text        String
  project     Project?  @relation(fields: [projectId], references: [id])
  projectId   Int?
  isActive    Boolean   @default(true)
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
}

// ─── درخواست مشاوره ──────────────────────────────────────
model ConsultationRequest {
  id          Int       @id @default(autoincrement())
  name        String
  phone       String
  email       String?
  projectType String?
  description String?
  status      LeadStatus @default(NEW)
  createdAt   DateTime  @default(now())
}

enum LeadStatus {
  NEW        // جدید
  CONTACTED  // تماس گرفته شده
  QUALIFIED  // واجد شرایط
  CLOSED     // بسته شده
}

// ─── ادمین ────────────────────────────────────────────────
model Admin {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  passwordHash String
  createdAt   DateTime  @default(now())
}
```

---

## ۴. نقشه راه فازبندی‌شده (Roadmap برای Antigravity)

### 📌 پیش‌نیاز: راه‌اندازی محیط

**دستور شروع:**
```bash
npx create-next-app@latest nobana \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"
cd nobana
npm install prisma @prisma/client bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
npx prisma init
```

**فایل‌های پیکربندی که باید ساخته شوند:**
- `.env` — شامل `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`
- `next.config.js` — فعال‌سازی `output: 'standalone'`
- `tailwind.config.ts` — اضافه کردن فونت IRANSans
- `prisma/schema.prisma` — مدل‌های بالا

---

### فاز ۱ — پایه و زیرساخت (انجام شد)

**هدف:** پروژه Next.js راه‌اندازی شود، دیتابیس متصل باشد، layout اصلی آماده باشد.

**تسک‌ها:**
1. راه‌اندازی Next.js 14 با App Router + TypeScript + Tailwind
2. تنظیم `next.config.js` با `output: 'standalone'`
3. اضافه کردن فونت Vazir به `globals.css` و Tailwind config
4. تنظیم متغیرهای رنگی برند نوبنا در Tailwind:
   - Primary: `#E5E4E2` (پلاتینیوم)
   - Background: `#FFFFFF`
   - Foreground: `#333333` (خاکستری تیره)
5. نوشتن `schema.prisma` با تمام مدل‌های بالا
6. اجرای `npx prisma migrate dev --name init`
7. ساخت `app/layout.tsx` اصلی با فونت و direction: rtl
8. ساخت کامپوننت `Navbar` و `Footer` پایه
9. ساخت `Dockerfile` و `docker-compose.yml` برای Next.js + PostgreSQL + Nginx

---

### فاز ۲ — صفحه اصلی و محتوای عمومی (انجام شد)

**هدف:** صفحه اصلی کامل با تمام بخش‌ها آماده شود.

**تسک‌ها:**
1. **`app/(public)/page.tsx`** — اسمبل تمام سکشن‌ها
2. کامپوننت `HeroSection` — تیتر + زیرتیتر + دو CTA + کانتر آمار
3. کامپوننت `ServicesSection` — ۶ کارت خدمت (داده استاتیک در فاز ۱، بعداً از DB)
4. کامپوننت `ProjectsSection` — گالری با اسلایدر (داده از `/api/projects?featured=true`)
5. کامپوننت `TestimonialsMarquee` — نوار متحرک نظرات
6. کامپوننت `AboutSection` — معرفی برند + بنیان‌گذار
7. کامپوننت `ConsultationForm` — فرم با `POST /api/consultation`
8. کامپوننت `CatalogSection` — دکمه دانلود و مشاهده
9. کامپوننت `CollaborationSection` — همکاری با ما
10. کامپوننت `FloatingCTA` — دکمه شناور (fixed bottom-right)
11. **`app/(public)/projects/page.tsx`** — گرید همه پروژه‌ها با فیلتر
12. **`app/(public)/projects/[slug]/page.tsx`** — جزئیات پروژه
13. API Route: `GET /api/projects` با query param `?featured=true&type=...`
14. API Route: `POST /api/consultation`

---

### فاز ۳ — پنل کارفرمایان (اولویت: مهم)

**هدف:** کارفرما بتواند لاگین کند و وضعیت پروژه‌اش را ببیند.

**تسک‌ها:**
1. API Route: `POST /api/auth/login` — بررسی ایمیل/رمز، صدور JWT در HttpOnly Cookie
2. API Route: `POST /api/auth/logout` — پاک کردن کوکی
3. Middleware برای محافظت از مسیرهای `/panel/*`
4. **`app/(panel)/panel/login/page.tsx`** — فرم ورود
5. **`app/(panel)/panel/dashboard/page.tsx`** — داشبورد با لیست پروژه(ها)
6. **`app/(panel)/panel/project/[id]/page.tsx`** — تایم‌لاین + گزارش‌ها
7. کامپوننت `ProjectTimeline` — نمایش فازها و درصد پیشرفت
8. کامپوننت `UpdatesList` — لیست گزارش‌های پروژه به ترتیب تاریخ

---

### فاز ۴ — پنل ادمین (اولویت: بعد از پنل کارفرما)

**هدف:** ادمین بتواند محتوا را مدیریت کند.

**تسک‌ها:**
1. سیستم Auth جداگانه برای ادمین (role-based در JWT)
2. Middleware برای محافظت از `/admin/*`
3. **`/admin/dashboard`** — خلاصه آمار (تعداد پروژه، لید، کارفرما)
4. **`/admin/projects`** — CRUD پروژه + آپلود تصویر (ذخیره local در `public/uploads`)
5. **`/admin/consultations`** — لیست لیدها + تغییر وضعیت
6. **`/admin/clients`** — CRUD کارفرما + اختصاص پروژه + ریست رمز

---

### فاز ۵ — استقرار روی VPS (اولویت: نهایی)

**هدف:** سایت روی VPS ایرانی با Docker راه‌اندازی شود.

**فایل‌های زیرساخت که باید ساخته شوند:**

**`Dockerfile`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**`docker-compose.yml`:**
```yaml
version: '3.8'
services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: nobana
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: nobana_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    restart: always
    environment:
      DATABASE_URL: postgresql://nobana:${DB_PASSWORD}@db:5432/nobana_db
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db
    expose:
      - "3000"

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/conf:/etc/letsencrypt
    depends_on:
      - app

volumes:
  postgres_data:
```

**`nginx.conf`:**
```nginx
server {
    listen 80;
    server_name nobana.ir www.nobana.ir;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name nobana.ir www.nobana.ir;

    ssl_certificate /etc/letsencrypt/live/nobana.ir/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nobana.ir/privkey.pem;

    client_max_body_size 20M;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🎨 راهنمای بصری و ویژوال

### جهت طراحی (Design Direction)
بر اساس تصویر مرجع تأیید شده: **Platinum Minimal**

| متغیر | مقدار |
|---|---|
| `--primary` | `#E5E4E2` (پلاتینیوم) |
| `--background` | `#FFFFFF` (پس‌زمینه روشن) |
| `--foreground` | `#333333` (متن اصلی) |
| `--muted` | `#8a8f98` (متن ثانویه) |

**فونت:** Vazir (از پوشه fonts/ موجود)  
**سبک:** فضای منفی زیاد · تایپوگرافی بزرگ · border line های ظریف · بدون سایه سنگین

### کتابخانه‌های فرانت‌اند
```bash
npm install framer-motion
npx shadcn@latest init
npx shadcn@latest add button card dialog sheet
```

### استفاده از Framer Motion
- ورود المان‌ها با `fadeInUp` هنگام scroll
- hover روی کارت پروژه‌ها با `whileHover`
- transition بین صفحات با `AnimatePresence`

---

## ✅ چک‌لیست شروع برای Antigravity

```
[x] 1. اجرای دستور create-next-app با پارامترهای بالا
[x] 2. کپی کردن فونت‌های Vazir از پوشه fonts/ موجود به public/fonts/
[x] 3. تنظیم tailwind.config.ts برای فونت و رنگ‌های برند (Platinum palette)
[x] 4. نصب shadcn/ui و Framer Motion
[x] 5. ساخت prisma/schema.prisma و اجرای migrate
[x] 6. ساخت layout.tsx با direction: rtl و فونت Vazir
[x] 7. ساخت صفحه اصلی بر اساس موکاپ mockup_home.html
```

---

*آخرین به‌روزرسانی توسط: Claude (Senior Architect) — بر اساس docs/Site.docx و docs/Customer Journey.docx*

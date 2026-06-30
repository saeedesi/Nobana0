# راه‌اندازی بک‌اند (فاز ۴ — پایه)

این پایه شامل دیتابیس (PostgreSQL + Prisma)، ذخیره‌ی واقعی فرم مشاوره، و ورود امن ادمین است.

## ۱. متغیرهای محیطی

```bash
cp .env.example .env
```

سپس در `.env`:
- `DATABASE_URL` — اگر از دیتابیس دِوِ آماده استفاده می‌کنی، همان مقدار پیش‌فرض درست است.
- `JWT_SECRET` — یک مقدار تصادفی بلند بگذار: `openssl rand -base64 48`
- `ADMIN_EMAIL` و `ADMIN_PASSWORD` — برای ساخت اولین ادمین.

## ۲. نصب وابستگی‌ها

```bash
npm install
```
(در نصب، `prisma generate` خودکار اجرا می‌شود.)

## ۳. دیتابیس دِو (اختیاری ولی ساده)

اگر Postgres محلی نداری، با Docker بالا بیاور:

```bash
docker compose -f docker-compose.dev.yml up -d
```

## ۴. ساخت جداول و ادمین

```bash
npm run db:migrate -- --name init   # ساخت جداول
npm run db:seed                      # ساخت ادمین از روی .env
```

## ۵. اجرا

```bash
npm run dev
```

- فرم مشاوره (`/#consultation`) حالا واقعاً در DB ذخیره می‌شود.
- ورود ادمین: `/admin/login` → داشبورد: `/admin/dashboard` (مسیرهای `/admin/*` با middleware محافظت می‌شوند).

## ابزار کمکی

```bash
npm run db:studio   # مرورگر گرافیکی دیتابیس (Prisma Studio)
```

## امنیت
- توکن نشست به‌صورت JWT امضاشده (jose, HS256) داخل کوکی **HttpOnly** ذخیره می‌شود.
- رمز عبور با bcrypt هش می‌شود.
- middleware در Edge فقط توکن را راستی‌آزمایی می‌کند (بدون bcrypt).
- هرگز `.env` را کامیت نکن (در `.gitignore` هست).

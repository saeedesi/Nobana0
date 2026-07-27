# راه‌اندازی بک‌اند (فاز ۴ — پایه)

این پایه شامل دیتابیس (PostgreSQL + Prisma)، ذخیره‌ی واقعی فرم مشاوره، و ورود امن ادمین است.

> **پکیج‌منیجر پروژه: pnpm** — نسخه در فیلد `packageManager` در `package.json` پین شده است.
>
> اگر pnpm نسخه ۱۰ یا بالاتر نصب داری، خودش نسخه‌ی پین‌شده را می‌خواند و به آن سوییچ می‌کند؛ کار دیگری لازم نیست.
> اگر pnpm نصب نداری، یکی از این دو:
> ```bash
> npm i -g pnpm@11.17.0     # نصب مستقیم
> corepack enable           # یا از طریق Corepack (اگر در دسترس باشد)
> ```
> از `npm install` استفاده نکن — `package-lock.json` حذف شده و تنها lockfile معتبر `pnpm-lock.yaml` است.

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
pnpm install
```
(در نصب، `prisma generate` خودکار اجرا می‌شود.)

کلاینت Prisma در `src/generated/prisma` ساخته می‌شود (نه در `node_modules`) — این مسیر در `.gitignore` است و با هر `pnpm install` بازسازی می‌شود.

## ۳. دیتابیس دِو (اختیاری ولی ساده)

اگر Postgres محلی نداری، با Docker بالا بیاور:

```bash
docker compose -f docker-compose.dev.yml up -d
```

## ۴. ساخت جداول و ادمین

```bash
pnpm db:migrate --name init   # ساخت جداول
pnpm db:seed                  # ساخت ادمین از روی .env
```

## ۵. اجرا

```bash
pnpm dev
```

- فرم مشاوره (`/#consultation`) حالا واقعاً در DB ذخیره می‌شود.
- ورود ادمین: `/admin/login` → داشبورد: `/admin/dashboard` (مسیرهای `/admin/*` با middleware محافظت می‌شوند).

## ابزار کمکی

```bash
pnpm db:studio   # مرورگر گرافیکی دیتابیس (Prisma Studio)
```

---

## استقرار روی VPS (Docker)

فایل‌های زیرساخت: `Dockerfile` (چندمرحله‌ای)، `docker-compose.yml`، `nginx/nobana.conf`.

```bash
# ۱. روی سرور، .env پروداکشن را بساز
cp .env.example .env   # و مقادیر واقعی را پر کن (POSTGRES_PASSWORD, DATABASE_URL, JWT_SECRET)

# ۲. بیلد و اجرا
docker compose build
docker compose up -d
```

سرویس‌ها:

| سرویس | نقش |
|---|---|
| `db` | PostgreSQL 16 — فقط روی شبکه‌ی داخلی، پورتی منتشر نمی‌کند |
| `migrate` | یک‌بار اجرا می‌شود، `prisma migrate deploy` را می‌زند و خارج می‌شود |
| `app` | Next.js standalone روی پورت ۳۰۰۰ (داخلی) |
| `nginx` | reverse proxy روی ۸۰/۴۴۳ با SSL |
| `certbot` | فقط با `--profile tools` — صدور و تمدید گواهی |

### صدور گواهی SSL (بار اول)

قبل از اولین اجرا، بلوک `listen 443` در `nginx/nobana.conf` را کامنت کن تا nginx بدون گواهی بالا بیاید، سپس:

```bash
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d nobana.ir -d www.nobana.ir --email you@example.com --agree-tos --no-eff-email
```

بعد کامنت را بردار و `docker compose up -d nginx` را اجرا کن.

### تمدید (ماهانه در cron)

```bash
docker compose run --rm certbot renew && docker compose exec nginx nginx -s reload
```

### بکاپ دیتابیس

```bash
docker compose exec db pg_dump -U nobana nobana_db | gzip > backup-$(date +%F).sql.gz
```

## امنیت
- توکن نشست به‌صورت JWT امضاشده (jose, HS256) داخل کوکی **HttpOnly** ذخیره می‌شود.
- رمز عبور با bcrypt هش می‌شود.
- middleware در Edge فقط توکن را راستی‌آزمایی می‌کند (بدون bcrypt).
- کانتینر `app` با کاربر غیر-root (`nextjs`) اجرا می‌شود.
- هرگز `.env` را کامیت نکن (در `.gitignore` هست).

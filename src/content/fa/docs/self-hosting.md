---
title: راهنمای میزبانی شخصی
description: Expense Budget Tracker را با Docker Compose و Postgres روی سرور خودتان اجرا کنید.
---

## پیش‌نیازها

- Docker و Docker Compose
- Postgres 18 (در فایل Compose تعریف شده است)

## شروع سریع

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

این دستورها Postgres را بالا می‌آورند، مهاجرت‌ها را اجرا می‌کنند و سرویس‌های زیر را راه‌اندازی می‌کنند:

- برنامهٔ وب در `http://localhost:3000`
- سرویس احراز هویت در `http://localhost:8081`
- ورکر FX در Docker Compose

## پیکربندی

فایل `.env.example` را به `.env` کپی کنید و این مقدارها را متناسب با محیط خودتان تنظیم کنید:

- `MIGRATION_DATABASE_URL` — نقش مالک پایگاه داده که مهاجرت‌ها با آن اجرا می‌شوند
- `DATABASE_URL` — نقش برنامه برای پردازهٔ وب
- `AUTH_DATABASE_URL` — نقش اسکیما احراز هویت برای سرویس احراز هویت
- `AUTH_MODE` — برای استفادهٔ محلی `none` و برای محیط‌هایی که از OTP ایمیلی استفاده می‌کنند `cognito`
- `AUTH_DOMAIN`، `COOKIE_DOMAIN` و `ALLOWED_REDIRECT_URIS` — برای مسیرهای احراز هویت، کوکی‌ها و آدرس‌های بازگشت

اگر `AUTH_MODE=cognito` باشد، باید تنظیمات Cognito و همچنین `SESSION_ENCRYPTION_KEY` را هم از `.env.example` به `.env` منتقل کنید.

## به‌روزرسانی

```bash
git pull
make up
```

Docker Compose سرویس‌ها را دوباره می‌سازد و مهاجرت‌ها را هم از طریق کانتینر `migrate` دوباره اجرا می‌کند.

## استقرار روی AWS

برای استقرار نسخهٔ عملیاتی روی AWS (شامل ECS Fargate + RDS + ALB + Cognito)، به [راهنمای AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws) مراجعه کنید.

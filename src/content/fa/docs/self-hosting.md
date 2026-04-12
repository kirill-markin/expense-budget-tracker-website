---
title: راهنمای میزبانی شخصی
description: Expense Budget Tracker را با Docker Compose و Postgres روی سرور خودتان اجرا کنید.
---

## پیش‌نیازها

- Docker و Docker Compose
- Postgres 18 (در فایل Compose گنجانده شده است)

## شروع سریع

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

این کار Postgres را بالا می‌آورد، مهاجرت‌ها را اجرا می‌کند و موارد زیر را راه‌اندازی می‌کند:

- برنامه وب در `http://localhost:3000`
- سرویس احراز هویت در `http://localhost:8081`
- پردازشگر FX در Docker Compose

## پیکربندی

فایل `.env.example` را به `.env` کپی کنید و این مقادیر را تنظیم کنید:

- `MIGRATION_DATABASE_URL` — نقش مالک که توسط مهاجرت‌ها استفاده می‌شود
- `DATABASE_URL` — نقش برنامه برای فرایند وب
- `AUTH_DATABASE_URL` — نقش اسکیما احراز هویت برای سرویس احراز هویت
- `AUTH_MODE` — برای استفاده محلی `none` و برای محیط‌های OTP ایمیلی `cognito`
- `AUTH_DOMAIN`، `COOKIE_DOMAIN` و `ALLOWED_REDIRECT_URIS` — برای مسیر‌دهی احراز هویت و کوکی‌ها

وقتی `AUTH_MODE=cognito` باشد، باید تنظیمات Cognito و همچنین `SESSION_ENCRYPTION_KEY` را هم از `.env.example` وارد کنید.

## به‌روزرسانی

```bash
git pull
make up
```

Docker Compose سرویس‌ها را دوباره می‌سازد و مهاجرت‌ها را از طریق کانتینر `migrate` دوباره اجرا می‌کند.

## استقرار روی AWS

برای استقرار محیط عملیاتی روی AWS (شامل ECS Fargate + RDS + ALB + Cognito)، به [راهنمای AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws) مراجعه کنید.

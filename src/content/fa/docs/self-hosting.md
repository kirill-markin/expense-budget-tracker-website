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

پشتهٔ CDK عملیاتی از ECS Fargate، RDS، ALB، Cognito، API Gateway و Lambda استفاده می‌کند. دامنه‌های عمومی برنامه عبارت‌اند از:

- `app.<domain>` — برنامهٔ وب در ECS Fargate پشت ALB
- `auth.<domain>` — سرویس OTP و OAuth پشت ALB
- `api.<domain>/v1/*` — REST API ماشینی SQL از طریق API Gateway و Lambda
- `mcp.<domain>/mcp` — سرویس MCP میزبانی‌شده از طریق HTTP API اختصاصی در API Gateway و MCP Lambda

دامنهٔ سفارشی MCP به یک گواهی عمومی ACM برای نام دقیق `mcp.<domain>` نیاز دارد. رکورد CNAME اعتبارسنجی DNS را برای تمدید نگه دارید، ARN گواهی را در اختیار استقرار CDK و CI بگذارید و رکورد DNS مربوط به `mcp.*` را همراه با دیگر دامنه‌های عمومی ایجاد کنید.

برای ترتیب و اسکریپت‌های پشتیبانی‌شده، [نمای کلی استقرار](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) و [راهنمای AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) در مخزن را ببینید.

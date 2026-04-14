---
title: دليل الاستضافة الذاتية
description: شغّل Expense Budget Tracker على خادمك باستخدام Docker Compose وPostgres.
---

## المتطلبات

- توفر Docker وDocker Compose
- Postgres 18 (مضمّن ضمن ملف Compose)

## البدء السريع

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

تؤدي هذه الخطوات إلى تشغيل Postgres، ثم تنفيذ عمليات الترحيل، ثم تشغيل الخدمات التالية:

- تطبيق الويب على `http://localhost:3000`
- خدمة المصادقة على `http://localhost:8081`
- عامل أسعار الصرف (FX) ضمن بيئة Docker Compose

## التهيئة

انسخ الملف `.env.example` إلى `.env`، ثم اضبط القيم التالية حسب بيئتك:

- `MIGRATION_DATABASE_URL` — دور المالك الذي تستخدمه عمليات الترحيل
- `DATABASE_URL` — دور التطبيق الذي تستخدمه خدمة الويب
- `AUTH_DATABASE_URL` — دور مخطط المصادقة الذي تستخدمه خدمة المصادقة
- `AUTH_MODE` — استخدم `none` للتشغيل المحلي، و`cognito` في البيئات التي تعتمد OTP عبر البريد الإلكتروني
- `AUTH_DOMAIN` و`COOKIE_DOMAIN` و`ALLOWED_REDIRECT_URIS` — إعدادات توجيه المصادقة وملفات تعريف الارتباط

عند استخدام `AUTH_MODE=cognito`، ستحتاج أيضًا إلى إعدادات Cognito وقيمة `SESSION_ENCRYPTION_KEY` كما هي مبيّنة في `.env.example`.

## التحديث

```bash
git pull
make up
```

يعيد Docker Compose بناء الخدمات ويشغّل عمليات الترحيل مرة أخرى عبر الحاوية `migrate`.

## النشر على AWS

إذا كنت تنشر بيئة الإنتاج على AWS (`ECS Fargate` + `RDS` + `ALB` + `Cognito`)، فراجع [دليل AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).

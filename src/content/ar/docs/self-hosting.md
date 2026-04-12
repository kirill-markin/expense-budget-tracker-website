---
title: دليل الاستضافة الذاتية
description: شغّل Expense Budget Tracker على خادمك باستخدام Docker Compose وPostgres.
---

## المتطلبات

- Docker وDocker Compose
- Postgres 18 (مضمّن في ملف Compose)

## البدء السريع

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

يؤدي ذلك إلى تشغيل Postgres، وتنفيذ عمليات الترحيل، ثم تشغيل:

- تطبيق الويب على `http://localhost:3000`
- خدمة المصادقة على `http://localhost:8081`
- عامل أسعار الصرف (FX) ضمن Docker Compose

## التهيئة

انسخ `.env.example` إلى `.env` ثم عدّل القيم التالية:

- `MIGRATION_DATABASE_URL` — دور المالك المستخدم في عمليات الترحيل
- `DATABASE_URL` — دور التطبيق لعملية الويب
- `AUTH_DATABASE_URL` — دور مخطط المصادقة لخدمة المصادقة
- `AUTH_MODE` — استخدم `none` للاستخدام المحلي و`cognito` للبيئات التي تعتمد OTP عبر البريد الإلكتروني
- `AUTH_DOMAIN` و`COOKIE_DOMAIN` و`ALLOWED_REDIRECT_URIS` — توجيه المصادقة وإعدادات ملفات تعريف الارتباط

عند استخدام `AUTH_MODE=cognito`، ستحتاج أيضًا إلى إعدادات Cognito و`SESSION_ENCRYPTION_KEY` الموجودة في `.env.example`.

## التحديث

```bash
git pull
make up
```

يعيد Docker Compose بناء الخدمات ويشغّل عمليات الترحيل مرة أخرى عبر الحاوية `migrate`.

## النشر على AWS

للنشر في بيئة الإنتاج على AWS (`ECS Fargate` + `RDS` + `ALB` + `Cognito`)، راجع [دليل AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).

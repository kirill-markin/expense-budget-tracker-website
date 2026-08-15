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

تستخدم حزمة CDK للإنتاج ECS Fargate وRDS وALB وCognito وAPI Gateway وLambda، وتعرض نطاقات التطبيق العامة التالية:

- `app.<domain>` — تطبيق الويب على ECS Fargate خلف ALB
- `auth.<domain>` — خدمة OTP وOAuth خلف ALB
- `api.<domain>/v1/*` — واجهة REST ماشينية لـSQL عبر API Gateway وLambda
- `mcp.<domain>/mcp` — خدمة MCP مستضافة عبر HTTP API مخصّصة في API Gateway ودالة MCP Lambda

يتطلب نطاق MCP المخصّص شهادة ACM عامة للاسم المطابق `mcp.<domain>`. احتفظ بسجل CNAME الخاص بالتحقق من DNS للتجديد، وقدّم ARN الشهادة إلى نشر CDK وCI، وأنشئ سجل DNS لـ`mcp.*` إلى جانب النطاقات العامة الأخرى.

للاطلاع على التسلسل والبرامج النصية المدعومة، راجع [نظرة عامة على النشر](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) و[دليل AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) في المستودع.

---
title: مرجع واجهة البرمجة
description: مرجع تهيئة الوكلاء وواجهة SQL للوصول البرمجي إلى بياناتك المالية.
---

## نظرة عامة

يقدّم Expense Budget Tracker واجهة آلية عامة واحدة على:

`https://api.expense-budget-tracker.com/v1/`

يمكنك استخدام هذه الواجهة نفسها بطريقتين:

1. **تهيئة أصلية للوكلاء** تبدأ من `GET /v1/`
2. **استخدام HTTP مباشر** باستخدام `ApiKey` طويل الأمد موجود مسبقًا

جميع الطلبات تستخدم آلية `Row Level Security` في Postgres نفسها المطبقة في تطبيق الويب.

## الاكتشاف والمواصفات المنشورة

ابدأ من هنا:

`https://api.expense-budget-tracker.com/v1/`

توضح استجابة الاكتشاف للوكلاء كيفية بدء المصادقة وما الذي يجب استدعاؤه بعد ذلك. وتنشر الواجهة نفسها أيضًا:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

استخدم `schema` عندما تحتاج إلى القائمة الدقيقة للعلاقات والأعمدة المسموح بها التي يوفّرها `/v1/sql`.

## التهيئة الأصلية للوكلاء

إذا كنت تريد أن يتصل Claude Code أو Codex أو OpenClaw أو أي وكيل آخر بنفسه، فابدأ من نقطة الاكتشاف واتبع الإجراءات التي يعيدها الخادم.

### مسار المصادقة

1. `GET https://api.expense-budget-tracker.com/v1/`
2. اقرأ الإجراء `send_code` و`bootstrapUrl` المعادين في الاستجابة
3. أرسل بريد المستخدم الإلكتروني عبر `POST` إلى `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. استلم `otpSessionToken`
5. اطلب من المستخدم الرمز المكوّن من 8 أرقام الذي وصله عبر البريد الإلكتروني
6. أرسل `code` و`otpSessionToken` و`label` عبر `POST` إلى `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. استلم `ApiKey` طويل الأمد
8. احفظ هذا المفتاح خارج ذاكرة المحادثة
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. اختياريًا: `POST https://api.expense-budget-tracker.com/v1/workspaces` لإنشاء مساحة عمل
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. نفّذ SQL عبر `POST https://api.expense-budget-tracker.com/v1/sql`

### ترويسة المصادقة

- `Authorization: ApiKey <key>`

### التعامل مع مساحة العمل

- يحفظ `POST /v1/workspaces/{workspaceId}/select` مساحة العمل الافتراضية لهذا المفتاح
- بعد حفظ مساحة العمل، يمكن لـ `/v1/sql` الاستغناء عن `X-Workspace-Id`
- يظل `X-Workspace-Id: <workspaceId>` مدعومًا عندما تريد تجاوز مساحة العمل المحفوظة لطلب واحد
- إذا كان لدى المستخدم مساحة عمل واحدة فقط ولم يكن للمفتاح اختيار محفوظ بعد، فستحفظ الواجهة تلك المساحة تلقائيًا وتستخدمها

للاطلاع على دليل بشري خطوة بخطوة، راجع [إعداد وكيل الذكاء الاصطناعي](/docs/agent-setup/).

## استخدام HTTP مباشر بمفتاح موجود مسبقًا

يمكن للسكربتات ومهام `cron` ولوحات المعلومات والتطبيقات المخصصة استدعاء الواجهة نفسها مباشرةً ما دامت تملك مسبقًا `ApiKey` طويل الأمد.

### المصادقة

مرّر المفتاح ضمن ترويسة مصادقة من نوع `ApiKey`:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

يكون `X-Workspace-Id` مطلوبًا فقط إذا لم يكن لدى المفتاح مساحة عمل افتراضية محفوظة مسبقًا، أو إذا كنت تريد تجاوز مساحة العمل المحفوظة لهذا الطلب.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` عند الحاجة

## ملخص نقاط النهاية

- `GET /v1/` — مستند الاكتشاف العام
- `GET /v1/openapi.json` و`GET /v1/swagger.json` — مواصفات الواجهة المنشورة
- `GET /v1/me` — سياق الحساب بعد المصادقة
- `GET /v1/workspaces` — عرض مساحات العمل المتاحة لمالك المفتاح
- `POST /v1/workspaces` — إنشاء مساحة عمل
- `POST /v1/workspaces/{workspaceId}/select` — حفظ مساحة العمل الافتراضية لهذا المفتاح
- `GET /v1/schema` — فحص العلاقات والأعمدة المسموح بها لاستخدامها في SQL
- `POST /v1/sql` — تنفيذ عبارة SQL مقيّدة واحدة

## سياسة SQL

يقبل `POST /v1/sql` عبارة SQL واحدة فقط في كل طلب.

أنواع العبارات المسموح بها:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

الأنماط المحظورة أو المرفوضة:

- عبارات متعددة
- أوامر DDL مثل `CREATE` و`DROP` و`ALTER`
- مغلفات المعاملات مثل `BEGIN` و`COMMIT` و`ROLLBACK`
- `set_config()`
- تعليقات SQL
- المعرّفات الموضوعة بين علامتَي اقتباس
- السلاسل النصية ذات صيغة dollar-quoted

يفرض الخادم أيضًا قيودًا على العلاقات التي يمكن الاستعلام عنها. استخدم `/v1/schema` لفحص العلاقات والأعمدة المعروضة قبل توليد SQL.

العلاقات المعروضة حاليًا:

- `ledger_entries`
- `accounts`
- `budget_lines`
- `budget_comments`
- `workspace_settings`
- `account_metadata`
- `exchange_rates`

## الحدود

- 100 صف في كل استجابة
- مهلة تنفيذ قدرها 30 ثانية لكل عبارة
- 10 طلبات في الثانية، و10,000 طلب في اليوم لكل مفتاح

## الأمان

- تُخزَّن مفاتيح API على شكل تجزئات SHA-256، ولا يُحفَظ النص الأصلي للمفتاح مطلقًا
- تفرض RLS عزل مساحات العمل على مستوى قاعدة البيانات
- يمكن إبطال المفاتيح من داخل المنتج في أي وقت
- تؤدي إزالة عضو من مساحة العمل إلى إبطال جميع مفاتيحه تلقائيًا

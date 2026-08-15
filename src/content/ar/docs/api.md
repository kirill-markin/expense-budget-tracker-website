---
title: مرجع واجهة برمجة التطبيقات
description: مرجع تهيئة الوكلاء وواجهة SQL للوصول البرمجي إلى بياناتك المالية.
---

## نظرة عامة

يوفّر Expense Budget Tracker واجهة برمجة تطبيقات عامة واحدة للوصول البرمجي عبر:

`https://api.expense-budget-tracker.com/v1/`

ويمكن استخدام هذه الواجهة بطريقتين:

1. **تهيئة مخصّصة للوكلاء** تبدأ من `GET /v1/`
2. **استخدام مباشر عبر HTTP** باستخدام `ApiKey` طويل الأمد موجود مسبقًا

وتخضع جميع الطلبات لسياسات Postgres نفسها الخاصة بالأمان على مستوى الصفوف (`Row Level Security`) تمامًا كما في تطبيق الويب.

إذا كان عميلك يدعم MCP، فاستخدم [موصّل MCP](/ar/docs/mcp-connector/) المستضاف على `https://mcp.expense-budget-tracker.com/mcp` وصرّح له بالوصول عبر OAuth في المتصفح. توثّق هذه الصفحة مسار Agent API المنفصل وعقد HTTP المباشر اللذين يستخدمان `ApiKey` طويل الأمد.

## الاكتشاف والمصدر ومخطط وقت التشغيل

ابدأ من هنا:

`https://api.expense-budget-tracker.com/v1/`

توضّح استجابة الاكتشاف للوكلاء كيفية بدء المصادقة وما الطلبات التالية التي ينبغي إرسالها. كما تتضمن روابط إلى README ومصدر التنفيذ. وتوفّر الواجهة:

- `GET /v1/schema`
- `GET /v1/openapi.json` و`GET /v1/swagger.json` كنقطتَي فحص للتوافق توضّحان أن OpenAPI غير متاح وتعيدان العميل إلى الاكتشاف والمصدر

استخدم `schema` عندما تحتاج إلى القائمة الدقيقة للعلاقات والأعمدة التي تتيحها `/v1/sql/query` و`/v1/sql/execute` ونقطة التوافق `/v1/sql`.

## التهيئة المخصّصة للوكلاء

إذا أردت أن يتصل Claude Code أو Codex أو OpenClaw أو أي وكيل آخر بنفسه، فابدأ من نقطة الاكتشاف واتبع الإجراءات التي يعيدها الخادم.

### مسار المصادقة

1. `GET https://api.expense-budget-tracker.com/v1/`
2. اقرأ الإجراء `send_code` و`bootstrapUrl` اللذين تُعيدهما الاستجابة
3. أرسل بريد المستخدم الإلكتروني في طلب `POST` إلى `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. استلم `otpSessionToken`
5. اطلب من المستخدم الرمز المكوّن من 8 أرقام الذي وصله عبر البريد الإلكتروني
6. أرسل `code` و`otpSessionToken` و`label` في طلب `POST` إلى `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. استلم `ApiKey` طويل الأمد
8. احفظ هذا المفتاح خارج سياق المحادثة
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. اختياريًا: `POST https://api.expense-budget-tracker.com/v1/workspaces` لإنشاء مساحة عمل
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. اقرأ البيانات عبر `POST https://api.expense-budget-tracker.com/v1/sql/query` وأرسل عمليات الكتابة الموافق عليها عبر `POST https://api.expense-budget-tracker.com/v1/sql/execute`

### ترويسة المصادقة

- `Authorization: ApiKey <key>`

### التعامل مع مساحة العمل

- يحفظ `POST /v1/workspaces/{workspaceId}/select` مساحة العمل الافتراضية لهذا المفتاح
- بعد حفظ مساحة العمل، يمكن استدعاء `/v1/sql/query` و`/v1/sql/execute` ونقطة التوافق `/v1/sql` من دون `X-Workspace-Id`
- يظل `X-Workspace-Id: <workspaceId>` مدعومًا إذا أردت تجاوز مساحة العمل المحفوظة لطلب واحد
- إذا لم يكن للمفتاح اختيار محفوظ بعد وكان لدى المستخدم مساحة عمل واحدة فقط، فستحفظ الواجهة تلك المساحة تلقائيًا وتستخدمها

للاطلاع على دليل إرشادي خطوة بخطوة للمستخدم، راجع [إعداد وكيل الذكاء الاصطناعي](/docs/agent-setup/).

## الاستخدام المباشر عبر HTTP بمفتاح موجود مسبقًا

يمكن للبرامج النصية، ومهام `cron`، ولوحات المعلومات، والتطبيقات المخصّصة استدعاء الواجهة نفسها مباشرةً إذا كانت تملك مسبقًا `ApiKey` طويل الأمد.

### المصادقة

أرسل المفتاح ضمن ترويسة مصادقة من نوع `ApiKey`:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

يكون `X-Workspace-Id` مطلوبًا فقط إذا لم يكن للمفتاح مساحة عمل افتراضية محفوظة مسبقًا، أو إذا أردت تجاوز مساحة العمل المحفوظة لهذا الطلب.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` عند الحاجة

## ملخص نقاط النهاية

- `GET /v1/` — مستند الاكتشاف العام
- `GET /v1/openapi.json` و`GET /v1/swagger.json` — نقطتا فحص للتوافق واكتشاف المصدر، وليستا مواصفة API
- `GET /v1/me` — معلومات الحساب بعد المصادقة
- `GET /v1/workspaces` — قائمة مساحات العمل المتاحة لمالك المفتاح
- `POST /v1/workspaces` — إنشاء مساحة عمل
- `POST /v1/workspaces/{workspaceId}/select` — حفظ مساحة العمل الافتراضية لهذا المفتاح
- `GET /v1/schema` — فحص العلاقات والأعمدة المتاحة لاستخدامها في SQL
- `POST /v1/sql/query` — تنفيذ عبارة `SELECT` أو `WITH ... SELECT` واحدة للقراءة فقط
- `POST /v1/sql/execute` — تنفيذ عبارة `INSERT` أو `UPDATE` أو `DELETE` واحدة موافق عليها
- `POST /v1/sql` — نقطة توافق للبرامج النصية الذرية متعددة العبارات

## سياسة SQL

تفصل نقاط النهاية الأساسية بين القراءة والكتابة عمدًا:

- يقبل `POST /v1/sql/query` عبارة `SELECT` أو `WITH ... SELECT` واحدة للقراءة فقط
- يقبل `POST /v1/sql/execute` عملية تغيير واحدة من نوع `INSERT` أو `UPDATE` أو `DELETE`، بما في ذلك صيغ `WITH` المدعومة
- تقبل نقطة التوافق `POST /v1/sql` البرامج النصية المقيّدة متعددة العبارات وتطبّقها ذريًا؛ استخدمها فقط عندما تحتاج إلى هذا السلوك الذري

الأنماط المحظورة أو المرفوضة:

- عبارات متعددة في نقطتَي النهاية الأساسيتين `/v1/sql/query` و`/v1/sql/execute`
- أوامر DDL مثل `CREATE` و`DROP` و`ALTER`
- أوامر المعاملات مثل `BEGIN` و`COMMIT` و`ROLLBACK`
- `set_config()`
- تعليقات SQL
- المعرّفات المحاطة بعلامتَي اقتباس
- السلاسل النصية بصيغة `dollar-quoted`

ويفرض الخادم أيضًا قيودًا على العلاقات التي يمكن الاستعلام عنها. استخدم `/v1/schema` لفحص العلاقات والأعمدة المتاحة قبل توليد SQL.

العلاقات المتاحة حاليًا:

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (للقراءة فقط)
- `fx_rates_raw` (للقراءة فقط)
- `fx_rates_daily` (للقراءة فقط)

## الحدود

- 100 صف مُعاد كحد أقصى لكل طلب
- 100 صف متأثر كحد أقصى لكل عبارة تغيير ولكل طلب
- مهلة إجمالية قدرها 25 ثانية لكل طلب SQL
- 10 طلبات في الثانية، و10,000 طلب في اليوم لكل مفتاح

## الأمان

- تُخزَّن مفاتيح API على هيئة تجزئات SHA-256، ولا تُحفَظ القيمة الأصلية للمفتاح مطلقًا
- تفرض سياسات الأمان على مستوى الصفوف (`RLS`) عزل مساحات العمل على مستوى قاعدة البيانات
- يمكن إبطال المفاتيح من داخل المنتج في أي وقت
- تؤدي إزالة عضو من مساحة العمل إلى إبطال جميع مفاتيحه تلقائيًا

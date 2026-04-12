---
title: "إعداد متتبع نفقات بالذكاء الاصطناعي لـ Claude Code وCodex وOpenClaw"
description: "كيفية ربط Claude Code أو Codex أو OpenClaw بمتتبع نفقات مفتوح المصدر. شارك رابط الاكتشاف الواحد، وأكّد رمز البريد الإلكتروني، واحفظ ApiKey المُعاد، ودع الوكيل يبدأ العمل."
date: "2026-03-10"
keywords:
  - "متتبع نفقات بالذكاء الاصطناعي"
  - "إعداد Claude Code"
  - "إعداد Codex"
  - "إعداد OpenClaw"
  - "ربط وكيل ذكاء اصطناعي بمتتبع نفقات"
  - "Expense Budget Tracker API"
  - "استيراد المعاملات بالذكاء الاصطناعي"
  - "متتبع نفقات مفتوح المصدر"
---

إذا كنت تريد استخدام وكيل ذكاء اصطناعي لتتبع النفقات، فالمزعج غالبًا هو الإعداد.

المسار المعتاد يبدو هكذا:

1. افتح التطبيق
2. أنشئ مفتاح API
3. انسخ المفتاح
4. ألصقه داخل وكيل الطرفية
5. اشرح له أي نقطة نهاية يجب أن يستدعيها
6. وادعُ أن يستخدم الوكيل مساحة العمل الصحيحة

هذا قابل للتنفيذ، لكنه ليس مصممًا أصلًا للوكلاء.

يوفّر [Expense Budget Tracker](https://expense-budget-tracker.com/ar/) الآن نقطة اكتشاف عامة لوكلاء الطرفية مثل [Claude Code](https://docs.anthropic.com/en/docs/claude-code) أو OpenAI Codex أو OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

يعطي المستخدم ذلك الرابط الواحد للوكيل، ثم يجيب عن سؤالين:

- ما البريد الإلكتروني الذي يجب استخدامه لتسجيل الدخول؟
- ما الرمز المكوّن من 8 أرقام الذي وصل للتو إلى صندوق الوارد؟

بعد ذلك، ينشئ الوكيل `ApiKey` الخاص به، ويحفظه خارج ذاكرة الدردشة، ويحمّل الحساب، ويعرض مساحات العمل، ويحفظ إحداها كافتراضية لذلك المفتاح، ثم يمكنه بدء استيراد المعاملات أو الاستعلام عنها.

المشروع مفتوح المصدر على GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [تنفيذ Machine API](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [مسار الوكيل لإرسال الرمز](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [مسار الوكيل للتحقق من الرمز](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## الرابط الواحد الذي تعطيه لوكيلك

هذا هو الرابط الدقيق:

```text
https://api.expense-budget-tracker.com/v1/
```

تعيد نقطة النهاية هذه مستند اكتشاف قابلًا للقراءة آليًا. ويمكن للوكيل أن يعرف منه:

- أين توجد بداية المصادقة
- أي إجراء يجب استدعاؤه أولًا
- أي ترويسة مصادقة يجب استخدامها لاحقًا
- ما الخطوات التالية لإعداد مساحة العمل والوصول إلى SQL

هذه هي الفكرة الأساسية: بدلًا من ترميز تعليمات الإعداد داخل prompt، يشرح المنتج نفسه للوكيل كيف يتصل به.

## مثال على prompt لـ Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Ask me for the account email, wait for the 8-digit code from my inbox, finish the setup,
save the returned ApiKey outside chat memory, then import transactions from ~/Downloads/chase-march-2026.csv and verify the final balance.
```

## مثال على prompt لـ Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
When you need login information, ask me for the email and then the 8-digit code.
After setup, save the key, inspect /schema, and show me my latest 20 transactions and total grocery spend this month.
```

## مثال على prompt لـ OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, save my personal workspace as the default for this key and import the CSV file I uploaded.
Use existing categories when possible, and tell me if any balance does not match.
```

## كيف يعمل إعداد متتبع النفقات بالذكاء الاصطناعي

فيما يلي التدفق الكامل عبر HTTP خلف هذا الإعداد.

### 1. اقرأ نقطة الاكتشاف

يبدأ الوكيل من هنا:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

تخبره الاستجابة أن يبدأ بـ `send_code`، وتتضمن رابط bootstrap على نطاق المصادقة، وتشير إلى نقاط نهاية OpenAPI وschema المنشورة.

### 2. أرسل بريد المستخدم الإلكتروني

يرسل الوكيل عنوان البريد الإلكتروني إلى خدمة المصادقة:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

إذا نجح الطلب، تحتوي الاستجابة على `otpSessionToken` وتعليمات باستدعاء `verify_code`.

### 3. اطلب من المستخدم رمز البريد الإلكتروني المكوّن من 8 أرقام

يفتح المستخدم صندوق الوارد ثم يرسل الرمز إلى الوكيل.

### 4. تحقّق من الرمز واحصل على ApiKey

بعد ذلك يستدعي الوكيل:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

تتضمن الاستجابة `ApiKey` جديدًا. يُعرض هذا المفتاح مرة واحدة، وينبغي أن يحفظه الوكيل للطلبات اللاحقة، ويفضل كمتغير `EXPENSE_BUDGET_TRACKER_API_KEY`.

وهذا هو التحسين الرئيسي مقارنة بالمسار اليدوي القديم: لا يحتاج المستخدم إلى إنشاء مفتاح من صفحة Settings ونسخه إلى الطرفية.

### 5. حمّل سياق الحساب ومساحة العمل

بعد التحقق، يستخدم الوكيل `Authorization: ApiKey <key>` ثم يحمّل الحساب:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

ثم يعرض مساحات العمل:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

وإذا لزم الأمر، يمكنه إنشاء مساحة عمل جديدة أو حفظ مساحة موجودة صراحة عبر `POST /v1/workspaces/{workspaceId}/select`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. نفّذ SQL عبر Agent API

بعد ذلك، تتم أعمال البيانات العادية عبر نطاق التطبيق:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

يجب أن يتضمن الطلب كلا الأمرين:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` فقط عندما تريد تجاوز مساحة العمل المحفوظة أو قبل حفظ واحدة

اختيار مساحة العمل هنا صريح، ويحفظ الخادم هذا الاختيار لكل مفتاح API بعد `POST /v1/workspaces/{workspaceId}/select`. وإذا كان لدى المستخدم مساحة عمل واحدة فقط، فستُحفظ تلقائيًا وتُستخدم للمفتاح الجديد.

## ما الذي يمكن لوكيلك فعله بعد الإعداد

بعد الاتصال، يستطيع الوكيل تولي الأعمال المالية المملة التي لا ينبغي أن تتطلب ساعات من النقر:

1. تحليل ملفات CSV أو PDF أو لقطات الشاشة المصدّرة من البنك
2. إدخال المعاملات في دفتر الأستاذ
3. التحقق من الأرصدة مقارنة بما يعرضه البنك
4. الاستعلام عن الإنفاق حسب الفئة أو التاجر أو الفترة
5. تحديث بنود الميزانية للشهر القادم

إليك مثالًا عمليًا على استيراد كشف حساب:

```text
Import ~/Downloads/revolut-february-2026.csv into my EUR account.
Before writing anything, query my existing categories and the last 30 days of transactions to avoid duplicates.
After import, compare the resulting account balance with the closing balance in the CSV.
```

وهذا مثال على التحليل:

```text
Show me my top 10 spending categories in the last 90 days, then compare them with the previous 90-day period.
Also list the largest transactions in categories where spending increased.
```

## لماذا هذا أفضل من إعداد مفتاح API يدويًا

المسار الجديد أبسط للمستخدم وللوكيل معًا:

- المستخدم لا يحتاج إلى نسخ مفتاح طويل الأجل يدويًا
- الوكيل يكتشف البروتوكول من المنتج نفسه
- المصادقة منفصلة عن الوصول إلى البيانات بشكل واضح
- كل طلب SQL مقيّد بمساحة العمل المحددة
- يمكن إلغاء الاتصال لاحقًا من داخل التطبيق

إذا كنت تبني سير عمل لتتبع النفقات بالذكاء الاصطناعي، فهذا مهم. فهو يزيل كثيرًا من boilerplate في الـ prompt وأخطاء الإعداد.

## متتبع نفقات مفتوح المصدر مع إعداد للوكلاء

Expense Budget Tracker مرخّص تحت MIT ومفتوح المصدر بالكامل:

- [موقع المشروع](https://expense-budget-tracker.com/ar/)
- [مستودع GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [ملف README على GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [توثيق إعداد وكلاء الذكاء الاصطناعي](https://expense-budget-tracker.com/ar/docs/agent-setup/)
- [مرجع API](https://expense-budget-tracker.com/ar/docs/api/)

إذا أردت استضافته ذاتيًا، فابدأ بـ:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

وإذا أردت استخدام النسخة المستضافة، فأعطِ وكيلك هذا الرابط:

```text
https://api.expense-budget-tracker.com/v1/
```

وهذا يكفي لكي يبدأ Claude Code أو Codex أو OpenClaw تدفق تسجيل الدخول بمفردهم.

---
title: "إعداد متتبع النفقات بالذكاء الاصطناعي لـ Claude Code وCodex وOpenClaw"
description: "كيفية ربط Claude Code أو Codex أو OpenClaw بمتتبع نفقات مفتوح المصدر. امنح وكيلك رابط اكتشاف واحدًا، أكّد رمز البريد الإلكتروني، احفظ `ApiKey` الذي يعود إليك، ثم دعه يبدأ العمل."
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

إذا أردت استخدام وكيل ذكاء اصطناعي لتتبع النفقات، فغالبًا ما تكون التهيئة هي الجزء الأكثر إزعاجًا.

غالبًا ما يسير المسار التقليدي على هذا النحو:

1. تفتح التطبيق
2. تنشئ مفتاح API
3. تنسخ المفتاح
4. تلصقه داخل وكيل الطرفية
5. تشرح له أي نقطة نهاية يجب أن يستدعيها
6. ثم تأمل أن يستخدم مساحة العمل الصحيحة

هذا المسار ممكن عمليًا، لكنه ليس مسارًا صُمم للوكلاء من الأصل.

يوفّر [Expense Budget Tracker](https://expense-budget-tracker.com/ar/) الآن نقطة اكتشاف عامة لوكلاء الطرفية مثل [Claude Code](https://docs.anthropic.com/en/docs/claude-code) وOpenAI Codex وOpenClaw:

`https://api.expense-budget-tracker.com/v1/`

يكفي أن تعطي الوكيل هذا الرابط، ثم تجيب عن سؤالين:

- ما عنوان البريد الإلكتروني الذي تريد استخدامه لتسجيل الدخول؟
- ما الرمز المكوّن من 8 أرقام الذي وصل للتو إلى صندوق الوارد؟

بعد ذلك، ينشئ الوكيل `ApiKey` الخاص به، ويحفظه خارج ذاكرة الدردشة، ويحمّل الحساب، ويعرض مساحات العمل، ويحفظ إحداها كمساحة العمل الافتراضية لذلك المفتاح، ثم يستطيع بدء استيراد المعاملات أو الاستعلام عنها.

المشروع مفتوح المصدر على GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [تنفيذ Machine API](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [مسار الوكيل لإرسال الرمز](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [مسار الوكيل للتحقق من الرمز](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## الرابط الوحيد الذي تعطيه لوكيلك

هذا هو الرابط بالضبط:

```text
https://api.expense-budget-tracker.com/v1/
```

تعيد نقطة النهاية هذه مستند اكتشاف تقرؤه الآلات. ومن خلاله يستطيع الوكيل معرفة:

- أين تبدأ تهيئة المصادقة
- ما الإجراء الذي يجب استدعاؤه أولًا
- ما ترويسة المصادقة التي يجب استخدامها لاحقًا
- ما الخطوات التالية لإعداد مساحة العمل والوصول إلى SQL

هذه هي الفكرة الأساسية: بدلًا من حشر تعليمات التهيئة داخل تعليمة يكتبها المستخدم، يشرح المنتج نفسه للوكيل كيف يتصل به.

## مثال على تعليمة لـ Claude Code

```text
اتصل بـ Expense Budget Tracker باستخدام https://api.expense-budget-tracker.com/v1/.
اطلب مني البريد الإلكتروني للحساب، ثم انتظر الرمز المكوّن من 8 أرقام الذي يصل إلى بريدي،
وأكمل الإعداد، واحفظ ApiKey الذي يعود إليك خارج ذاكرة الدردشة،
ثم استورد المعاملات من ~/Downloads/chase-march-2026.csv وتحقق من الرصيد النهائي.
```

## مثال على تعليمة لـ Codex

```text
استخدم https://api.expense-budget-tracker.com/v1/ للاتصال بحسابي في Expense Budget Tracker.
عندما تحتاج إلى معلومات تسجيل الدخول، اطلب مني البريد الإلكتروني ثم الرمز المكوّن من 8 أرقام.
بعد الإعداد، احفظ المفتاح، وافحص /schema، ثم اعرض لي آخر 20 معاملة وإجمالي إنفاق البقالة هذا الشهر.
```

## مثال على تعليمة لـ OpenClaw

```text
اتصل بنفسك إلى Expense Budget Tracker عبر https://api.expense-budget-tracker.com/v1/.
بعد تسجيل الدخول، احفظ مساحة عملي الشخصية كمساحة العمل الافتراضية لهذا المفتاح واستورد ملف CSV الذي رفعته.
استخدم الفئات الحالية كلما أمكن، وأخبرني إذا كان أي رصيد لا يتطابق.
```

## كيف تعمل تهيئة متتبع النفقات بالذكاء الاصطناعي

إليك تدفّق HTTP الكامل وراء هذا الإعداد.

### 1. اقرأ نقطة الاكتشاف

يبدأ الوكيل من هنا:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

تخبره الاستجابة أن يبدأ بـ `send_code`، وتتضمن عنوان التهيئة الأولية على نطاق المصادقة، وتشير إلى نقطتَي النهاية المنشورتين لـ `OpenAPI` و`schema`.

### 2. أرسل بريد المستخدم الإلكتروني

يرسل الوكيل عنوان البريد الإلكتروني إلى خدمة المصادقة:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

إذا نجح الطلب، فستتضمن الاستجابة `otpSessionToken` وتعليمات باستدعاء `verify_code`.

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

تتضمن الاستجابة `ApiKey` جديدًا. يُعرض هذا المفتاح مرة واحدة فقط، ولذلك ينبغي أن يحفظه الوكيل لاستخدامه في الطلبات اللاحقة، ويفضل كمتغير باسم `EXPENSE_BUDGET_TRACKER_API_KEY`.

هذا هو التحسين الأهم مقارنة بالمسار اليدوي القديم: لم يعد المستخدم بحاجة إلى إنشاء مفتاح من صفحة `Settings` ثم نسخه إلى الطرفية.

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

### 6. نفّذ استعلامات SQL عبر واجهة الوكيل

بعد ذلك، تنتقل أعمال البيانات المعتادة إلى نطاق التطبيق:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

يجب أن يتضمن الطلب الأمرين التاليين:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` فقط عندما تريد تجاوز مساحة العمل المحفوظة أو قبل حفظ مساحة عمل افتراضية

اختيار مساحة العمل هنا صريح، ويحفظ الخادم هذا الاختيار لكل مفتاح API بعد `POST /v1/workspaces/{workspaceId}/select`. وإذا كان لدى المستخدم مساحة عمل واحدة فقط، فستُحفظ تلقائيًا وتُستخدم مع المفتاح الجديد.

## ما الذي يمكن لوكيلك فعله بعد الإعداد

بعد الاتصال، يستطيع الوكيل تولي الأعمال المالية المملة التي لا ينبغي أن تتطلب ساعات من النقر:

1. تحليل ملفات CSV أو PDF أو لقطات الشاشة المصدّرة من البنك
2. إدخال المعاملات في دفتر الأستاذ
3. التحقق من الأرصدة مقارنة بما يعرضه البنك
4. الاستعلام عن الإنفاق حسب الفئة أو التاجر أو الفترة الزمنية
5. تحديث بنود الميزانية للشهر التالي

إليك مثالًا عمليًا على استيراد كشف حساب:

```text
استورد ~/Downloads/revolut-february-2026.csv إلى حسابي باليورو.
قبل أن تكتب أي شيء، استعلم عن فئاتي الحالية وعن معاملات آخر 30 يومًا لتجنب التكرار.
بعد الاستيراد، قارن رصيد الحساب الناتج مع الرصيد الختامي الموجود في ملف CSV.
```

وهذا مثال على التحليل:

```text
اعرض لي أعلى 10 فئات إنفاق لدي خلال آخر 90 يومًا، ثم قارنها بفترة التسعين يومًا السابقة.
واعرض أيضًا أكبر المعاملات في الفئات التي ارتفع فيها الإنفاق.
```

## لماذا هذا أفضل من إعداد مفتاح API يدويًا

المسار الجديد أبسط للمستخدم وللوكيل معًا:

- لا يحتاج المستخدم إلى نسخ مفتاح طويل الأمد يدويًا
- يكتشف الوكيل البروتوكول من المنتج نفسه
- تنفصل المصادقة عن الوصول إلى البيانات بشكل واضح
- يكون كل طلب SQL مقيّدًا بمساحة العمل المحددة
- يمكن إلغاء هذا الاتصال لاحقًا من داخل التطبيق

إذا كنت تبني سير عمل لتتبع النفقات بالذكاء الاصطناعي، فهذا مهم. فهو يزيل كثيرًا من التعليمات التمهيدية المكررة وأخطاء الإعداد.

## متتبع نفقات مفتوح المصدر مع تهيئة للوكلاء

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

وهذا يكفي لكي يبدأ Claude Code أو Codex أو OpenClaw تدفّق تسجيل الدخول من تلقاء نفسه.

---
title: "كيف تتابع المصروفات وتدير ميزانيتك باستخدام Claude Code"
description: "أعدّ Claude Code ليكون مساعدك الشخصي في الشؤون المالية. أعطه رابط اكتشاف واحدًا، ودعه يكمل تدفق رمز البريد الإلكتروني لمرة واحدة، ويحفظ ApiKey المُعاد، ثم يصبح قادرًا على تحليل الكشوف والتحقق من الأرصدة وإدارة ميزانيتك من الطرفية."
date: "2026-03-05"
---

Claude Code هو وكيل الذكاء الاصطناعي من Anthropic الذي يعمل داخل الطرفية. يمكنه قراءة الملفات وكتابة الشيفرة وتنفيذ الأوامر وإجراء طلبات HTTP. يستخدم معظم الناس Claude Code في تطوير البرمجيات. لكنه يعمل أيضًا بشكل ممتاز في التمويل الشخصي عندما تربطه بمتتبع مصروفات يملك Machine API نظيفًا.

الفكرة بسيطة: أوصل Claude Code بمتتبع مصروفات مفتوح المصدر عبر Machine API الخاص به، وسيتحول إلى مساعد مالي شخصي يعيش في الطرفية. ألقِ فيه كشفًا بنكيًا، واطلب من Claude Code تسجيل المعاملات، وفحص الأرصدة، وتحديث الميزانية، وكل ذلك عبر محادثة طبيعية. من دون التنقل بين شاشات الواجهة، ومن دون إدخال يدوي للبيانات.

## لماذا يعمل Claude Code جيدًا في تتبع المصروفات

يختلف Claude Code عن ChatGPT أو تطبيق Claude على الويب في عدة نقاط مهمة تؤثر فعلًا على التمويل الشخصي:

**يعمل محليًا ويمكنه قراءة ملفاتك.** عندما تنزّل كشفًا بنكيًا بصيغة CSV أو PDF، يستطيع Claude Code قراءته مباشرة من نظام الملفات لديك. لا رفع ملفات، ولا نسخ ولصق، ولا لقطات شاشة. تقول له "حلّل الكشف البنكي في `~/Downloads/chase-march-2026.csv`" فيقرأ الملف.

**يمكنه تنفيذ الشيفرة وطلبات HTTP.** Claude Code لا يكتفي باقتراح أمر `curl` بل يشغّله. وعندما يحتاج إلى إدخال 50 معاملة في قاعدة بيانات المصروفات لديك، يكتب SQL ويرسل طلب HTTP ويتحقق من النتيجة. ويتدفق كل ذلك داخل محادثة واحدة.

**يتذكر إعدادك بين الجلسات.** بعد حفظ `ApiKey` المُعاد خارج ذاكرة الدردشة، يستطيع Claude Code إعادة استخدام الاتصال نفسه في الجلسات اللاحقة بدل تكرار تدفق رمز البريد الإلكتروني كل مرة.

**يعمل على الملفات المحلية حتى عند الحاجة إلى تجهيزها محليًا.** إذا أردت معالجة الكشوف البنكية مسبقًا أو تنظيف صيغ CSV أو كتابة سكربتات استيراد، يستطيع Claude Code تنفيذ ذلك محليًا قبل أن يلمس أي شيء الـ API.

## إعداد Claude Code للتمويل الشخصي

أنت تحتاج إلى شيئين: متتبع مصروفات يملك Machine API، ومكان تحفظ فيه المفتاح طويل الأجل الذي يستلمه Claude Code بعد تسجيل الدخول.

[Expense Budget Tracker](https://expense-budget-tracker.com/ar/) هو نظام تمويل شخصي مفتوح المصدر مبني على Postgres. ونقطة الاكتشاف الأساسية له هي `GET https://api.expense-budget-tracker.com/v1/`. يمكنك التسجيل في النسخة المستضافة أو [استضافته ذاتيًا](https://github.com/kirill-markin/expense-budget-tracker) على خادمك.

### الخطوة 1: أعطِ Claude Code رابط الاكتشاف

اطلب من Claude Code أن يتصل باستخدام:

```text
https://api.expense-budget-tracker.com/v1/
```

يفترض أن يبدأ Claude Code بقراءة استجابة الاكتشاف، ثم يطلب:

- بريد حسابك الإلكتروني
- الرمز المكوّن من 8 أرقام الذي وصل إلى صندوق الوارد

وعندما يتحقق من الرمز، تعيد الخدمة مفتاحًا طويل الأجل بصيغة API الحقيقية، مثل `ebta_...`.

### الخطوة 2: احفظ المفتاح المُعاد خارج ذاكرة الدردشة

تدفق المصادقة مريح، لكن المفتاح ما زال يحتاج إلى مكان دائم للحفظ. والخلفية توضّح صراحة للوكلاء ألّا يعتمدوا على تاريخ الدردشة وحده.

نمط بسيط لذلك:

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="ebta_your_key_here"
```

إذا أردت أن يحفظه Claude Code في ملف `.env` محلي، فوافق على ذلك صراحة. وإلا فأبقِه في الـ shell للجلسة الحالية واحفظه أنت بنفسك في مكان دائم.

### الخطوة 3: احفظ مساحة العمل مرة واحدة

بعد أن يتحقق Claude Code من الرمز، ينبغي أن يحمّل حسابك ومساحات العمل:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

ثم احفظ مساحة العمل الافتراضية لذلك المفتاح مرة واحدة:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace-id/select \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

بعد ذلك، يمكن لـ `/v1/sql` الاستغناء عن `X-Workspace-Id`. وإذا كان لدى حسابك مساحة عمل واحدة فقط، فسيحفظها API تلقائيًا ويستخدمها من المرة الأولى.

### الخطوة 4: أضف ملف تعليمات محليًا يعبّر عن قواعدك أنت

سيعمل Claude Code بشكل أفضل أيضًا عندما تعطيه فئاتك وحساباتك وقواعد سير العمل الخاصة بك. ولهذا يفيد ملف `CLAUDE.md` محلي:

```markdown
# Personal Finance

## Expense Tracker API

- Endpoint: https://api.expense-budget-tracker.com/v1/sql
- Auth: ApiKey in Authorization header
- API key is in the EXPENSE_BUDGET_TRACKER_API_KEY environment variable
- Default workspace is already saved for this key
- Request: POST with JSON body {"sql": "your query"}
- Response: {"rows": [...], "rowCount": N}

## My expense categories

Income: salary, freelance, side-projects
Fixed: rent, utilities, insurance, subscriptions
Daily: groceries, dining-out, transport, coffee
Lifestyle: clothing, entertainment, healthcare, travel
Planning: taxes, big-purchases, savings, emergency-fund

## My accounts

- chase-checking (USD) — main checking account
- wise-eur (EUR) — European account
- cash-usd (USD) — cash

## Rules

- Always check existing categories before inserting transactions
- After importing, verify account balances match the bank
- Use the exact category names listed above
- Store transactions in their original currency
```

### الخطوة 5: افتح Claude Code وابدأ العمل

```bash
cd ~/finances
claude
```

سيقرأ Claude Code تعليماتك المحلية، ويعيد استخدام `ApiKey` المحفوظ، ويبدأ العمل فورًا.

## تحليل الكشوف البنكية باستخدام Claude Code

هنا يبرز Claude Code فعلًا. نزّل كشفك البنكي واطلب منه معالجته:

```
> I downloaded my Chase statement to ~/Downloads/chase-march-2026.csv.
> Parse it and record all transactions to my chase-checking account.
```

سيقوم Claude Code بما يلي:
1. يقرأ ملف CSV من نظام الملفات لديك
2. يحلّل كل سطر: التاريخ، والمبلغ، والوصف
3. يطابق كل معاملة مع إحدى فئات المصروفات لديك (من `CLAUDE.md`)
4. يبني تعليمات INSERT لجدول `ledger_entries`
5. يرسل كل واحدة عبر SQL API
6. يخبرك بما سجّله

أنت تراجع المخرجات، وتطلب من Claude Code تصحيح أي معاملة صُنّفت بشكل خاطئ، وينتهي الأمر. شهر كامل من المعاملات البنكية تتم معالجته في بضع دقائق.

وبالنسبة لكشوف PDF أو لقطات شاشة تطبيقك البنكي، يعمل الأسلوب نفسه أيضًا. يستطيع Claude Code قراءة الصور وملفات PDF، واستخراج بيانات المعاملات، وتسجيل كل شيء بالطريقة نفسها.

## التحقق من الأرصدة واكتشاف الأخطاء

بعد استيراد المعاملات، تحقّق دائمًا من أن الأرقام متطابقة:

```
> Check my account balances and compare them to what I see in the bank:
> chase-checking should be $4,230.15
> wise-eur should be €1,847.50
```

سيستعلم Claude Code عن عرض `accounts` عبر SQL API، ويقارن الأرصدة، ويشير إلى أي فروق. وإذا كان رصيد `chase-checking` يظهر 4,180.15 دولارًا بدل 4,230.15 دولارًا، يمكنه مساعدتك في العثور على الـ 50 دولارًا المفقودة، ربما معاملة سقطت من الاستيراد أو حُسبت مرتين.

فحص الأرصدة الأسبوعي هذا من أهم العادات في التمويل الشخصي. ويقوم Kirill Markin، الذي بنى Expense Budget Tracker ويصنّف كل معاملة شخصية منذ أكثر من خمس سنوات، بهذا الفحص كل أسبوع بلا استثناء. وهذا ما يحافظ على موثوقية البيانات مع الوقت.

## طرح أسئلة عن إنفاقك

بمجرد أن تصبح بيانات المصروفات في قاعدة البيانات، يمكن لـ Claude Code الإجابة عن أي سؤال مالي بكتابة استعلامات SQL:

```
> How much did I spend on dining out in the last 3 months?
```

```
> What are my top 5 expense categories this month?
```

```
> Show me all transactions over $100 from last week.
```

```
> What's my average monthly grocery spending over the past 6 months?
```

يكتب Claude Code الاستعلام، ويشغّله على الـ API، ثم يعطيك الإجابة بلغة واضحة. لا تحتاج إلى معرفة SQL بنفسك، لكن يمكنك دائمًا أن تطلب منه عرض الاستعلام الذي نفّذه أو التحقق من منطقيته أو تعديله.

## إدارة توقّعات ميزانيتك

تتبع المصروفات يعني تسجيل ما حدث بالفعل. أما إعداد الميزانية فيعني التخطيط لما سيأتي بعد ذلك. والاثنان يعيشان في قاعدة البيانات نفسها.

جدول `budget_lines` يخزن توقّعك الشهري: الدخل المتوقع والمصروفات المخطط لها لكل فئة ولكل شهر. ويمكنك إدارة ذلك عبر Claude Code:

```
> Set my budget for April 2026:
> - groceries: $400
> - dining-out: $200
> - rent: $2,100
> - salary income: $8,500
> Copy everything else from March's budget.
```

سيقرأ Claude Code بنود ميزانية مارس، ويُنشئ بنود أبريل مع تحديثاتك، ثم يكتبها عبر SQL API. وهكذا تحصل على توقّع متدحرج لمدة 12 شهرًا يمكنك استعراضه في واجهة الويب.

روتين شهري جيد: في نهاية كل شهر، افتح Claude Code وقل شيئًا مثل:

```
> Compare my actual spending this month against the budget.
> For any category where I spent more than 20% over budget,
> adjust next month's forecast to be more realistic.
```

سيقرأ Claude Code القيم الفعلية من `ledger_entries`، ويقارنها بالخطة في `budget_lines`، ويحدّث التوقع. هذا النوع من التحليل قد يأخذ 30 دقيقة يدويًا، ويأخذ دقيقتين فقط مع Claude Code.

## العمل بعدة عملات

إذا كانت لديك حسابات بعملات مختلفة، فسيتعامل Claude Code مع ذلك طبيعيًا. فمتتبع المصروفات يخزن كل معاملة بعملتها الأصلية ويجلب أسعار الصرف يوميًا من ECB وCBR وNBS.

```
> I received €2,500 freelance payment into wise-eur yesterday.
> Record it as income, category: freelance.
```

سيكتب Claude Code أمر INSERT مع `currency: 'EUR'` والمبلغ الصحيح. وعندما تسأل لاحقًا: "ما إجمالي دخلي هذا الشهر بالدولار؟" تقوم قاعدة البيانات بتحويل العملات وقت الاستعلام باستخدام أحدث أسعار الصرف. وClaude Code يعرض لك النتيجة فقط.

## ما الذي يستطيع Claude Code فعله ولا تستطيع واجهات الويب فعله

تكمن قوة Claude Code في التمويل الشخصي في جمع الوصول إلى الملفات وطلبات HTTP والمحادثة داخل أداة واحدة:

**المعالجة على دفعات.** ضع خمسة كشوف بنكية من حسابات مختلفة في مجلد واحد، واطلب من Claude Code معالجتها كلها. سيقرأ كل ملف، ويدخل المعاملات في الحسابات المناسبة، ويتحقق من الأرصدة في النهاية. تنفيذ هذا عبر واجهة ويب سيعني ساعة من النقر.

**التحليل المخصص.** "ما الأشهر التي شهدت أعلى إنفاق على الترفيه في السنة الماضية، وما أكبر المعاملات فيها؟" لا يوجد زر جاهز لهذا في تطبيقات الميزانية. يكتب Claude Code استعلام SQL ويشغّله ويشرح النتائج.

**تحويل الصيغ.** هل يصدّر بنكك CSV غريبًا بأعمدة مدمجة وتواريخ أوروبية؟ اطلب من Claude Code تنظيفه أولًا. سيعيد كتابة الملف محليًا ثم يستورد النسخة النظيفة.

**السكربتات.** اطلب من Claude Code كتابة سكربت Python قابل لإعادة الاستخدام: "اكتب سكربتًا يستورد CSV من Chase ويسجل كل المعاملات. احفظه في `~/finances/import-chase.py`." وفي المرة القادمة يكفي أن تشغّل السكربت مباشرة، مع Claude Code أو بدونه.

## مخطط قاعدة البيانات الذي يعمل معه Claude Code

يكشف Machine API الخاص بـ Expense Budget Tracker مجموعة صغيرة من العلاقات يسهل على وكلاء الذكاء الاصطناعي العمل معها. وتُنشر المجموعة المسموح بها عبر `GET /v1/schema`.

| Table | What it stores |
|---|---|
| `ledger_entries` | Every income and expense transaction |
| `budget_lines` | Budget plan — amounts per category per month |
| `budget_comments` | Notes on specific budget cells |
| `exchange_rates` | Daily FX rates (fetched automatically) |
| `workspace_settings` | Reporting currency preference |
| `account_metadata` | Account liquidity classification |
| `accounts` | VIEW — running balances per account |

يحتوي جدول `ledger_entries` على أعمدة واضحة: `event_id` و`ts` و`account_id` و`amount` و`currency` و`kind` و`category` و`counterparty` و`note`. ويمكن لـ Claude Code كتابة أوامر INSERT صحيحة من المحاولة الأولى لأن أسماء الأعمدة تصف بوضوح ما تحتويه.

## الأمان والتحكم في الوصول

منح Claude Code وصولًا إلى قاعدة بيانات مصروفاتك آمن ضمن قيود SQL API:

كل استعلام يمر عبر Postgres Row Level Security. ويرتبط مفتاح الـ API بمستخدمك، ويعمل SQL فقط على مساحة العمل المختارة. أي إن Claude Code لا يستطيع رؤية سوى بياناتك حتى لو كانت قاعدة البيانات مشتركة.

ويُسمح بتعليمة واحدة فقط في كل طلب. وأنواع التعليمات المدعومة هي `SELECT` و`WITH` و`INSERT` و`UPDATE` و`DELETE`. لا يستطيع Claude Code إنشاء الجداول أو حذفها، ولا استخدام transaction wrappers، ولا استدعاء `set_config()`، ولا إرسال تعليقات SQL أو quoted identifiers. ويفرض SQL API هذه القيود من جهة الخادم بصرف النظر عما يحاول Claude Code إرساله.

تُخزَّن مفاتيح الـ API بصيغة SHA-256 hashes، ولا تُحفظ القيم النصية الصريحة في قاعدة البيانات. ويمكن إلغاء المفاتيح لاحقًا من داخل المنتج. وتحدّ حدود المعدل الاستخدام عند 10 طلبات في الثانية و10,000 طلب يوميًا، مع مهلة 30 ثانية وحد أقصى 100 سطر لكل استجابة.

يبقى مفتاح الـ API في متغير البيئة المحلي لديك. ويقرأه Claude Code من `$EXPENSE_BUDGET_TRACKER_API_KEY` عند تنفيذ الطلبات، ولا يحتاج أبدًا إلى الالتزام داخل مشروعك.

## بديل متقدم: HTTP مباشر من دون تسجيل دخول مخصص للوكلاء

إذا كان لديك أصلًا `ApiKey` طويل الأجل لـ Expense Budget Tracker، فيستطيع Claude Code تجاوز إعداد رمز البريد الإلكتروني واستخدام المفتاح الموجود مباشرة. وفي هذا الوضع ما زلت تستدعي نقاط النهاية نفسها:

- `GET /v1/openapi.json` للحصول على المواصفة المنشورة القابلة للقراءة آليًا
- `GET /v1/schema` للعلاقات المسموح بها
- `POST /v1/sql` للاستعلامات الفعلية

هذا مفيد للسكربتات الثابتة والبيئات المجهزة مسبقًا، لكن بالنسبة لمعظم الناس يبقى رابط الاكتشاف مع تدفق OTP هو الإعداد الأسهل.

## سير عمل حقيقي: تتبع أسبوعي للمصروفات في 10 دقائق

يستخدم Kirill Markin هذا الأسلوب نفسه منذ سنوات، وهو ينتهي عادة إلى جلسة أسبوعية تبدو تقريبًا هكذا:

1. تنزيل الكشوف البنكية من كل الحسابات (دقيقتان)
2. فتح Claude Code وطلب معالجة الملفات (3 دقائق، يقوم Claude Code بالعمل وأنت تراقب)
3. مراجعة ما سجله Claude Code وتصحيح أي فئات خاطئة (3 دقائق)
4. طلب التحقق من تطابق كل أرصدة الحسابات مع البنك (دقيقة واحدة)
5. وإذا كانت نهاية الشهر، اطلب من Claude Code مقارنة الفعلي بالميزانية وتحديث التوقع (دقيقتان)

هذه 10 دقائق فقط لتحصل على صورة كاملة عن وضعك المالي: كل معاملة مصنفة، وكل رصيد متحقق منه، والميزانية محدّثة. وينجح النظام لأن الأجزاء المملة، مثل التحليل والتصنيف والإدخال والحساب، هي بالضبط ما يجيده Claude Code، بينما تبقى أجزاء الحكم البشري، مثل مراجعة الفئات واتخاذ قرارات تعديل الميزانية، لديك أنت.

## بدء الاستخدام مع Claude Code وExpense Budget Tracker

1. [ثبّت Claude Code](https://docs.anthropic.com/en/docs/claude-code) إذا لم تكن قد فعلت بعد
2. سجّل في [expense-budget-tracker.com](https://expense-budget-tracker.com/ar/) أو [استضف التطبيق ذاتيًا](https://github.com/kirill-markin/expense-budget-tracker)
3. أعطِ Claude Code الرابط `https://api.expense-budget-tracker.com/v1/`
4. أكمل تدفق رمز البريد الإلكتروني واحفظ المفتاح المُعاد في `EXPENSE_BUDGET_TRACKER_API_KEY`
5. احفظ مساحة عمل افتراضية لذلك المفتاح
6. أضف ملف `CLAUDE.md` محليًا مع فئاتك وحساباتك وقواعد سير العمل
7. افتح Claude Code داخل مجلدك المالي وضع فيه أول كشف بنكي

سيفحص Claude Code المخطط، ويطابق فئاتك، ويبدأ بتسجيل المعاملات. راجع النتائج، وصحّح أي شيء يبدو غير دقيق، وستحصل على إعداد تتبع مصروفات مدعوم بالذكاء الاصطناعي يعمل من الطرفية.

متتبع المصروفات مرخّص بترخيص MIT ومفتوح المصدر بالكامل على [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). أما Claude Code فمتاح على [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code). ويمكن البدء بالأداتين مجانًا.

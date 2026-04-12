---
title: "چطور با Claude Code هزینه‌ها را دنبال کنیم و بودجه را مدیریت کنیم"
description: "Claude Code را به دستیار مالی شخصی‌تان تبدیل کنید. یک URL‌ discovery به آن بدهید، بگذارید جریان OTP ایمیل را کامل کند، ApiKey دریافتی را ذخیره کند و بعد از ترمینال صورت‌حساب‌ها را parse کند، مانده‌ها را بررسی کند و بودجه را مدیریت کند."
date: "2026-03-05"
keywords:
  - "پیگیری هزینه با claude code"
  - "مدیریت بودجه با claude code"
  - "expense tracker برای claude code"
  - "claude code برای بودجه شخصی"
  - "api expense budget tracker"
  - "agent مالی در ترمینال"
---

Claude Code عامل هوش مصنوعی Anthropic است که در ترمینال شما اجرا می‌شود. می‌تواند فایل‌ها را بخواند، کد بنویسد، فرمان اجرا کند و درخواست HTTP بفرستد. بیشتر مردم Claude Code را برای توسعهٔ نرم‌افزار استفاده می‌کنند. اما وقتی آن را به یک expense tracker با machine API تمیز وصل کنید، برای امور مالی شخصی هم فوق‌العاده خوب جواب می‌دهد.

setup ساده است: Claude Code را از طریق machine API به یک expense tracker متن‌باز وصل می‌کنید و آن تبدیل می‌شود به دستیار مالی شخصی‌ای که در ترمینال شما زندگی می‌کند. صورت‌حساب بانکی را رها می‌کنید، از Claude Code می‌خواهید تراکنش‌ها را ثبت کند، مانده‌ها را بررسی کند، بودجه را به‌روزرسانی کند؛ همه از طریق گفت‌وگوی طبیعی. بدون کلیک‌کردن بین صفحه‌های UI، بدون ورود دستی داده.

## چرا Claude Code برای پیگیری هزینه خوب کار می‌کند

Claude Code در چند مورد مهم که برای امور مالی شخصی مهم‌اند با ChatGPT یا اپ وب Claude فرق دارد:

**به‌صورت محلی اجرا می‌شود و می‌تواند فایل‌های شما را بخواند.** وقتی صورت‌حساب بانکی را به شکل CSV یا PDF دانلود می‌کنید، Claude Code می‌تواند مستقیم از فایل‌سیستم شما بخواند. نه آپلود، نه کپی‌پیست، نه اسکرین‌شات. شما می‌گویید «صورت‌حساب بانکی داخل `~/Downloads/chase-march-2026.csv` را parse کن» و Claude Code همان فایل را می‌خواند.

**می‌تواند کد و درخواست HTTP اجرا کند.** Claude Code فقط دستور `curl` پیشنهاد نمی‌دهد؛ خودش آن را اجرا می‌کند. وقتی لازم باشد ۵۰ تراکنش را وارد دیتابیس هزینه‌های شما کند، SQL را می‌نویسد، درخواست HTTP را می‌فرستد و نتیجه را تأیید می‌کند. کل جریان داخل یک گفت‌وگو اتفاق می‌افتد.

**setup شما را بین نشست‌ها به خاطر می‌سپارد.** وقتی ApiKey برگردانده‌شده بیرون از حافظهٔ چت ذخیره شود، Claude Code می‌تواند در نشست‌های بعدی همان اتصال را دوباره استفاده کند، بدون اینکه هر بار جریان کد ایمیل را تکرار کند.

**با فایل‌های محلی به‌صورت آفلاین کار می‌کند.** اگر بخواهید صورت‌حساب‌های بانکی را پیش‌پردازش کنید، فرمت CSV را تمیز کنید یا script واردسازی بنویسید، Claude Code همهٔ این کارها را قبل از تماس با API به‌صورت محلی انجام می‌دهد.

## راه‌اندازی Claude Code برای امور مالی شخصی

به دو چیز نیاز دارید: یک expense tracker با machine API، و جایی برای نگه‌داشتن کلید بلندمدتی که Claude Code بعد از login دریافت می‌کند.

[Expense Budget Tracker](https://expense-budget-tracker.com/fa/) یک سیستم مالی شخصی متن‌باز مبتنی بر Postgres است. endpoint رسمی discovery آن این است: `GET https://api.expense-budget-tracker.com/v1/`. می‌توانید در نسخهٔ میزبانی‌شده ثبت‌نام کنید یا آن را روی سرور خودتان [self-host](https://github.com/kirill-markin/expense-budget-tracker) کنید.

### مرحلهٔ ۱: URL‌ discovery را به Claude Code بدهید

به Claude Code بگویید با این آدرس وصل شود:

```text
https://api.expense-budget-tracker.com/v1/
```

Claude Code باید با خواندن پاسخ discovery شروع کند و بعد از شما این‌ها را بپرسد:

- ایمیل حساب‌تان
- کد ۸ رقمی‌ای که به inbox شما ارسال شده

وقتی کد را تأیید کند، سرویس یک کلید بلندمدت در فرمت واقعی API برمی‌گرداند؛ مثلاً `ebta_...`.

### مرحلهٔ ۲: کلید دریافتی را بیرون از حافظهٔ چت ذخیره کنید

جریان auth راحت است، اما کلید هنوز باید جایی پایدار ذخیره شود. backend صراحتاً به agentها می‌گوید نباید فقط به تاریخچهٔ چت تکیه کنند.

یک الگوی ساده این است:

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="ebta_your_key_here"
```

اگر می‌خواهید Claude Code آن را در یک فایل `.env` محلی ذخیره کند، این را صریحاً تأیید کنید. در غیر این صورت، آن را فقط در shell برای نشست جاری نگه دارید و خودتان در جایی پایدار ذخیره‌اش کنید.

### مرحلهٔ ۳: workspace را یک‌بار ذخیره کنید

بعد از اینکه Claude Code کد را تأیید کرد، باید حساب و workspaceهای شما را بار کند:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

بعد یک‌بار workspace پیش‌فرض برای آن کلید ذخیره می‌شود:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace-id/select \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

بعد از آن، `/v1/sql` می‌تواند `X-Workspace-Id` را حذف کند. اگر حساب شما دقیقاً یک workspace داشته باشد، API همان بار اول آن را خودکار ذخیره و استفاده می‌کند.

### مرحلهٔ ۴: یک فایل instruction محلی برای قواعد خودتان اضافه کنید

Claude Code وقتی دسته‌بندی‌ها، حساب‌ها و قوانین workflow شما را بداند بهتر کار می‌کند. یک `CLAUDE.md` محلی برای این بخش خیلی مفید است:

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

### مرحلهٔ ۵: Claude Code را باز کنید و شروع کنید

```bash
cd ~/finances
claude
```

Claude Code دستورالعمل‌های محلی شما را می‌خواند، ApiKey ذخیره‌شده را دوباره استفاده می‌کند و می‌تواند بلافاصله شروع به کار کند.

## parse کردن صورت‌حساب بانکی با Claude Code

اینجا همان جایی است که Claude Code واقعاً می‌درخشد. صورت‌حساب بانکی را دانلود کنید و به Claude Code بگویید آن را پردازش کند:

```text
> I downloaded my Chase statement to ~/Downloads/chase-march-2026.csv.
> Parse it and record all transactions to my chase-checking account.
```

Claude Code این کارها را انجام می‌دهد:
1. فایل CSV را از فایل‌سیستم شما می‌خواند
2. هر ردیف را parse می‌کند: تاریخ، مبلغ، شرح
3. هر تراکنش را با یکی از دسته‌بندی‌های هزینهٔ شما تطبیق می‌دهد
4. برای جدول `ledger_entries` دستورهای INSERT می‌سازد
5. هر کدام را از طریق SQL API ارسال می‌کند
6. گزارش می‌دهد چه چیزهایی را ثبت کرده است

شما خروجی را بازبینی می‌کنید، اگر دسته‌بندی‌ای اشتباه بود از Claude Code می‌خواهید اصلاحش کند و کار تمام است. تراکنش‌های یک ماه کامل، در چند دقیقه پردازش می‌شوند.

برای صورت‌حساب‌های PDF یا اسکرین‌شات‌های اپ بانکی هم همین رویکرد جواب می‌دهد. Claude Code می‌تواند تصویر و PDF را بخواند، دادهٔ تراکنش‌ها را استخراج کند و همه‌چیز را همان‌طور ثبت کند.

## بررسی مانده‌حساب‌ها و پیدا کردن خطاها

بعد از import تراکنش‌ها، همیشه بررسی کنید که عددها با هم جمع می‌شوند:

```text
> Check my account balances and compare them to what I see in the bank:
> chase-checking should be $4,230.15
> wise-eur should be €1,847.50
```

Claude Code از طریق SQL API روی view `accounts` پرس‌وجو می‌کند، مانده‌ها را مقایسه می‌کند و هر مغایرتی را علامت می‌زند. اگر `chase-checking` به‌جای ۴٬۲۳۰٫۱۵ دلار عدد ۴٬۱۸۰٫۱۵ دلار را نشان بدهد، Claude Code می‌تواند به شما کمک کند آن ۵۰ دلار گمشده را پیدا کنید؛ شاید یک تراکنش جا افتاده یا دوبار شمرده شده باشد.

این بررسی هفتگیِ مانده یکی از مهم‌ترین عادت‌ها در امور مالی شخصی است. Kirill Markin که Expense Budget Tracker را ساخته و بیش از پنج سال است هر تراکنش شخصی‌اش را دسته‌بندی می‌کند، همین بررسی را هر هفته بدون استثنا انجام می‌دهد. همین است که داده‌ها را در طول زمان قابل‌اعتماد نگه می‌دارد.

## پرسیدن سؤال دربارهٔ خرج‌هایتان

وقتی دادهٔ هزینه‌هایتان داخل دیتابیس باشد، Claude Code می‌تواند هر سؤالی را دربارهٔ امور مالی‌تان با نوشتن SQL جواب بدهد:

```text
> How much did I spend on dining out in the last 3 months?
```

```text
> What are my top 5 expense categories this month?
```

```text
> Show me all transactions over $100 from last week.
```

```text
> What's my average monthly grocery spending over the past 6 months?
```

Claude Code SQL را می‌نویسد، روی API اجرا می‌کند و پاسخ را به زبان ساده به شما می‌دهد. لازم نیست خودتان SQL بلد باشید، اما همیشه می‌توانید از Claude Code بخواهید query اجراشده را نشان بدهد، بررسی‌اش کنید یا تغییرش بدهید.

## مدیریت پیش‌بینی بودجه

پیگیری هزینه یعنی ثبت آنچه قبلاً اتفاق افتاده. بودجه‌بندی یعنی برنامه‌ریزی برای بعد. هر دو داخل همان دیتابیس زندگی می‌کنند.

جدول `budget_lines` پیش‌بینی ماهانهٔ شما را نگه می‌دارد؛ درآمد مورد انتظار و هزینهٔ برنامه‌ریزی‌شده برای هر دسته‌بندی و هر ماه. می‌توانید این را از طریق Claude Code مدیریت کنید:

```text
> Set my budget for April 2026:
> - groceries: $400
> - dining-out: $200
> - rent: $2,100
> - salary income: $8,500
> Copy everything else from March's budget.
```

Claude Code ردیف‌های بودجهٔ مارس را می‌خواند، ردیف‌های آوریل را با تغییرات شما می‌سازد و از طریق SQL API می‌نویسد. حالا یک پیش‌بینی غلتان ۱۲ ماهه دارید که می‌توانید در UI وب روی آن اسکرول کنید.

یک روتین ماهانهٔ خوب: آخر هر ماه، Claude Code را باز کنید و چیزی شبیه این بگویید:

```text
> Compare my actual spending this month against the budget.
> For any category where I spent more than 20% over budget,
> adjust next month's forecast to be more realistic.
```

Claude Code actualها را از `ledger_entries` می‌خواند، با برنامه در `budget_lines` مقایسه می‌کند و پیش‌بینی را به‌روزرسانی می‌کند. همین نوع تحلیلی است که دستی ۳۰ دقیقه طول می‌کشد و با Claude Code در ۲ دقیقه تمام می‌شود.

## کار با چند ارز

اگر حساب‌هایی در ارزهای مختلف دارید، Claude Code این را طبیعی مدیریت می‌کند. expense tracker هر تراکنش را در ارز اصلی خودش ذخیره می‌کند و نرخ‌های تبدیل را هر روز از ECB، CBR و NBS می‌گیرد.

```text
> I received €2,500 freelance payment into wise-eur yesterday.
> Record it as income, category: freelance.
```

Claude Code دستور INSERT را با `currency: 'EUR'` و مبلغ درست می‌نویسد. بعداً وقتی بپرسید «جمع درآمد من این ماه به دلار چقدر بوده؟» دیتابیس تبدیل ارز را هنگام query با استفاده از جدیدترین نرخ‌ها انجام می‌دهد. Claude Code فقط نتیجه را گزارش می‌کند.

## Claude Code چه کاری می‌تواند بکند که UIهای وب نمی‌توانند

قدرت Claude Code در امور مالی شخصی از ترکیب دسترسی به فایل، درخواست HTTP و گفت‌وگو در یک ابزار می‌آید:

**پردازش دسته‌ای.** پنج صورت‌حساب بانکی از حساب‌های مختلف را داخل یک پوشه بیندازید و به Claude Code بگویید همه را پردازش کند. هر فایل را می‌خواند، تراکنش‌ها را در حساب درست ثبت می‌کند و در پایان مانده‌ها را بررسی می‌کند. انجام همین کار در یک UI وب یک ساعت کلیک می‌خواهد.

**تحلیل سفارشی.** «در یک سال گذشته کدام ماه‌ها بیشترین خرج سرگرمی را داشتند و بزرگ‌ترین تراکنش‌ها چه بودند؟» هیچ اپ بودجه‌ای برای این دکمه ندارد. Claude Code query را می‌نویسد، اجرا می‌کند و نتیجه را توضیح می‌دهد.

**تبدیل فرمت.** بانک شما یک CSV عجیب با ستون‌های ادغام‌شده و فرمت اروپایی تاریخ می‌دهد؟ به Claude Code بگویید اول فایل را تمیز کند. آن را محلی بازنویسی می‌کند و بعد نسخهٔ تمیز را import می‌کند.

**script‌نویسی.** از Claude Code بخواهید یک script پایتون بنویسد که بعداً دوباره هم استفاده‌اش کنید: «یک script بنویس که CSV بانک Chase را import کند و همهٔ تراکنش‌ها را ثبت کند. آن را در `~/finances/import-chase.py` ذخیره کن.» دفعهٔ بعد فقط script را اجرا می‌کنید؛ با Claude Code یا بدون آن.

## schema دیتابیسی که Claude Code با آن کار می‌کند

machine API مربوط به Expense Budget Tracker یک مجموعهٔ کوچک از relationها را در اختیار می‌گذارد که برای agentهای AI ساده‌اند. این مجموعه از طریق `GET /v1/schema` منتشر می‌شود.

| جدول | چیزی که ذخیره می‌کند |
|---|---|
| `ledger_entries` | همهٔ تراکنش‌های درآمد و هزینه |
| `budget_lines` | برنامهٔ بودجه؛ مبلغ‌ها به‌ازای هر دسته‌بندی و هر ماه |
| `budget_comments` | یادداشت‌ها روی سلول‌های خاص بودجه |
| `exchange_rates` | نرخ‌های روزانهٔ ارز |
| `workspace_settings` | ترجیح ارز گزارش‌گیری |
| `account_metadata` | طبقه‌بندی نقدشوندگی حساب |
| `accounts` | VIEW با مانده‌های در حال حرکت هر حساب |

جدول `ledger_entries` ستون‌های واضحی دارد: `event_id`، `ts`، `account_id`، `amount`، `currency`، `kind`، `category`، `counterparty`، `note`. Claude Code می‌تواند از همان بار اول دستورهای INSERT درست بنویسد چون نام ستون‌ها دقیقاً توضیح می‌دهند چه چیزی را نگه می‌دارند.

## امنیت و کنترل دسترسی

دادن دسترسی Claude Code به دیتابیس هزینه‌هایتان در چارچوب محدودیت‌های SQL API امن است:

هر query از فیلتر Postgres Row Level Security عبور می‌کند. API key به کاربر شما وصل است و SQL فقط روی workspace انتخاب‌شده اجرا می‌شود؛ یعنی Claude Code فقط داده‌های شما را می‌بیند، حتی اگر دیتابیس مشترک باشد.

در هر درخواست فقط یک statement مجاز است. نوع statementهای پشتیبانی‌شده `SELECT`، `WITH`، `INSERT`، `UPDATE` و `DELETE` هستند. Claude Code نمی‌تواند جدول بسازد یا حذف کند، نمی‌تواند transaction wrapper استفاده کند، نمی‌تواند `set_config()` صدا بزند و نمی‌تواند SQL comment یا quoted identifier بفرستد. SQL API همهٔ این محدودیت‌ها را در سمت سرور enforce می‌کند، فارغ از اینکه Claude Code چه چیزی تلاش کند بفرستد.

API keyها به شکل SHA-256 hash ذخیره می‌شوند؛ متن خام کلید هرگز داخل دیتابیس نیست. بعداً می‌توانید کلیدها را از داخل محصول لغو کنید. rate limit استفاده را به ۱۰ درخواست در ثانیه و ۱۰٬۰۰۰ درخواست در روز محدود می‌کند، با timeout سی‌ثانیه‌ای و سقف ۱۰۰ ردیف در هر پاسخ.

کلید API داخل environment variable محلی شما می‌ماند. Claude Code هنگام درخواست‌فرستادن آن را از `$EXPENSE_BUDGET_TRACKER_API_KEY` می‌خواند؛ لازم نیست هرگز در پروژه commit شود.

## جایگزین پیشرفته: HTTP مستقیم بدون login بومیِ agent

اگر از قبل یک ApiKey بلندمدت برای Expense Budget Tracker دارید، Claude Code می‌تواند جریان OTP ایمیل را رد کند و مستقیم از همان کلید استفاده کند. در این حالت، باز هم همان endpointها را صدا می‌زنید:

- `GET /v1/openapi.json` برای spec ماشین‌خوان منتشرشده
- `GET /v1/schema` برای relationهای مجاز
- `POST /v1/sql` برای queryهای واقعی

این حالت برای scriptهای پایدار و محیط‌های از قبل پیکربندی‌شده مفید است، اما برای بیشتر افراد URL discovery به‌همراه جریان OTP ساده‌ترین setup است.

## یک workflow واقعی: پیگیری هفتگی هزینه‌ها در ۱۰ دقیقه

Kirill Markin سال‌هاست دقیقاً با همین workflow کار می‌کند و در عمل جلسهٔ هفتگی‌اش تقریباً این شکلی است:

1. صورت‌حساب‌های بانکی را از همهٔ حساب‌ها دانلود می‌کند (۲ دقیقه)
2. Claude Code را باز می‌کند و می‌گوید فایل‌ها را پردازش کند (۳ دقیقه؛ Claude Code کار را انجام می‌دهد و شما نگاه می‌کنید)
3. چیزی را که Claude Code ثبت کرده مرور می‌کند و دسته‌بندی‌های اشتباه را اصلاح می‌کند (۳ دقیقه)
4. از Claude Code می‌خواهد همهٔ مانده‌حساب‌ها را با بانک تطبیق دهد (۱ دقیقه)
5. اگر آخر ماه باشد، از Claude Code می‌خواهد actualها را با بودجه مقایسه کند و پیش‌بینی را به‌روزرسانی کند (۲ دقیقه)

یعنی ۱۰ دقیقه برای یک تصویر کامل از امور مالی: همهٔ تراکنش‌ها دسته‌بندی شده، همهٔ مانده‌ها بررسی شده، بودجه به‌روزرسانی شده. سیستم جواب می‌دهد چون بخش‌های خسته‌کنندهٔ ماجرا، یعنی parse کردن، دسته‌بندی، insert و محاسبه، دقیقاً همان چیزهایی هستند که Claude Code در آن خوب است و بخش‌های قضاوتی، یعنی بازبینی دسته‌بندی‌ها و تصمیم‌گیری دربارهٔ تغییر بودجه، دست شما می‌مانند.

## شروع کار با Claude Code و Expense Budget Tracker

1. اگر هنوز نصبش نکرده‌اید، [Claude Code را نصب کنید](https://docs.anthropic.com/en/docs/claude-code)
2. در [expense-budget-tracker.com](https://expense-budget-tracker.com/fa/) ثبت‌نام کنید یا اپ را [self-host](https://github.com/kirill-markin/expense-budget-tracker) کنید
3. آدرس `https://api.expense-budget-tracker.com/v1/` را به Claude Code بدهید
4. جریان OTP ایمیل را کامل کنید و کلید برگشتی را به شکل `EXPENSE_BUDGET_TRACKER_API_KEY` ذخیره کنید
5. یک workspace پیش‌فرض برای آن کلید ذخیره کنید
6. یک فایل `CLAUDE.md` محلی با دسته‌بندی‌ها، حساب‌ها و قواعد workflow خودتان اضافه کنید
7. Claude Code را در پوشهٔ مالی‌تان باز کنید و اولین صورت‌حساب بانکی را داخلش بیندازید

Claude Code schema را بررسی می‌کند، دسته‌بندی‌های شما را تطبیق می‌دهد و شروع می‌کند به ثبت تراکنش‌ها. نتیجه را بازبینی کنید، هر چیزی که مشکوک بود اصلاح کنید و یک setup پیگیری هزینه با AI خواهید داشت که از داخل ترمینال اجرا می‌شود.

این expense tracker تحت مجوز MIT منتشر شده و کاملاً متن‌باز است: [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Claude Code هم از اینجا در دسترس است: [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code). شروع با هر دو ابزار رایگان است.

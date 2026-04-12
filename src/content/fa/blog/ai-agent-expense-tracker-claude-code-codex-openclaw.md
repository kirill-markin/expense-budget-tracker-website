---
title: "راه‌اندازی رهگیر هزینه با هوش مصنوعی برای Claude Code، Codex و OpenClaw"
description: "چطور Claude Code، Codex یا OpenClaw را به یک رهگیر هزینهٔ متن‌باز وصل کنید: یک لینک discovery بدهید، کد ایمیل را تایید کنید، ApiKey برگردانده‌شده را ذخیره کنید و بگذارید عامل کار را شروع کند."
date: "2026-03-10"
keywords:
  - "راه‌اندازی رهگیر هزینه با هوش مصنوعی"
  - "رهگیر هزینه برای codex"
  - "رهگیر هزینه برای claude code"
  - "رهگیر هزینه برای openclaw"
  - "اتصال عامل هوش مصنوعی به بودجه"
  - "api expense budget tracker"
---

اگر می‌خواهید برای پیگیری هزینه‌ها از یک عامل هوش مصنوعی استفاده کنید، بخش آزاردهنده معمولاً مرحلهٔ راه‌اندازی است.

جریان معمول معمولاً این شکلی است:

1. برنامه را باز کنید
2. یک API key بسازید
3. کلید را کپی کنید
4. آن را در عامل ترمینالی خود پیست کنید
5. توضیح بدهید کدام endpoint باید صدا زده شود
6. امیدوار باشید عامل فضای‌کار درست را انتخاب کند

این روش شدنی است، اما agent-native نیست.

[Expense Budget Tracker](https://expense-budget-tracker.com/fa/) حالا یک endpoint عمومی discovery برای عامل‌های ترمینالی مثل [Claude Code](https://docs.anthropic.com/en/docs/claude-code)، OpenAI Codex یا OpenClaw ارائه می‌کند:

`https://api.expense-budget-tracker.com/v1/`

کاربر فقط همان یک لینک را به عامل می‌دهد و بعد به دو سؤال جواب می‌دهد:

- برای ورود از کدام ایمیل باید استفاده شود؟
- کد ۸ رقمی‌ای که همین الان به صندوق ورودی رسیده چیست؟

بعد از آن، عامل `ApiKey` خودش را می‌گیرد، آن را بیرون از حافظهٔ چت ذخیره می‌کند، حساب را بار می‌کند، فضاهای‌کار را فهرست می‌کند، یکی را به‌عنوان پیش‌فرض همان کلید ذخیره می‌کند و می‌تواند وارد کردن یا پرس‌وجوی تراکنش‌ها را شروع کند.

این پروژه روی GitHub متن‌باز است:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [پیاده‌سازی Machine API](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [مسیر send-code برای عامل](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [مسیر verify-code برای عامل](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## همان یک لینکی که باید به عامل بدهید

این URL دقیق است:

```text
https://api.expense-budget-tracker.com/v1/
```

این endpoint یک سند discovery ماشین‌خوان برمی‌گرداند. عامل می‌تواند از آن بخواند:

- bootstrap احراز هویت کجا قرار دارد
- اولین action کدام است
- بعداً باید از چه auth headerی استفاده شود
- برای راه‌اندازی فضای‌کار و دسترسی SQL چه مرحله‌هایی بعد از آن می‌آید

ایدهٔ اصلی همین است: به‌جای اینکه دستورالعمل راه‌اندازی اولیه را داخل prompt هاردکد کنید، خود محصول به عامل می‌گوید چطور وصل شود.

## نمونه prompt برای Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Ask me for the account email, wait for the 8-digit code from my inbox, finish the setup,
save the returned ApiKey outside chat memory, then import transactions from ~/Downloads/chase-march-2026.csv and verify the final balance.
```

## نمونه prompt برای Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
When you need login information, ask me for the email and then the 8-digit code.
After setup, save the key, inspect /schema, and show me my latest 20 transactions and total grocery spend this month.
```

## نمونه prompt برای OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, save my personal workspace as the default for this key and import the CSV file I uploaded.
Use existing categories when possible, and tell me if any balance does not match.
```

## راه‌اندازی رهگیر هزینه با هوش مصنوعی چطور کار می‌کند

در ادامه، کل جریان HTTP پشت این راه‌اندازی را می‌بینید.

### 1. خواندن endpoint discovery

عامل از اینجا شروع می‌کند:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

پاسخ به آن می‌گوید با `send_code` شروع کند، URL مربوط به bootstrap را روی دامنهٔ auth می‌دهد و به endpointهای منتشرشدهٔ OpenAPI و schema اشاره می‌کند.

### 2. فرستادن ایمیل کاربر

عامل آدرس ایمیل را به سرویس auth می‌فرستد:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

اگر درخواست موفق باشد، پاسخ شامل `otpSessionToken` و دستورالعمل فراخوانی `verify_code` است.

### 3. درخواست کد ۸ رقمی ایمیل از کاربر

کاربر صندوق ورودی را چک می‌کند و کد را برای عامل می‌فرستد.

### 4. تایید کد و گرفتن ApiKey

بعد از آن، عامل این درخواست را می‌زند:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

پاسخ شامل یک `ApiKey` جدید است. این کلید فقط یک بار نمایش داده می‌شود و بهتر است عامل آن را برای درخواست‌های بعدی ذخیره کند، ترجیحاً با نام `EXPENSE_BUDGET_TRACKER_API_KEY`.

این بزرگ‌ترین بهبود نسبت به جریان دستی قبلی است: کاربر دیگر لازم نیست در Settings کلید بسازد و آن را دستی وارد ترمینال کند.

### 5. بار کردن زمینهٔ حساب و فضای‌کار

بعد از تایید، عامل با `Authorization: ApiKey <key>` حساب را بار می‌کند:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

بعد، فضاهای‌کار را فهرست می‌کند:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

اگر لازم باشد، می‌تواند فضای‌کار جدید بسازد یا با `POST /v1/workspaces/{workspaceId}/select` یکی از فضاهای‌کار موجود را صریحاً ذخیره کند.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. اجرای SQL از طریق Agent API

بعد از آن، کار عادی داده از طریق دامنهٔ اپ انجام می‌شود:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

درخواست باید هر دو مورد زیر را شامل شود:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` فقط وقتی که می‌خواهید فضای‌کار ذخیره‌شده را نادیده بگیرید یا هنوز چیزی ذخیره نشده است

انتخاب فضای‌کار صریح است و سرور بعد از `POST /v1/workspaces/{workspaceId}/select` آن انتخاب را برای هر API key ذخیره می‌کند. اگر کاربر دقیقاً یک فضای‌کار داشته باشد، API آن را برای کلید جدید به‌صورت خودکار ذخیره و استفاده می‌کند.

## عامل شما بعد از راه‌اندازی چه کارهایی می‌تواند انجام دهد

وقتی اتصال برقرار شد، عامل می‌تواند کارهای خسته‌کنندهٔ مالی را انجام بدهد؛ کارهایی که نباید ساعت‌ها کلیک بخواهند:

1. خروجی‌های CSV، PDF یا اسکرین‌شات بانک را تجزیه کند
2. تراکنش‌ها را در دفتر کل ثبت کند
3. مانده‌ها را با چیزی که بانک نشان می‌دهد تطبیق بدهد
4. هزینه‌ها را بر اساس دسته‌بندی، فروشنده یا بازهٔ زمانی پرس‌وجو کند
5. خطوط بودجهٔ ماه بعد را به‌روزرسانی کند

در ادامه یک نمونهٔ عملی برای وارد کردن صورت‌حساب آمده است:

```text
Import ~/Downloads/revolut-february-2026.csv into my EUR account.
Before writing anything, query my existing categories and the last 30 days of transactions to avoid duplicates.
After import, compare the resulting account balance with the closing balance in the CSV.
```

و این هم یک نمونه برای تحلیل:

```text
Show me my top 10 spending categories in the last 90 days, then compare them with the previous 90-day period.
Also list the largest transactions in categories where spending increased.
```

## چرا این روش از راه‌اندازی دستی API key بهتر است

جریان جدید هم برای کاربر ساده‌تر است و هم برای عامل:

- کاربر لازم نیست یک کلید بلندمدت را دستی کپی کند
- عامل پروتکل را از خود محصول کشف می‌کند
- auth به‌صورت تمیز از دسترسی به داده جدا شده است
- هر درخواست SQL در محدودهٔ فضای‌کار انتخاب‌شده اجرا می‌شود
- بعداً می‌توان اتصال را از داخل برنامه لغو کرد

اگر در حال ساختن یک گردش‌کار برای رهگیری هزینه با هوش مصنوعی هستید، این موضوع مهم است. این روش مقدار زیادی کار تکراری اولیه داخل prompt و خطاهای راه‌اندازی را حذف می‌کند.

## رهگیر هزینهٔ متن‌باز با راه‌اندازی مخصوص عامل

Expense Budget Tracker تحت مجوز MIT منتشر شده و کاملاً متن‌باز است:

- [وب‌سایت پروژه](https://expense-budget-tracker.com/fa/)
- [مخزن GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README روی GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [مستندات راه‌اندازی AI Agent](https://expense-budget-tracker.com/fa/docs/agent-setup/)
- [مرجع API](https://expense-budget-tracker.com/fa/docs/api/)

اگر می‌خواهید خودتان میزبانی‌اش کنید، از اینجا شروع کنید:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

اگر می‌خواهید از نسخهٔ میزبانی‌شده استفاده کنید، این URL را به عامل خود بدهید:

```text
https://api.expense-budget-tracker.com/v1/
```

همین برای شروع جریان ورود خودکار توسط Claude Code، Codex یا OpenClaw کافی است.

---
title: "راه‌اندازی رهگیر هزینه با هوش مصنوعی برای Claude Code، Codex و OpenClaw"
description: "چطور Claude Code، Codex یا OpenClaw را به یک رهگیر هزینهٔ متن‌باز وصل کنید: یک نشانی معرفی سرویس بدهید، کد ایمیل را تأیید کنید، ApiKey دریافتی را ذخیره کنید و بگذارید ایجنت کار را شروع کند."
date: "2026-03-10"
keywords:
  - "راه‌اندازی رهگیر هزینه با هوش مصنوعی"
  - "رهگیر هزینه برای Codex"
  - "رهگیر هزینه برای Claude Code"
  - "رهگیر هزینه برای OpenClaw"
  - "اتصال ایجنت هوش مصنوعی به بودجه"
  - "API Expense Budget Tracker"
---

اگر می‌خواهید برای پیگیری هزینه‌ها از یک ایجنت هوش مصنوعی استفاده کنید، معمولاً دردسر اصلی همان راه‌اندازی اولیه است.

این فرایند معمولاً این‌طور پیش می‌رود:

1. برنامه را باز کنید
2. یک کلید API بسازید
3. کلید را کپی کنید
4. آن را داخل ایجنت ترمینالی خود جای‌گذاری کنید
5. توضیح بدهید باید کدام نشانی را فراخوانی کند
6. امیدوار باشید ایجنت فضای کاری درست را انتخاب کند

این روش شدنی است، اما برای کار با ایجنت‌ها طراحی نشده است.

[Expense Budget Tracker](https://expense-budget-tracker.com/fa/) حالا یک نشانی عمومی برای معرفی سرویس به ایجنت‌های ترمینالی مثل [Claude Code](https://docs.anthropic.com/en/docs/claude-code)، OpenAI Codex و OpenClaw ارائه می‌کند:

`https://api.expense-budget-tracker.com/v1/`

کاربر فقط همین یک لینک را به ایجنت می‌دهد و بعد به دو سؤال جواب می‌دهد:

- برای ورود باید از کدام ایمیل استفاده شود؟
- کد ۸ رقمی‌ای که همین حالا به صندوق ورودی رسیده چیست؟

بعد از آن، ایجنت برای خودش یک `ApiKey` می‌گیرد، آن را بیرون از حافظهٔ چت ذخیره می‌کند، اطلاعات حساب را می‌خواند، فهرست فضاهای کاری را می‌گیرد، یکی را به‌عنوان پیش‌فرض همان کلید ذخیره می‌کند و می‌تواند وارد کردن یا پرس‌وجوی تراکنش‌ها را شروع کند.

این پروژه روی GitHub متن‌باز است:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [پیاده‌سازی API ماشینی](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [مسیر ارسال کد برای ایجنت](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [مسیر تأیید کد برای ایجنت](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## همان یک لینکی که باید به ایجنت بدهید

این دقیقاً همان نشانی است:

```text
https://api.expense-budget-tracker.com/v1/
```

این نشانی یک سند معرفی ماشین‌خوان برمی‌گرداند. ایجنت می‌تواند از آن بفهمد:

- آغاز فرایند احراز هویت کجاست
- اول باید کدام عمل را اجرا کند
- بعداً باید از کدام سرآیند احراز هویت استفاده کند
- برای انتخاب فضای کاری و دسترسی SQL چه مراحلی بعد از آن می‌آید

اصل ماجرا همین است: به‌جای اینکه دستورهای راه‌اندازی را داخل پرامپت به‌صورت ثابت بنویسید، خود محصول به ایجنت می‌گوید چطور وصل شود.

## نمونه پرامپت برای Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Ask me for the account email, wait for the 8-digit code from my inbox, finish the setup,
save the returned ApiKey outside chat memory, then import transactions from ~/Downloads/chase-march-2026.csv and verify the final balance.
```

## نمونه پرامپت برای Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
When you need login information, ask me for the email and then the 8-digit code.
After setup, save the key, inspect /schema, and show me my latest 20 transactions and total grocery spend this month.
```

## نمونه پرامپت برای OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, save my personal workspace as the default for this key and import the CSV file I uploaded.
Use existing categories when possible, and tell me if any balance does not match.
```

## راه‌اندازی رهگیر هزینه با هوش مصنوعی چطور کار می‌کند

در ادامه، کل فرایند HTTP پشت این راه‌اندازی را می‌بینید.

### 1. خواندن نشانی معرفی سرویس

ایجنت از اینجا شروع می‌کند:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

پاسخ به آن می‌گوید کار را با `send_code` شروع کند، نشانی آغاز احراز هویت را روی دامنهٔ احراز هویت می‌دهد و به نشانی‌های منتشرشدهٔ OpenAPI و schema اشاره می‌کند.

### 2. فرستادن ایمیل کاربر

ایجنت آدرس ایمیل را به سرویس احراز هویت می‌فرستد:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

اگر درخواست موفق باشد، پاسخ شامل `otpSessionToken` و دستور فراخوانی `verify_code` است.

### 3. درخواست کد ۸ رقمی ایمیل از کاربر

کاربر صندوق ورودی را بررسی می‌کند و کد را برای ایجنت می‌فرستد.

### 4. تأیید کد و گرفتن ApiKey

بعد از آن، ایجنت این درخواست را ارسال می‌کند:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

پاسخ شامل یک `ApiKey` جدید است. این کلید فقط یک بار نمایش داده می‌شود و ایجنت باید آن را برای درخواست‌های بعدی نگه دارد، ترجیحاً با نام `EXPENSE_BUDGET_TRACKER_API_KEY`.

این همان بهبود اصلی نسبت به روش دستی قبلی است: کاربر دیگر لازم نیست از داخل تنظیمات یک کلید بسازد و آن را دستی داخل ترمینال کپی کند.

### 5. خواندن اطلاعات حساب و فضای کاری

بعد از تأیید، ایجنت با `Authorization: ApiKey <key>` اطلاعات حساب را می‌خواند:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

بعد، فهرست فضاهای کاری را می‌گیرد:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

اگر لازم باشد، می‌تواند یک فضای کاری تازه بسازد یا با `POST /v1/workspaces/{workspaceId}/select` یکی از فضاهای کاری موجود را به‌طور صریح ذخیره کند.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. اجرای SQL از طریق API ایجنت

بعد از آن، کارهای معمول داده‌ای از طریق دامنهٔ برنامه انجام می‌شود:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

درخواست باید هر دو مورد زیر را داشته باشد:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` فقط وقتی که می‌خواهید فضای کاری ذخیره‌شده را نادیده بگیرید، یا هنوز هیچ فضای کاری‌ای برای آن ذخیره نشده است

انتخاب فضای کاری صریح است و سرور بعد از `POST /v1/workspaces/{workspaceId}/select` آن انتخاب را برای هر کلید API ذخیره می‌کند. اگر کاربر دقیقاً یک فضای کاری داشته باشد، API آن را برای کلید جدید به‌صورت خودکار ذخیره و استفاده می‌کند.

## ایجنت شما بعد از راه‌اندازی چه کارهایی می‌تواند انجام دهد

وقتی اتصال برقرار شد، ایجنت می‌تواند آن بخش خسته‌کنندهٔ کارهای مالی را انجام بدهد؛ همان کارهایی که نباید ساعت‌ها کلیک لازم داشته باشند:

1. خروجی‌های CSV، PDF یا اسکرین‌شات بانک را پردازش کند
2. تراکنش‌ها را در دفتر کل ثبت کند
3. مانده‌ها را با چیزی که بانک نشان می‌دهد تطبیق بدهد
4. هزینه‌ها را بر اساس دسته‌بندی، فروشنده یا بازهٔ زمانی پرس‌وجو کند
5. ردیف‌های بودجهٔ ماه بعد را به‌روزرسانی کند

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

## چرا این روش از راه‌اندازی دستی کلید API بهتر است

این فرایند جدید هم برای کاربر ساده‌تر است و هم برای ایجنت:

- کاربر لازم نیست یک کلید بلندمدت را دستی کپی کند
- ایجنت پروتکل اتصال را از خود محصول یاد می‌گیرد
- احراز هویت به‌صورت تمیز از دسترسی به داده جدا شده است
- هر درخواست SQL در محدودهٔ فضای کاری انتخاب‌شده اجرا می‌شود
- بعداً می‌توان این اتصال را از داخل برنامه لغو کرد

اگر در حال ساختن یک گردش‌کار رهگیری هزینه با هوش مصنوعی هستید، این تفاوت مهم است. هم متن تکراری پرامپت را کمتر می‌کند و هم خطاهای راه‌اندازی را.

## رهگیر هزینهٔ متن‌باز با راه‌اندازی مخصوص ایجنت

Expense Budget Tracker تحت مجوز MIT منتشر شده و کاملاً متن‌باز است:

- [وب‌سایت پروژه](https://expense-budget-tracker.com/fa/)
- [مخزن GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README روی GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [مستندات راه‌اندازی ایجنت هوش مصنوعی](https://expense-budget-tracker.com/fa/docs/agent-setup/)
- [مرجع API](https://expense-budget-tracker.com/fa/docs/api/)

اگر می‌خواهید آن را روی زیرساخت خودتان میزبانی کنید، از اینجا شروع کنید:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

اگر می‌خواهید از نسخهٔ میزبانی‌شده استفاده کنید، این نشانی را به ایجنت خود بدهید:

```text
https://api.expense-budget-tracker.com/v1/
```

همین برای Claude Code، Codex یا OpenClaw کافی است تا فرایند ورود را خودشان شروع کنند.

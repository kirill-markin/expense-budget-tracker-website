---
title: راه‌اندازی عامل هوش مصنوعی
description: یک URL کشف را با Claude Code، Codex یا OpenClaw به اشتراک بگذارید تا عامل پاسخ کشف را دنبال کند، کد ۸ رقمی را تأیید کند، ApiKey بلندمدت خود را ذخیره کند و با فضای کاری شما شروع به کار کند.
---

## لینکی که باید به عامل بدهید

این URL دقیق را در اختیار عامل قرار دهید:

`https://api.expense-budget-tracker.com/v1/`

این نشانی، سند کشف عمومی مرجع برای عامل‌های هوش مصنوعی است. این سند به عامل می‌گوید چطور احراز هویت را آغاز کند، در ادامه باید کدام مسیرها را فراخوانی کند، بعد از آن از چه روش احراز هویتی استفاده کند، و مشخصات منتشرشده API را از کجا پیدا کند.

## کارهایی که کاربر انجام می‌دهد

1. Claude Code، Codex، OpenClaw، یا عامل دیگری را باز کنید که بتواند درخواست HTTP ارسال کند.
2. به عامل بگویید با استفاده از `https://api.expense-budget-tracker.com/v1/` به Expense Budget Tracker متصل شود.
3. وقتی عامل آدرس ایمیل را خواست، همان ایمیلی را بدهید که برای Expense Budget Tracker استفاده می‌کنید.
4. صندوق ایمیل خود را برای دریافت کد ۸ رقمی بررسی کنید.
5. آن کد را برای عامل بفرستید.
6. اجازه دهید عامل ApiKey برگردانده‌شده را بیرون از حافظه چت ذخیره کند و سپس کار وارد کردن داده، پرس‌وجو، یا بودجه‌بندی را ادامه دهد.

در طول فرایند ورود، نیازی به کپی و جای‌گذاری دستی کلید نیست. عامل بعد از تأیید کد ایمیل، اتصال خودش را آماده می‌کند.

## کارهایی که عامل انجام می‌دهد

توالی کامل به این شکل است:

1. `GET https://api.expense-budget-tracker.com/v1/`
2. پاسخ کشف را بخواند و به‌جای ثابت‌نویسی مراحل بعدی، اقدام‌های برگردانده‌شده را دنبال کند
3. ایمیل کاربر را با `POST` به `bootstrapUrl` برگردانده‌شده بفرستد
4. `otpSessionToken` و اقدام مربوط به `verify_code` را دریافت کند
5. کد ۸ رقمی ایمیل را از کاربر بپرسد
6. `code`، `otpSessionToken`، و یک `label` برای اتصال را با `POST` به `https://auth.expense-budget-tracker.com/api/agent/verify-code` بفرستد
7. یک `ApiKey` جدید دریافت کند
8. آن کلید را بیرون از حافظه چت ذخیره کند، ترجیحاً با نام `EXPENSE_BUDGET_TRACKER_API_KEY`
9. با `Authorization: ApiKey <key>` یک درخواست `GET https://api.expense-budget-tracker.com/v1/me` بفرستد
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. در صورت نیاز، با `POST /v1/workspaces` یک فضای کاری بسازد
12. با `POST /v1/workspaces/{workspaceId}/select` یک فضای کاری پیش‌فرض ذخیره کند
13. رابطه‌های مجاز را با `GET https://api.expense-budget-tracker.com/v1/schema` بررسی کند
14. SQL را با `POST https://api.expense-budget-tracker.com/v1/sql` اجرا کند

انتخاب فضای کاری صریح است، اما بدون وضعیت نیست. بعد از `POST /v1/workspaces/{workspaceId}/select`، فضای کاری انتخاب‌شده برای همان کلید API ذخیره می‌شود، بنابراین فراخوانی‌های بعدی `/v1/sql` می‌توانند `X-Workspace-Id` را حذف کنند. با این حال، اگر بخواهید برای یک درخواست مشخص فضای کاری ذخیره‌شده را موقتاً نادیده بگیرید، هنوز هم می‌توانید `X-Workspace-Id` را بفرستید.

اگر کاربر دقیقاً یک فضای کاری داشته باشد و آن کلید هنوز فضای کاری ذخیره‌شده‌ای نداشته باشد، سمت سرور همان فضای کاری را به‌صورت خودکار ذخیره و استفاده می‌کند.

## عامل باید چه چیزی را ذخیره کند

کلیدی که از `verify-code` برمی‌گردد بلندمدت است. فقط به حافظه چت تکیه نکنید.

- اگر کاربر اجازه نوشتن فایل بدهد، آن را در یک فایل محلی `.env` با این قالب ذخیره کنید: `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`
- در غیر این صورت، آن را در پوسته فعلی با `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` export کنید و از کاربر بخواهید آن را در جایی ماندگار ذخیره کند

درخواست‌های احراز هویت‌شده از این موارد استفاده می‌کنند:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` فقط وقتی که بخواهید فضای کاری ذخیره‌شده را موقتاً نادیده بگیرید یا هنوز هیچ فضای کاری‌ای ذخیره نشده باشد

## اگر شما یک عامل هوش مصنوعی هستید

با این دستور شروع کنید:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

سپس اقدام‌هایی را دنبال کنید که سرور برمی‌گرداند. اگر سند کشف همین حالا مراحل بعدی را مشخص کرده است، آن‌ها را ثابت‌نویسی نکنید.

بعد از `verify-code`، `ApiKey` برگردانده‌شده را به‌صورت امن ذخیره کنید. سپس این مسیرها را بارگذاری کنید:

- `/v1/me` برای دریافت زمینه حساب
- `/v1/workspaces` برای دیدن فضاهای کاری در دسترس
- `/v1/schema` برای رابطه‌ها و ستون‌های مجاز SQL
- `/v1/openapi.json` یا `/v1/swagger.json` برای مشخصات ماشین‌خوان منتشرشده API

## نمونه دستورها برای کاربران

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## بعد از راه‌اندازی چه کارهایی می‌توانید انجام دهید

- صورت‌حساب‌های بانکی یا خروجی کارت را وارد کنید
- تراکنش‌ها را با دسته‌بندی‌های فعلی خودتان دسته‌بندی کنید
- مانده حساب‌ها را با داده‌های بانک تطبیق دهید
- هزینه‌ها را بر اساس دسته‌بندی، بازه زمانی، فروشنده، یا حساب پرس‌وجو کنید
- ردیف‌های بودجه ماه بعد را به‌روزرسانی کنید

برای مسیرهای سطح پایین‌تر و جزئیات احراز هویت، [مرجع API](/docs/api/) را ببینید.

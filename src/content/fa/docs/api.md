---
title: مرجع API
description: راهنمای راه‌اندازی عامل‌ها و مرجع SQL API برای دسترسی برنامه‌نویسی به داده‌های مالی شما.
---

## نمای کلی

Expense Budget Tracker برای دسترسی ماشینی یک API عمومی در این نشانی ارائه می‌کند:

`https://api.expense-budget-tracker.com/v1/`

از همین API می‌توان به دو روش استفاده کرد:

1. **راه‌اندازی بومیِ عامل** که از `GET /v1/` شروع می‌شود
2. **استفادهٔ مستقیم از HTTP** با `ApiKey` بلندمدتی که از قبل در اختیار دارید

همهٔ درخواست‌ها زیر همان قواعد Row Level Security در Postgres اجرا می‌شوند که برنامهٔ وب هم از آن‌ها پیروی می‌کند.

اگر کلاینت شما از MCP پشتیبانی می‌کند، از [اتصال‌دهندهٔ MCP](/fa/docs/mcp-connector/) میزبانی‌شده در `https://mcp.expense-budget-tracker.com/mcp` استفاده کنید و آن را با OAuth در مرورگر مجاز کنید. این صفحه اتصال جداگانه از طریق Agent API و قرارداد HTTP مستقیم با `ApiKey` بلندمدت را توضیح می‌دهد.

## کشف، کد منبع و شِمای زمان اجرا

نقطه شروع اینجاست:

`https://api.expense-budget-tracker.com/v1/`

پاسخ سند کشف API به عامل‌ها می‌گوید احراز هویت را چگونه آغاز کنند و بعد از آن کدام مسیرها را فراخوانی کنند. این پاسخ همچنین به README و کد منبع پیاده‌سازی پیوند می‌دهد. API این مسیرها را ارائه می‌کند:

- `GET /v1/schema`
- `GET /v1/openapi.json` و `GET /v1/swagger.json` به‌عنوان مسیرهای بررسی سازگاری که اعلام می‌کنند OpenAPI در دسترس نیست و کلاینت را به سند کشف و کد منبع هدایت می‌کنند

هر زمان به فهرست دقیق رابطه‌ها و ستون‌هایی نیاز داشتید که از طریق `/v1/sql/query`، `/v1/sql/execute` و مسیر سازگاری `/v1/sql` در دسترس‌اند، `schema` را بررسی کنید.

## راه‌اندازی بومیِ عامل

اگر می‌خواهید Claude Code، Codex، OpenClaw یا هر عامل دیگری خودش اتصال را برقرار کند، از نقطهٔ کشف API شروع کنید و همان اقدام‌هایی را دنبال کنید که سرور برمی‌گرداند.

### فرایند احراز هویت

1. `GET https://api.expense-budget-tracker.com/v1/`
2. اقدام `send_code` و `bootstrapUrl` بازگردانده‌شده را بخوانید
3. ایمیل کاربر را با `POST` به `https://auth.expense-budget-tracker.com/api/agent/send-code` بفرستید
4. `otpSessionToken` را دریافت کنید
5. از کاربر بخواهید کد ۸ رقمیِ ارسال‌شده به ایمیل را وارد کند
6. `code`، `otpSessionToken` و `label` را با `POST` به `https://auth.expense-budget-tracker.com/api/agent/verify-code` بفرستید
7. یک `ApiKey` بلندمدت دریافت کنید
8. این کلید را بیرون از حافظهٔ گفت‌وگو ذخیره کنید
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. در صورت نیاز با `POST https://api.expense-budget-tracker.com/v1/workspaces` یک فضای کاری بسازید
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. داده‌ها را با `POST https://api.expense-budget-tracker.com/v1/sql/query` بخوانید و نوشتن‌های تأییدشده را با `POST https://api.expense-budget-tracker.com/v1/sql/execute` ارسال کنید

### هدر احراز هویت

- `Authorization: ApiKey <key>`

### مدیریت فضای کاری

- `POST /v1/workspaces/{workspaceId}/select` فضای کاریِ پیش‌فرض را برای همان کلید API ذخیره می‌کند
- وقتی فضای کاری ذخیره شد، دیگر لازم نیست در فراخوانی‌های `/v1/sql/query`، `/v1/sql/execute` و مسیر سازگاری `/v1/sql` هدر `X-Workspace-Id` را بفرستید
- اگر بخواهید فقط برای یک درخواست، فضای کاریِ ذخیره‌شده را نادیده بگیرید، همچنان می‌توانید از `X-Workspace-Id: <workspaceId>` استفاده کنید
- اگر کاربر دقیقاً یک فضای کاری داشته باشد و این کلید هنوز انتخاب ذخیره‌شده‌ای نداشته باشد، API همان فضای کاری را به‌طور خودکار ذخیره و استفاده می‌کند

برای راهنمای مرحله‌به‌مرحله مخصوص کاربران انسانی، [راه‌اندازی عامل هوش مصنوعی](/docs/agent-setup/) را ببینید.

## استفادهٔ مستقیم از HTTP با کلیدی که از قبل دارید

اسکریپت‌ها، کارهای زمان‌بندی‌شده، داشبوردها و برنامه‌های سفارشی، اگر از قبل یک `ApiKey` بلندمدت داشته باشند، می‌توانند همین API را مستقیماً فراخوانی کنند.

### احراز هویت

کلید را در هدر احراز هویت `ApiKey` بفرستید:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

فقط وقتی به `X-Workspace-Id` نیاز دارید که آن کلید هنوز فضای کاریِ پیش‌فرضِ ذخیره‌شده نداشته باشد، یا بخواهید برای همان درخواست فضای کاریِ ذخیره‌شده را نادیده بگیرید.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` در صورت نیاز

## خلاصه نقطه‌های پایانی

- `GET /v1/` — سند عمومی کشف API
- `GET /v1/openapi.json` و `GET /v1/swagger.json` — مسیرهای سازگاری برای کشف کد منبع، نه مشخصات API
- `GET /v1/me` — اطلاعات حسابِ احراز هویت‌شده
- `GET /v1/workspaces` — فهرست فضاهای کاریِ در دسترس برای صاحب کلید
- `POST /v1/workspaces` — ایجاد یک فضای کاری
- `POST /v1/workspaces/{workspaceId}/select` — ذخیرهٔ فضای کاریِ پیش‌فرض برای این کلید
- `GET /v1/schema` — بررسی رابطه‌ها و ستون‌های مجاز برای اجرای SQL
- `POST /v1/sql/query` — اجرای یک دستور فقط‌خواندنی `SELECT` یا `WITH ... SELECT`
- `POST /v1/sql/execute` — اجرای یک دستور تأییدشدهٔ `INSERT`، `UPDATE` یا `DELETE`
- `POST /v1/sql` — مسیر سازگاری برای اسکریپت‌های اتمیک چنددستوری

## سیاست SQL

مسیرهای اصلی، خواندن و نوشتن را عمداً از هم جدا می‌کنند:

- `POST /v1/sql/query` دقیقاً یک دستور فقط‌خواندنی `SELECT` یا `WITH ... SELECT` را می‌پذیرد
- `POST /v1/sql/execute` دقیقاً یک تغییر `INSERT`، `UPDATE` یا `DELETE`، از جمله شکل‌های پشتیبانی‌شدهٔ `WITH` را می‌پذیرد
- مسیر سازگاری `POST /v1/sql` اسکریپت‌های محدود چنددستوری را می‌پذیرد و به‌صورت اتمیک اعمال می‌کند؛ فقط زمانی از آن استفاده کنید که به این رفتار اتمیک نیاز دارید

الگوهای مسدود یا ردشده:

- چند دستور در مسیرهای اصلی `/v1/sql/query` و `/v1/sql/execute`
- DDLهایی مثل `CREATE`، `DROP` و `ALTER`
- دستورهای تراکنشی مثل `BEGIN`، `COMMIT` و `ROLLBACK`
- `set_config()`
- کامنت‌های SQL
- شناسه‌های نقل‌قول‌شده
- رشته‌های dollar-quoted

سرور فقط اجازه می‌دهد روی مجموعهٔ محدودی از رابطه‌ها پرس‌وجو اجرا شود. پیش از تولید SQL، با `/v1/schema` رابطه‌ها و ستون‌های در دسترس را بررسی کنید.

رابطه‌های در دسترس در حال حاضر:

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (فقط‌خواندنی)
- `fx_rates_raw` (فقط‌خواندنی)
- `fx_rates_daily` (فقط‌خواندنی)

## محدودیت‌ها

- حداکثر ۱۰۰ ردیف بازگردانده‌شده در هر درخواست
- حداکثر ۱۰۰ ردیف تحت تأثیر در هر دستور تغییر و هر درخواست
- مهلت کل هر درخواست SQL برابر با ۲۵ ثانیه است
- ۱۰ درخواست در ثانیه و ۱۰٬۰۰۰ درخواست در روز برای هر کلید

## امنیت

- کلیدهای API به‌صورت هش‌های SHA-256 ذخیره می‌شوند و هرگز به‌صورت متن خام ذخیره نمی‌شوند
- RLS جداسازی فضاهای کاری را در سطح پایگاه داده اعمال می‌کند
- کلیدها را می‌توان هر زمان از داخل محصول باطل کرد
- با حذف یک عضو از فضای کاری، همهٔ کلیدهای او به‌طور خودکار باطل می‌شوند

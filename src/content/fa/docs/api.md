---
title: مرجع API
description: مرجع راه‌اندازی عامل‌ها و SQL API برای دسترسی برنامه‌نویسی به داده‌های مالی شما.
---

## نمای کلی

Expense Budget Tracker یک API ماشینی عمومی را در این نشانی ارائه می‌کند:

`https://api.expense-budget-tracker.com/v1/`

می‌توانید از همین رابط به دو روش استفاده کنید:

1. **راه‌اندازی بومیِ عامل** که از `GET /v1/` شروع می‌شود
2. **استفاده مستقیم از HTTP** با یک ApiKey بلندمدتِ موجود

همه درخواست‌ها از همان سازوکار Postgres Row Level Security استفاده می‌کنند که در وب‌اپ هم اعمال می‌شود.

## کشف API و مشخصات منتشرشده

نقطه شروع اینجاست:

`https://api.expense-budget-tracker.com/v1/`

پاسخ نقطه پایانیِ کشف API به عامل‌ها توضیح می‌دهد احراز هویت را چگونه شروع کنند و در ادامه چه چیزی را فراخوانی کنند. همین API همچنین این موارد را هم منتشر می‌کند:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

وقتی به فهرست دقیق رابطه‌ها و ستون‌های مجاز که از طریق `/v1/sql` در دسترس هستند نیاز دارید، از `schema` استفاده کنید.

## راه‌اندازی بومیِ عامل

اگر می‌خواهید Claude Code، Codex، OpenClaw یا عامل دیگری خودش متصل شود، از نقطه پایانیِ کشف API شروع کنید و اقدام‌هایی را که سرور برمی‌گرداند دنبال کنید.

### فرایند احراز هویت

1. `GET https://api.expense-budget-tracker.com/v1/`
2. اقدام `send_code` و `bootstrapUrl` برگردانده‌شده را بخوانید
3. ایمیل کاربر را با `POST` به `https://auth.expense-budget-tracker.com/api/agent/send-code` بفرستید
4. `otpSessionToken` را دریافت کنید
5. از کاربر بخواهید کد 8 رقمیِ ایمیل‌شده را وارد کند
6. `code`، `otpSessionToken` و `label` را با `POST` به `https://auth.expense-budget-tracker.com/api/agent/verify-code` بفرستید
7. یک `ApiKey` بلندمدت دریافت کنید
8. این کلید را خارج از حافظه چت ذخیره کنید
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. در صورت نیاز با `POST https://api.expense-budget-tracker.com/v1/workspaces` یک فضای کاری بسازید
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. SQL را با `POST https://api.expense-budget-tracker.com/v1/sql` اجرا کنید

### هدر احراز هویت

- `Authorization: ApiKey <key>`

### مدیریت فضای کاری

- `POST /v1/workspaces/{workspaceId}/select` فضای کاریِ پیش‌فرض را برای همان کلید API ذخیره می‌کند
- بعد از ذخیره شدن فضای کاری، در `/v1/sql` می‌توان `X-Workspace-Id` را حذف کرد
- وقتی بخواهید فقط برای یک درخواست فضای کاریِ ذخیره‌شده را نادیده بگیرید، همچنان می‌توانید از `X-Workspace-Id: <workspaceId>` استفاده کنید
- اگر کاربر دقیقاً یک فضای کاری داشته باشد و این کلید هنوز فضای کاریِ ذخیره‌شده‌ای نداشته باشد، API آن فضای کاری را به‌صورت خودکار ذخیره و استفاده می‌کند

برای راهنمای مرحله‌به‌مرحله مخصوص کاربران انسانی، [راه‌اندازی عامل هوش مصنوعی](/docs/agent-setup/) را ببینید.

## استفاده مستقیم از HTTP با یک کلید موجود

اسکریپت‌ها، کارهای زمان‌بندی‌شده، داشبوردها و برنامه‌های سفارشی وقتی از قبل یک ApiKey بلندمدت داشته باشند، می‌توانند همین API را مستقیماً فراخوانی کنند.

### احراز هویت

کلید را به‌صورت هدر احراز هویت ApiKey بفرستید:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

فقط زمانی به `X-Workspace-Id` نیاز دارید که آن کلید هنوز فضای کاریِ پیش‌فرضِ ذخیره‌شده نداشته باشد، یا بخواهید برای همان درخواست فضای کاریِ ذخیره‌شده را نادیده بگیرید.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` در صورت نیاز

## خلاصه نقطه‌های پایانی

- `GET /v1/` — سند عمومی کشف API
- `GET /v1/openapi.json` و `GET /v1/swagger.json` — مشخصات منتشرشده API
- `GET /v1/me` — اطلاعات حسابِ احراز هویت‌شده
- `GET /v1/workspaces` — فهرست فضاهای کاریِ در دسترس برای مالک کلید
- `POST /v1/workspaces` — ایجاد یک فضای کاری
- `POST /v1/workspaces/{workspaceId}/select` — ذخیره فضای کاریِ پیش‌فرض برای این کلید
- `GET /v1/schema` — بررسی رابطه‌ها و ستون‌های مجاز برای SQL
- `POST /v1/sql` — اجرای یک دستور محدودِ SQL

## سیاست SQL

`POST /v1/sql` در هر درخواست دقیقاً فقط یک دستور SQL را می‌پذیرد.

نوع دستورهای مجاز:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

الگوهای مسدود یا ردشونده:

- چند دستور در یک درخواست
- DDLهایی مثل `CREATE`، `DROP` و `ALTER`
- دستورهای تراکنشی مثل `BEGIN`، `COMMIT` و `ROLLBACK`
- `set_config()`
- کامنت‌های SQL
- شناسه‌های نقل‌قول‌شده
- رشته‌های dollar-quoted

سرور همچنین رابطه‌هایی را که می‌توان روی آن‌ها کوئری اجرا کرد محدود می‌کند. پیش از تولید SQL، از `/v1/schema` برای بررسی رابطه‌ها و ستون‌های در دسترس استفاده کنید.

رابطه‌های فعلاً در دسترس:

- `ledger_entries`
- `accounts`
- `budget_lines`
- `budget_comments`
- `workspace_settings`
- `account_metadata`
- `exchange_rates`

## محدودیت‌ها

- 100 ردیف در هر پاسخ
- مهلت اجرای سی‌ثانیه‌ای برای هر دستور
- 10 درخواست در ثانیه و 10,000 درخواست در روز برای هر کلید

## امنیت

- کلیدهای API به‌صورت هش‌های SHA-256 ذخیره می‌شوند و متن خام آن‌ها هرگز ذخیره نمی‌شود
- RLS جداسازی فضاهای کاری را در سطح پایگاه داده اعمال می‌کند
- کلیدها را می‌توان هر زمان از داخل محصول باطل کرد
- حذف یک عضو از فضای کاری، همه کلیدهای او را به‌صورت خودکار باطل می‌کند

---
title: Довідник API
description: Онбординг агентів і довідник SQL API для програмного доступу до ваших фінансових даних.
---

## Огляд

Expense Budget Tracker надає один публічний машинний API за адресою:

`https://api.expense-budget-tracker.com/v1/`

Той самий API можна використовувати двома способами:

1. **Нативний онбординг для агентів**, починаючи з `GET /v1/`
2. **Пряме використання через HTTP** з наявним довготривалим API-ключем

Усі запити проходять через той самий механізм Postgres Row Level Security, що й вебзастосунок.

## Виявлення API та опубліковані специфікації

Починайте тут:

`https://api.expense-budget-tracker.com/v1/`

Початкова відповідь пояснює агентам, як запустити автентифікацію і що викликати далі. Той самий API також публікує:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

Використовуйте `schema`, коли вам потрібен точний перелік дозволених зв'язків і стовпців, доступних через `/v1/sql`.

## Нативний онбординг для агентів

Якщо ви хочете, щоб Claude Code, Codex, OpenClaw або інший агент підключився самостійно, почніть із початкової точки `GET /v1/` і виконайте дії, які сервер поверне у відповіді.

### Потік автентифікації

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Прочитайте повернену дію `send_code` і `bootstrapUrl`
3. Виконайте `POST` з адресою електронної пошти користувача на `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Отримайте `otpSessionToken`
5. Запитайте в користувача 8-значний код з електронного листа
6. Виконайте `POST` з `code`, `otpSessionToken` і `label` на `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Отримайте довготривалий API-ключ `ApiKey`
8. Збережіть цей ключ поза пам'яттю чату
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. За потреби виконайте `POST https://api.expense-budget-tracker.com/v1/workspaces`, щоб створити робочий простір
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Виконуйте SQL через `POST https://api.expense-budget-tracker.com/v1/sql`

### Заголовок автентифікації

- `Authorization: ApiKey <key>`

### Робота з робочим простором

- `POST /v1/workspaces/{workspaceId}/select` зберігає робочий простір за замовчуванням для цього API-ключа
- після збереження робочого простору в `/v1/sql` можна не передавати `X-Workspace-Id`
- `X-Workspace-Id: <workspaceId>` і далі підтримується, якщо потрібно тимчасово перевизначити збережений робочий простір для одного запиту
- якщо в користувача рівно один робочий простір і для ключа ще не збережено вибір, API автоматично збереже та використає цей робочий простір

Покрокову інструкцію для людей дивіться в [Налаштування AI-агента](/uk/docs/agent-setup/).

## Пряме використання HTTP з наявним ключем

Скрипти, cron-завдання, дашборди й власні застосунки можуть напряму викликати той самий API, якщо в них уже є довготривалий API-ключ.

### Автентифікація

Передавайте ключ у заголовку автентифікації `ApiKey`:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` потрібен лише тоді, коли для ключа ще не збережено робочий простір за замовчуванням або коли ви хочете перевизначити збережений робочий простір для конкретного запиту.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` за потреби

## Короткий огляд кінцевих точок

- `GET /v1/` — публічний документ виявлення
- `GET /v1/openapi.json` і `GET /v1/swagger.json` — опубліковані специфікації API
- `GET /v1/me` — контекст автентифікованого акаунта
- `GET /v1/workspaces` — список робочих просторів, доступних власнику ключа
- `POST /v1/workspaces` — створити робочий простір
- `POST /v1/workspaces/{workspaceId}/select` — зберегти робочий простір за замовчуванням для цього ключа
- `GET /v1/schema` — переглянути дозволені зв'язки й стовпці для SQL
- `POST /v1/sql` — виконати один обмежений SQL-вираз

## Політика SQL

`POST /v1/sql` приймає рівно один SQL-вираз на запит.

Дозволені типи виразів:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

Заблоковані або відхилені шаблони:

- кілька виразів в одному запиті
- DDL-операції на кшталт `CREATE`, `DROP` і `ALTER`
- обгортки транзакцій на кшталт `BEGIN`, `COMMIT` і `ROLLBACK`
- `set_config()`
- коментарі SQL
- ідентифікатори в лапках
- рядки з dollar-quoting

Сервер також обмежує, до яких зв'язків можна звертатися в запитах. Перед генерацією SQL використовуйте `/v1/schema`, щоб переглянути відкриті зв'язки та стовпці.

Наразі відкриті такі зв'язки:

- `ledger_entries`
- `accounts`
- `budget_lines`
- `budget_comments`
- `workspace_settings`
- `account_metadata`
- `exchange_rates`

## Обмеження

- 100 рядків у відповіді
- тайм-аут виразу 30 секунд
- 10 запитів/секунду, 10 000 запитів/день на один ключ

## Безпека

- API-ключі зберігаються як SHA-256 хеші, відкритий текст ніколи не зберігається
- RLS забезпечує ізоляцію робочих просторів на рівні бази даних
- ключі можна будь-коли відкликати з продукту
- видалення учасника робочого простору автоматично відкликає всі його ключі

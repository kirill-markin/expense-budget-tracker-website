---
title: Довідник API
description: Підключення AI-агентів і довідник SQL API для програмного доступу до ваших фінансових даних.
---

## Огляд

Expense Budget Tracker надає один публічний API для машинного доступу за адресою:

`https://api.expense-budget-tracker.com/v1/`

Цю саму точку входу можна використовувати двома способами:

1. **Підключення AI-агента** через `GET /v1/`
2. **Прямі HTTP-запити** з уже наявним довготривалим `ApiKey`

Усі запити проходять через той самий механізм Postgres Row Level Security, що й вебзастосунок.

## Точка входу та опубліковані специфікації

Починайте з цієї адреси:

`https://api.expense-budget-tracker.com/v1/`

Початкова відповідь пояснює агенту, як розпочати автентифікацію і що викликати далі. Через цей самий API також опубліковано:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

Використовуйте `schema`, коли потрібен точний перелік дозволених таблиць, подань і стовпців, доступних через `/v1/sql`.

## Підключення AI-агента

Якщо ви хочете, щоб Claude Code, Codex, OpenClaw або інший агент підключився самостійно, почніть із початкової точки входу `GET /v1/` і далі виконуйте дії, які сервер поверне у відповіді.

### Як проходить автентифікація

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Прочитайте `send_code` і `bootstrapUrl`, які поверне сервер
3. Надішліть `POST` з email користувача на `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Отримайте `otpSessionToken`
5. Попросіть користувача ввести 8-значний код із листа
6. Надішліть `POST` з `code`, `otpSessionToken` і `label` на `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Отримайте довготривалий `ApiKey`
8. Збережіть цей ключ поза пам'яттю чату
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. За потреби створіть робочий простір через `POST https://api.expense-budget-tracker.com/v1/workspaces`
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Виконуйте SQL через `POST https://api.expense-budget-tracker.com/v1/sql`

### Заголовок автентифікації

- `Authorization: ApiKey <key>`

### Вибір робочого простору

- `POST /v1/workspaces/{workspaceId}/select` зберігає вибраний робочий простір за замовчуванням для цього API-ключа
- після цього у викликах `/v1/sql` можна не передавати `X-Workspace-Id`
- `X-Workspace-Id: <workspaceId>` усе одно підтримується, якщо потрібно тимчасово перевизначити збережений робочий простір для одного запиту
- якщо в користувача є лише один робочий простір і для ключа ще не збережено вибір, API автоматично збереже й використає саме його

Покрокову інструкцію для людини дивіться в [Налаштування AI-агента](/uk/docs/agent-setup/).

## Прямі HTTP-запити з наявним ключем

Скрипти, cron-завдання, дашборди й власні застосунки можуть напряму звертатися до того самого API, якщо вже мають довготривалий `ApiKey`.

### Автентифікація

Передавайте ключ у заголовку `Authorization` зі схемою `ApiKey`:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` потрібен лише тоді, коли для ключа ще не збережено робочий простір за замовчуванням або коли ви хочете тимчасово перевизначити збережений робочий простір для конкретного запиту.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` за потреби

## Коротко про ендпоїнти

- `GET /v1/` — публічний стартовий опис API
- `GET /v1/openapi.json` і `GET /v1/swagger.json` — опубліковані специфікації API
- `GET /v1/me` — дані автентифікованого акаунта
- `GET /v1/workspaces` — список робочих просторів, доступних власнику ключа
- `POST /v1/workspaces` — створити робочий простір
- `POST /v1/workspaces/{workspaceId}/select` — зберегти робочий простір за замовчуванням для цього ключа
- `GET /v1/schema` — перевірити, які таблиці, подання й стовпці доступні для SQL
- `POST /v1/sql` — виконати один обмежений SQL-оператор

## Правила для SQL

`POST /v1/sql` приймає рівно один SQL-оператор на запит.

Дозволені типи операторів:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

Заблоковані або відхилені конструкції:

- кілька операторів в одному запиті
- DDL-команди, як-от `CREATE`, `DROP` і `ALTER`
- обгортки транзакцій, як-от `BEGIN`, `COMMIT` і `ROLLBACK`
- `set_config()`
- SQL-коментарі
- ідентифікатори в подвійних лапках
- рядки у форматі dollar-quoting

Сервер також обмежує, до яких таблиць і подань можна звертатися. Перед генерацією SQL перевіряйте `/v1/schema`, щоб побачити доступні об'єкти та стовпці.

Наразі доступні такі таблиці й подання:

- `ledger_entries`
- `accounts`
- `budget_lines`
- `budget_comments`
- `workspace_settings`
- `account_metadata`
- `exchange_rates`

## Обмеження

- не більше 100 рядків у відповіді
- тайм-аут виконання оператора 30 секунд
- до 10 запитів за секунду і 10 000 запитів на день на один ключ

## Безпека

- API-ключі зберігаються як SHA-256-хеші; у відкритому вигляді вони не зберігаються
- RLS забезпечує ізоляцію робочих просторів на рівні бази даних
- ключі можна будь-коли відкликати з інтерфейсу продукту
- якщо видалити учасника робочого простору, усі його ключі буде автоматично відкликано

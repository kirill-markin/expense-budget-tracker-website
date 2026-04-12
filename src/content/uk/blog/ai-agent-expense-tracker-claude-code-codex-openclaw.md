---
title: "Налаштування AI-трекера витрат для Claude Code, Codex і OpenClaw"
description: "Як підключити Claude Code, Codex або OpenClaw до open-source трекера витрат. Передайте один discovery URL, підтвердьте код з email, збережіть отриманий ApiKey і дозвольте агенту одразу почати роботу."
date: "2026-03-10"
keywords:
  - "ai трекер витрат"
  - "налаштування claude code"
  - "налаштування codex"
  - "підключення openclaw"
  - "агент для обліку витрат"
  - "open source трекер витрат"
---

Якщо ви хочете використовувати AI-агента для обліку витрат, найдратівливіша частина зазвичай не сама робота, а налаштування.

Зазвичай це виглядає так:

1. Відкрити застосунок
2. Створити API-ключ
3. Скопіювати ключ
4. Вставити його у свого термінального агента
5. Пояснити, який endpoint викликати
6. Сподіватися, що агент використає правильний workspace

Працювати так можна, але це не agent-native підхід.

[Expense Budget Tracker](https://expense-budget-tracker.com/uk/) тепер має публічний discovery endpoint для термінальних агентів на кшталт [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex або OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

Користувач передає агенту одне це посилання, а потім відповідає лише на два запитання:

- Який email треба використати для входу?
- Який 8-значний код щойно прийшов у вхідні?

Після цього агент сам створює `ApiKey`, зберігає його поза пам’яттю чату, завантажує акаунт, показує список workspace, зберігає один із них як типовий для цього ключа і може одразу почати імпорт чи запити до транзакцій.

Проєкт має відкритий код на GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [Реалізація Machine API](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [Маршрут надсилання коду для агента](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [Маршрут перевірки коду для агента](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## Одне посилання, яке треба дати агенту

Ось точний URL:

```text
https://api.expense-budget-tracker.com/v1/
```

Цей endpoint повертає machine-readable discovery document. Агент із нього дізнається:

- де знаходиться bootstrap для авторизації
- яку дію треба викликати першою
- який auth header використовувати далі
- які наступні кроки для налаштування workspace і SQL-доступу

У цьому і є суть: замість того щоб жорстко прописувати інструкції з онбордингу в prompt, сам продукт пояснює агенту, як підключитися.

## Приклад prompt для Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Ask me for the account email, wait for the 8-digit code from my inbox, finish the setup,
save the returned ApiKey outside chat memory, then import transactions from ~/Downloads/chase-march-2026.csv and verify the final balance.
```

## Приклад prompt для Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
When you need login information, ask me for the email and then the 8-digit code.
After setup, save the key, inspect /schema, and show me my latest 20 transactions and total grocery spend this month.
```

## Приклад prompt для OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, save my personal workspace as the default for this key and import the CSV file I uploaded.
Use existing categories when possible, and tell me if any balance does not match.
```

## Як працює налаштування AI-трекера витрат

Ось повний HTTP-флоу за цим налаштуванням.

### 1. Прочитати discovery endpoint

Агент починає тут:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

У відповіді сказано, що починати треба з `send_code`, там же є bootstrap URL на auth-домені та посилання на опубліковані OpenAPI і schema endpoints.

### 2. Надіслати email користувача

Агент відправляє email-адресу до auth-сервісу:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Якщо запит успішний, у відповіді буде `otpSessionToken` та інструкція викликати `verify_code`.

### 3. Запитати у користувача 8-значний код із email

Користувач перевіряє пошту і надсилає код назад агенту.

### 4. Перевірити код і отримати ApiKey

Після цього агент викликає:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

У відповіді буде новий `ApiKey`. Цей ключ показується лише один раз, тому агент має зберегти його для подальших запитів, бажано як `EXPENSE_BUDGET_TRACKER_API_KEY`.

Це і є головне покращення порівняно зі старим ручним флоу: користувачу не треба створювати ключ у Settings і копіювати його в термінал.

### 5. Завантажити контекст акаунта і workspace

Після перевірки агент використовує `Authorization: ApiKey <key>` і завантажує акаунт:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

Потім запитує список workspace:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

За потреби він може створити новий workspace або явно зберегти наявний через `POST /v1/workspaces/{workspaceId}/select`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. Виконувати SQL через API агента

Після цього звичайна робота з даними йде через домен застосунку:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

Запит обов’язково має містити обидва заголовки:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` лише якщо ви хочете перевизначити збережений workspace або поки його ще не збережено

Вибір workspace є явним, а сервер зберігає його для кожного API-ключа після `POST /v1/workspaces/{workspaceId}/select`. Якщо у користувача рівно один workspace, API автоматично зберігає і використовує його для нового ключа.

## Що агент може робити після налаштування

Після підключення агент може забрати на себе нудну фінансову рутину, яка не повинна вимагати годин кліків:

1. Парсити CSV, PDF або скриншоти з банку
2. Додавати транзакції в ledger
3. Звіряти баланси з тим, що показує банк
4. Аналізувати витрати за категорією, merchant або періодом
5. Оновлювати бюджетні рядки на наступний місяць

Ось практичний приклад для імпорту виписки:

```text
Import ~/Downloads/revolut-february-2026.csv into my EUR account.
Before writing anything, query my existing categories and the last 30 days of transactions to avoid duplicates.
After import, compare the resulting account balance with the closing balance in the CSV.
```

А ось приклад для аналітики:

```text
Show me my top 10 spending categories in the last 90 days, then compare them with the previous 90-day period.
Also list the largest transactions in categories where spending increased.
```

## Чому це краще за ручне налаштування API-ключа

Новий флоу простіший і для користувача, і для агента:

- користувачу не треба вручну копіювати довгоживучий ключ
- агент дізнається протокол безпосередньо від продукту
- авторизація чітко відокремлена від доступу до даних
- кожен SQL-запит прив’язаний до вибраного workspace
- підключення можна пізніше відкликати з застосунку

Якщо ви будуєте AI-флоу для обліку витрат, це важливо. Воно прибирає багато зайвого boilerplate у prompt і типових помилок під час налаштування.

## Open-source трекер витрат із налаштуванням для агентів

Expense Budget Tracker має ліцензію MIT і повністю відкритий код:

- [Сайт проєкту](https://expense-budget-tracker.com/uk/)
- [Репозиторій на GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README на GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [Документація з налаштування AI-агента](https://expense-budget-tracker.com/uk/docs/agent-setup/)
- [Довідник API](https://expense-budget-tracker.com/uk/docs/api/)

Якщо хочете self-hosted варіант, почніть так:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

Якщо хочете користуватися хостинговою версією, дайте своєму агенту ось цей URL:

```text
https://api.expense-budget-tracker.com/v1/
```

Цього достатньо, щоб Claude Code, Codex або OpenClaw самі запустили флоу входу.

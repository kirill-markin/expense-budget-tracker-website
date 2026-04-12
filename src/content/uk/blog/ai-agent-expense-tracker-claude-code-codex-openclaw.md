---
title: "Як підключити ШІ-агента до Expense Budget Tracker: Claude Code, Codex і OpenClaw"
description: "Як підключити Claude Code, Codex або OpenClaw до трекера витрат Expense Budget Tracker з відкритим кодом. Передайте один URL discovery, підтвердьте код із пошти, збережіть отриманий ApiKey і дозвольте агенту одразу почати роботу."
date: "2026-03-10"
keywords:
  - "ші трекер витрат"
  - "expense budget tracker"
  - "claude code для обліку витрат"
  - "codex для обліку витрат"
  - "openclaw для обліку витрат"
  - "трекер витрат з відкритим кодом"
---

Якщо ви хочете вести облік витрат через ШІ-агента, найнеприємніше зазвичай не саме використання, а початкове підключення.

Зазвичай це виглядає так:

1. Відкрити застосунок
2. Створити API-ключ
3. Скопіювати цей ключ
4. Вставити його у термінального агента
5. Пояснити, який ендпойнт треба викликати
6. Сподіватися, що агент працюватиме з правильним робочим простором

Такий сценарій робочий, але його складно назвати агентно-орієнтованим.

[Expense Budget Tracker](https://expense-budget-tracker.com/uk/) тепер має публічний discovery endpoint для термінальних агентів на кшталт [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex або OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

Користувач передає агенту лише це посилання, а далі відповідає всього на два запитання:

- Яку адресу електронної пошти використати для входу?
- Який 8-значний код щойно надійшов на пошту?

Після цього агент сам отримує `ApiKey`, зберігає його поза пам'яттю чату, завантажує акаунт, показує список робочих просторів, зберігає один із них як типовий для цього ключа й одразу може імпортувати транзакції або виконувати запити.

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

Цей endpoint повертає документ discovery у машинозчитуваному форматі. З нього агент дізнається:

- де знаходиться початкова точка авторизації
- яку дію треба викликати першою
- який заголовок авторизації використовувати далі
- які наступні кроки потрібні для налаштування робочого простору і SQL-доступу

У цьому і є головна ідея: замість того щоб вручну зашивати інструкції з початкового налаштування в запит, сам продукт пояснює агенту, як до нього підключитися.

## Приклад запиту для Claude Code

```text
Підключися до Expense Budget Tracker через https://api.expense-budget-tracker.com/v1/.
Запитай у мене адресу електронної пошти для входу, дочекайся 8-значного коду з пошти, заверши налаштування,
збережи отриманий ApiKey поза пам'яттю чату, а потім імпортуй транзакції з ~/Downloads/chase-march-2026.csv і перевір підсумковий баланс.
```

## Приклад запиту для Codex

```text
Використай https://api.expense-budget-tracker.com/v1/, щоб підключитися до мого акаунта Expense Budget Tracker.
Коли знадобляться дані для входу, спочатку запитай адресу електронної пошти, а потім 8-значний код із пошти.
Після налаштування збережи ключ, переглянь /schema і покажи мої останні 20 транзакцій та загальну суму витрат на продукти за цей місяць.
```

## Приклад запиту для OpenClaw

```text
Підключися до Expense Budget Tracker через https://api.expense-budget-tracker.com/v1/.
Після входу збережи мій особистий робочий простір як типовий для цього ключа й імпортуй CSV-файл, який я завантажив.
За можливості використовуй наявні категорії та повідом мені, якщо якийсь баланс не зійдеться.
```

## Як працює підключення ШІ-агента до трекера витрат

Нижче наведено повний HTTP-флоу цього налаштування.

### 1. Прочитати discovery endpoint

Агент починає тут:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

У відповіді сказано, що починати треба з `send_code`. Там само є bootstrap URL на auth-домені й посилання на опубліковані OpenAPI та schema endpoints.

### 2. Надіслати адресу електронної пошти користувача

Агент надсилає адресу електронної пошти до auth-сервісу:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Якщо запит успішний, у відповіді буде `otpSessionToken` та інструкція викликати `verify_code`.

### 3. Запитати у користувача 8-значний код із пошти

Користувач перевіряє вхідні й передає код агенту.

### 4. Перевірити код і отримати ApiKey

Після цього агент викликає:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code на MacBook"
  }'
```

У відповіді буде новий `ApiKey`. Цей ключ показується лише один раз, тому агент має зберегти його для подальших запитів, бажано як `EXPENSE_BUDGET_TRACKER_API_KEY`.

Це і є головне покращення порівняно зі старим ручним сценарієм: користувачу не треба створювати ключ у налаштуваннях і вручну переносити його в термінал.

### 5. Завантажити контекст акаунта і workspace

Після перевірки агент використовує `Authorization: ApiKey <key>` і завантажує акаунт:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

Потім запитує список робочих просторів:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

За потреби він може створити новий робочий простір або явно зберегти наявний через `POST /v1/workspaces/{workspaceId}/select`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. Виконувати SQL через API агента

Після цього звичайна робота з даними відбувається через домен застосунку:

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
- `X-Workspace-Id: <workspaceId>` лише якщо ви хочете перевизначити збережений робочий простір або поки його ще не збережено

Вибір робочого простору є явним, а сервер зберігає його для кожного API-ключа після `POST /v1/workspaces/{workspaceId}/select`. Якщо у користувача рівно один робочий простір, API автоматично зберігає й використовує його для нового ключа.

## Що агент може робити після налаштування

Після підключення агент може взяти на себе рутинну фінансову роботу, яка не повинна забирати години ручних дій:

1. Розбирати CSV, PDF або скриншоти з банку
2. Додавати транзакції в обліковий журнал
3. Звіряти баланси з тим, що показує банк
4. Аналізувати витрати за категорією, продавцем або періодом
5. Оновлювати бюджетні рядки на наступний місяць

Ось практичний приклад запиту для імпорту виписки:

```text
Імпортуй ~/Downloads/revolut-february-2026.csv у мій рахунок у EUR.
Перш ніж щось записувати, перевір мої наявні категорії та транзакції за останні 30 днів, щоб уникнути дублікатів.
Після імпорту порівняй підсумковий баланс рахунку з кінцевим балансом у CSV.
```

А ось приклад запиту для аналітики:

```text
Покажи мої 10 найбільших категорій витрат за останні 90 днів, а потім порівняй їх із попереднім 90-денним періодом.
Також переліч найбільші транзакції в категоріях, де витрати зросли.
```

## Чому це краще за ручне створення API-ключа

Новий сценарій простіший і для користувача, і для агента:

- користувачу не треба вручну копіювати довгоживучий ключ
- агент дізнається протокол безпосередньо від продукту
- авторизація чітко відокремлена від доступу до даних
- кожен SQL-запит прив’язаний до вибраного робочого простору
- підключення можна пізніше відкликати з застосунку

Якщо ви будуєте сценарій обліку витрат через ШІ-агента, це важливо. Такий підхід прибирає зайвий шаблонний текст у запиті й суттєво зменшує кількість типових помилок під час налаштування.

## Трекер витрат з відкритим кодом і підтримкою агентів

Expense Budget Tracker має ліцензію MIT і повністю відкритий код:

- [Сайт проєкту](https://expense-budget-tracker.com/uk/)
- [Репозиторій на GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README на GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [Документація з налаштування ШІ-агента](https://expense-budget-tracker.com/uk/docs/agent-setup/)
- [Довідник API](https://expense-budget-tracker.com/uk/docs/api/)

Якщо ви хочете розгорнути все самостійно, почніть так:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

Якщо вам підходить хостингова версія, просто дайте своєму агенту ось цей URL:

```text
https://api.expense-budget-tracker.com/v1/
```

Цього достатньо, щоб Claude Code, Codex або OpenClaw самостійно запустили вхід і далі виконували практичну роботу з вашими витратами.

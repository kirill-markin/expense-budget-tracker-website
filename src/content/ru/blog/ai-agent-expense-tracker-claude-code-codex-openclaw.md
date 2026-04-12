---
title: "Настройка ИИ-трекера расходов для Claude Code, Codex и OpenClaw"
description: "Как подключить Claude Code, Codex или OpenClaw к открытому трекеру расходов. Передайте одну ссылку для автоконфигурации, подтвердите код из письма, сохраните полученный ApiKey и дайте агенту начать работу."
date: "2026-03-10"
keywords:
  - "ии трекер расходов"
  - "настройка claude code"
  - "настройка codex"
  - "openclaw"
  - "api для учета расходов"
  - "открытый трекер расходов"
---

Если вы хотите использовать ИИ-агента для учета расходов, самая раздражающая часть обычно связана именно с настройкой.

Обычно все выглядит так:

1. Открыть приложение
2. Создать API-ключ
3. Скопировать ключ
4. Вставить его в терминального агента
5. Объяснить, какой адрес API вызывать
6. Надеяться, что агент выберет правильное рабочее пространство

Это рабочий вариант, но он не ощущается естественным для агента.

[Expense Budget Tracker](https://expense-budget-tracker.com/ru/) теперь публикует открытый адрес автоконфигурации для терминальных агентов, таких как [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex или OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

Пользователь передает агенту эту одну ссылку, а затем отвечает на два вопроса:

- Какой адрес электронной почты использовать для входа?
- Какой 8-значный код только что пришел во входящие?

После этого агент сам создает `ApiKey`, сохраняет его вне памяти чата, загружает аккаунт, показывает список рабочих пространств, сохраняет одно из них как рабочее пространство по умолчанию для этого ключа и может сразу начинать импорт или запросы к транзакциям.

Проект открыт и доступен на GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [Реализация Machine API](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [Маршрут отправки кода для агента](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [Маршрут проверки кода для агента](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## Одна ссылка, которую нужно передать агенту

Вот точный URL:

```text
https://api.expense-budget-tracker.com/v1/
```

Этот адрес возвращает машиночитаемый документ автоконфигурации. Агент может узнать:

- где находится начальная точка аутентификации
- какое действие нужно вызвать первым
- какой заголовок авторизации использовать дальше
- какие шаги нужны затем для настройки рабочего пространства и доступа к SQL

В этом и состоит основная идея: вместо того чтобы зашивать инструкции по подключению в prompt, продукт сам объясняет агенту, как к нему подключиться.

## Пример prompt для Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Ask me for the account email, wait for the 8-digit code from my inbox, finish the setup,
save the returned ApiKey outside chat memory, then import transactions from ~/Downloads/chase-march-2026.csv and verify the final balance.
```

## Пример prompt для Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
When you need login information, ask me for the email and then the 8-digit code.
After setup, save the key, inspect /schema, and show me my latest 20 transactions and total grocery spend this month.
```

## Пример prompt для OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, save my personal workspace as the default for this key and import the CSV file I uploaded.
Use existing categories when possible, and tell me if any balance does not match.
```

## Как работает настройка ИИ-трекера расходов

Ниже показан полный HTTP-поток за этой настройкой.

### 1. Прочитать адрес автоконфигурации

Агент начинает здесь:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Ответ подсказывает, что нужно начать с `send_code`, включает стартовый URL на auth-домене и указывает на опубликованные маршруты OpenAPI и schema.

### 2. Отправить адрес пользователя

Агент отправляет email в auth-сервис:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Если запрос успешен, в ответе будут `otpSessionToken` и инструкции вызвать `verify_code`.

### 3. Спросить у пользователя 8-значный код из письма

Пользователь проверяет почту и передает код агенту.

### 4. Проверить код и получить ApiKey

Затем агент вызывает:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

Ответ включает новый `ApiKey`. Этот ключ показывается один раз, и агент должен сохранить его для последующих запросов, в идеале как `EXPENSE_BUDGET_TRACKER_API_KEY`.

Это и есть главное улучшение по сравнению со старым ручным сценарием: пользователю больше не нужно создавать ключ в Settings и копировать его в терминал.

### 5. Загрузить контекст аккаунта и рабочего пространства

После проверки агент использует `Authorization: ApiKey <key>` и загружает аккаунт:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

Затем он получает список рабочих пространств:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

Если нужно, агент может создать новое рабочее пространство или явно сохранить существующее через `POST /v1/workspaces/{workspaceId}/select`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. Выполнять SQL через агентский API

После этого обычная работа с данными идет через домен приложения:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

Запрос должен включать оба заголовка:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` только если вы хотите переопределить сохраненное рабочее пространство или пока оно еще не сохранено

Выбор рабочего пространства явный, и сервер сохраняет его для конкретного API-ключа после `POST /v1/workspaces/{workspaceId}/select`. Если у пользователя ровно одно рабочее пространство, API автоматически сохраняет и использует его для нового ключа.

## Что агент может делать после настройки

После подключения агент может взять на себя рутинную финансовую работу, на которую обычно уходит слишком много кликов:

1. Разбирать CSV, PDF или скриншоты банковских выписок
2. Добавлять транзакции в ledger
3. Сверять балансы с тем, что показывает банк
4. Анализировать траты по категориям, мерчантам и периодам
5. Обновлять бюджетные строки на следующий месяц

Вот практический пример для импорта выписки:

```text
Import ~/Downloads/revolut-february-2026.csv into my EUR account.
Before writing anything, query my existing categories and the last 30 days of transactions to avoid duplicates.
After import, compare the resulting account balance with the closing balance in the CSV.
```

А вот пример для анализа:

```text
Show me my top 10 spending categories in the last 90 days, then compare them with the previous 90-day period.
Also list the largest transactions in categories where spending increased.
```

## Почему это лучше, чем ручная настройка API-ключа

Новый поток проще и для пользователя, и для агента:

- пользователю не нужно вручную копировать долгоживущий ключ
- агент сам узнает протокол из продукта
- аутентификация чисто отделена от доступа к данным
- каждый SQL-запрос привязан к выбранному рабочему пространству
- подключение можно потом отозвать из приложения

Если вы строите процесс ИИ-учета расходов, это важно. Так исчезает большая часть служебного текста в prompt'ах и типичные ошибки настройки.

## Открытый трекер расходов с настройкой для агентов

Expense Budget Tracker распространяется по лицензии MIT и полностью открыт:

- [Сайт проекта](https://expense-budget-tracker.com/ru/)
- [Репозиторий на GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README на GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [Документация по настройке ИИ-агента](https://expense-budget-tracker.com/ru/docs/agent-setup/)
- [Справочник API](https://expense-budget-tracker.com/ru/docs/api/)

Если вы хотите вариант с самостоятельным размещением, начните так:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

Если вы хотите использовать хостинговую версию, дайте агенту этот URL:

```text
https://api.expense-budget-tracker.com/v1/
```

Этого достаточно, чтобы Claude Code, Codex или OpenClaw сами запустили процесс входа.

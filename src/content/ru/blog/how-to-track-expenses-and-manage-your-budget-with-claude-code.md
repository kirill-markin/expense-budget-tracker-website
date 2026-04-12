---
title: "Как учитывать расходы и управлять бюджетом с помощью Claude Code"
description: "Настройте Claude Code как своего помощника по личным финансам. Передайте ему один URL автоконфигурации, дайте пройти проверку кода из письма, сохраните полученный ApiKey, и он сможет разбирать выписки, проверять балансы и вести ваш бюджет прямо из терминала."
date: "2026-03-05"
keywords:
  - "claude code для учета расходов"
  - "claude code для бюджета"
  - "ии агент для личных финансов"
  - "api для учета расходов"
  - "sql api для бюджета"
  - "claude code personal finance"
---

Claude Code — это ИИ-агент Anthropic, который работает прямо в вашем терминале. Он умеет читать файлы, писать код, выполнять команды и делать HTTP-запросы. Большинство людей используют Claude Code для разработки. Но он также очень хорошо подходит для личных финансов, если подключить его к трекеру расходов с нормальным машинным API.

Схема простая: вы подключаете Claude Code к open source трекеру расходов через его machine API, и он превращается в личного финансового помощника, который живет у вас в терминале. Бросаете банковскую выписку, просите Claude Code записать транзакции, проверить балансы, обновить бюджет — и все это через обычный диалог. Без кликов по экранам, без ручного ввода.

## Почему Claude Code хорошо работает для учета расходов

Claude Code отличается от ChatGPT или веб-версии Claude по нескольким важным для личных финансов пунктам:

**Он работает локально и умеет читать ваши файлы.** Когда вы скачиваете банковскую выписку в CSV или PDF, Claude Code может прочитать ее прямо с вашего диска. Ничего не нужно загружать в чат, копировать или пересылать. Вы говорите: «разбери выписку в ~/Downloads/chase-march-2026.csv», и Claude Code читает файл.

**Он умеет выполнять код и HTTP-запросы.** Claude Code не просто предлагает команду `curl` — он ее реально запускает. Если ему нужно вставить 50 транзакций в вашу базу расходов, он пишет SQL, отправляет HTTP-запрос и подтверждает результат. Весь процесс живет внутри одной беседы.

**Он помнит вашу настройку между сессиями.** Если сохранить полученный ApiKey вне памяти чата, Claude Code сможет использовать то же подключение и в следующих сессиях, не проходя каждый раз повторно email-код.

**Он умеет работать офлайн с локальными файлами.** Если вы хотите предварительно обработать банковские выписки, почистить формат CSV или написать импорт-скрипты, Claude Code сделает это локально еще до любого обращения к API.

## Настройка Claude Code для личных финансов

Вам нужны две вещи: трекер расходов с machine API и место, где можно хранить долгоживущий ключ, который Claude Code получает после входа.

[Expense Budget Tracker](https://expense-budget-tracker.com/ru/) — это open source система личных финансов на Postgres. Ее канонический discovery endpoint — `GET https://api.expense-budget-tracker.com/v1/`. Вы можете зарегистрироваться в облачной версии или [развернуть ее самостоятельно](https://github.com/kirill-markin/expense-budget-tracker) на своем сервере.

### Шаг 1. Передайте Claude Code discovery URL

Скажите Claude Code подключаться через:

```text
https://api.expense-budget-tracker.com/v1/
```

Claude Code должен сначала прочитать discovery response, а затем попросить:

- email вашего аккаунта
- 8-значный код, который пришел вам на почту

После проверки кода сервис возвращает долгоживущий ключ в реальном формате API, например `ebta_...`.

### Шаг 2. Сохраните полученный ключ вне памяти чата

Сам auth flow удобен, но ключ все равно нужно хранить в каком-то долговечном месте. Бэкенд явно предупреждает агентов не полагаться только на историю чата.

Простой вариант такой:

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="ebta_your_key_here"
```

Если вы хотите, чтобы Claude Code сохранил ключ в локальном `.env`, одобрите это явно. Иначе держите его в shell для текущей сессии и сохраните постоянным способом сами.

### Шаг 3. Один раз сохраните ваш workspace

После проверки кода Claude Code должен загрузить ваш аккаунт и workspace'ы:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

Затем один раз сохранить workspace по умолчанию для этого ключа:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace-id/select \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

После этого `/v1/sql` уже может опускать `X-Workspace-Id`. Если у вашего аккаунта ровно один workspace, API сам сохранит и начнет использовать его с первого раза.

### Шаг 4. Добавьте локальный файл инструкций со своими правилами

Claude Code работает заметно лучше, если вы заранее описываете ему свои категории, счета и правила процесса. Для этого полезен локальный `CLAUDE.md`:

```markdown
# Personal Finance

## Expense Tracker API

- Endpoint: https://api.expense-budget-tracker.com/v1/sql
- Auth: ApiKey in Authorization header
- API key is in the EXPENSE_BUDGET_TRACKER_API_KEY environment variable
- Default workspace is already saved for this key
- Request: POST with JSON body {"sql": "your query"}
- Response: {"rows": [...], "rowCount": N}

## My expense categories

Income: salary, freelance, side-projects
Fixed: rent, utilities, insurance, subscriptions
Daily: groceries, dining-out, transport, coffee
Lifestyle: clothing, entertainment, healthcare, travel
Planning: taxes, big-purchases, savings, emergency-fund

## My accounts

- chase-checking (USD) — main checking account
- wise-eur (EUR) — European account
- cash-usd (USD) — cash

## Rules

- Always check existing categories before inserting transactions
- After importing, verify account balances match the bank
- Use the exact category names listed above
- Store transactions in their original currency
```

### Шаг 5. Откройте Claude Code и начинайте работать

```bash
cd ~/finances
claude
```

Claude Code читает ваши локальные инструкции, повторно использует сохраненный ApiKey и может сразу приступать к работе.

## Разбор банковских выписок с помощью Claude Code

Вот где Claude Code особенно хорош. Скачайте банковскую выписку и попросите его обработать ее:

```
> I downloaded my Chase statement to ~/Downloads/chase-march-2026.csv.
> Parse it and record all transactions to my chase-checking account.
```

Claude Code:
1. прочитает CSV-файл с вашего диска
2. разберет каждую строку — дату, сумму, описание
3. сопоставит каждую транзакцию с одной из ваших категорий расходов из `CLAUDE.md`
4. соберет INSERT-запросы для таблицы `ledger_entries`
5. отправит их через SQL API
6. сообщит, что именно записал

Вы просматриваете результат, просите исправить неверно категоризированные транзакции — и на этом все. Месячный объем банковских операций обработан за несколько минут.

Для PDF-выписок или скриншотов банковского приложения работает тот же подход. Claude Code умеет читать изображения и PDF, вытаскивать данные о транзакциях и записывать все тем же способом.

## Проверка балансов и поиск ошибок

После импорта транзакций всегда проверяйте, что цифры сходятся:

```
> Check my account balances and compare them to what I see in the bank:
> chase-checking should be $4,230.15
> wise-eur should be €1,847.50
```

Claude Code запросит представление `accounts` через SQL API, сравнит балансы и подсветит расхождения. Если по `chase-checking` у вас вышло $4,180.15 вместо $4,230.15, Claude Code поможет найти пропавшие $50 — возможно, транзакцию пропустили или учли дважды.

Такая еженедельная проверка балансов — одна из самых важных привычек в личных финансах. Кирилл Маркин, создатель Expense Budget Tracker, который категоризирует каждую свою личную транзакцию уже больше пяти лет, делает эту проверку каждую неделю. Именно она удерживает данные надежными на длинной дистанции.

## Как задавать вопросы о своих расходах

Как только данные о расходах оказываются в базе, Claude Code может отвечать на любые вопросы о ваших финансах, просто пишет SQL-запросы:

```
> How much did I spend on dining out in the last 3 months?
```

```
> What are my top 5 expense categories this month?
```

```
> Show me all transactions over $100 from last week.
```

```
> What's my average monthly grocery spending over the past 6 months?
```

Claude Code пишет SQL, запускает его через API и возвращает ответ обычным языком. Вам не нужно знать SQL самим, но вы всегда можете попросить показать сам запрос, проверить, что он разумен, или скорректировать его.

## Управление бюджетным прогнозом

Учет расходов — это запись того, что уже произошло. Бюджет — это планирование того, что будет дальше. И то и другое живет в одной базе.

Таблица `budget_lines` хранит ваш помесячный прогноз — ожидаемые доходы и планируемые расходы по каждой категории в каждом месяце. Этим тоже можно управлять через Claude Code:

```
> Set my budget for April 2026:
> - groceries: $400
> - dining-out: $200
> - rent: $2,100
> - salary income: $8,500
> Copy everything else from March's budget.
```

Claude Code читает записи бюджета за март, создает апрельские строки с вашими изменениями и записывает их через SQL API. В итоге у вас появляется rolling forecast на 12 месяцев, который можно прокручивать в веб-интерфейсе.

Полезная месячная рутина выглядит примерно так:

```
> Compare my actual spending this month against the budget.
> For any category where I spent more than 20% over budget,
> adjust next month's forecast to be more realistic.
```

Claude Code читает фактические данные из `ledger_entries`, сравнивает их с планом в `budget_lines` и обновляет прогноз. Вручную на такой анализ обычно уходит 30 минут. С Claude Code — примерно 2 минуты.

## Работа с несколькими валютами

Если у вас есть счета в разных валютах, Claude Code справляется с этим естественно. Трекер расходов хранит каждую транзакцию в исходной валюте и ежедневно получает курсы от ECB, CBR и NBS.

```
> I received €2,500 freelance payment into wise-eur yesterday.
> Record it as income, category: freelance.
```

Claude Code записывает INSERT с `currency: 'EUR'` и правильной суммой. А когда вы позже спрашиваете: «какой у меня общий доход в этом месяце в USD?», база сама делает конвертацию по актуальным курсам в момент запроса. Claude Code просто сообщает результат.

## Что Claude Code умеет такого, чего не умеют веб-интерфейсы

Сила Claude Code в личных финансах — в том, что он совмещает доступ к файлам, HTTP-запросы и разговор в одном инструменте:

**Пакетная обработка.** Бросьте в одну папку пять банковских выписок из разных счетов и скажите Claude Code обработать их все. Он прочитает каждый файл, занесет транзакции в нужные счета и в конце сверит балансы. В веб-интерфейсе на это ушел бы час кликов.

**Кастомный анализ.** «В какие месяцы за последний год у меня были самые большие траты на развлечения и какие там были крупнейшие транзакции?» Ни в одном бюджетном приложении нет отдельной кнопки под это. Claude Code пишет SQL, запускает его и объясняет результат.

**Конвертация форматов.** Ваш банк экспортирует странный CSV со слитыми колонками и европейским форматом дат? Попросите Claude Code сначала привести файл в порядок. Он перепишет его локально, а потом импортирует чистую версию.

**Сценарии и скрипты.** Попросите Claude Code написать Python-скрипт на будущее: «Write a script that imports a Chase CSV and records all transactions. Save it to ~/finances/import-chase.py.» В следующий раз вы просто запускаете этот скрипт напрямую — с Claude Code или без него.

## Схема базы, с которой работает Claude Code

Machine API Expense Budget Tracker открывает небольшой набор отношений, с которыми AI-агентам удобно работать. Разрешенный список публикуется через `GET /v1/schema`.

| Table | What it stores |
|---|---|
| `ledger_entries` | Every income and expense transaction |
| `budget_lines` | Budget plan — amounts per category per month |
| `budget_comments` | Notes on specific budget cells |
| `exchange_rates` | Daily FX rates (fetched automatically) |
| `workspace_settings` | Reporting currency preference |
| `account_metadata` | Account liquidity classification |
| `accounts` | VIEW — running balances per account |

У таблицы `ledger_entries` понятные колонки: `event_id`, `ts`, `account_id`, `amount`, `currency`, `kind`, `category`, `counterparty`, `note`. Claude Code может писать корректные INSERT-запросы с первой попытки именно потому, что названия колонок честно описывают, что в них лежит.

## Безопасность и контроль доступа

Давать Claude Code доступ к вашей базе расходов безопасно — в рамках ограничений SQL API:

Каждый запрос проходит через Postgres Row Level Security. API-ключ привязан к вашему пользователю, и SQL выполняется только в выбранном workspace — Claude Code видит только ваши данные, даже если база общая.

В одном запросе разрешено только одно выражение. Поддерживаются только `SELECT`, `WITH`, `INSERT`, `UPDATE` и `DELETE`. Claude Code не может создавать или удалять таблицы, не может использовать transaction wrappers, не может вызывать `set_config()` и не может отправлять SQL-комментарии или quoted identifiers. Все это принудительно проверяется на стороне сервера независимо от того, что агент попытается отправить.

API-ключи хранятся как SHA-256-хэши — открытый текст никогда не лежит в базе. Ключи можно позже отозвать из продукта. Лимиты ограничивают использование до 10 запросов в секунду и 10 000 в день, с таймаутом 30 секунд и пределом в 100 строк на ответ.

Сам API-ключ остается в вашей локальной переменной окружения. Claude Code читает его из `$EXPENSE_BUDGET_TRACKER_API_KEY`, когда делает запросы — его не нужно коммитить в проект.

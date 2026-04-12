---
title: Справочник API
description: Онбординг агентов и SQL API для программного доступа к вашим финансовым данным.
---

## Обзор

Expense Budget Tracker публикует один машинный API:

`https://api.expense-budget-tracker.com/v1/`

Его можно использовать двумя способами:

1. Через агентный онбординг, начиная с `GET /v1/`
2. Через прямые HTTP-запросы с уже существующей ApiKey

Все запросы применяют ту же Postgres row-level security, что и веб-приложение.

## Discovery и опубликованные спецификации

Начинайте с:

`https://api.expense-budget-tracker.com/v1/`

Этот discovery-ответ объясняет, как агенту пройти bootstrap аутентификацию и какие действия выполнять дальше. На той же поверхности доступны:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

Используйте `schema`, когда нужен точный список relations и columns, доступных через `/v1/sql`.

## Прямой доступ по HTTP

Скрипты, cron-задачи, дашборды и пользовательские приложения могут вызывать API напрямую после получения долгоживущей ApiKey.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` нужен только если ключ еще не сохранил workspace по умолчанию или вы хотите переопределить его для одного запроса.

## Краткий список endpoint'ов

- `GET /v1/` — публичный discovery-документ
- `GET /v1/openapi.json` и `GET /v1/swagger.json` — опубликованные спецификации
- `GET /v1/me` — контекст аккаунта
- `GET /v1/workspaces` — список доступных workspace
- `POST /v1/workspaces` — создание workspace
- `POST /v1/workspaces/{workspaceId}/select` — сохранение workspace по умолчанию
- `GET /v1/schema` — список разрешенных relations и columns
- `POST /v1/sql` — выполнение одного ограниченного SQL-запроса

## Политика SQL

`POST /v1/sql` принимает ровно один SQL statement за запрос.

Разрешены:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

Запрещены:

- несколько statement'ов
- DDL-команды вроде `CREATE`, `DROP`, `ALTER`
- транзакционные обертки `BEGIN`, `COMMIT`, `ROLLBACK`
- `set_config()`
- SQL-комментарии
- quoted identifiers
- dollar-quoted strings

Перед генерацией SQL сначала проверьте `/v1/schema`.

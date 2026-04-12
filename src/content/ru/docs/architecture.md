---
title: Архитектура
description: Обзор системы, модель данных, мультивалютный дизайн и модель аутентификации.
---

## Обзор системы

```
Browser UI  -->  Next.js web app  -->  Postgres (RLS)
                        |                  ^
                        v                  |
                 Auth service -------------+
                        ^
                        |
             Machine clients via API Gateway
                        ^
                        |
                Worker (FX fetchers) ------
```

Пять компонентов, одна база данных:

1. **web** — Next.js-приложение с UI и API routes
2. **auth** — вход по email OTP и bootstrap агентов на auth-домене
3. **sql-api** — AWS Lambda за API Gateway для машинных клиентов
4. **worker** — ежедневная загрузка курсов ECB, CBR и NBS
5. **Postgres** — единый источник истины с row-level security

## Модель данных

- **ledger_entries** — одна строка на каждое движение по счету
- **budget_lines** — append-only ячейки бюджета с last-write-wins
- **budget_comments** — append-only заметки к ячейкам бюджета
- **workspace_settings** — отчетная валюта и настройки workspace
- **account_metadata** — метаданные счетов
- **exchange_rates** — ежедневные FX-курсы для конвертации при чтении
- **workspaces** / **workspace_members** — многопользовательская изоляция
- **accounts** — view, вычисляемый из ledger_entries

## Мультивалютность

Все суммы хранятся в исходной валюте. Перевод в отчетную валюту происходит во время чтения через SQL joins к `exchange_rates`. Предварительной конвертации с потерей данных нет.

## Аутентификация

Через переменную `AUTH_MODE` доступны два режима:

- `none` — без аутентификации, один локальный workspace
- `cognito` — беспарольный вход по email OTP через AWS Cognito

Для машинных клиентов публичная точка входа — `GET /v1/`. Агентный онбординг использует email OTP на auth-домене, возвращает долгоживущую ApiKey и затем выполняет SQL через машинный API за API Gateway.

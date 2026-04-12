---
title: Довідник API
description: Онбординг агентів і SQL API для програмного доступу до ваших фінансових даних.
---

## Огляд

Expense Budget Tracker публікує один machine API:

`https://api.expense-budget-tracker.com/v1/`

Його можна використовувати через агентний онбординг або прямі HTTP-запити з уже існуючою ApiKey.

## Основні endpoints

- `GET /v1/` — discovery-документ
- `GET /v1/openapi.json` і `GET /v1/swagger.json` — специфікації API
- `GET /v1/me` — контекст акаунта
- `GET /v1/workspaces` — список workspace
- `POST /v1/workspaces` — створення workspace
- `POST /v1/workspaces/{workspaceId}/select` — збереження workspace за замовчуванням
- `GET /v1/schema` — дозволені relations і columns
- `POST /v1/sql` — виконання одного обмеженого SQL-запиту

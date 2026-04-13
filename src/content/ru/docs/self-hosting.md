---
title: Руководство по самостоятельному развертыванию
description: Разверните Expense Budget Tracker на собственном сервере с Docker Compose и Postgres.
---

## Требования

- Docker и Docker Compose
- Postgres 18 (входит в Compose-файл)

## Быстрый старт

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Команда поднимает Postgres, применяет миграции и запускает:

- веб-приложение на `http://localhost:3000`
- сервис авторизации на `http://localhost:8081`
- FX-worker в Docker Compose

## Конфигурация

Скопируйте `.env.example` в `.env` и настройте:

- `MIGRATION_DATABASE_URL` — роль владельца для миграций
- `DATABASE_URL` — роль приложения для веб-процесса
- `AUTH_DATABASE_URL` — роль схемы авторизации для сервиса авторизации
- `AUTH_MODE` — `none` для локального режима, `cognito` для входа по одноразовому коду из письма
- `AUTH_DOMAIN`, `COOKIE_DOMAIN`, `ALLOWED_REDIRECT_URIS` — домены авторизации и cookie

Если `AUTH_MODE=cognito`, также понадобятся настройки Cognito и `SESSION_ENCRYPTION_KEY` из `.env.example`.

## Обновление

```bash
git pull
make up
```

Docker Compose пересоберет сервисы и заново применит миграции через контейнер `migrate`.

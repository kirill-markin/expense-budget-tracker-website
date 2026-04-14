---
title: Руководство по самостоятельному развертыванию
description: Разверните Expense Budget Tracker на собственном сервере с помощью Docker Compose и Postgres.
---

## Требования

- Docker и Docker Compose
- Postgres 18 (определен в файле Compose)

## Быстрый старт

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Команда поднимает Postgres, применяет миграции и запускает:

- веб-приложение по адресу `http://localhost:3000`
- сервис авторизации по адресу `http://localhost:8081`
- воркер валютных курсов в Docker Compose

## Конфигурация

Скопируйте `.env.example` в `.env` и укажите:

- `MIGRATION_DATABASE_URL` — строку подключения с ролью владельца, которую используют миграции
- `DATABASE_URL` — строку подключения с ролью приложения для веб-процесса
- `AUTH_DATABASE_URL` — строку подключения с ролью схемы авторизации для сервиса авторизации
- `AUTH_MODE` — `none` для локального запуска, `cognito` для окружений, где вход выполняется по одноразовому коду из письма
- `AUTH_DOMAIN`, `COOKIE_DOMAIN`, `ALLOWED_REDIRECT_URIS` — домен авторизации, домен cookie и список разрешенных URI перенаправления

Если `AUTH_MODE=cognito`, дополнительно укажите параметры Cognito и `SESSION_ENCRYPTION_KEY` из `.env.example`.

## Обновление

```bash
git pull
make up
```

Docker Compose пересоберет сервисы и повторно применит миграции через контейнер `migrate`.

## Развертывание в AWS

Если вы разворачиваете приложение в AWS в рабочем окружении (ECS Fargate + RDS + ALB + Cognito), см. [руководство по AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).

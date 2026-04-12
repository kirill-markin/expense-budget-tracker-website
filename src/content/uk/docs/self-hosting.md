---
title: Посібник із самостійного розгортання
description: Запускайте Expense Budget Tracker на власному сервері за допомогою Docker Compose і Postgres.
---

## Вимоги

- Docker і Docker Compose
- Postgres 18 (включено до файлу Compose)

## Швидкий старт

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Це запускає Postgres, застосовує міграції та піднімає:

- вебзастосунок на `http://localhost:3000`
- сервіс автентифікації на `http://localhost:8081`
- FX-воркер у Docker Compose

## Налаштування

Скопіюйте `.env.example` у `.env` і налаштуйте:

- `MIGRATION_DATABASE_URL` — роль власника, яку використовують міграції
- `DATABASE_URL` — роль застосунку для вебпроцесу
- `AUTH_DATABASE_URL` — роль схеми auth для сервісу автентифікації
- `AUTH_MODE` — `none` для локального використання, `cognito` для середовищ з OTP через email
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` і `ALLOWED_REDIRECT_URIS` — маршрутизацію автентифікації та cookie

Якщо `AUTH_MODE=cognito`, вам також знадобляться параметри Cognito і `SESSION_ENCRYPTION_KEY` з `.env.example`.

## Оновлення

```bash
git pull
make up
```

Docker Compose перебудує сервіси та повторно застосує міграції через контейнер `migrate`.

## Розгортання в AWS

Для продакшн-розгортання в AWS (ECS Fargate + RDS + ALB + Cognito) дивіться [посібник з AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).

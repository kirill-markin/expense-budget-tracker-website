---
title: Посібник із самостійного розгортання
description: Розгорніть Expense Budget Tracker на власному сервері за допомогою Docker Compose і Postgres.
---

## Вимоги

- Docker і Docker Compose
- Postgres 18 (уже додано до файла Compose)

## Швидкий старт

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Ця команда запускає Postgres, виконує міграції та піднімає:

- вебзастосунок за адресою `http://localhost:3000`
- сервіс автентифікації за адресою `http://localhost:8081`
- FX-воркер у складі Docker Compose

## Налаштування

Скопіюйте `.env.example` у `.env` і задайте потрібні значення:

- `MIGRATION_DATABASE_URL` — роль власника бази даних, від імені якої виконуються міграції
- `DATABASE_URL` — роль застосунку для вебпроцесу
- `AUTH_DATABASE_URL` — роль для схеми `auth`, яку використовує сервіс автентифікації
- `AUTH_MODE` — `none` для локального запуску, `cognito` для середовищ з одноразовими кодами, що надходять електронною поштою
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` і `ALLOWED_REDIRECT_URIS` — домен автентифікації, домен для файлів cookie і дозволені URI перенаправлення

Якщо `AUTH_MODE=cognito`, також потрібно заповнити параметри Cognito і `SESSION_ENCRYPTION_KEY` з `.env.example`.

## Оновлення

```bash
git pull
make up
```

Docker Compose перебудує сервіси й повторно виконає міграції через контейнер `migrate`.

## Розгортання в AWS

Для розгортання в AWS у продакшн-середовищі (ECS Fargate + RDS + ALB + Cognito) дивіться [посібник з AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).

---
title: Посібник із self-hosting
description: Запускайте Expense Budget Tracker на власному сервері з Docker Compose і Postgres.
---

## Вимоги

- Docker і Docker Compose
- Postgres 18 (входить до Compose-файлу)

## Швидкий старт

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Це підніме Postgres, застосує міграції та запустить вебзастосунок, auth-сервіс і FX-worker.

---
title: Швидкий старт
description: Зареєструйтеся в cloud-версії або розгорніть власний екземпляр за кілька хвилин.
---

## Cloud-версія

Найшвидший спосіб почати — керована cloud-версія:

1. Відкрийте [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Увійдіть через email за одноразовим кодом
3. Почніть відстежувати витрати у вебзастосунку
4. Якщо хочете підключити Claude Code, Codex або OpenClaw, дайте агенту `https://api.expense-budget-tracker.com/v1/`

Встановлення та налаштування сервера не потрібні. Дані ізольовано на рівні workspace через Postgres row-level security.

## Доступ для програм і агентів

Той самий акаунт підходить для:

- вебінтерфейсу за адресою `https://app.expense-budget-tracker.com`
- агентного онбордингу через `GET https://api.expense-budget-tracker.com/v1/`
- прямих HTTP-клієнтів з `Authorization: ApiKey <key>`

---
title: Налаштування AI-агента
description: Передайте Claude Code, Codex або OpenClaw один discovery URL. Агент прочитає відповідь сервера, підтвердить 8-значний код, збереже власну ApiKey і почне працювати з вашим workspace.
---

## Посилання для агента

Передайте агенту цей URL:

`https://api.expense-budget-tracker.com/v1/`

Це канонічний публічний discovery-документ для AI-агентів. Він описує bootstrap аутентифікації, наступні endpoints та місце розташування специфікації API.

## Що робить користувач

1. Відкрийте Claude Code, Codex, OpenClaw або іншого агента з HTTP-доступом.
2. Попросіть підключитися до Expense Budget Tracker через `https://api.expense-budget-tracker.com/v1/`.
3. Коли агент попросить email, вкажіть адресу, яку ви використовуєте в Expense Budget Tracker.
4. Отримайте 8-значний код з email.
5. Передайте код агенту.
6. Дозвольте агенту зберегти повернену ApiKey поза пам’яттю чату.

---
title: Настройка AI-агента
description: Передайте Claude Code, Codex или OpenClaw один URL обнаружения. Агент прочитает ответ сервера, подтвердит 8-значный код, сохранит свою ApiKey и начнет работать с вашим workspace.
---

## Ссылка для агента

Передайте агенту этот URL:

`https://api.expense-budget-tracker.com/v1/`

Это канонический публичный документ обнаружения для AI-агентов. В нем описано, как пройти bootstrap аутентификации, какие endpoints вызывать дальше и где находится опубликованная спецификация API.

## Что делает пользователь

1. Откройте Claude Code, Codex, OpenClaw или другого агента с HTTP-доступом.
2. Попросите подключиться к Expense Budget Tracker через `https://api.expense-budget-tracker.com/v1/`.
3. Когда агент попросит email, укажите адрес, который используете в Expense Budget Tracker.
4. Получите 8-значный код из письма.
5. Передайте код агенту.
6. Разрешите агенту сохранить возвращенную ApiKey вне памяти чата и продолжить импорт, запрос или работу с бюджетом.

Во время входа не нужно вручную копировать ключ. Агент получает собственное подключение после проверки email-кода.

## Что делает агент

Полная последовательность:

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Прочитать discovery-ответ и следовать returned actions
3. `POST` email пользователя на `bootstrapUrl`
4. Получить `otpSessionToken`
5. Запросить у пользователя 8-значный код
6. `POST` код, `otpSessionToken` и метку соединения на `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Получить долгоживущую `ApiKey`
8. Сохранить ключ вне памяти чата, желательно как `EXPENSE_BUDGET_TRACKER_API_KEY`
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. При необходимости создать workspace через `POST /v1/workspaces`
12. Сохранить workspace по умолчанию через `POST /v1/workspaces/{workspaceId}/select`
13. Проверить доступные relations через `GET /v1/schema`
14. Выполнять SQL через `POST /v1/sql`

Выбор workspace выполняется явно, но потом сохраняется на ключе. После `POST /v1/workspaces/{workspaceId}/select` последующие вызовы `/v1/sql` могут не передавать `X-Workspace-Id`.

## Что должен хранить агент

Ключ из `verify-code` долгоживущий. Не полагайтесь только на память чата.

- Сохраните его в локальный `.env` как `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`, если пользователь разрешает запись файлов
- Иначе экспортируйте его в shell и попросите пользователя сохранить его в постоянном месте

Подробности по endpoint'ам и аутентификации есть в [справочнике API](/ru/docs/api/).

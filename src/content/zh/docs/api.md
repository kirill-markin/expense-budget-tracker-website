---
title: API 参考
description: 用于以编程方式访问你的财务数据的智能体接入与 SQL API 参考。
---

## 概览

Expense Budget Tracker 对外提供一个公开的机器接口：

`https://api.expense-budget-tracker.com/v1/`

你可以通过同一组接口以两种方式使用它：

1. 从 `GET /v1/` 开始的**原生智能体接入**
2. 使用现有长期有效 ApiKey 的**直接 HTTP 调用**

所有请求都使用与 Web 应用相同的 Postgres 行级安全（Row Level Security, RLS）策略。

## API 发现与已发布规范

从这里开始：

`https://api.expense-budget-tracker.com/v1/`

发现接口的响应会告诉智能体如何完成认证引导，以及下一步该调用什么。该 API 还发布了以下规范：

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

当你需要获取 `/v1/sql` 允许暴露的关系和列的精确列表时，请使用 `schema`。

## 原生智能体接入

如果你希望 Claude Code、Codex、OpenClaw 或其他智能体自行连接，请从发现端点开始，并按照服务器返回的操作继续执行。

### 认证流程

1. `GET https://api.expense-budget-tracker.com/v1/`
2. 读取返回结果中的 `send_code` 操作和 `bootstrapUrl`
3. 将用户邮箱 `POST` 到 `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. 获取 `otpSessionToken`
5. 向用户询问邮件中的 8 位验证码
6. 将 `code`、`otpSessionToken` 和 `label` `POST` 到 `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. 获取长期有效的 `ApiKey`
8. 将该密钥保存在聊天记忆之外的位置
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. 如有需要，`POST https://api.expense-budget-tracker.com/v1/workspaces` 创建工作区
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. 使用 `POST https://api.expense-budget-tracker.com/v1/sql` 执行 SQL

### 认证请求头

- `Authorization: ApiKey <key>`

### 工作区处理

- `POST /v1/workspaces/{workspaceId}/select` 会为该 API key 保存默认工作区
- 默认工作区保存后，`/v1/sql` 可以省略 `X-Workspace-Id`
- 如果你想仅对某一次请求覆盖已保存的工作区，仍然支持 `X-Workspace-Id: <workspaceId>`
- 如果用户恰好只有一个工作区，且该 key 尚未保存工作区选择，API 会自动保存并使用该工作区

如需面向人工用户的分步指南，请参阅 [AI 智能体设置](/docs/agent-setup/)。

## 使用现有密钥直接进行 HTTP 调用

脚本、cron 作业、仪表盘和自定义应用在已经持有长期有效 ApiKey 的情况下，都可以直接调用同一套 API。

### 身份验证

通过 ApiKey 认证请求头传递密钥：

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

只有在该 key 尚未保存默认工作区，或你希望本次请求覆盖已保存工作区时，才需要 `X-Workspace-Id`。

- `Authorization: ApiKey ebta_your_key_here`
- 在需要时使用 `X-Workspace-Id: <workspaceId>`

## 端点摘要

- `GET /v1/` — 公开的发现文档
- `GET /v1/openapi.json` 和 `GET /v1/swagger.json` — 已发布的 API 规范
- `GET /v1/me` — 已认证的账户上下文
- `GET /v1/workspaces` — 列出该 key 所有者可访问的工作区
- `POST /v1/workspaces` — 创建工作区
- `POST /v1/workspaces/{workspaceId}/select` — 为此 key 保存默认工作区
- `GET /v1/schema` — 查看 SQL 允许使用的关系和列
- `POST /v1/sql` — 执行一条受限 SQL 语句

## SQL 策略

`POST /v1/sql` 每次请求只接受且只执行一条 SQL 语句。

允许的语句类型：

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

会被阻止或拒绝的模式：

- 多条语句
- `CREATE`、`DROP`、`ALTER` 等 DDL
- `BEGIN`、`COMMIT`、`ROLLBACK` 等事务包装语句
- `set_config()`
- SQL 注释
- 带引号的标识符
- dollar-quoted 字符串

服务器还会限制可查询的关系。生成 SQL 之前，请先使用 `/v1/schema` 查看已暴露的关系和列。

当前已暴露的关系：

- `ledger_entries`
- `accounts`
- `budget_lines`
- `budget_comments`
- `workspace_settings`
- `account_metadata`
- `exchange_rates`

## 限制

- 每次响应最多 100 行
- 语句超时时间为 30 秒
- 每个 key 限制为每秒 10 次请求、每天 10,000 次请求

## 安全性

- API key 以 SHA-256 哈希形式存储（不会持久化保存明文）
- RLS 在数据库层面强制执行工作区隔离
- 可以随时在产品中吊销密钥
- 移除工作区成员时，会自动吊销其所有密钥

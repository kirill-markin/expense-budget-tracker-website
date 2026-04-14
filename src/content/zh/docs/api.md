---
title: API 参考
description: 以编程方式访问财务数据时使用的智能体接入说明与 SQL API 参考。
---

## 概览

Expense Budget Tracker 对外公开提供一个面向程序和智能体的 API：

`https://api.expense-budget-tracker.com/v1/`

同一组端点支持两种使用方式：

1. 从 `GET /v1/` 开始的**智能体原生接入**
2. 持有长期有效 `ApiKey` 后的**直接 HTTP 调用**

所有请求都使用与 Web 应用相同的 Postgres 行级安全（Row Level Security，RLS）机制。

## 发现入口与已发布规范

从这里开始：

`https://api.expense-budget-tracker.com/v1/`

发现响应会告诉智能体如何启动认证流程，以及接下来该调用哪些端点。这套 API 还发布了以下规范：

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

如果你需要确认 `/v1/sql` 实际开放了哪些关系和列，请使用 `schema`。

## 智能体原生接入

如果你希望 Claude Code、Codex、OpenClaw 或其他智能体自行完成连接，请从发现端点开始，并按服务器返回的操作继续执行。

### 认证流程

1. `GET https://api.expense-budget-tracker.com/v1/`
2. 读取响应中的 `send_code` 操作和 `bootstrapUrl`
3. 将用户邮箱 `POST` 到 `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. 收到 `otpSessionToken`
5. 向用户索取邮件中的 8 位验证码
6. 将 `code`、`otpSessionToken` 和 `label` `POST` 到 `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. 收到长期有效的 `ApiKey`
8. 将该密钥保存在聊天记忆之外
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. 如有需要，`POST https://api.expense-budget-tracker.com/v1/workspaces` 创建工作区
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. 使用 `POST https://api.expense-budget-tracker.com/v1/sql` 执行 SQL

### 认证头

- `Authorization: ApiKey <key>`

### 工作区选择

- `POST /v1/workspaces/{workspaceId}/select` 会把默认工作区保存到这个 API 密钥上
- 保存默认工作区后，调用 `/v1/sql` 时可以省略 `X-Workspace-Id`
- 如果你只想在某一次请求中覆盖已保存的工作区，仍然可以传 `X-Workspace-Id: <workspaceId>`
- 如果用户恰好只有一个工作区，而这个密钥还没有保存过默认选择，API 会自动保存并使用该工作区

如需查看面向人工用户的分步指南，请参阅 [AI 智能体设置](/docs/agent-setup/)。

## 使用现有密钥直接发起 HTTP 请求

脚本、定时任务、仪表盘和自定义应用在已经持有长期有效 `ApiKey` 的情况下，都可以直接调用这套 API。

### 身份验证

把密钥放在 `ApiKey` 认证头里：

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

只有在这个 API 密钥还没有保存默认工作区，或者你想在当前请求中覆盖已保存工作区时，才需要 `X-Workspace-Id`。

- `Authorization: ApiKey ebta_your_key_here`
- 在需要时使用 `X-Workspace-Id: <workspaceId>`

## 端点一览

- `GET /v1/` — 公开的发现文档
- `GET /v1/openapi.json` 和 `GET /v1/swagger.json` — 已发布的 API 规范
- `GET /v1/me` — 已认证的账户上下文
- `GET /v1/workspaces` — 列出该 API 密钥所有者可访问的工作区
- `POST /v1/workspaces` — 创建工作区
- `POST /v1/workspaces/{workspaceId}/select` — 为这个 API 密钥保存默认工作区
- `GET /v1/schema` — 查看 SQL 可访问的关系和列
- `POST /v1/sql` — 执行一条受限的 SQL 语句

## SQL 规则

`POST /v1/sql` 每次请求严格只接受一条 SQL 语句。

允许的语句类型：

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

会被阻止或拒绝的模式：

- 多条语句
- `CREATE`、`DROP`、`ALTER` 等 DDL 语句
- `BEGIN`、`COMMIT`、`ROLLBACK` 等事务控制语句
- `set_config()`
- SQL 注释
- 带引号的标识符
- 使用美元引号包裹的字符串

服务器还会限制可查询的关系。生成 SQL 之前，请先使用 `/v1/schema` 查看已开放的关系和列。

当前已开放的关系：

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
- 每个 API 密钥最多每秒 10 次请求、每天 10,000 次请求

## 安全性

- API 密钥以 SHA-256 哈希形式存储，不会持久化保存明文
- RLS 在数据库层面强制执行工作区隔离
- 可以随时在产品中吊销 API 密钥
- 移除工作区成员时，会自动吊销其所有 API 密钥

---
title: AI 智能体接入指南
description: 把同一个发现 URL 提供给 Claude Code、Codex 或 OpenClaw。智能体会读取发现响应、验证 8 位验证码、保存长期有效的 API 密钥（`ApiKey`），然后开始处理你的工作区任务。
---

## 提供给智能体的链接

把下面这个 URL 原样发给智能体：

`https://api.expense-budget-tracker.com/v1/`

这个端点是面向 AI 智能体的公开发现文档。它会告诉智能体如何启动认证流程、下一步该调用哪些端点、后续应使用哪种认证方式，以及去哪里获取已发布的 API 规范。

## 用户需要做什么

1. 打开 Claude Code、Codex、OpenClaw，或任何能够发起 HTTP 请求的智能体。
2. 告诉智能体使用 `https://api.expense-budget-tracker.com/v1/` 连接 Expense Budget Tracker。
3. 当智能体询问邮箱地址时，提供你在 Expense Budget Tracker 中使用的邮箱。
4. 检查收件箱，找到 8 位验证码。
5. 把验证码发给智能体。
6. 让智能体把返回的 API 密钥（`ApiKey`）保存在聊天记忆之外，然后继续执行导入、查询或预算相关任务。

整个登录流程不需要手动复制粘贴密钥。邮箱验证码验证通过后，智能体会自行完成连接配置。

## 智能体会做什么

完整流程如下：

1. `GET https://api.expense-budget-tracker.com/v1/`
2. 读取发现响应，并按照响应里返回的操作继续，而不是把后续步骤写死
3. 将用户邮箱 `POST` 到返回的 `bootstrapUrl`
4. 收到 `otpSessionToken` 和 `verify_code` 操作
5. 向用户请求 8 位邮箱验证码
6. 将 `code`、`otpSessionToken` 和连接 `label` `POST` 到 `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. 收到新的 API 密钥（`ApiKey`）
8. 把这个密钥保存在聊天记忆之外，最好保存为 `EXPENSE_BUDGET_TRACKER_API_KEY`
9. 使用 `Authorization: ApiKey <key>` 执行 `GET https://api.expense-budget-tracker.com/v1/me`
10. 执行 `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. 如果需要，用 `POST /v1/workspaces` 创建工作区
12. 用 `POST /v1/workspaces/{workspaceId}/select` 保存默认工作区
13. 用 `GET https://api.expense-budget-tracker.com/v1/schema` 查看允许使用的关系
14. 通过 `POST https://api.expense-budget-tracker.com/v1/sql` 执行 SQL

工作区选择需要显式执行，但并不是完全无状态的。调用 `POST /v1/workspaces/{workspaceId}/select` 之后，所选工作区会保存到该 API 密钥下，因此后续调用 `/v1/sql` 时可以省略 `X-Workspace-Id`。如果你想在某一次请求中临时覆盖已保存的工作区，仍然可以显式发送 `X-Workspace-Id`。

如果用户恰好只有一个工作区，并且这个 API 密钥还没有保存过默认选择，后端会自动保存并使用该工作区。

## 智能体应该保存什么

`verify-code` 返回的 API 密钥（`ApiKey`）是长期有效的。不要只依赖聊天记忆。

- 如果用户允许写文件，就把它保存在本地 `.env` 文件中，格式为 `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`
- 否则就在当前 shell 中导出 `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`，并提醒用户把它保存到持久位置

带认证的请求使用：

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` 只在你想覆盖已保存的工作区，或者默认工作区还没保存时才需要

## 如果你是 AI 智能体

先从这里开始：

```bash
curl https://api.expense-budget-tracker.com/v1/
```

然后按照服务器返回的操作继续。只要发现文档已经提供了后续步骤，就不要自行假设或写死流程。

在 `verify-code` 之后，请安全保存返回的 API 密钥（`ApiKey`）。然后继续读取：

- `/v1/me`，用于获取账户上下文
- `/v1/workspaces`，用于获取可用工作区
- `/v1/schema`，用于查看允许使用的 SQL 关系和列
- `/v1/openapi.json` 或 `/v1/swagger.json`，用于获取已发布的机器可读 API 规范

## 给用户的提示词示例

### Claude Code

```text
使用 https://api.expense-budget-tracker.com/v1/ 连接 Expense Budget Tracker。
在需要时使用我的账户邮箱，向我询问 8 位验证码，把返回的 API 密钥保存在聊天记忆之外，然后从 ~/Downloads 导入我最新的银行对账单。
```

### Codex

```text
使用 https://api.expense-budget-tracker.com/v1/ 连接到我的 Expense Budget Tracker 账户。
先询问我的邮箱，等待邮件验证码，保存返回的 API 密钥，检查 /schema，然后把我最新的交易记录展示出来。
```

### OpenClaw

```text
通过 https://api.expense-budget-tracker.com/v1/ 自行连接到 Expense Budget Tracker。
登录完成后，列出我的工作区，把其中一个保存为这个 API 密钥的默认工作区，然后导入我刚上传的新 CSV。
```

## 完成设置后你可以做什么

- 导入银行对账单或银行卡导出文件
- 使用你现有的分类对交易进行归类
- 把账户余额与银行记录进行核对
- 按分类、周期、商户或账户查询支出
- 更新下个月的预算条目

如果你想查看更底层的端点和认证细节，请参阅 [API 参考](/docs/api/)。

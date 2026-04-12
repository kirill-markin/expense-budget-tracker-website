---
title: "Claude Code、Codex 与 OpenClaw 的 AI 记账接入指南"
description: "介绍如何把 Claude Code、Codex 或 OpenClaw 连接到开源记账系统。只需提供一个发现 URL，确认邮箱验证码，保存返回的 ApiKey，代理就能开始工作。"
date: "2026-03-10"
keywords:
  - "AI 记账"
  - "Claude Code 记账"
  - "Codex 记账"
  - "OpenClaw 记账"
  - "Expense Budget Tracker API"
---

如果你想让 AI 代理帮你记账，最烦人的部分通常不是分析，而是接入。

常见流程一般是这样：

1. 打开应用
2. 创建 API key
3. 复制 key
4. 粘贴到终端代理里
5. 说明该调用哪个 endpoint
6. 希望代理最终连对了 workspace

这当然能用，但它并不是面向代理原生设计的流程。

[Expense Budget Tracker](https://expense-budget-tracker.com/zh/) 现在为 Claude Code、OpenAI Codex、OpenClaw 这类终端代理公开提供了一个发现端点：

`https://api.expense-budget-tracker.com/v1/`

用户只需要把这一条链接交给代理，然后回答两个问题：

- 登录要使用哪个邮箱？
- 收件箱里刚收到的 8 位验证码是什么？

之后，代理会自己申请 `ApiKey`、把 key 保存到聊天记忆之外、加载账户、列出 workspaces、把其中一个保存为该 key 的默认 workspace，然后就可以开始导入或查询交易了。

这个项目在 GitHub 上完全开源：

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [机器 API 实现](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [代理 send-code 路由](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [代理 verify-code 路由](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## 交给代理的那一条链接

就是这个精确 URL：

```text
https://api.expense-budget-tracker.com/v1/
```

这个端点会返回一份可供机器读取的发现文档。代理可以从中读到：

- 认证引导入口在哪里
- 第一条该调用的动作是什么
- 后续该使用哪种认证头
- workspace 设置和 SQL 访问接下来应该怎么做

核心思路很简单：不再把接入说明硬编码进 prompt，而是让产品自己告诉代理应该怎么连接。

## Claude Code 的示例提示词

```text
请使用 https://api.expense-budget-tracker.com/v1/ 连接到 Expense Budget Tracker。
先向我询问账户邮箱，等待我从收件箱里拿到 8 位验证码，再完成设置，
把返回的 ApiKey 保存在聊天记忆之外，然后从 ~/Downloads/chase-march-2026.csv 导入交易并校验最终余额。
```

## Codex 的示例提示词

```text
请使用 https://api.expense-budget-tracker.com/v1/ 连接我的 Expense Budget Tracker 账户。
需要登录信息时，先向我询问邮箱，再询问 8 位验证码。
完成设置后，保存 key，查看 /schema，并向我展示最近 20 条交易以及本月杂货总支出。
```

## OpenClaw 的示例提示词

```text
请通过 https://api.expense-budget-tracker.com/v1/ 自行连接到 Expense Budget Tracker。
登录后，把我的个人 workspace 保存为这个 key 的默认 workspace，并导入我上传的 CSV 文件。
能复用已有分类就复用，并在任何余额对不上的地方告诉我。
```

## AI 记账接入是如何工作的

下面是这套接入背后的完整 HTTP 流程。

### 1. 读取发现端点

代理从这里开始：

```bash
curl https://api.expense-budget-tracker.com/v1/
```

响应会告诉它应该先调用 `send_code`，给出 auth 域上的 bootstrap URL，并指向已发布的 OpenAPI 与 schema 端点。

### 2. 发送用户邮箱

代理把邮箱地址发送给 auth 服务：

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

如果请求成功，响应里会包含一个 `otpSessionToken`，并说明接下来要调用 `verify_code`。

### 3. 向用户询问 8 位邮箱验证码

用户查看收件箱后，把验证码发回给代理。

### 4. 校验验证码并获取 ApiKey

随后代理调用：

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

响应会返回一个新的 `ApiKey`。这个 key 只会显示一次，代理应把它保存起来供后续请求使用，理想情况下保存为 `EXPENSE_BUDGET_TRACKER_API_KEY`。

这正是相对于旧的手工流程最大的改进：用户不需要再去 Settings 里手动创建 key，再复制进终端。

### 5. 加载账户与 workspace 上下文

验证码校验完成后，代理会使用 `Authorization: ApiKey <key>` 加载账户：

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

然后列出 workspaces：

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

如果需要，它还可以创建新的 workspace，或者通过 `POST /v1/workspaces/{workspaceId}/select` 显式保存现有 workspace。

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. 通过代理 API 执行 SQL

之后，常规数据操作就通过 app 域进行：

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

请求必须包含：

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>`，仅当你想覆盖已保存的 workspace 或者在尚未保存前指定 workspace 时使用

workspace 选择是显式的。在调用 `POST /v1/workspaces/{workspaceId}/select` 之后，服务端会把该选择按 API key 保存下来。如果用户恰好只有一个 workspace，API 会自动为新 key 保存并使用它。

## 接入完成后，代理可以做什么

连接完成后，代理就能处理那些本不该靠你点来点去完成的琐碎财务工作：

1. 解析银行导出的 CSV、PDF 或截图
2. 把交易写入总账
3. 将余额与银行显示结果核对
4. 按分类、商户或时间区间查询支出
5. 更新下个月的预算行

下面是一个导入账单的实际例子：

```text
请把 ~/Downloads/revolut-february-2026.csv 导入我的 EUR 账户。
在写入任何内容之前，先查询我现有的分类以及最近 30 天的交易，避免重复导入。
导入完成后，把结果账户余额与 CSV 中的期末余额进行比较。
```

下面是一个分析例子：

```text
请展示我最近 90 天支出最高的 10 个分类，并与前 90 天对比。
同时列出那些支出上升分类中金额最大的交易。
```

## 为什么这比手动设置 API key 更好

对用户和代理来说，新流程都更简单：

- 用户不需要手动复制长期有效的 key
- 代理会从产品本身发现协议
- 认证与数据访问被清晰分离
- 每次 SQL 请求都会绑定到已选中的 workspace
- 之后还可以在应用里撤销这条连接

如果你正在构建 AI 记账工作流，这一点很重要。它能去掉大量 prompt 样板与接入错误。

## 带代理接入能力的开源记账工具

Expense Budget Tracker 采用 MIT 许可证，完全开源：

- [项目网站](https://expense-budget-tracker.com/zh/)
- [GitHub 仓库](https://github.com/kirill-markin/expense-budget-tracker)
- [GitHub 上的 README](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [AI 代理设置文档](https://expense-budget-tracker.com/zh/docs/agent-setup/)
- [API 参考](https://expense-budget-tracker.com/zh/docs/api/)

如果你想 self-host，可以从这里开始：

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

如果你想直接使用托管版，把这个 URL 交给你的代理即可：

```text
https://api.expense-budget-tracker.com/v1/
```

这就足够让 Claude Code、Codex 或 OpenClaw 自行开始登录流程了。

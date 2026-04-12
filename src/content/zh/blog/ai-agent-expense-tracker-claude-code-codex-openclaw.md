---
title: "Claude Code、Codex 与 OpenClaw 如何接入 AI 记账工具"
description: "介绍如何把 Claude Code、Codex 或 OpenClaw 连接到开源的 Expense Budget Tracker。只需提供一个发现 URL，确认邮箱验证码，代理就能自行完成登录、保存 ApiKey，并开始导入和查询账务数据。"
date: "2026-03-10"
keywords:
  - "AI 记账"
  - "Expense Budget Tracker"
  - "Claude Code"
  - "OpenAI Codex"
  - "OpenClaw"
  - "代理接入"
---

如果你想让 AI 代理帮你记账，真正让人头疼的通常不是分析能力，而是接入流程。

很多产品表面上支持 API，但实际用起来仍然很手动：

1. 打开应用后台
2. 手动创建 API 密钥
3. 复制密钥
4. 粘贴到终端代理里
5. 再补一段说明，告诉代理该请求哪个端点
6. 最后还得祈祷它连到了正确的工作区

这套流程不是不能用，只是不够适合代理。

[Expense Budget Tracker](https://expense-budget-tracker.com/zh/) 现在为 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)、OpenAI Codex 和 OpenClaw 这类终端代理提供了公开的发现入口：

`https://api.expense-budget-tracker.com/v1/`

用户只需要把这一条链接交给代理，然后回答两个问题：

- 登录使用哪个邮箱？
- 刚收到的 8 位邮箱验证码是多少？

之后，代理会自行申请 `ApiKey`、把它保存在聊天上下文之外的安全位置、加载账户信息、列出工作区、为当前密钥保存默认工作区，然后就可以开始导入交易或查询数据。

整个项目也已经在 GitHub 开源：

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [机器接口实现](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [代理发送验证码路由](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [代理校验验证码路由](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## 你只需要交给代理这一条链接

准确地址如下：

```text
https://api.expense-budget-tracker.com/v1/
```

这个端点会返回一份机器可读的发现文档，代理可以直接从中读出：

- 认证引导入口在哪里
- 第一步应该调用哪个动作
- 后续请求该使用什么认证头
- 工作区选择和 SQL 访问下一步怎么继续

核心思路很直接：不再把接入说明硬塞进提示词，而是由产品本身告诉代理应该如何完成连接。

## 给 Claude Code 的示例提示词

```text
请使用 https://api.expense-budget-tracker.com/v1/ 连接到我的 Expense Budget Tracker 账户。
需要登录时，先向我询问邮箱，再等待我提供收件箱里的 8 位验证码。
完成设置后，把返回的 ApiKey 保存在聊天上下文之外，然后从 ~/Downloads/chase-march-2026.csv 导入交易，并核对最终余额是否正确。
```

## 给 Codex 的示例提示词

```text
请通过 https://api.expense-budget-tracker.com/v1/ 连接我的 Expense Budget Tracker。
当你需要登录信息时，先向我询问邮箱，再询问 8 位验证码。
连接完成后，保存 ApiKey，查看 /schema，并展示我最近 20 条交易以及本月的杂货支出总额。
```

## 给 OpenClaw 的示例提示词

```text
请通过 https://api.expense-budget-tracker.com/v1/ 自行接入 Expense Budget Tracker。
登录后，把我的个人工作区保存为这个 ApiKey 的默认工作区，并导入我上传的 CSV 文件。
能复用现有分类就优先复用；如果发现余额对不上，请明确告诉我。
```

## AI 记账代理是如何完成接入的

下面是这套接入背后的完整 HTTP 流程。

### 1. 读取发现端点

代理首先从这里开始：

```bash
curl https://api.expense-budget-tracker.com/v1/
```

返回结果会告诉它先执行 `send_code`，给出认证域名上的引导 URL，并指向已发布的 OpenAPI 与 schema 端点。

### 2. 提交用户邮箱

代理会把邮箱地址发送到认证服务：

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

如果请求成功，响应里会返回一个 `otpSessionToken`，并说明下一步要调用 `verify_code`。

### 3. 询问用户 8 位邮箱验证码

这时用户只需要查看收件箱，再把验证码发给代理。

### 4. 校验验证码并换取 ApiKey

接着代理调用：

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

响应中会包含一个新的 `ApiKey`。这个值只会显示一次，因此代理应该把它安全保存起来，供后续请求使用。比较合适的环境变量名是 `EXPENSE_BUDGET_TRACKER_API_KEY`。

这正是它比旧流程更顺手的地方：用户不必再先进入设置页面手动创建密钥，再复制回终端。

### 5. 加载账户和工作区上下文

验证码校验通过后，代理会使用 `Authorization: ApiKey <key>` 读取账户信息：

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

然后列出可用工作区：

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

如果有需要，它还可以创建新的工作区，或者通过 `POST /v1/workspaces/{workspaceId}/select` 显式保存现有工作区：

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. 通过代理接口执行 SQL

完成以上步骤后，常规数据操作就通过应用域名上的接口进行：

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

请求里必须包含：

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>`，仅在你想覆盖已保存的默认工作区，或者在默认工作区尚未保存之前显式指定时才需要传

工作区选择是显式且可保存的。调用 `POST /v1/workspaces/{workspaceId}/select` 之后，服务端会把这次选择按 API 密钥保存下来。如果用户名下只有一个工作区，API 也会自动为新密钥保存并使用它。

## 接入完成后，代理能帮你做什么

一旦连接完成，代理就能接手那些本来很耗时间、却不值得手工反复点来点去的财务杂务：

1. 解析银行导出的 CSV、PDF 或截图
2. 把交易写入总账
3. 把系统余额和银行余额做核对
4. 按分类、商户或时间区间查询支出
5. 更新下个月的预算项目

下面是一个更实用的导入示例：

```text
请把 ~/Downloads/revolut-february-2026.csv 导入我的 EUR 账户。
写入之前，先读取我现有的分类和最近 30 天交易，避免重复导入。
导入完成后，再把账户余额与 CSV 里的期末余额进行核对。
```

下面是一个支出分析示例：

```text
请列出我最近 90 天支出最高的 10 个分类，并与前一个 90 天周期进行对比。
另外，把那些支出上升分类里金额最大的交易也一并列出来。
```

## 为什么这比手动配置 API 密钥更适合代理

这套新流程对用户和代理都更友好：

- 用户不用手动复制长期有效的密钥
- 代理可以直接从产品公开的发现文档中理解接入协议
- 认证与数据访问被明确拆分
- 每次 SQL 请求都能落在选定的工作区内
- 之后也可以在应用里撤销这条连接

如果你正在搭建 AI 记账流程，这一点很关键。它能减少大量提示词样板、接入说明和人为失误。

## 支持代理接入的开源记账工具

Expense Budget Tracker 采用 MIT 许可证，并已完整开源：

- [项目网站](https://expense-budget-tracker.com/zh/)
- [GitHub 仓库](https://github.com/kirill-markin/expense-budget-tracker)
- [GitHub README](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [AI 代理接入文档](https://expense-budget-tracker.com/zh/docs/agent-setup/)
- [API 参考文档](https://expense-budget-tracker.com/zh/docs/api/)

如果你想自行部署，可以从这里开始：

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

如果你只是想直接用托管版，那就把这条地址交给你的代理：

```text
https://api.expense-budget-tracker.com/v1/
```

这已经足够让 Claude Code、Codex 或 OpenClaw 自行发起登录流程、保存连接信息，并开始处理你的账务数据。

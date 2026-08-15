---
title: MCP 指南
description: 将兼容的 AI 客户端连接到 Expense Budget Tracker 托管远程 MCP 服务器，并了解 OAuth 权限、工具和数据边界。
---

Expense Budget Tracker 提供一个统一的托管远程 MCP 端点：

```text
https://mcp.expense-budget-tracker.com/mcp
```

请在所有兼容客户端中使用同一 URL。托管服务器使用 Streamable HTTP 和 OAuth 2.1；此端点不接受 API 密钥。

## 支持的客户端

该端点适用于 ChatGPT 以及同时支持以下能力的其他 MCP 客户端：

- 通过 Streamable HTTP 连接远程 MCP 服务器；
- 带 PKCE 的 OAuth 2.1 授权码流程；
- OAuth 动态客户端注册（Dynamic Client Registration）。

当 Claude、Codex、OpenClaw 或其他客户端的当前版本支持上述远程传输和认证流程时，也可以使用同一端点。只支持本地 `stdio` 服务器的客户端无法直接连接此托管端点。

## 连接与授权

1. 在客户端中将 `https://mcp.expense-budget-tracker.com/mcp` 添加为自定义远程 MCP 服务器。
2. 客户端会发现受保护资源和授权服务器，然后通过动态客户端注册提交自己的名称和重定向 URL。
3. 浏览器会打开 Expense Budget Tracker 的登录和授权页面。登录后检查客户端名称及其请求的权限，只批准你愿意授予的访问。
4. 客户端通过 PKCE 交换授权码，并使用短期访问凭据建立连接。你无需把令牌复制到客户端。
5. 在读取或修改财务数据前，让客户端先调用 `list_workspaces`。

授权服务器可以授予以下 scope：

| Scope | 访问能力 |
| --- | --- |
| `expenses:read` | 列出工作区、查看允许的 schema，并查询财务数据。 |
| `expenses:write` | 通过 `sql_execute` 执行允许的 `INSERT`、`UPDATE` 或 `DELETE`。写权限与读权限分开。 |

只读连接会获得 `expenses:read`。启用写入的连接会同时获得 `expenses:read` 和 `expenses:write`。

## 工具

| 工具 | 用途 | 边界 |
| --- | --- | --- |
| `list_workspaces` | 列出当前登录用户可访问的所有工作区。 | 只读；需要 `expenses:read`。 |
| `get_schema` | 返回某个工作区允许使用的关系、列、约束、限制和智能体提示。 | 只读；需要 `expenses:read`。 |
| `sql_query` | 仅执行一条符合策略的 `SELECT` 或 `WITH ... SELECT`。 | 使用受限读取角色执行只读事务；需要 `expenses:read`。 |
| `sql_execute` | 仅执行一条符合策略的 `INSERT`、`UPDATE` 或 `DELETE`。 | 会修改财务数据且不具备幂等性；需要 `expenses:write`。 |

这些工具只能处理 Expense Budget Tracker 数据。它们不能浏览网页、访问其他服务、执行 DDL，也不能绕过 `get_schema` 返回的关系和列。

## 选择工作区

先调用 `list_workspaces`。如果只返回一个工作区，其他调用可以省略 `workspaceId`。如果有多个工作区，请选择返回结果中的一个 ID，并在每次调用 `get_schema`、`sql_query` 和 `sql_execute` 时明确传入该 `workspaceId`。服务器不会猜测，而会拒绝含糊或无权访问的工作区。

选择工作区后、编写 SQL 前调用 `get_schema`。详细的关系和 SQL 合约由 [API 参考](/zh/docs/api/)维护；本指南只说明 MCP 连接与安全模型。

## 读写边界

使用 `sql_query` 查看数据和生成报告。只有在变更内容明确且用户已经批准时才使用 `sql_execute`。修改操作不具备幂等性，因此不要盲目重试结果不确定的写入：先查询最终状态，确认变更没有生效后再重试。

服务端通过 Postgres 行级安全和受限数据库角色隔离工作区。OAuth scope、工作区成员资格、SQL 策略、语句时限和响应行数上限均由服务端强制执行，而不是交给 AI 客户端决定。

## 隐私、撤销与帮助

AI 客户端是独立的第三方，可能按照自己的条款和隐私政策处理或保留提示词及工具结果。连接财务数据前请阅读其政策。Expense Budget Tracker 的[隐私政策](/zh/privacy/)说明托管服务会处理和存储哪些内容。

你可以在托管应用的**设置 > 智能体访问**中撤销已连接的 MCP 客户端。撤销后，该连接的访问令牌和刷新凭据都会失效。连接遇到问题时，请查看[支持页面](/zh/support/)。

## 相关资源

- [API 参考](/zh/docs/api/)
- [隐私政策](/zh/privacy/)
- [服务条款](/zh/terms/)
- [支持](/zh/support/)
- [自托管指南](/zh/docs/self-hosting/)
- [源代码](https://github.com/kirill-markin/expense-budget-tracker)

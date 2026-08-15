---
title: MCP 连接器
description: 使用 OAuth 将 MCP 客户端连接到 Expense Budget Tracker，安全查询或更新财务数据。
---

## 概览

Expense Budget Tracker 提供托管的 Model Context Protocol（MCP）连接器，地址为：

`https://mcp.expense-budget-tracker.com/mcp`

该端点使用 Streamable HTTP 和 OAuth。请将此 URL 提供给支持远程 Streamable HTTP 服务器和 OAuth 发现的 MCP 客户端。授权流程会打开浏览器，让你登录并批准访问权限。

该连接器不使用 API 密钥。OAuth 访问令牌和刷新令牌才是 MCP 凭证。[智能体 API 参考](/zh/docs/api/)中介绍的长期 `ApiKey` 属于另一套直接 HTTP 集成，MCP 端点不会接受它。

## OAuth 发现与连接

托管连接器在以下地址发布受保护资源元数据：

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

该元数据会将客户端引导到授权服务器。授权服务器元数据位于：

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

兼容的客户端会按以下流程连接：

1. 连接到 `https://mcp.expense-budget-tracker.com/mcp`，并发现受保护资源元数据。
2. 以公共 OAuth 客户端的身份完成动态注册，不使用客户端密钥。
3. 启动 Authorization Code 流程，并在用户的浏览器中打开授权 URL。
4. 每次授权请求都使用 PKCE。唯一支持的代码质询方法是 `S256`。
5. 请求 `expenses:read`。只有在客户端需要调用 `sql_execute` 时才添加 `expenses:write`。
6. 使用授权码换取访问令牌和刷新令牌，之后由客户端在需要时刷新访问权限。

不要把令牌复制到提示词、聊天记录、源代码文件或日志中。令牌只能保存在 MCP 客户端的凭证存储中。

## 权限范围

- `expenses:read` 为必选项。它允许发现工作区、查看 schema 和执行只读查询。
- `expenses:write` 为可选项。它单独允许使用具有破坏性的 `sql_execute` 工具。

只请求任务所需的最小权限范围。仅分析数据或生成报告的客户端应请求 `expenses:read`，不要请求 `expenses:write`。

## 工具

### `list_workspaces`

列出已登录用户可以访问的工作区。读取或修改数据前，请使用返回的工作区标识符明确指定目标。

### `get_schema`

返回所选工作区中通过 MCP 开放的关系和列。编写 SQL 前先调用此工具，不要猜测表名或列名。

### `sql_query`

在所选工作区中执行一条受限的只读 SQL 查询。查询路径还受到数据库只读边界的强制保护。结果最多包含 100 行，执行期限为 20 秒。

### `sql_execute`

在所选工作区中执行会修改数据的受限 SQL。该工具具有破坏性，需要单独授予 `expenses:write` 权限。批准调用前，请确认工作区并审查完整语句。

由于 MCP 服务器提供 `sql_execute`，因此不能把整个服务器称为只读。只读保证只适用于 `sql_query` 及其数据库边界。

## 安全使用

1. 调用 `list_workspaces`，并与用户确认目标工作区。
2. 生成 SQL 前先调用 `get_schema`。
3. 使用 `sql_query` 检查数据、计算汇总、对账和生成报告。
4. 只有任务必须修改数据时才请求 `expenses:write`。
5. 调用 `sql_execute` 前，展示完整语句及其预期影响，然后再次确认工作区。
6. 写入后使用 `sql_query` 验证结果。

服务器会限制 SQL 范围和开放的关系。这些控制措施是对生成 SQL 进行谨慎审查的补充，不能取代人工审查。

## 限制

- SQL 结果最多 100 行
- 执行期限为 20 秒
- 只能访问已登录用户可用的工作区
- `sql_query` 使用受限的 SQL 范围和数据库只读边界
- 除必选的读取权限外，`sql_execute` 还要求 `expenses:write`

## 隐私与自托管

获得授权的 MCP 客户端可以读取财务数据；取得 `expenses:write` 后还可以修改数据。连接前，请查看[隐私政策](/zh/privacy/)以及客户端自身的数据处理政策。

上述托管 URL 仅适用于 Expense Budget Tracker 的托管服务。自行部署时，请先阅读[自托管指南](/zh/docs/self-hosting/)，并为自己的域名配置 MCP 端点和 OAuth 元数据。实现代码位于[源代码仓库](https://github.com/kirill-markin/expense-budget-tracker)。

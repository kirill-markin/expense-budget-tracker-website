---
title: "2026 年如何通过 MCP 将 Claude 接入记账工具"
description: "通过远程 MCP 连接器将 Claude 或 Claude Desktop 接入 Expense Budget Tracker，分别控制读写权限，并在每次修改后重新查询验证结果。"
date: "2026-08-17"
image: "/blog/claude-expense-tracker-mcp-connector.png"
keywords:
  - "Claude 记账"
  - "Claude 记账工具"
  - "Claude MCP 记账"
  - "Claude MCP 连接器"
  - "Claude Desktop 记账"
  - "Claude 支出追踪"
---

Claude 与你的记账工具进行第一次对话时，越平淡越安全：先列出工作区，读取当前数据库结构，再执行一条只读查询。账本中的任何数据都不会改变。

这个看似不起眼的开场很重要，因为之后你可能会允许同一个连接器修改财务数据。安全使用的关键，是把读取和写入权限分开、明确指定工作区，并在每次修改后重新检查结果。

Expense Budget Tracker 正是为这套流程提供了托管的远程 MCP 连接器：

```text
https://mcp.expense-budget-tracker.com/mcp
```

把这个 URL 添加到 Claude，完成浏览器中的 OAuth 授权，Claude 就能通过四个职责明确的工具操作记账系统。你不需要终端、API 密钥，也不需要本地 MCP 配置文件。

![版画师将受保护的参考印样与用一块选定铜版制成的新校样进行对比](/blog/claude-expense-tracker-mcp-connector.png)

## 这是连接器流程，不是 Claude Code API 流程

Expense Budget Tracker 提供两种机器访问方式，两者的凭据很容易混淆。

| | 远程 MCP 连接器 | 直接 Agent API |
|---|---|---|
| 适用场景 | Claude 和 Claude Desktop 对话 | Claude Code、Codex、脚本及其他终端代理 |
| 起始 URL | `https://mcp.expense-budget-tracker.com/mcp` | `https://api.expense-budget-tracker.com/v1/` |
| 身份验证 | 浏览器 OAuth | 长期有效的 `ApiKey` |
| 接口 | MCP 工具 | HTTP 端点 |
| 凭据 | 由 MCP 客户端保存的 OAuth 访问令牌和刷新令牌 | 保存在聊天记录之外的 ApiKey |

MCP 端点不接受直接 API 使用的 `ApiKey`，直接 API 也不能把这把密钥变成 Claude 自定义连接器。两者是相互独立的集成方式，各有一套凭据流程。

如果你想从 Claude 网页版或桌面应用接入记账工具，请继续阅读本指南。如果你的任务是“读取我电脑上的这份 CSV”，则应改用[如何用 Claude Code 追踪支出并管理预算](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code/)中的终端流程。更完整的 [AI 记账工具设置指南](/blog/ai-agent-expense-tracker-claude-code-codex-openclaw/)介绍了 Claude Code、Codex 和 OpenClaw 如何通过直接 API 接入。

## 在 Claude 中添加 Expense Budget Tracker 连接器

Claude 个人账户目前的入口是 **Customize > Connectors > Add custom connector**。Anthropic 会在[远程 MCP 自定义连接器指南](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)中更新界面和账户相关说明。

### 1. 添加远程 MCP URL

打开 Claude 或 Claude Desktop，然后：

1. 前往 **Customize > Connectors**。
2. 点击 **+** 按钮，选择 **Add custom connector**。
3. 将连接器命名为 `Expense Budget Tracker`。
4. 在远程 MCP 服务器 URL 中输入 `https://mcp.expense-budget-tracker.com/mcp`。
5. 点击 **Add**。

Advanced 设置中的 OAuth Client ID 和 Client Secret 都不需要填写。Expense Budget Tracker 授权服务器支持公共 OAuth 客户端的动态注册，不会使用客户端密钥。

如果使用 Team 或 Enterprise 账户，必须先由 Owner 或 Primary Owner 为组织添加自定义连接器。之后，每位成员再用自己的账户完成连接，而且只能访问该登录用户有权使用的工作区。

### 2. 连接并批准 OAuth 权限

点击新连接器旁的 **Connect**。Claude 会按照 MCP 授权发现流程，在浏览器中打开 Expense Budget Tracker 的登录页面。登录后，仔细检查它请求的权限。

两个 scope 分工不同：

- `expenses:read` 是必选权限，可用于发现工作区、读取 schema 和执行只读查询。
- `expenses:write` 是可选权限，可启用具有破坏性的 `sql_execute` 工具。

如果只是复盘支出、生成报告、对账或分析预算，只授予 `expenses:read` 即可。只有在 Claude 确实需要插入、更新或删除特定数据时，才添加 `expenses:write`，不要为了“以后可能会用到”而提前授权。

不要把 OAuth 令牌粘贴进提示词。访问令牌和刷新令牌会由浏览器及 Claude 的连接器凭据存储来处理。

### 3. 在当前对话中启用连接器

添加连接器并不代表 Claude 会在每次聊天中自动使用它。打开对话里的 **+** 菜单，选择 **Connectors**，再为当前聊天启用 Expense Budget Tracker。

这种按对话控制的开关很适合财务数据。平时不需要访问账务时保持关闭，等到专门处理预算时再打开。

## Claude 在 OAuth 流程中做了什么

这些步骤不需要手动执行，但了解整个流程，有助于在连接失败时准确定位问题。

托管连接器会在 `https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp` 发布受保护资源元数据。该文档再把 Claude 指向 `https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server` 上的授权服务器元数据。

Claude 会注册为公共 OAuth 客户端，在浏览器中发起 Authorization Code 流程，并使用以 `S256` 为质询方法的 PKCE。用户批准后，它用授权码换取令牌，并在需要时刷新访问权限。这套流程遵循 [MCP 授权模型](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)，包括受保护资源发现，以及用 PKCE 保护授权码。

有一点经常出乎 Claude Desktop 用户的意料：远程连接器的流量并不是从桌面应用的本地网络接口发出。[Anthropic 表示，自定义远程 MCP 连接来自其云基础设施](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)，即使你使用 Claude Desktop 也是如此。这里的托管连接器已经可以通过公网访问；如果是私有的自托管 MCP 服务器，则必须先允许 Anthropic 的基础设施连接，Claude 才能访问。

## Claude 会获得哪四个工具

这个连接器只提供一组范围明确的操作，不会把不受限制的数据库连接直接交给 Claude。

| 工具 | 作用 | 权限 |
|---|---|---|
| `list_workspaces` | 列出当前登录用户可用的工作区 | `expenses:read` |
| `get_schema` | 返回所选工作区允许访问的数据库关系和列 | `expenses:read` |
| `sql_query` | 执行一条受限的只读 SQL 查询 | `expenses:read` |
| `sql_execute` | 执行会修改数据的受限 SQL | `expenses:read` 和 `expenses:write` |

`sql_query` 受数据库只读边界保护，结果最多返回 100 行，执行时限为 20 秒。不过，一旦 `sql_execute` 可用，整个连接器就不再是只读的，这正是写入 scope 需要单独对待的原因。

正确的顺序是先读取实时 schema，再编写 SQL。表名、列名和允许访问的关系都应该来自 `get_schema`，而不是旧提示词、复制来的示例，或 Claude 对其他财务应用的记忆。

## 第一次会话应按这个安全顺序进行

第一条提示词应该要求 Claude 先确认上下文，再开始分析：

```text
以只读模式使用 Expense Budget Tracker 连接器。

首先调用 list_workspaces，向我显示可用工作区的名称和标识符。
即使只有一个工作区，也要让我确认使用哪一个。然后为已确认的工作区调用
get_schema。只使用 sql_query。暂时不要调用 sql_execute，也不要提出任何修改。

获取 schema 后，按分类汇总我当前自然月的支出，并与上一个自然月比较。
使用聚合查询，不要返回账本中的每一行。显示查询，并解释所有会影响结果的
限制。
```

顺序很重要：先选择工作区，再读取其当前 schema，最后才编写查询。如果一条查询可能返回超过 100 条记录，让 Claude 直接在 SQL 中聚合，或把问题拆成合理的时间段。目标不是把整本账塞进聊天，而是在数据库端完成计算，只返回真正有用的结果。

## 第一次只读会话可以这样提问

确认工作区并读取 schema 后，Claude 能做的不只是列出最近几笔消费。

### 做一次月度预算复盘

```text
只使用 sql_query，对比本月实际收入和支出与预算。按分类汇总差异，
将绝对值最大的差异排在前面，并把预算数据缺失与真正的超支分开。
不要修改任何预算项。显示你使用的 SQL。
```

这相当于用对话完成一次[月度预算复盘](/blog/how-to-do-a-monthly-budget-review/)：先找出差距，再决定哪里需要调整。

### 查找疑似重复的支出

```text
使用实时 schema 和 sql_query，查找过去 45 天内可能重复的支出记录。
如果对应字段存在，请比较日期、金额、币种、账户和交易对手。
把结果视为待确认的候选项，不要直接判定为重复记录。不要删除或更新任何内容。
```

“待确认的候选项”很重要。两笔金额相同的咖啡消费，并不一定来自一次重复导入。

### 先做一次对账检查

```text
使用 list_workspaces，确认我的个人工作区，读取 schema，并查询连接器可访问的
余额。解释最新余额由哪些账本记录构成。不要进行修正，我会亲自把结果与
银行对账单进行比较。
```

如果余额与原始对账单不符，先停下来调查差额。[预算对账流程](/blog/how-to-reconcile-your-budget-with-your-bank-balance/)介绍了如何在修改账本之前，分别排查遗漏交易、重复记录、期初余额问题和转账。

## 每次写入都应当是一个独立任务

只有目标和预期结果都足够明确时，写入权限才真正有用：修正某一笔交易的分类、记录一笔已经批准的支出，或按已确认的方案更新一个预算项。每次只做一项便于审核的小改动，不要笼统地要求 Claude“把所有内容都清理一下”。

下面这条提示词可以谨慎地修改一笔交易的分类：

```text
我需要修正一条账本记录的分类。

1. 调用 list_workspaces，并和我确认目标工作区。
2. 调用 get_schema，不要自行假设列名。
3. 根据我提供的日期、金额、币种、账户和交易对手信息，使用 sql_query
   找到准确的记录。
4. 如果无法得到唯一且明确的匹配项，请停止并询问我该怎么做。
5. 显示你准备交给 sql_execute 的确切 SQL 语句、工作区标识符、匹配到的记录
   和预期影响。暂时不要执行。
6. 等待我的明确确认。
7. 确认后，只调用一次 sql_execute。然后重新运行 sql_query，验证保存后的值，
   并把结果告诉我。
```

这样，三个决定始终清晰可见：使用哪个工作区、修改哪条记录，以及具体如何修改。验证应该是在修改后重新读取数据，而不是让 Claude 告诉你写入“大概已经成功”。

导入数据时也可以沿用同样的流程。先让 Claude 检查现有分类和疑似重复记录，预览准备插入的内容，再等待你的明确批准。执行获批的写入后，验证新增记录并核对最终余额。如果输入来自银行导出文件，[如何把银行账单导入记账工具](/blog/how-to-import-bank-statements-into-an-expense-tracker/)详细介绍了审核源文件的步骤。

## 处理财务数据时收紧连接器权限

MCP 省去了把密钥复制进聊天的步骤，但并不替你作判断。Anthropic 的[连接器安全指南](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)建议只连接受信任的服务器、检查请求的权限，并留意工具的输入和输出。

对于这个连接器，可以归纳成七条简单规则：

1. 确认 URL 完全是 `https://mcp.expense-budget-tracker.com/mcp`。
2. 默认只授予 `expenses:read`，除非计划中的任务确实需要修改数据。
3. 每次开始写入会话前都确认工作区。
4. 生成 SQL 前读取实时 schema。
5. 调用 `sql_execute` 前，审核确切语句和预期影响。
6. 写入后立即用 `sql_query` 验证结果。
7. 不再需要写入时，在 Claude 的工具控制中禁用 `sql_execute`，或在当前对话中禁用连接器。

不要为 `sql_execute` 选择 **Always allow**。当工具能够修改财务记录时，保留这道人工确认步骤很有必要。

财务备注和导入的描述只能作为数据，不能被当成指令。如果某笔交易中存储的文字要求 Claude 忽略你的规则或调用其他工具，不要照做。这也是为什么在大范围研究或分析期间，应当关闭写入权限。

连接前，请阅读 [Expense Budget Tracker 隐私政策](/privacy/)和 Anthropic 的数据处理条款。获得授权的 Claude 会话可以读取你账户下可访问的财务数据，并在拥有 `expenses:write` 时修改这些数据。远程连接会经过 Anthropic 的云和托管的 Expense Budget Tracker 服务；即使使用 Claude Desktop，它也不会变成仅在本地传输的数据路径。

## 不靠猜测排查连接问题

### 自定义连接器无法连接

先检查端点，必须是：

```text
https://mcp.expense-budget-tracker.com/mcp
```

不要换成网站 URL 或直接 API URL。Advanced 中的 OAuth Client ID 和 Client Secret 字段都应留空，并确认你拥有有效的 Expense Budget Tracker 账户。如果身份验证仍然失败，请在 **Customize > Connectors** 中断开服务后重新连接。

如果使用 Team 或 Enterprise Claude 账户，请询问 Owner 或 Primary Owner 是否已经为组织添加并允许使用该自定义连接器。普通成员无法自行完成组织级设置。

### Claude 显示连接器已添加，却没有使用

从 **+ > Connectors** 菜单为当前聊天启用 Expense Budget Tracker。然后在提示词中明确点名该连接器，并要求 Claude 从 `list_workspaces` 开始。配置好的连接器仍可能在某个对话中处于禁用状态。

### `sql_execute` 不可用或权限被拒绝

当前 OAuth 授权很可能只有 `expenses:read`，没有可选的 `expenses:write` scope。如果任务只涉及分析，保持现状即可。如果某个已经批准的具体任务确实需要修改数据，请重新连接，并在授予写入权限前仔细检查请求内容。

### 查询失败或返回的数据过多

再次调用 `get_schema`，根据返回的关系和列重新生成 SQL。查询必须限制在连接器允许的 SQL 范围内。面对较大的账本，应直接在 SQL 中计算总额、数量和分组结果，不要要求返回超过 100 行的结果。执行超过 20 秒的查询则需要进一步缩小范围。

### Claude 查看了错误的财务数据

先停止写入。调用 `list_workspaces`，比较返回的名称和标识符，明确确认目标工作区。然后为该工作区调用 `get_schema`，重新执行读取。虽然 Claude 只能访问当前登录用户有权使用的工作区，但仍然需要选中你真正想操作的那一个。

### Claude 要求你提供 `ApiKey`

这说明它走的是直接 HTTP 集成，而不是远程 MCP 连接器。此处应该回到连接器 URL 和浏览器 OAuth 流程。如果你本来就想使用终端自动化或直接发送 HTTP 请求，请改用 [Agent API 参考文档](/docs/api/)。

## 连接只需几步，真正重要的是审核闭环

将 Claude 接入 Expense Budget Tracker，只需要一个 URL 和一次浏览器登录。真正需要长期坚持的是之后的习惯：列出工作区、读取 schema、先查询、只授予必要权限，并让每次写入都具体到可以逐行审核。

先阅读完整的 [MCP 连接器文档](/docs/mcp-connector/)，在 **Customize > Connectors** 下添加 `https://mcp.expense-budget-tracker.com/mcp`，再进行一次只读的月度复盘。以后确实需要修改数据时，先让 Claude 显示工作区、记录、SQL 和预期影响，再决定是否批准。这样，这套 Claude 记账方案才不只是一个方便的演示，而会成为你真正可以信任的财务流程。

---
title: "如何用 AI 记录支出并管理预算"
description: "一份实用的 AI 个人财务指南。通过托管 MCP 或 Agent API 连接，让 AI 解析银行账单、为交易分类、记录支出并维护预算。"
date: "2026-03-05"
keywords:
  - "AI 记账"
  - "AI 预算管理"
  - "AI 支出管理"
  - "个人财务管理"
  - "Expense Budget Tracker"
  - "SQL API"
---

你大概已经在某种程度上把 AI 用到了个人财务上。也许你会把银行账单贴进 ChatGPT，请它帮你整理支出分类；或者截一张手机银行 App 的图发给 Claude，让它算一算这个月买菜花了多少钱。

这种做法偶尔用一次当然没问题。

但问题也很明显：答案只留在聊天记录里。数据没有真正保存，支出没有持续追踪，下周你还得从头再来。AI 看完你的资料，给你一段总结，然后事情就结束了。

更有用的方式，是别让 AI 只会“看图说话”，而是让它直接操作你的财务数据。让它把交易记进系统、更新预算、核对余额，而不是只在对话里分析一遍。

## 真正落地的“AI 记账”是什么样

[Expense Budget Tracker](https://expense-budget-tracker.com/zh/) 的创建者 Kirill Markin，已经连续五年多为自己的每一笔个人交易做分类。最早他完全手动记账，后来为了提速，逐步把工具搭了起来。现在这套流程的核心，是一个能通过 SQL API 直接访问数据库的 AI 助手。

他每周的流程大致是这样：先下载银行账单（CSV 或 PDF），再把文件交给 AI，让它逐笔解析并写入系统。因为 AI 已经能从历史记录里看出他的分类习惯，所以大多数交易都能自动归类。Kirill 只需要快速检查一遍，修正少量错误就可以结束。整个过程大约 10 分钟，而过去手工录入通常要花一个小时。

这套方法同样适用于很多 AI 工具，包括 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 和 [OpenAI Codex](https://openai.com/index/codex/)。支持 MCP 的客户端可以使用托管连接器并通过浏览器 OAuth 授权；终端智能体、脚本和其他 HTTP 客户端可以使用直接 Agent API 和长期有效的 `ApiKey`。两条路径都会访问同一套受限、按工作区隔离的财务数据接口。

## 怎么把 AI 接到你的财务数据上

[Expense Budget Tracker](https://expense-budget-tracker.com/zh/) 是一个基于 Postgres 的开源个人财务系统。它支持两种互补的连接方式：

1. **托管 MCP 连接器。** 在支持 MCP 的客户端中添加 `https://mcp.expense-budget-tracker.com/mcp`，并通过浏览器 OAuth 授权。随后，客户端使用带有权限范围的 OAuth 访问令牌调用读取工具和已批准的写入工具。服务器由 Expense Budget Tracker 托管，因此无需安装或持续运行本地 MCP 进程。请参阅 [MCP 连接器指南](/zh/docs/mcp-connector/)。
2. **直接 Agent API。** 对于终端智能体、脚本和直接 HTTP 客户端，请从 `GET https://api.expense-budget-tracker.com/v1/` 开始。发现响应会引导智能体完成邮箱 OTP 接入，并返回长期有效的 `ApiKey`。该密钥以 `Authorization: ApiKey <key>` 形式发送。读取使用 `POST /v1/sql/query`，已批准的写入使用 `POST /v1/sql/execute`。兼容端点 `POST /v1/sql` 仅保留给需要原子执行的多语句脚本。请参阅 [API 参考](/docs/api/)。

无论选择哪条路径，AI 都可以查询数据，并通过专用写入接口提交已批准的变更。直接 HTTP 读取请求如下：

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

成功响应是一个 JSON 封装对象。`data.statements` 为每条已执行语句提供一项记录；每项都包含 `rows`、`rowCount`、`returnedRowCount`、`totalRowCount` 和 `truncated`。`data` 还会提供已选择的 `workspace` 和当前 `limits` 上下文。

## 有了这个权限，AI 能帮你做什么

连接后，AI 操作的就是你的真实支出和预算数据，不是副本，不是摘要，而是正在使用的数据库本身：

**解析并记下支出。** 把银行账单（CSV、PDF，或者手机银行 App 的截图）交给 AI。它会读取每一行内容，识别金额、日期、交易对象和分类，然后向 `ledger_entries` 表写入 INSERT 语句。每一笔支出都会直接进入数据库。

**按你现有的分类习惯自动归类。** AI 会先查询你已经在用的分类。如果你过去几个月都把 “Whole Foods” 归到 “groceries”，它就会沿用这个判断。你不用每次都重新解释自己的记账规则。

**核对账户余额。** 当 AI 把一份账单里的支出录完后，它可以查询 `accounts` 视图，把系统中的余额和银行显示的数字对一遍。如果对不上，你就知道要么有交易漏记了，要么出现了重复记录。

**更新预算预测。** `budget_lines` 表里存的是月度预算计划，也就是每个月、每个分类的预期收入和计划支出。AI 可以读出本月实际发生的数据，和计划比较，再建议你调整下个月，或者直接替你更新。

**处理多币种。** 数据库会保留每笔交易的原始币种，汇率则每天从 ECB、CBR 和 NBS 获取。AI 不需要自己换算，数据库会在查询时完成币种计算。

这套数据结构本来就刻意做得简单直接：只有七张表，列名清楚，没有深层嵌套。正因为几乎没有容易误解的地方，AI 往往第一次就能写出正确的 SQL。

## 内置 AI 聊天，适合处理快速小任务

Expense Budget Tracker 的网页界面里也内置了 AI 助手。你在 Settings 中接入自己的 OpenAI 或 Anthropic API 密钥后，聊天窗口就会获得一个 `query_database` 工具，也就是应用内部使用的同一套 SQL 能力。

这对小任务很方便。比如你上传一张收据截图，让 AI 帮你新增一笔支出，确认一下就完成了。内置 AI 会按固定流程工作：先检查现有分类，看看有没有重复交易，核对余额，然后在你确认后才写入数据库。

如果你要处理更大的任务，比如批量导入多份银行账单、搭自动化流程，或者接入其他系统，那么外部 SQL API 会更实用。你可以在应用外用任何 AI 工具或脚本来调用它。

## 为什么托管 MCP 与直接 SQL 是互补方案

托管 MCP 服务器适合支持该协议的客户端。你只需添加一个 HTTPS 端点，通过浏览器 OAuth 授权，然后使用分开的读写工具。远程服务由 Expense Budget Tracker 运行，因此 MCP 不需要你在电脑上启动任何进程。

直接 Agent API 则是面向终端智能体、脚本、定时任务、仪表盘和自定义应用的通用 HTTP 路径。它通过发现和 OTP 流程签发长期有效的 `ApiKey`，分开的 SQL 端点明确区分读取与写入。

它们不是互相竞争的架构，而是同一套受限、按工作区隔离的数据接口上的两种传输方式。客户端支持远程连接器和浏览器 OAuth 时选择 MCP；直接 HTTP 更合适时选择 Agent API。

## 直接把数据库权限交给 AI，安全吗？

在合适的约束下，答案是安全的。Expense Budget Tracker 的 SQL API 做了多层保护：

每一条查询都会经过 Postgres Row Level Security。API 密钥绑定的是你的用户和工作区，所以 AI 只能看到并修改你的数据，碰不到别人的内容。

接口只允许数据操作，也就是 `SELECT`、`INSERT`、`UPDATE`、`DELETE`。AI 不能建表、删表或改权限。主查询和执行端点每次只接受一条语句；兼容端点 `/v1/sql` 只接受受限的原子脚本。像 `set_config()` 这种可能带来权限提升风险的调用，也被明确禁止。

API 密钥在数据库里只保存 SHA-256 哈希，明文不会落库。你也可以随时在 Settings 里撤销密钥。如果你把某个工作区成员移除，对方的所有密钥也会自动删除。

接口还有速率限制：每个密钥每秒最多 10 次请求、每天最多 10,000 次。每次 SQL 请求的总时限为 25 秒，最多返回 100 行，也最多影响 100 行。这些限制对 AI 记账和预算管理来说绰绰有余，同时也能防止请求失控。

## 让 AI 记账更顺手的几个实用建议

下面这些经验，能让整套流程顺畅很多：

**保持分类名称一致。** AI 是从你已有的数据里学习的。如果你有时写 “restaurants”，有时又写 “dining out”，它就容易判断失准。每个分类尽量只保留一个固定名称。

**每周核对一次余额。** AI 导入完账单后，把系统里的账户余额和银行数字对一遍。这样能尽早发现漏记或重复交易，避免误差越滚越大。

**先从一个账户开始。** 不要第一天就把所有银行卡、信用卡和投资账户一起接进来。先从最常用的活期账户开始，跑上几周，等流程稳定了再慢慢加。

**每次都检查 AI 的分类结果。** AI 通常能分对大多数交易，但遇到新商户或不常见的支出时，还是可能出错。花五分钟过一遍很值得。你越早纠正，下次它读到的数据就越准确。

**不要只记账，也要维护预算表。** 记录已经花掉的钱当然有价值，但更大的价值来自一份滚动 12 个月的预算表：行是分类，列是月份，未来月份填的是预测。AI 很擅长根据实际支出模式更新这些预测。你可以让它在看完本月数据后，顺手把下个月的预算也调整好。

## 如何开始

1. 在 [expense-budget-tracker.com](https://expense-budget-tracker.com/zh/) 注册使用（免费、开源），或者[自行部署](https://github.com/kirill-markin/expense-budget-tracker)
2. 对于 MCP，在兼容客户端中添加 `https://mcp.expense-budget-tracker.com/mcp`，并通过浏览器 OAuth 授权
3. 对于直接 HTTP，把 `GET https://api.expense-budget-tracker.com/v1/` 交给智能体，并在它询问时完成邮箱 OTP 流程
4. 把一份银行账单交给已连接的智能体，让它帮你解析并记录支出

AI 会先识别你的数据库结构，匹配你已有的分类，然后开始写入交易。你只需要检查结果，修正少数不对的地方，很快就能跑起一套真正由 AI 协助维护的预算系统。

Kirill Markin 还专门写过一篇更详细的方法文章：[How I Use AI to Handle My Expenses from Bank Accounts and Budget](https://kirill-markin.com/articles/ai-expense-tracking-bank-accounts-budget/)。五年里，他持续为每一笔交易做分类和追踪，这套方法也在多个国家、多个币种的真实使用场景里验证过。

这个工具采用 MIT 许可证，完整开源在 [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)。你可以直接使用托管版，也可以自己部署，SQL API 在两种方式下都完全一致。

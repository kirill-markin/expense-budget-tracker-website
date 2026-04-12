---
title: "如何使用 AI 追踪支出并管理预算"
description: "一份实用的 AI 个人财务指南。把 API key 交给你的 AI 代理，它就能解析银行账单、给交易分类、追踪支出并管理你的预算，而且这一切都可以通过 SQL API 完成。"
date: "2026-03-05"
keywords:
  - "AI 记账"
  - "AI 预算管理"
  - "AI 支出追踪"
  - "个人财务 AI"
  - "SQL API 记账"
  - "Expense Budget Tracker API"
---

你大概已经以某种形式把 AI 用在个人财务上了。也许你会把一份银行账单贴进 ChatGPT，请它帮你给支出分类；或者你会截一张银行 App 的图，发给 Claude，让它算算这个月杂货到底花了多少。

这种方法能用一次。

但答案会留在聊天里。没有任何东西被保存下来，没有任何东西真正被追踪，下周你还得再来一遍。AI 读了你的数据，给了你一段总结，然后就结束了。

其实还有一种更有用的方式来做 AI 记账。与其让 AI 只会分析截图，不如直接给它写入你财务数据库的权限。让 AI 直接记录交易、更新预算、核对余额，而不是只会和你“讨论”这些事。

## 实际可用的“AI 记账”到底是什么样

[Expense Budget Tracker](https://expense-budget-tracker.com/zh/) 的作者 Kirill Markin 已经给自己的每一笔个人交易做分类超过五年。最开始他完全手工记，后来开始不断做工具让这件事更快。现在这套系统已经演变成：由一个 AI 代理通过 SQL API 直接连接数据库。

他每周的流程大致是这样的：下载银行账单（CSV 或 PDF），把文件扔给 AI 代理，让代理解析每一笔交易并写入系统。代理已经从过去的数据里知道他的分类习惯，所以大多数交易都能自动匹配。Kirill 再审核一下 AI 做了什么，修正少数错误，然后结束。整个过程大约 10 分钟，而不是过去手工录入时的一小时。

同样的方式可以和 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)、[OpenAI Codex](https://openai.com/index/codex/)、自定义 GPT，或者任何能调用 HTTP 接口的 AI 代理配合使用。关键不在插件，也不在浏览器扩展，而在于：给 AI 一个真正能读写财务数据的数据库入口。

## 如何把 AI 代理接入你的财务系统

[Expense Budget Tracker](https://expense-budget-tracker.com/zh/) 是一个基于 Postgres 的开源个人财务系统。它提供 `POST /v1/sql` 这个 SQL API 端点，可以通过 HTTP 接收 SQL 查询，并返回 JSON 结果。

要把任何 AI 代理接入进来，你只需要：

1. 打开应用，进入 **Settings → API Keys → Create key**
2. 复制这把 key（以 `ebt_` 开头，而且只会显示一次）
3. 把两件事告诉你的 AI 代理：API endpoint URL 和这把 key

就这么简单。

现在这个代理就可以查询并修改你的支出数据了。不需要启动 MCP server，不需要安装插件，也不需要维护额外的自定义集成。任何能发 HTTP POST 请求的 AI 都能直接工作。

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

响应会直接返回一个 JSON 行数组。没有分页 token，没有深层嵌套对象，也不需要额外 SDK。

## AI 代理拿到这个权限之后能做什么

有了 API key，AI 代理处理的就是你的真实支出和预算数据，不是副本，不是摘要，而是正在运行的数据库本身：

**解析并记录支出。** 把一份银行账单（CSV、PDF，或者银行 App 的截图）交给 AI 代理。代理会读每一行，识别金额、日期、对手方和分类，然后向 `ledger_entries` 表写入 INSERT 语句。每一笔支出都会直接进入你的数据库。

**根据现有分类给交易自动分类。** 代理会先查询你当前已有的分类。如果你已经连续几个月把 “Whole Foods” 归为 “groceries”，AI 会学到这个习惯，下次继续这么做。你不必每次从头解释自己的系统。

**核对账户余额。** 当 AI 把一份账单里的支出录完之后，它可以查询 `accounts` 视图，把系统里的余额和银行显示的数字对比。如果对不上，你就知道要么有交易漏了，要么有重复。

**更新预算预测。** `budget_lines` 表存的是你的月度预算计划：每个月、每个分类的预期收入和计划支出。AI 可以读这个月的实际数据，拿它和计划比较，再建议你调整下个月，或者直接帮你更新。

**处理多币种。** 数据库中的每一笔交易都会保留原始币种。汇率每天从 ECB、CBR 和 NBS 抓取。AI 不需要自己做换算，数据库会在查询时完成币种计算。

这套 schema 被刻意设计得扁平、直接：七张表，列名清楚，没有深层嵌套。AI 模型之所以经常能第一次就写对 SQL，很大程度上就是因为它几乎没什么可以误解的地方。

## 内置 AI 聊天，适合快速小任务

Expense Budget Tracker 也在 Web 界面里内置了 AI 助手。你在 Settings 里接上自己的 OpenAI 或 Anthropic API key 后，聊天窗口就会获得一个 `query_database` 工具，也就是在应用内部使用的同一套 SQL 能力。

这对快速任务很方便：上传一张收据截图，让 AI 把它加成一笔支出，确认一下，结束。内置 AI 会严格按协议工作：先检查你已有的分类，查看是否有重复交易，核对余额，再在你批准后写入数据库。

如果是更大的任务，比如批量处理多份银行账单、搭建自动化工作流，或者接入其他系统，那么外部 SQL API 会更实用。你可以在应用外用任何代理或脚本调用它。

## 为什么直接用 SQL，比 MCP server 和插件更合适

现在大家很喜欢用 MCP server、自定义 GPT actions 或供应商专属插件来把 AI 接到外部工具上。但对于个人财务，这通常只是平添几个活动部件。

MCP server 是你必须额外启动并保持存活的一个进程。它崩了，AI 在对话中途就会失去对财务数据的访问。自定义 GPT 插件只在 ChatGPT 里有效；如果你换去 Claude，或者自己写代理，它们就没意义了。供应商专属集成则会随着平台 API 调整而不断坏掉。

而 SQL API 避开了这一切。接口就是一个 HTTP endpoint，加上一门叫 SQL 的语言。这两样东西都已经存在几十年了，不会轻易消失。你把 AI 模型从一个提供商换到另一个提供商，还是同一把 API key、同一个 endpoint、同一套 SQL。AI 代理根本不在乎自己跑在 ChatGPT、Claude Code，还是你自己写的 Python 脚本里。

## 直接给 AI 数据库权限，安全吗？

在合适的约束下，答案是安全的。Expense Budget Tracker 的 SQL API 内建了多层保护：

每条查询都会经过 Postgres Row Level Security。API key 绑定到你的用户和 workspace，所以 AI 只能看到和修改你的数据，别人的数据它碰不到。

只允许数据操作：`SELECT`、`INSERT`、`UPDATE`、`DELETE`。AI 不能建表、删表、改权限，也不能在同一个请求里塞多条语句。`set_config()` 这种可能引发权限提升的调用也被明确禁止。

API key 以 SHA-256 哈希保存，明文不会落进数据库。你可以随时在 Settings 里撤销 key。如果你把某个 workspace 成员移除，对方所有 keys 也会自动删除。

接口还有限流：每个 key 每秒最多 10 次请求、每天最多 10,000 次。查询超时 30 秒。每次最多返回 100 行。这些限制对 AI 记账和预算管理来说完全够用，但也足以拦住失控行为。

## 让 AI 记账更顺手的几个实践建议

基于真实使用经验，有几件事会明显让这套流程更顺：

**保持分类名字一致。** AI 是从你已有数据里学的。如果你有时叫 “restaurants”，有时又叫 “dining out”，代理会开始困惑。每个分类尽量只保留一个名字。

**每周核对一次余额。** AI 从账单导入完支出后，把系统里的账户余额和银行对一遍。这样能尽早抓出漏记或重复交易，而不是让误差越积越大。

**先从一个账户开始。** 不要试图第一天就把所有银行卡、信用卡和投资账户都接进来。先从你的主活期账户开始，跑几周，等流程稳定了再加别的。

**每次都审核 AI 的分类。** AI 往往能分对大多数交易，但偶尔还是会在新商户或异常支出上分错。花五分钟过一遍。你纠正得越早，下次它查询到的就是更正确的数据。

**不要只做记账，也要用预算表。** 只记录已经花掉的钱当然有价值，但真正更大的价值在于维护一份滚动 12 个月的预算：行是分类，列是月份，未来月份放的是预测。AI 很擅长根据实际支出模式去更新这些预测。你可以让代理在看完这个月的实际情况后，顺手帮你调整下个月。

## 如何开始

1. 在 [expense-budget-tracker.com](https://expense-budget-tracker.com/zh/) 注册（免费、开源），或者[自行托管](https://github.com/kirill-markin/expense-budget-tracker)
2. 进入 **Settings → API Keys → Create key**，复制 API key
3. 把 key、workspace ID 和 endpoint（`https://api.expense-budget-tracker.com/v1/sql`）交给你的 AI 代理
4. 把一份银行账单扔给代理，让它帮你解析并记录支出

AI 会先看你的数据库 schema，匹配你已有的分类，然后开始写入交易。你审核它的结果，修正不对劲的地方，很快就能得到一套真正由 AI 维护的预算系统。

Kirill Markin 还更详细地写过他自己的方法论：[How I Use AI to Handle My Expenses from Bank Accounts and Budget](https://kirill-markin.com/articles/ai-expense-tracking-bank-accounts-budget/)。他已经持续五年给每一笔交易做分类和追踪，跨多个币种和国家验证过的真实工作流，和这篇文章说的是同一件事。

这个工具采用 MIT 许可证，完整开源在 [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)。你可以直接用托管版，也可以自己部署，SQL API 两边都一样。

---
title: "如何用 Claude Code 追踪支出并管理预算"
description: "把 Claude Code 配置成你的个人财务助手。只需给它一个发现地址，完成邮箱验证码流程并保存返回的 ApiKey，它就能在终端里解析账单、核对余额并维护预算。"
date: "2026-03-05"
keywords:
  - "Claude Code 记账"
  - "Claude Code 预算管理"
  - "AI 支出追踪"
  - "终端记账助手"
  - "Expense Budget Tracker API"
  - "Claude Code 财务助手"
---

Claude Code 是 Anthropic 的终端 AI 代理。它能读取文件、编写代码、执行命令，也能直接发起 HTTP 请求。大多数人把 Claude Code 用在软件开发上，但只要把它接到一个设计清晰、面向机器的记账 API 上，它同样很适合处理个人财务。

这套思路很直接：让 Claude Code 通过机器 API 连接到一个开源支出追踪系统，它就会变成一个住在你终端里的个人财务助手。你把银行账单交给它，它可以帮你录入交易、核对余额、更新预算，整个过程都通过自然语言完成。不用反复点网页，也不用手工录入一堆数据。

## 为什么 Claude Code 特别适合记账

Claude Code 和 ChatGPT 或 Claude 网页版相比，有几个对个人财务尤其重要的差异：

**它在本地运行，能直接读取你的文件。** 你下载的银行账单无论是 CSV 还是 PDF，Claude Code 都可以直接从本地文件系统读取。不需要上传，不需要复制粘贴，也不需要先截屏。你只要说“解析 `~/Downloads/chase-march-2026.csv` 这份银行账单”，Claude Code 就会自己去读。

**它不仅会建议命令，还能真的执行。** Claude Code 不会只给你一条 `curl` 命令让你自己跑；它会自己写 SQL、发 HTTP 请求、检查返回结果。如果它要向你的支出数据库写入 50 条交易，整个过程都能在同一段对话里完成。

**它能在不同会话之间复用你的配置。** 只要返回的 ApiKey 没有只留在聊天记录里，而是保存在更持久的位置，Claude Code 后续会话就能继续使用同一条连接，不必每次都重新走邮箱验证码流程。

**它处理本地文件时可以先离线完成准备工作。** 如果你想先清洗 CSV、预处理银行导出的怪格式，或者写一个导入脚本，Claude Code 都可以先在本地把这些步骤做完，再决定何时调用 API。

## 如何把 Claude Code 配置成个人财务助手

你需要两样东西：一个提供机器 API 的记账系统，以及一个能持久保存 Claude Code 登录后拿到的长期密钥的位置。

[Expense Budget Tracker](https://expense-budget-tracker.com/zh/) 是一个基于 Postgres 的开源个人财务系统。它的标准发现端点是 `GET https://api.expense-budget-tracker.com/v1/`。你可以直接注册托管版，也可以[自行托管](https://github.com/kirill-markin/expense-budget-tracker)。

### 第一步：把发现地址交给 Claude Code

告诉 Claude Code 用这个地址连接：

```text
https://api.expense-budget-tracker.com/v1/
```

Claude Code 应该先读取发现响应，然后向你询问：

- 你的账户邮箱
- 发到收件箱里的 8 位验证码

验证码校验成功后，服务会返回一个长期可用的密钥，实际格式类似 `ebta_...`。

### 第二步：把返回的密钥保存在聊天记录之外

登录流程虽然方便，但这个密钥仍然需要放到一个更持久的位置。后端会明确提醒代理：不要只依赖聊天历史来记住它。

一种简单做法是：

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="ebta_your_key_here"
```

如果你希望 Claude Code 把它写入本地 `.env` 文件，最好明确授权。否则就先把它放在当前 shell 会话里，再由你自己保存到长期位置。

### 第三步：把默认工作区保存一次

Claude Code 验证完验证码后，应该先读取你的账户信息和工作区列表：

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

然后为这个 key 保存一次默认工作区：

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace-id/select \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

这样一来，之后调用 `/v1/sql` 时就不需要再传 `X-Workspace-Id`。如果你的账户里恰好只有一个工作区，API 第一次使用时也会自动帮这个 key 保存并选中它。

### 第四步：补一份本地说明文件，告诉 Claude Code 你的习惯

只要提前告诉 Claude Code 你的分类、账户和操作规则，它的表现会稳定得多。本地放一份 `CLAUDE.md` 很适合做这件事。

下面这段 `CLAUDE.md` 示例刻意保留英文，方便你直接复制到本地使用：

```markdown
# Personal Finance

## Expense Tracker API

- Endpoint: https://api.expense-budget-tracker.com/v1/sql
- Auth: ApiKey in Authorization header
- API key is in the EXPENSE_BUDGET_TRACKER_API_KEY environment variable
- Default workspace is already saved for this key
- Request: POST with JSON body {"sql": "your query"}
- Response: {"rows": [...], "rowCount": N}

## My expense categories

Income: salary, freelance, side-projects
Fixed: rent, utilities, insurance, subscriptions
Daily: groceries, dining-out, transport, coffee
Lifestyle: clothing, entertainment, healthcare, travel
Planning: taxes, big-purchases, savings, emergency-fund

## My accounts

- chase-checking (USD) — main checking account
- wise-eur (EUR) — European account
- cash-usd (USD) — cash

## Rules

- Always check existing categories before inserting transactions
- After importing, verify account balances match the bank
- Use the exact category names listed above
- Store transactions in their original currency
```

### 第五步：打开 Claude Code，开始处理财务

```bash
cd ~/finances
claude
```

Claude Code 会读取你的本地说明，复用已经保存好的 ApiKey，然后立刻就能开始工作。

## 用 Claude Code 解析银行账单

这正是 Claude Code 最有优势的场景。下载好银行账单后，直接让它处理：

```text
我把 Chase 的账单下载到了 ~/Downloads/chase-march-2026.csv。
请解析它，并把所有交易记录到我的 chase-checking 账户里。
```

Claude Code 会：

1. 从你的文件系统读取这份 CSV
2. 解析每一行里的日期、金额和描述
3. 按照 `CLAUDE.md` 里的分类规则给交易归类
4. 为 `ledger_entries` 表生成 `INSERT` 语句
5. 通过 SQL API 把这些记录写进去
6. 告诉你它实际录入了哪些内容

你只需要审核结果，把分错类的交易指出来让它改掉，就完成了。原本要花不少时间手工录入的一个月交易，几分钟就能处理完。

如果你拿到的是 PDF 账单，或者只是银行 App 的截图，方法也一样。Claude Code 可以读取图片和 PDF，抽取其中的交易数据，再按同样的方式写入系统。

## 核对余额，尽快抓出错误

导入交易之后，始终都应该检查数字是否对得上：

```text
检查一下我的账户余额，并和银行里看到的数字对比：
chase-checking 应该是 $4,230.15
wise-eur 应该是 €1,847.50
```

Claude Code 会通过 SQL API 查询 `accounts` 视图，把系统里的余额和你给出的银行数字逐项比较，并标出任何差异。假设 `chase-checking` 显示的是 $4,180.15，而不是 $4,230.15，Claude Code 还可以继续帮你追那缺少的 50 美元，看看是不是有一笔交易漏记了，或者被重复计算了。

这种每周一次的余额核对，是个人财务里最重要的习惯之一。Expense Budget Tracker 的作者 Kirill Markin 已经持续给自己的每一笔个人交易分类超过五年，而这项核对他每周都做。正因为如此，数据才能在长期里保持可信。

## 直接向 Claude Code 提问你的支出情况

只要支出数据已经进了数据库，Claude Code 就能通过生成 SQL 回答各种财务问题：

```text
我过去 3 个月在外食上花了多少钱？
```

```text
这个月支出最高的 5 个分类是什么？
```

```text
把上周所有超过 100 美元的交易列出来。
```

```text
过去 6 个月里，我每月在杂货上的平均支出是多少？
```

Claude Code 会写出 SQL，通过 API 执行，再用自然语言把结果解释给你。你并不需要自己会写 SQL，但你随时都可以要求它展示查询语句，确认逻辑是否正确，或者让它调整条件。

## 用 Claude Code 管理预算预测

记账是在记录已经发生的事，预算是在规划接下来会发生什么。这两件事可以放在同一个数据库里完成。

`budget_lines` 表存的是你的月度预算预测，也就是每个月、每个分类的预期收入和计划支出。你可以直接让 Claude Code 来维护它：

```text
帮我设置 2026 年 4 月的预算：
- groceries: $400
- dining-out: $200
- rent: $2,100
- salary income: $8,500
其他内容都沿用 3 月的预算。
```

Claude Code 会先读取 3 月的预算项，再创建 4 月的记录，并把你的调整写进去。这样你就得到了一份可以在网页界面里滚动查看的 12 个月预测。

一个很好用的月度习惯是：每个月结束时，打开 Claude Code，然后这样说：

```text
比较一下我这个月的实际支出和预算。
凡是超出预算 20% 以上的分类，
都把下个月的预测调得更贴近现实一点。
```

Claude Code 会从 `ledger_entries` 里读取实际支出，把它和 `budget_lines` 里的计划逐项对比，再更新下个月的预测。手工做这种分析通常要花 30 分钟，而用 Claude Code 往往 2 分钟就够了。

## 处理多币种也很自然

如果你有多个币种的账户，Claude Code 也能很自然地处理。Expense Budget Tracker 会把每笔交易保留在原始币种里，并且每天从 ECB、CBR 和 NBS 获取汇率。

```text
我昨天收到了 €2,500 的自由职业收入，打进了 wise-eur。
把它记为 income，分类是 freelance。
```

Claude Code 会写出包含 `currency: 'EUR'` 和正确金额的 `INSERT` 语句。之后如果你问“我这个月的总收入折合 USD 是多少？”，数据库会在查询时完成汇率换算，Claude Code 只需要把结果告诉你。

## 这是网页界面很难替代的能力

Claude Code 在个人财务上的真正优势，是把文件访问、HTTP 请求和自然对话放进了同一个工具里：

**批量处理。** 把五份来自不同账户的银行账单扔进同一个文件夹，然后让 Claude Code 一次性处理。它会逐个读取文件，把交易写到正确的账户里，并在最后统一核对余额。换成普通网页界面，这通常意味着一小时以上的重复点击。

**自定义分析。** “过去一年里哪个月份的娱乐支出最高？其中金额最大的几笔交易是什么？” 很少有预算 App 会为这种问题专门做一个按钮，但 Claude Code 可以自己写 SQL、执行查询，再把结果解释给你听。

**格式转换。** 你的银行导出的 CSV 列很怪，日期还是欧洲格式？可以先让 Claude Code 在本地清洗文件，再导入干净版本。

**写脚本。** 你甚至可以让 Claude Code 顺手给你写一个以后能重复使用的脚本：“写一个脚本，把 Chase CSV 导入并记录所有交易，保存为 `~/finances/import-chase.py`。” 下次你就可以直接运行脚本，无论是否还需要 Claude Code 参与。

## Claude Code 实际操作的数据库结构

Expense Budget Tracker 的机器 API 暴露了一组很适合 AI 代理使用的关系，允许访问的范围由 `GET /v1/schema` 公布。

| 表 | 用途 |
|---|---|
| `ledger_entries` | 每一笔收入和支出交易 |
| `budget_lines` | 预算计划：每月、每个分类的金额 |
| `budget_comments` | 针对特定预算单元格的备注 |
| `exchange_rates` | 每日汇率（自动抓取） |
| `workspace_settings` | 报表币种偏好 |
| `account_metadata` | 账户流动性分类 |
| `accounts` | 视图：各账户的滚动余额 |

`ledger_entries` 这张表的列也很直观：`event_id`、`ts`、`account_id`、`amount`、`currency`、`kind`、`category`、`counterparty`、`note`。列名本身已经把含义表达得很清楚，所以 Claude Code 往往第一次就能写出正确的 `INSERT` 语句。

## 安全性和访问控制

在 SQL API 的这些约束下，把 Claude Code 接到你的支出数据库上是安全的：

每一条查询都会经过 Postgres Row Level Security。API key 既绑定到你的用户身份，也绑定到当前选中的工作区，所以即使数据库是共享部署的，Claude Code 也只能看到你的数据。

每个请求只允许一条语句。支持的类型只有 `SELECT`、`WITH`、`INSERT`、`UPDATE` 和 `DELETE`。Claude Code 不能建表、不能删表、不能套事务、不能调用 `set_config()`，也不能发送 SQL 注释或带引号的标识符。这些限制都由 SQL API 在服务端强制执行，不取决于 Claude Code 想发什么。

API key 以 SHA-256 哈希形式保存，明文不会进入数据库。你之后也可以在产品里撤销这个密钥。接口还有限流：每秒 10 个请求、每天 10,000 个请求、超时 30 秒，而且每次响应最多返回 100 行。

密钥始终保存在你的本地环境变量里。Claude Code 发请求时从 `$EXPENSE_BUDGET_TRACKER_API_KEY` 读取它，不需要把它提交到项目代码里。

## 进阶方案：跳过代理原生登录，直接发 HTTP 请求

如果你已经有一个长期可用的 Expense Budget Tracker ApiKey，Claude Code 也可以跳过邮箱验证码流程，直接使用现成密钥。此时调用的仍然是同一组端点：

- `GET /v1/openapi.json`：获取机器可读的 OpenAPI 规范
- `GET /v1/schema`：查看允许访问的关系
- `POST /v1/sql`：执行实际查询

这更适合稳定运行的脚本或已经预配置好的环境，但对大多数人来说，发现地址加邮箱验证码流程仍然是最省事的接入方式。

## 一个真实工作流：每周 10 分钟完成记账

Kirill Markin 多年来一直按这套流程运行，大致就是这样一段每周例行操作：

1. 从所有账户下载银行账单（2 分钟）
2. 打开 Claude Code，让它处理这些文件（3 分钟，主要是 Claude Code 在执行）
3. 审核录入结果，修正少数分类错误（3 分钟）
4. 让 Claude Code 核对所有账户余额是否和银行一致（1 分钟）
5. 如果刚好到月底，再让 Claude Code 比较实际支出和预算，并更新预测（2 分钟）

差不多 10 分钟，你就能得到一份完整的财务视图：每一笔交易都已分类，每个余额都已核对，预算也已经更新。这个系统之所以有效，是因为那些枯燥但耗时的部分，例如解析、分类、写入和计算，正好都是 Claude Code 擅长的；而真正需要判断的部分，例如审核分类、决定预算如何调整，仍然由你来拍板。

## 开始使用 Claude Code 和 Expense Budget Tracker

1. 如果你还没安装，先[安装 Claude Code](https://docs.anthropic.com/en/docs/claude-code)
2. 在 [expense-budget-tracker.com](https://expense-budget-tracker.com/zh/) 注册，或者[自行托管](https://github.com/kirill-markin/expense-budget-tracker)这个应用
3. 把 `https://api.expense-budget-tracker.com/v1/` 交给 Claude Code
4. 完成邮箱验证码流程，并把返回的 key 保存为 `EXPENSE_BUDGET_TRACKER_API_KEY`
5. 为这个 key 保存一个默认工作区
6. 写一份本地 `CLAUDE.md`，记录你的分类、账户和工作规则
7. 在你的财务目录里打开 Claude Code，导入第一份银行账单

Claude Code 会先检查 schema、匹配你的分类，然后开始记录交易。你只需要审核结果，修正不对劲的地方，就能很快搭起一套运行在终端里的 AI 记账流程。

Expense Budget Tracker 采用 MIT 许可证，并以完全开源的形式发布在 [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)。Claude Code 的产品说明见 [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code)。这两款工具都可以低成本开始使用。

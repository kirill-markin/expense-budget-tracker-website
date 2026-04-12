---
title: "如何用 Claude Code 追踪支出并管理预算"
description: "把 Claude Code 配置成你的个人财务助手。只要给它一个发现 URL，让它完成邮箱验证码流程并保存返回的 ApiKey，它就能在终端里解析账单、核对余额并管理你的预算。"
date: "2026-03-05"
keywords:
  - "Claude Code 记账"
  - "Claude Code 预算管理"
  - "AI 支出追踪"
  - "终端记账助手"
  - "Expense Budget Tracker API"
  - "Claude Code 财务助手"
---

Claude Code 是 Anthropic 的终端 AI 代理。它可以读文件、写代码、执行命令，也可以发起 HTTP 请求。大多数人用 Claude Code 做软件开发，但如果你把它接到一个拥有干净机器 API 的记账系统上，它同样很适合处理个人财务。

这套配置的核心思路是：把 Claude Code 通过机器 API 连接到一个开源记账工具上，它就会变成一个生活在终端里的个人财务助手。把银行账单扔给它，让 Claude Code 帮你记录交易、核对余额、更新预算，全程都通过自然对话完成。不用点一堆界面，也不用手动录入数据。

## 为什么 Claude Code 很适合用来记账

Claude Code 和 ChatGPT 或 Claude 网页版有几个对个人财务很重要的区别：

**它在本地运行，可以直接读取你的文件。** 当你下载了一份 CSV 或 PDF 银行账单时，Claude Code 可以直接从你的文件系统里读取它。不用上传，不用复制粘贴，也不用先转截图。你只要说“解析 `~/Downloads/chase-march-2026.csv` 这份银行账单”，Claude Code 就会去读这个文件。

**它可以执行代码和 HTTP 请求。** Claude Code 不只是告诉你该怎么写一条 `curl` 命令，它会直接去执行它。当它需要往你的记账数据库里插入 50 条交易时，它会写出 SQL、发出 HTTP 请求，然后确认结果。整个流程都在同一段对话里完成。

**它可以跨会话记住你的配置。** 只要返回的 ApiKey 被保存在聊天记忆之外，Claude Code 之后的会话就可以复用同一条连接，而不必每次都重复邮箱验证码流程。

**它能在处理本地文件时离线工作。** 如果你想先预处理银行账单、清洗 CSV 格式或写导入脚本，Claude Code 都可以先在本地完成这些事，再决定是否调用 API。

## 如何把 Claude Code 配置成个人财务助手

你需要两样东西：一个带机器 API 的记账系统，以及一个能长期保存 Claude Code 登录后拿到的密钥的位置。

[Expense Budget Tracker](https://expense-budget-tracker.com/zh/) 是一个基于 Postgres 的开源个人财务系统。它的标准发现端点是 `GET https://api.expense-budget-tracker.com/v1/`。你可以直接注册托管版，也可以[自行托管](https://github.com/kirill-markin/expense-budget-tracker)。

### 第一步：把发现 URL 交给 Claude Code

告诉 Claude Code 使用这个地址连接：

```text
https://api.expense-budget-tracker.com/v1/
```

Claude Code 应该先读取发现响应，然后再向你询问：

- 你的账户邮箱
- 收件箱里收到的 8 位验证码

验证码验证成功后，服务会返回一个长期可用的密钥，真实格式类似 `ebta_...`。

### 第二步：把返回的密钥保存在聊天记忆之外

这个登录流程很方便，但密钥仍然需要被保存到一个更持久的地方。后端会明确告诉代理：不要只依赖聊天历史。

一个简单做法是：

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="ebta_your_key_here"
```

如果你希望 Claude Code 把它写入本地 `.env` 文件，最好明确批准。否则就先把它放在当前 shell 会话里，并由你自己保存到一个长期位置。

### 第三步：把 workspace 默认值保存一次

Claude Code 验证完验证码后，应该先加载你的账户和 workspaces：

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

接着，把默认 workspace 为这个 key 保存一次：

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace-id/select \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

这样之后调用 `/v1/sql` 时就可以省略 `X-Workspace-Id`。如果你的账户里只有一个 workspace，API 第一次使用时也会自动为这个 key 保存并使用它。

### 第四步：为自己的习惯加一份本地说明文件

Claude Code 在你把分类、账户和操作规则提前告诉它之后，会工作得更稳定。一份本地 `CLAUDE.md` 很适合做这件事：

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

### 第五步：打开 Claude Code，开始工作

```bash
cd ~/finances
claude
```

Claude Code 会读取你的本地说明，复用已经保存好的 ApiKey，然后马上开始工作。

## 用 Claude Code 解析银行账单

这正是 Claude Code 最擅长的部分。下载好银行账单后，直接告诉它去处理：

```text
我把 Chase 的账单下载到了 ~/Downloads/chase-march-2026.csv。
请解析它，并把所有交易记录到我的 chase-checking 账户里。
```

Claude Code 会：

1. 从你的文件系统中读取 CSV 文件
2. 解析每一行：日期、金额、描述
3. 根据 `CLAUDE.md` 里已有的分类为交易匹配类别
4. 为 `ledger_entries` 表生成 INSERT 语句
5. 通过 SQL API 发送这些请求
6. 告诉你它到底记录了什么

你只需要审核输出，指出那些分错类的交易让它修正，就完成了。原本一个月的银行交易，需要手工输入很久；现在几分钟就能跑完。

如果是 PDF 账单或银行 App 的截图，方法也一样。Claude Code 可以读取图片和 PDF，抽取其中的交易数据，再用同样的方式写进系统。

## 核对余额并抓出错误

导入完交易后，始终都应该验证数字是否对得上：

```text
检查一下我的账户余额，并和银行里看到的数字对比：
chase-checking 应该是 $4,230.15
wise-eur 应该是 €1,847.50
```

Claude Code 会通过 SQL API 查询 `accounts` 视图，拿余额去比较，并把任何差异标出来。如果你的 `chase-checking` 显示的是 $4,180.15 而不是 $4,230.15，Claude Code 还能继续帮你追那少掉的 50 美元，看看是不是有一笔交易漏了或者被重复算了。

这种每周做一次的余额核对，是个人财务里最重要的习惯之一。Expense Budget Tracker 的作者 Kirill Markin 已经持续给自己的每一笔个人交易做分类超过五年，而这项核对，他每周都做。正是它让数据在长期里仍然值得信任。

## 直接向 Claude Code 询问你的支出

当你的支出数据已经进了数据库，Claude Code 就可以通过写 SQL 回答各种财务问题：

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

Claude Code 会写出 SQL、通过 API 执行，然后用自然语言把结果告诉你。你不需要自己会写 SQL，但你始终可以要求它展示查询语句、确认逻辑是否合理，或者手动调整条件。

## 用 Claude Code 管理预算预测

记账是在记录已经发生的事，预算是在规划接下来会发生什么。这两者生活在同一个数据库里。

`budget_lines` 表存的是你的月度预算预测：每个月、每个分类的预期收入和计划支出。你也可以直接通过 Claude Code 管理它：

```text
帮我设置 2026 年 4 月的预算：
- groceries: $400
- dining-out: $200
- rent: $2,100
- salary income: $8,500
其他内容都沿用 3 月的预算。
```

Claude Code 会先读取 3 月的预算项，再创建 4 月的记录并写入你的调整。于是你会得到一份可以在 Web 界面里滚动浏览的 12 个月预测。

一个很好用的月度习惯是：每个月结束时，打开 Claude Code，然后这样说：

```text
比较一下我这个月的实际支出和预算。
凡是超出预算 20% 以上的分类，
都把下个月的预测调得更贴近现实一点。
```

Claude Code 会从 `ledger_entries` 里读取实际支出，把它们与 `budget_lines` 中的计划对比，再把下个月的预测更新掉。手工做这种分析通常要 30 分钟，而用 Claude Code 往往 2 分钟就够了。

## 处理多币种

如果你有多个币种的账户，Claude Code 也能很自然地处理。记账系统会把每笔交易保留在原始币种里，并每天从 ECB、CBR 和 NBS 拉取汇率。

```text
我昨天收到了 €2,500 的自由职业收入，打进了 wise-eur。
把它记为 income，分类是 freelance。
```

Claude Code 会写出包含 `currency: 'EUR'` 和正确金额的 INSERT 语句。之后，如果你问“我这个月总收入折合 USD 是多少？”，数据库会在查询时处理汇率换算，Claude Code 只负责把结果报告给你。

## Claude Code 能做到而网页界面做不到的事

Claude Code 在个人财务里真正强大的地方，在于它把文件访问、HTTP 请求和对话这三件事放进了同一个工具里：

**批量处理。** 把五份来自不同账户的银行账单丢进同一个文件夹，告诉 Claude Code 一次性处理。它会逐一读取文件，把交易写进对应账户，再在最后统一核对余额。用普通 Web UI 做这件事，通常要点上一个小时。

**自定义分析。** “过去一年里哪个月份娱乐支出最高？其中金额最大的交易是什么？” 几乎没有哪款预算 App 会专门做出这个按钮，但 Claude Code 可以自己写 SQL、执行它，再把结果解释给你听。

**格式转换。** 你的银行导出的 CSV 列很奇怪、日期还是欧洲格式？先让 Claude Code 在本地清洗一遍，再导入干净版本。

**写脚本。** 你甚至可以让 Claude Code 给你写一个以后可重复用的脚本：“写一个脚本，把 Chase CSV 导入并记录所有交易，保存为 `~/finances/import-chase.py`。”下次你就可以直接运行脚本，不管是否还需要 Claude Code 参与。

## Claude Code 操作的数据库结构

Expense Budget Tracker 的机器 API 暴露了一组非常适合 AI 代理操作的关系，允许的集合由 `GET /v1/schema` 发布。

| 表 | 存什么 |
|---|---|
| `ledger_entries` | 每一笔收入和支出交易 |
| `budget_lines` | 预算计划：每月每个分类的金额 |
| `budget_comments` | 针对特定预算单元格的备注 |
| `exchange_rates` | 每日汇率（自动抓取） |
| `workspace_settings` | 报表币种偏好 |
| `account_metadata` | 账户流动性分类 |
| `accounts` | VIEW：各账户的持续余额 |

`ledger_entries` 这张表的列也很直接：`event_id`、`ts`、`account_id`、`amount`、`currency`、`kind`、`category`、`counterparty`、`note`。因为列名本身就把含义说得很清楚，所以 Claude Code 往往第一次就能写对 INSERT 语句。

## 安全性和访问控制

在合适约束下，把 Claude Code 接到你的记账数据库是安全的：

每一条查询都会经过 Postgres Row Level Security。API key 绑定到你的用户和选中的 workspace，所以 Claude Code 只能看见你的数据，哪怕数据库是共享部署的。

每个请求只允许一条语句。支持的类型只有 `SELECT`、`WITH`、`INSERT`、`UPDATE` 和 `DELETE`。Claude Code 不能建表、不能删表、不能用事务包装，也不能调用 `set_config()`、发送 SQL 注释或使用带引号的标识符。这些限制都由 SQL API 在服务端强制执行，不取决于 Claude Code 想发什么。

API key 以 SHA-256 哈希形式保存，明文不会进数据库。你之后也可以在产品里撤销密钥。接口还有限流：每秒 10 个请求、每天 10,000 个请求，超时 30 秒，每次响应最多返回 100 行。

密钥保存在你的本地环境变量里。Claude Code 发请求时从 `$EXPENSE_BUDGET_TRACKER_API_KEY` 读取它，不需要把它提交进项目代码。

## 进阶替代方案：不走代理原生登录，直接用 HTTP

如果你已经有一个长期可用的 Expense Budget Tracker ApiKey，Claude Code 也可以跳过邮箱验证码流程，直接使用这个现成密钥。此时调用的还是同一套端点：

- `GET /v1/openapi.json`：获取机器可读的 OpenAPI 规范
- `GET /v1/schema`：查看允许访问的关系
- `POST /v1/sql`：执行实际查询

这适合已经固定下来的脚本或预配置环境，但对大多数人来说，发现 URL 配合邮箱验证码仍然是最省事的接入方式。

## 一个真实工作流：每周 10 分钟完成记账

Kirill Markin 已经把这套流程跑了很多年，它大致就是这样一段每周例行操作：

1. 从所有账户下载银行账单（2 分钟）
2. 打开 Claude Code，告诉它处理这些文件（3 分钟，主要是 Claude Code 在做事）
3. 审核 Claude Code 的录入结果，修正少数分类错误（3 分钟）
4. 让 Claude Code 核对所有账户余额是否和银行一致（1 分钟）
5. 如果刚好到月底，再让 Claude Code 比较实际支出与预算，并更新预测（2 分钟）

差不多 10 分钟，你就能拿到一整套完整财务视图：每一笔交易都已分类，每个余额都已核对，预算也已经更新。这个系统之所以有效，是因为那些枯燥的部分（解析、分类、写入、计算）恰好都是 Claude Code 擅长的，而判断性的部分（审核分类、决定预算怎么调）仍然留给你。

## 开始使用 Claude Code 和 Expense Budget Tracker

1. 如果你还没装，先[安装 Claude Code](https://docs.anthropic.com/en/docs/claude-code)
2. 在 [expense-budget-tracker.com](https://expense-budget-tracker.com/zh/) 注册，或者[自行托管](https://github.com/kirill-markin/expense-budget-tracker)这个应用
3. 把 `https://api.expense-budget-tracker.com/v1/` 交给 Claude Code
4. 完成邮箱验证码流程，并把返回的 key 保存为 `EXPENSE_BUDGET_TRACKER_API_KEY`
5. 为这个 key 保存一个默认 workspace
6. 写一份本地 `CLAUDE.md`，记录你的分类、账户和工作规则
7. 在你的财务目录里打开 Claude Code，把第一份银行账单丢进去

Claude Code 会检查 schema、匹配你的分类，并开始记录交易。你审核结果，修正不对劲的地方，很快就能拥有一套运行在终端里的 AI 记账系统。

Expense Budget Tracker 采用 MIT 许可证，并以完全开源的形式发布在 [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)。Claude Code 的介绍见 [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code)。这两款工具都可以低成本开始使用。

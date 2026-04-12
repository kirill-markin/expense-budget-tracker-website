---
title: "适合开发者的自托管开源预算工具：真正拥有你的财务数据"
description: "为什么程序员应该把记账工具部署在自己的服务器上。用开源预算工具搭建一套带 SQL API、AI 代理集成和完整 Postgres 数据控制权的个人财务系统。"
date: "2026-03-05"
keywords:
  - "开发者自托管预算工具"
  - "开源记账工具"
  - "自托管预算追踪器"
  - "SQL API 财务系统"
  - "AI 代理记账"
  - "Postgres 预算工具"
---

如果你是开发者，那么你的财务数据大概率还住在别人的服务器上。几乎所有预算 App 和记账 App，不管是 Mint、YNAB、Copilot 还是 Lunch Money，都会把你的交易、余额和消费模式存进它们的云里。你只能相信它们不会被攻破、不会拿你的数据变现，也不会突然关停（Mint，2024，安息）。

如果你对 Docker 和 Postgres 不陌生，其实还有一个更好的选项：自托管一款开源预算工具，让一切都运行在你自己的基础设施里。

## 自己部署的开源记账工具

[Expense Budget Tracker](https://github.com/kirill-markin/expense-budget-tracker) 是一套完全开源、基于 Postgres 的支出与预算追踪系统。你 clone 仓库，运行 `make up`，就能在 `localhost:3000` 上得到一个可用的应用和一套由你掌控的真实数据库。

不需要注册账户，不需要让数据离开你的机器，也没有订阅费用。MIT 协议，fork、修改、怎么用都由你决定。

![按分类展示过去实际值、当月追踪和未来月度预测的预算表](/blog/budget-view-example.jpg)

技术栈也很直接：Web UI 用 Next.js，存储用 Postgres 18，每日汇率抓取由一个 TypeScript worker 完成。整套系统通过一个 `docker-compose.yml` 跑在 Docker 容器里。

## 用 Docker 自托管，或者部署到 AWS

仓库开箱即带两条部署路径：

**本地 Docker Compose**：四条命令就能跑起来：

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
open -a Docker   # 如果 Docker 还没启动，先启动
make up          # Postgres + migrations + web + worker
```

打开 `http://localhost:3000`，就可以开始录第一笔交易。Postgres 数据持久化在 Docker volume 里。整个本地部署就这么多。

**AWS CDK**：一条脚本就能做完整生产部署：

```bash
bash scripts/bootstrap.sh --region eu-central-1
```

这会拉起 ECS Fargate、RDS Postgres、带 HTTPS 的 ALB、Cognito 登录、WAF、CloudWatch 监控、自动备份，以及通过 GitHub Actions 的 CI/CD。估算成本大约每月 50 美元，但换来的是一套完全属于你的企业级基础设施。[部署指南](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) 从开 AWS 账号到配置 Cloudflare DNS，每一步都写得很清楚。

因为它本质上就是 Postgres + Docker，你也可以把它托管到任何别的地方：DigitalOcean、Hetzner、家里柜子里的 Raspberry Pi、公司现成的 Kubernetes 集群。能跑 Docker 和 Postgres 的地方，就能跑它。

## 用于程序化访问的 SQL API

大多数预算应用只给你一个 Web UI，除此之外几乎什么都没有。这一套则额外暴露了一个通过 HTTP 提供的 **SQL Query API**：`POST /v1/sql`，接收原始 SQL，返回 JSON。

```bash
curl -X POST https://api.your-domain.com/v1/sql \
  -H "Authorization: ApiKey ebta_a7Bk9mNp..." \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT category, SUM(amount) AS total FROM ledger_entries WHERE kind = '\''spend'\'' AND ts >= DATE_TRUNC('\''month'\'', CURRENT_DATE) GROUP BY category ORDER BY total"}'
```

你只要在 Settings 里创建 API key，选好目标 workspace ID，任何 HTTP 客户端都能查你的数据。这就是一个很普通的 REST endpoint，没有 GraphQL，没有 ORM 抽象，也没有你还得先学一遍的 SDK。就是 SQL 输入，JSON 输出。

安全模型也很严格：API keys 以 SHA-256 哈希保存（明文从不持久化），查询类型限制为 SELECT/INSERT/UPDATE/DELETE（没有 DDL），单条语句超时 30 秒，每次最多返回 100 行，并按 key 做每秒 10 次的限流。所有查询都跑在 Postgres Row Level Security 下，也就是和 Web UI 一样的隔离层，所以一个 API key 只能访问它所属 workspace 里的数据。

## 为 AI 代理和 LLM 准备的结构

SQL API 正是让 AI 真正能参与个人财务的关键，因为你的 AI 代理必须能直接读写财务数据。

想想你现在通常怎么和 AI 互动：你把一张银行账单截图贴给 Claude 或 ChatGPT，让它帮你分类，然后它给你一段漂亮总结。接着你再把这些数字手工复制到真正的工具里。这是 2023 年的工作流。

有了 SQL API，AI 代理就不只是“分析数据”，而是可以**直接把结果写进数据库**。工作流会变成这样：

1. 把银行账单（CSV、PDF 或截图）丢给 AI 代理
2. 代理逐行读取交易，根据你现有分类匹配，并把结果 `INSERT` 到 `ledger_entries`
3. 代理核对系统里的账户余额和银行显示的余额是否一致
4. 你只需要花 5 分钟审核，而不是花 1 小时手工输入

这套数据库 schema 本身就是为此设计的。七张扁平表，没有嵌套 JSON，基本操作不需要复杂 join。`ledger_entries` 这张表刻意保持简单：每一行就是一次账户资金变动，列名也足够清楚。对一个 LLM 来说，这意味着它第一次就能写对 INSERT 的概率很高，因为几乎没有可误解的空间。

Expense Budget Tracker 还在 Web UI 里内置了**AI 聊天**。你连上自己的 OpenAI 或 Anthropic API key 后，就能得到一个带 `query_database` 工具的助手，它可以直接在你的 Postgres 里 `SELECT`、`INSERT`、`UPDATE` 和 `DELETE`。你上传一张银行 App 截图，AI 会解析每笔交易，让你确认，然后写进去。它遵循严格协议：先发现已有分类，再检查重复，再核对余额，最后只有在你明确批准后才写库。

这个 AI 聊天支持 Claude（Anthropic）和 GPT（OpenAI）模型。两边用的是同一套数据库工具、同一套安全规则：关键字白名单、语句超时和 RLS 约束。你当然也可以把 SQL API 交给外部代理，比如 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)、OpenAI Codex、自定义脚本或 Zapier Webhook。把你的 `ebt_` API key 和 endpoint 交给代理，它就能在所属 workspace 范围内获得完整读写能力。

## 这款预算工具具体能做什么

这并不是一个只有总账的极简玩具，商业产品里你会期待的功能它基本都有：

- **预算网格**：行是分类，列是月份。过去月份显示实际值，未来月份显示预测。你可以向前规划 12 个月，并一眼看到预估余额
- **多币种支持**：每笔交易保留原始币种。ECB、CBR 和 NBS 的每日汇率会自动抓取。换算在查询时报表层完成，不需要预计算列，也不会丢精度
- **账户余额**：支持活期、储蓄、信用卡、现金、投资账户。每个账户的余额都从总账推导得出
- **转账**：可以在自己的账户之间转钱，包括跨币种。实现方式是共享同一个 `event_id` 的两条总账记录，一正一负
- **交易分类**：分类完全由你定义，没有被强塞进某个官方层级体系里。AI 也会从你现有分类里学习
- **多语言界面**：支持英语、西班牙语、中文、阿拉伯语、希伯来语、波斯语、乌克兰语和俄语，RTL 也做了完整支持
- **Workspace 隔离**：Postgres Row Level Security 确保不同用户的数据完全隔离。哪怕共享同一个数据库，也互相看不到
- **Demo 模式**：UI 顶部一键切换到内存中的示例数据，不用数据库也能先体验界面

## 为开发者准备的 Postgres schema

整个 schema 很容易装进脑子里：

- `ledger_entries`：每一笔账户资金变动（核心表）
- `budget_lines`：追加式预算计划（同一单元格后写覆盖前写）
- `budget_comments`：预算单元格备注
- `exchange_rates`：每日汇率（全局，无访问控制）
- `workspace_settings`：每个 workspace 的报表币种
- `account_metadata`：账户流动性分类
- `accounts`：由 `ledger_entries` 推导出的 VIEW

没有 ORM。没有庞大的 migration 框架。就是 `db/migrations/` 目录里编号清晰的 SQL 文件，再由一个 shell 脚本执行。你可以把每条迁移都读一遍，理解每张表，然后直接写 SQL。

schema 变更走 migrations。Web 应用使用的 `app` 数据库角色权限受限，不能建表也不能改 schema。只有迁移脚本使用的 `tracker` 角色负责 DDL。这就是你会期待在一套生产级系统里看到的职责分离。

## 为什么开发者会想自托管自己的财务数据

你其实已经具备跑这套东西的大部分技能。Docker、Postgres、AWS（或者别的云）你都懂。真正的问题只剩一个：收益值不值得这点额外投入？

**完整的数据所有权**：你的个人财务数据不会离开你的基础设施。第三方数据泄露不再自动影响你，你也不需要去读一堆隐私政策，猜自己的支出模式有没有被拿去投广告。

**可定制性**：你可以往 schema 里加列，可以直接写 SQL 做自己的报表，也可以和你现有工具打通。想要一个每天推送支出摘要的 Telegram 机器人？写个脚本调 SQL API 就行。想用 Grafana 做可视化？直接连 Postgres。代码本来就是你的。

**没有供应商锁定**：哪怕哪天你不用这套 Web UI 了，数据依然在一套标准 Postgres 数据库里。`pg_dump` 能导出，任何 SQL 客户端都能查，想迁移走也行。

**学习价值**：这个代码库本身就是一份真实世界里的 Next.js + Postgres + Docker + AWS CDK + Row Level Security + API key 认证 + AI 工具集成示例。如果你自己也在做 SaaS，会看到不少值得偷师的模式。

## 开始使用这款开源预算工具

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

打开 `http://localhost:3000`。录入第一笔交易。给当前月份设置预算。如果你想先试试界面而不连数据库，Header 里还有一个 Demo 按钮，可以切到内存样例数据。

如果你准备上生产环境，就按 [AWS deployment guide](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) 走，或者把 Docker Compose 方案改造成你自己的基础设施。

仓库在 [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)。你可以 star，可以 fork，也可以只是把代码读一遍。MIT 协议，想怎么用都行。

如果你本来就每天在工作里管理服务器和数据库，那么把同样的技术栈用在个人财务上，其实只是很小的一步，而你换来的，是对这些数据的完整控制。

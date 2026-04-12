---
title: "面向开发者的自托管开源预算工具：把财务数据握在自己手里"
description: "为什么开发者应该把记账和预算系统部署在自己的环境里。用开源预算工具搭建一套带 SQL API、AI 集成能力和完整 Postgres 控制权的个人财务系统。"
date: "2026-03-05"
keywords:
  - "开发者自托管预算工具"
  - "开源记账系统"
  - "自托管个人财务"
  - "SQL API 记账工具"
  - "AI 自动记账"
  - "Postgres 预算管理"
---

如果你是开发者，你的财务数据大概率还放在别人的服务器上。无论是 Mint、YNAB、Copilot 还是 Lunch Money，这些预算和记账应用都会把你的交易记录、账户余额和消费习惯存进它们自己的云端。你只能寄希望于它们不会被攻破、不会转卖数据，也不会突然停运（Mint 已在 2024 年谢幕）。

如果你已经熟悉 Docker 和 Postgres，其实有个更合适的选择：自己托管一套开源预算工具，把整套系统放在你自己的基础设施里。

## 可自行部署的开源记账工具

[Expense Budget Tracker](https://github.com/kirill-markin/expense-budget-tracker) 是一套完全开源、基于 Postgres 的支出与预算管理系统。把仓库拉到本地，执行 `make up`，你就能在 `localhost:3000` 上得到一套可直接使用的应用，以及一个完全由自己掌控的真实数据库。

不需要注册账号，不需要把数据交给第三方，也没有订阅费。项目采用 MIT 许可证，你可以随意分叉、修改，或者按自己的方式继续扩展。

![按分类展示过去实际值、当月追踪和未来月度预测的预算表](/blog/budget-view-example.jpg)

这套系统的技术栈很直接：网页界面使用 Next.js，数据存储使用 Postgres 18，每日汇率由一个用 TypeScript 编写的后台任务抓取。所有服务都通过一个 `docker-compose.yml` 运行在 Docker 容器中。

## 用 Docker 自托管，或部署到 AWS

仓库开箱即用地提供了两种部署方式：

**本地 Docker Compose**：四条命令就能跑起来：

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
open -a Docker   # start Docker if not running
make up          # Postgres + migrations + web + worker
```

打开 `http://localhost:3000`，就可以开始录入交易。Postgres 数据会持久保存在 Docker 卷里。整个本地环境搭建到这里就结束了。

**AWS CDK**：一条脚本即可完成完整的生产部署：

```bash
bash scripts/bootstrap.sh --region eu-central-1
```

这会创建 ECS Fargate、RDS Postgres、带 HTTPS 的应用负载均衡器、Cognito 登录、WAF、CloudWatch 监控、自动备份，以及通过 GitHub Actions 实现的持续集成和持续部署。预估成本大约是每月 50 美元，但换来的是一套完全由你掌控的生产级基础设施。[部署说明](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) 把从创建 AWS 账号到配置 Cloudflare DNS 的每一步都写得很清楚。

由于它本质上只是 Postgres 加 Docker，你也可以把它放到别的环境里：DigitalOcean、Hetzner、家里的 Raspberry Pi，或者公司现有的 Kubernetes 集群。只要能运行 Docker 和 Postgres，这套系统就能跑起来。

## 便于程序化访问的 SQL API

大多数预算应用只提供网页界面，除此之外几乎没有别的访问方式。Expense Budget Tracker 则通过 HTTP 暴露了一个 **SQL 查询接口**：`POST /v1/sql`，接收原始 SQL 语句并返回 JSON。

```bash
curl -X POST https://api.your-domain.com/v1/sql \
  -H "Authorization: ApiKey ebta_a7Bk9mNp..." \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT category, SUM(amount) AS total FROM ledger_entries WHERE kind = '\''spend'\'' AND ts >= DATE_TRUNC('\''month'\'', CURRENT_DATE) GROUP BY category ORDER BY total"}'
```

你只需要在设置页面生成一个 API key，选好目标工作区 ID，然后就能用任意 HTTP 客户端查询自己的数据。这是一个非常直接的 REST 接口，没有 GraphQL，没有 ORM 抽象，也没有额外要学的 SDK。就是 SQL 输入，JSON 输出。

它的安全模型也很严格：API key 以 SHA-256 哈希形式保存，明文不会落库；查询被限制在 SELECT/INSERT/UPDATE/DELETE 范围内，不允许执行 DDL；单条语句的超时时间为 30 秒；每次最多返回 100 行；并且会按 key 做每秒 10 次的限流。所有查询都运行在 Postgres 的行级安全机制（Row Level Security，RLS）之下，也就是网页应用使用的同一层隔离，因此一个 API key 只能访问其所属工作区中的数据。

## 为 AI 助手和大语言模型而设计

SQL API 之所以重要，是因为这让 AI 真正具备了参与个人财务管理的能力。要让 AI 代理帮你处理账务，它就必须能直接读写数据库。

想想现在大家通常是怎么用 AI 的：把银行流水截图贴给 Claude 或 ChatGPT，让它帮你分类；它给出一段整理得不错的说明；然后你再把结果手动录进真正的记账工具里。这是 2023 年式的工作流。

有了 SQL API，AI 代理不再只是“分析数据”，而是可以**直接把结果写进数据库**。流程会变成这样：

1. 把银行账单（CSV、PDF 或截图）交给 AI 代理
2. 代理逐笔读取交易，对照你已有的分类，并把结果 `INSERT` 到 `ledger_entries`
3. 代理核对系统里的账户余额与银行显示的余额是否一致
4. 你只需要花 5 分钟审核，而不是花 1 小时手工录入

数据库表结构就是为这种场景设计的。整个系统只有七张扁平表，没有嵌套 JSON，日常操作也不需要复杂联结。`ledger_entries` 这张核心表尤其保持得很简单：每一行代表一次账户资金变动，列名也足够直观。对大语言模型来说，这样的设计更容易一次写出正确的 INSERT 语句，不容易被结构复杂度绊住。

Expense Budget Tracker 还在网页界面里内置了**AI 对话功能**。接入你自己的 OpenAI 或 Anthropic API key 后，你就会得到一个带 `query_database` 工具的助手，它可以直接在 Postgres 中执行 `SELECT`、`INSERT`、`UPDATE` 和 `DELETE`。上传一张银行应用截图后，AI 会解析每一笔交易，请你确认，然后再写入数据库。整个过程遵循严格的操作顺序：先读取现有分类，再检查是否有重复记录，再核对余额，最后只有在你明确批准后才执行写入。

这套 AI 对话同时支持 Claude（Anthropic）和 GPT（OpenAI）模型。两者使用的是同一套数据库工具和相同的安全约束，包括关键字白名单、语句超时和 RLS 隔离。你也可以把 SQL API 交给外部代理使用，例如 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)、OpenAI Codex、自定义脚本，或者 Zapier 的 Webhook。只要把你的 `ebt_` API key 和接口地址交给代理，它就能在所属工作区范围内获得完整的读写能力。

## 这款预算工具具备哪些能力

这并不是一个只能记流水的极简账本。商业产品里常见的核心能力，这里基本都有：

- **预算网格**：按分类为行、按月份为列。过去月份显示实际值，未来月份显示预算预测。你可以一次向前规划 12 个月，并快速看到预估余额
- **多币种支持**：每笔交易都保留原始币种。系统会自动抓取 ECB、CBR 和 NBS 的每日汇率。换算发生在查询阶段，不依赖预计算列，也不会损失精度
- **账户余额**：支持活期、储蓄、信用卡、现金和投资账户。每个账户的余额都由总账自动推导
- **转账**：支持在自己的账户之间转钱，包括跨币种转账。实现方式是共享同一个 `event_id` 的两条总账记录，一条为负，一条为正
- **交易分类**：分类由你自己定义，不会被强行套进固定体系。AI 也会从你已经使用的分类中学习
- **多语言界面**：支持英语、西班牙语、中文、阿拉伯语、希伯来语、波斯语、乌克兰语和俄语，并完整支持 RTL
- **工作区隔离**：Postgres 的行级安全确保不同用户的数据完全隔离。即使共用同一个数据库服务器，也无法互相查看数据
- **演示模式**：可以在界面中切换到基于内存的示例数据，不连数据库也能先体验产品

## 面向开发者设计的 Postgres 表结构

整套表结构并不复杂，很容易在脑子里建立完整模型：

- `ledger_entries`：每一笔账户资金变动，也是整个系统的核心表
- `budget_lines`：追加式预算计划，同一单元格以最后一次写入为准
- `budget_comments`：预算单元格的备注
- `exchange_rates`：每日汇率，全局共享，不做访问控制
- `workspace_settings`：每个工作区的报表币种设置
- `account_metadata`：账户流动性分类
- `accounts`：由 `ledger_entries` 推导出来的视图

没有 ORM，也没有额外的迁移框架。数据库变更就是 `db/migrations/` 目录里一组按编号排列的 SQL 文件，再由一个 shell 脚本依次执行。你可以把每一条迁移都读明白，理解每一张表，然后直接针对表结构写 SQL。

表结构的变更全部通过迁移完成。网页应用使用的 `app` 数据库角色权限受限，既不能创建表，也不能修改表结构。只有迁移脚本使用的 `tracker` 角色负责执行 DDL。这正是你希望在生产系统里看到的职责分离方式。

## 为什么开发者会选择自托管财务数据

你其实已经具备运行这套系统的大部分能力。Docker、Postgres、AWS，或者其他云服务，你都不陌生。真正的问题只有一个：这样做带来的收益，值不值得这点额外投入？

**完整的数据所有权**：你的个人财务数据不会离开你自己的基础设施。第三方数据泄露不再直接波及你，你也不必反复研究隐私政策，猜自己的消费习惯会不会被拿去做广告。

**更高的可定制性**：你可以给表结构加字段，直接用原始 SQL 写报表，也可以和现有工具打通。想做一个每天汇报支出的 Telegram 机器人？写个调用 SQL API 的脚本就行。想把数据接到 Grafana 做可视化？直接连 Postgres。代码本来就归你所有。

**没有供应商锁定**：即使哪天你不再使用这套网页界面，数据依然保存在标准的 Postgres 数据库里。你可以用 `pg_dump` 导出，也可以用任意 SQL 客户端读取，甚至随时迁移到别的系统。

**有真实的学习价值**：这个代码库本身就是一份完整的实践样本，涵盖 Next.js、Postgres、Docker、AWS CDK、行级安全、API key 认证，以及 AI 工具集成。如果你也在做 SaaS 产品，里面有不少值得借鉴的做法。

## 开始使用这款开源预算工具

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

打开 `http://localhost:3000`。录入第一笔交易。为当前月份设定预算。如果你想先在不连接数据库的情况下体验界面，可以点击页眉里的 `Demo` 按钮，切换到基于内存的示例数据。

如果你准备把它用于生产环境，可以参考 [AWS 部署说明](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md)，或者把 Docker Compose 方案按自己的基础设施进行调整。

项目仓库在 [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)。你可以加星标、分叉，或者只是把代码完整读一遍。它采用 MIT 许可证，想怎么用都可以。

如果你平时就在工作中管理服务器和数据库，那么把同样的技术栈用在个人财务上，其实只是向前迈出很小一步。换来的，是你对这批数据真正的控制权。

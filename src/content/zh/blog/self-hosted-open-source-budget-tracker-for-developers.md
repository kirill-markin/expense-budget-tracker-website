---
title: "自托管预算管理工具：开源、Docker 与 Postgres"
description: "用 Docker 和 Postgres 在本地运行开源收支与预算管理工具，并厘清备份、隐私边界，以及何时更适合选择托管服务。"
date: "2026-03-05"
updated: "2026-09-03"
image: "/blog/self-hosted-open-source-budget-tracker-for-developers-v2.png"
keywords:
  - "自托管预算管理工具"
  - "开源预算管理工具"
  - "自托管记账工具"
  - "Docker 记账工具"
  - "Postgres 预算应用"
  - "开发者个人财务管理"
---

当前的 Docker Compose 配置要求先选择身份验证模式，否则无法解析。若要在本地运行且不要求登录，需要在命令中明确指定该模式：

```bash
AUTH_MODE=none make up
```

这个小细节恰好点出了自托管个人财务软件的关键。运行容器并不难，真正需要考虑的是谁能访问这些服务、备份放在哪里，以及哪些可选服务可能收到财务数据。

[Expense Budget Tracker](https://github.com/kirill-markin/expense-budget-tracker) 是一款采用 MIT 许可证的开源预算管理工具，基于 Next.js 和 Postgres 构建。本指南以代码仓库目前的实际运行方式为准：供一名技术用户使用的本地 Docker 方案、文档中说明的 AWS/CDK 生产部署方案，以及托管 UI、MCP 和 Agent API 各自独立的托管端点。

![一名技术人员维护自成一体的雨水收集系统，旁边设有备用水箱和未连接的水管](/blog/self-hosted-open-source-budget-tracker-for-developers-v2.png)

## 首先，明确你真正需要的边界

“自托管”可以指几种截然不同的部署方式，不能将它们混为一谈。

| 方案 | 财务数据存放位置 | 你需要运维的部分 | 适用场景 |
| --- | --- | --- | --- |
| 本地 Docker Compose | 你电脑上 Docker 卷内的 Postgres | 容器、更新、本地访问和备份 | 主要只想在一台电脑上使用 Web UI 的技术用户 |
| 使用文档所述 CDK 栈部署到你自己的 AWS 账户 | 你 AWS 账户中的 RDS 和应用服务 | AWS、Cloudflare、域名、证书、邮件发送、密钥、监控和备份 | 需要公开访问或多用户支持，且愿意承担基础设施运维工作 |
| 托管 Web 应用 | Expense Budget Tracker 的托管环境 | 你的账户和数据录入流程 | 希望使用 UI，但不想运维服务器的用户 |
| 托管 MCP 连接器 | 通过 MCP 服务访问的托管工作区 | OAuth 授权和客户端连接 | 支持 MCP，且需要限定范围的读取或写入权限的智能体 |
| 托管 Agent API | 通过 API 服务访问的托管工作区 | 长期有效的 ApiKey、工作区选择和经审核的 SQL | 可以直接发送 HTTP 请求的脚本和终端智能体 |

本地 Compose 命令**不会**创建 `api.your-domain.com` 或 `mcp.your-domain.com`。这些供程序访问的接口属于 AWS 架构和托管服务。将托管客户端指向 `https://mcp.expense-budget-tracker.com/mcp`，意味着使用托管工作区，而不是访问你笔记本电脑里的 Postgres 容器。

因此，在选择任何自托管预算管理工具时，首先要明确：你想在本地掌控 Web 应用和数据库，还是需要通过更大规模的部署来实现远程集成？

## 在本地运行 Docker 记账工具

你需要安装 Git、Docker 和 Docker Compose。克隆代码仓库，然后在仓库根目录启动整个服务栈：

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
AUTH_MODE=none make up
```

然后打开 [http://localhost:3000](http://localhost:3000)。

`AUTH_MODE` 是 Compose 的必填变量。如果尚未把 `.env.example` 复制为 `.env`，每次执行 Compose 命令时都要加上此前缀。下文的命令会特意保留它。

`make up` 是以下命令的简写：

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml up -d
```

当前的 [Compose 文件](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/docker/compose.yml) 定义了 Postgres 18、一次性迁移服务、Next.js Web 应用、身份验证服务和汇率工作进程。使用 `AUTH_MODE=none` 时，Web 应用会使用本地身份，不再要求通过 Cognito 登录。请把这种模式当作本地开发访问方式，绝不能将其当作公开服务器的身份验证机制。

你可以使用常规 Compose 命令检查容器状态并持续查看应用日志：

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml ps
AUTH_MODE=none docker compose -f infra/docker/compose.yml logs -f web
```

用以下命令停止服务栈：

```bash
AUTH_MODE=none make down
```

[Makefile](https://github.com/kirill-markin/expense-budget-tracker/blob/main/Makefile) 会把这条命令映射为 `docker compose down`，并且不带 `-v`。Postgres 数据会保留在名为 `pgdata` 的卷中，并在下次启动服务栈时继续使用。

这种持久化很方便，但它并不等于备份。主机故障、磁盘损坏、误删数据卷或明确执行 `docker compose down -v`，仍可能让唯一的数据副本消失。

### 仅限本地使用

Compose 配置把 Web 应用、Postgres 和身份验证服务分别暴露在主机的 `3000`、`5432` 和 `8081` 端口。其中还包含开发环境的数据库凭据。不要把这套配置部署到面向互联网的主机上，再想当然地认为 Docker 已经替你做好了隔离。

对于工作站上的安装：

- 使用主机防火墙限制网络访问；
- 不要从路由器转发端口 `3000`、`5432` 或 `8081`；
- 不要通过公共反向代理暴露 `AUTH_MODE=none`；
- 不要把代码仓库、`.env` 文件和数据库转储放在公开或广泛共享的文件夹中。

代码仓库的生产部署文档针对 AWS/CDK。即使有经验的运维人员可以改造代码，仓库也没有承诺为每一种 VPS、NAS、Kubernetes 集群或家庭服务器提供经过安全加固的部署方案。

## 哪些组件在运行，哪些数据留在 Postgres 中

本地架构足够精简，可以直接逐项检查：

- **Next.js Web 应用：**提供预算、交易、余额、仪表盘、演示和聊天界面。
- **Postgres：**存储账本、预算计划、工作区设置、账户元数据和应用状态。
- **迁移容器：**在 Web 服务启动前执行代码仓库中的 SQL 迁移。
- **汇率工作进程：**获取公开汇率数据，并通过权限受限的数据库角色写入。
- **身份验证服务：**支持需要身份验证的部署架构；当 `AUTH_MODE=none` 时，本地 Web 使用会绕过 Cognito。

Postgres 是这套系统的权威数据源。这让它成为一款适合开发者的实用 Postgres 预算应用：你可以检查迁移、理解表之间的关系、查询自己的数据库，并使用标准 Postgres 工具导出数据。行级安全和彼此独立的应用角色在应用内部依然重要，但无法取代主机安全或备份。

汇率工作进程会向外发送请求以获取汇率数据。请求这些公开汇率并不需要发送你的账本记录。可选 AI 功能的边界有所不同，值得单独审查。

## 先做好真正的备份，再谈数据安全

对于默认的本地 Compose 数据库，以下命令会在主机上创建一个压缩的 Postgres 归档：

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml exec -T postgres \
  pg_dump -U tracker -d tracker --format=custom \
  > expense-budget-tracker.dump
```

请像对待银行对账单一样保管这个文件。它可能包含交易说明、余额、分类、备注和其他身份识别信息。

一套切实可行的备份流程需要做出四项决定：

1. **频率：**确定你最多可以接受丢失多少近期工作。
2. **独立位置：**把转储复制到 Docker 主机之外，避免一次磁盘故障同时毁掉两个副本。
3. **加密与访问控制：**归档文件落盘后应保持加密，并限制读取权限。
4. **恢复测试：**定期把备份恢复到另一个兼容的 Postgres 实例中，并核对交易、预算和余额。

更新应用前，先创建一份新的转储。随后拉取新代码、重新构建镜像，再次启动服务栈：

```bash
git pull
AUTH_MODE=none make build
AUTH_MODE=none make up
```

迁移容器会在启动时运行。升级前请阅读版本说明，并保留升级前的转储，直到你检查完应用并完成一次恢复演练。

## 自托管并不代表每一个字节都会自动留在本地

核心的本地 UI 和 Postgres 数据库可以在你的电脑上运行。但一旦启用会向外发送数据的功能或端点，数据就会越过这道边界。

### 内置 AI 聊天

内置聊天使用 `OPENAI_API_KEY`。使用这项功能时，提示词、随附或提取出的内容，以及模型调用所需的财务上下文都可能发送到 OpenAI。当前请求路径设置了 `store: false`，但服务提供商仍需处理请求，其余数据保留设置则取决于你的 API 组织。发送银行对账单或账本详情前，请查阅 [OpenAI 当前的 API 数据控制说明](https://developers.openai.com/api/docs/guides/your-data)。

Langfuse 跟踪是可选的。只有同时配置连接参数和 release 值时才会启用。启用后，聊天跟踪记录会导出到你选择的 `LANGFUSE_BASE_URL`。使用 Langfuse Cloud URL 会引入另一个外部数据处理方；自行托管 Langfuse，则会把数据发送到你运维的基础设施。

如果你的要求是“财务数据记录绝不发送给 LLM 服务提供商”，请不要配置 AI 集成，也不要使用聊天功能。数据库即使自托管，也无法阻止你主动启用的模型请求向外发送。

### 部署到你自己的 AWS 账户

文档所述的 [AWS 部署](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) 会把应用服务和 RDS 部署到你的 AWS 账户中。与此同时，它也会引入更多系统和信任关系：Cloudflare 负责 DNS 和边缘流量，Cognito 负责身份验证，Resend 负责发送登录邮件，此外还有公共域名证书、Secrets Manager、监控，以及可选的 OpenAI 和 Langfuse 连接。

CDK 栈包含托管式数据库备份基础设施。你仍需判断其保留策略是否满足需求、监控故障、测试恢复、轮换密钥、执行更新并响应事件。“我的 AWS 账户”是一个有用的控制边界，但并不等于“没有第三方”。

### 托管 UI、托管 MCP 与托管 Agent API

托管 UI 的入口是 [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)。这是运维负担最小的方案，但服务运营方和托管服务提供商都属于数据边界的一部分。存入真实财务数据前，请阅读 [隐私政策](/zh/privacy/)。

支持 MCP 的客户端可以连接到：

```text
https://mcp.expense-budget-tracker.com/mcp
```

托管 MCP 连接器使用浏览器 OAuth。必需的 `expenses:read` 作用域允许发现工作区、检查 schema 和执行只读查询。`expenses:write` 是独立作用域，执行 `sql_execute` 时需要它。除非客户端确实需要新增、修改或删除财务记录，否则请从只读权限开始。MCP 客户端也可能接收到工具返回的数据，因此其自身的隐私政策同样重要。完整流程请参阅 [MCP 连接器指南](/zh/docs/mcp-connector/)。

托管 Agent API 是另一套接口，使用不同的凭据。首先访问：

```bash
curl --fail --silent --show-error \
  https://api.expense-budget-tracker.com/v1/
```

通过电子邮件验证码完成接入流程并获得长期有效的密钥后，直接请求使用：

```text
Authorization: ApiKey <key>
```

主要 SQL 端点有意将单次读取与单次经批准的写入分开：

- `POST /v1/sql/query` 接受一条受限制的 `SELECT` 或 `WITH ... SELECT`。
- `POST /v1/sql/execute` 接受一条经过批准的 `INSERT`、`UPDATE` 或 `DELETE`。

工作区选择和 Postgres 行级安全在服务器端生效。它们不会让托管请求变成自托管请求，而且基于 OAuth 的 MCP 端点不接受 ApiKey。[API 参考](/zh/docs/api/) 介绍了服务发现、工作区选择、schema 检查、请求限制和具体的 SQL 策略。[支出跟踪 API 指南](/zh/blog/expense-tracking-api/) 则更深入地说明了审批与对账。

## 自托管意味着你要承担什么

从应用层面看，开发者搭建个人财务工具似乎很简单：一个代码仓库、一条 Compose 命令、一个数据库。但第一次成功打开页面后，运维工作并没有结束。

对于本地 Docker，你需要负责：

- Docker 和主机操作系统更新；
- 应用更新和迁移审查；
- 数据库转储、加密的异机副本、保留策略和恢复测试；
- 磁盘容量和容器健康状态；
- 防火墙规则和机器的物理访问控制；
- 保护 `.env` 文件、API 密钥、模型密钥和备份。

对于公开部署，还需要增加：

- 域名和 DNS 配置；
- TLS 证书及其续期流程；
- 启用身份验证，不再使用 `AUTH_MODE=none`；
- OTP 邮件发送及其凭据；
- 数据库和服务监控；
- 告警处理、事件响应和恢复；
- 云服务成本和提供商账户安全。

[自托管指南](/zh/docs/self-hosting/) 是一份简短的安装参考。关于受支持的 AWS 架构，应以源代码仓库中的部署文档为准。

## 实用决策清单

如果以下大多数情况都符合你的需求，自托管记账工具会很合适：

- 你愿意持续维护 Docker 和 Postgres，而不只是完成一次安装。
- 你会自动执行备份并测试恢复，而不是只相信数据卷。
- 你希望直接访问标准数据库和可以审计或修改的源代码。
- 本地浏览器访问已经足够，或者你已准备好运维文档所述的 AWS 栈。
- 你能确保 `AUTH_MODE=none` 不会暴露在公共网络中。
- 你会检查所有可选的对外数据路径，尤其是 AI 聊天和遥测。

如果以下描述更符合你的情况，请使用托管应用或其他托管方案：

- 你只想录入和查看财务数据，不想维护基础设施。
- 你需要可靠的远程访问，但不想管理域名、TLS、身份验证、邮件、密钥和监控。
- 备份失败或安全更新延迟时，你很可能无法及时发现。
- 通过 OAuth 作用域授权的 MCP 连接器或托管 Agent API 已能满足集成需求，无需运维完整的技术栈。

还有一种实用的折中方案：在本地运行系统，不配置任何 AI 密钥，不将其暴露在公共互联网上，并把加密的 Postgres 备份导出到你控制的存储中。这样既能获得自托管预算管理工具的主要优势，也不会误把笔记本电脑上的 Compose 文件当成生产平台。

先执行 `AUTH_MODE=none make up`，输入几笔不敏感的测试交易，停止并重新启动服务栈，然后创建并验证数据库转储。如果你觉得这套简单的运维流程可以接受，再迁入真实数据。如果这时已经觉得麻烦，[托管安装方案](/zh/docs/getting-started/)可能更符合实际。

---
title: 自托管指南
description: 使用 Docker Compose 和 Postgres 在自有服务器上运行 Expense Budget Tracker。
---

## 要求

- Docker 和 Docker Compose
- Postgres 18（Docker Compose 文件中已包含）

## 快速开始

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

执行以上命令后，会启动 Postgres、运行数据库迁移，并拉起以下服务：

- 运行在 `http://localhost:3000` 的 Web 应用
- 运行在 `http://localhost:8081` 的认证服务
- 负责汇率同步的后台进程（在 Docker Compose 中运行）

## 配置

将 `.env.example` 复制为 `.env` 后，再根据实际环境调整以下配置：

- `MIGRATION_DATABASE_URL`：数据库迁移使用的 owner 角色连接串
- `DATABASE_URL`：Web 进程使用的应用角色连接串
- `AUTH_DATABASE_URL`：认证服务访问 auth schema 时使用的角色连接串
- `AUTH_MODE`：本地环境设为 `none`，使用邮箱 OTP 的环境设为 `cognito`
- `AUTH_DOMAIN`、`COOKIE_DOMAIN` 和 `ALLOWED_REDIRECT_URIS`：用于控制认证路由和 Cookie

当 `AUTH_MODE=cognito` 时，还需要从 `.env.example` 中补齐 Cognito 相关配置，以及 `SESSION_ENCRYPTION_KEY`。

## 更新

```bash
git pull
make up
```

Docker Compose 会重新构建各个服务，并通过 `migrate` 容器再次执行迁移。

## AWS 部署

生产 CDK 栈使用 ECS Fargate、RDS、ALB、Cognito、API Gateway 和 Lambda，并公开以下应用域名：

- `app.<domain>` — ALB 后方运行在 ECS Fargate 上的 Web 应用
- `auth.<domain>` — ALB 后方的 OTP 与 OAuth 服务
- `api.<domain>/v1/*` — 通过 API Gateway 和 Lambda 提供的机器 SQL REST API
- `mcp.<domain>/mcp` — 通过专用 API Gateway HTTP API 和 MCP Lambda 提供的托管 MCP 服务

MCP 自定义域名需要一张覆盖准确域名 `mcp.<domain>` 的公共 ACM 证书。请保留用于续期的 DNS 验证 CNAME，将证书 ARN 提供给 CDK 部署和 CI，并与其他公共域名一起创建 `mcp.*` DNS 记录。

有关受支持的部署顺序和设置脚本，请参阅仓库中的[部署概览](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md)和 [AWS CDK 指南](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md)。

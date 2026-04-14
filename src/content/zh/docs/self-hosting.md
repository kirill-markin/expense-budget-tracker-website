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

如果你计划在 AWS 上进行生产环境部署（ECS Fargate + RDS + ALB + Cognito），请参阅 [AWS CDK 指南](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws)。

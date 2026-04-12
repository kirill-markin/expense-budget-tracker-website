---
title: 自托管指南
description: 使用 Docker Compose 和 Postgres 在你自己的服务器上运行 Expense Budget Tracker。
---

## 要求

- Docker 和 Docker Compose
- Postgres 18（已包含在 Docker Compose 文件中）

## 快速开始

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

这会启动 Postgres、运行数据库迁移，并启动以下服务：

- `http://localhost:3000` 上的 Web 应用
- `http://localhost:8081` 上的认证服务
- 在 Docker Compose 中运行的汇率工作进程

## 配置

将 `.env.example` 复制为 `.env`，然后按需调整以下配置：

- `MIGRATION_DATABASE_URL`：供迁移使用的 owner 角色
- `DATABASE_URL`：供 Web 进程使用的应用角色
- `AUTH_DATABASE_URL`：供认证服务使用的 auth schema 角色
- `AUTH_MODE`：本地使用设为 `none`，基于邮箱 OTP 的环境设为 `cognito`
- `AUTH_DOMAIN`、`COOKIE_DOMAIN` 和 `ALLOWED_REDIRECT_URIS`：用于认证路由与 Cookie 配置

当 `AUTH_MODE=cognito` 时，你还需要从 `.env.example` 中补齐 Cognito 相关配置以及 `SESSION_ENCRYPTION_KEY`。

## 更新

```bash
git pull
make up
```

Docker Compose 会重新构建各个服务，并通过 `migrate` 容器重新运行迁移。

## AWS 部署

如果你要在 AWS 上进行生产部署（ECS Fargate + RDS + ALB + Cognito），请参阅 [AWS CDK 指南](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws)。

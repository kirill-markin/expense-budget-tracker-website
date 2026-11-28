---
title: 自行架設指南
description: 用 Docker Compose 和 Postgres 在自己的伺服器上執行 Expense Budget Tracker。
---

## 系統需求

- Docker 和 Docker Compose
- Postgres 18（Compose 檔案已包含）

## 快速啟動

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

這些指令會啟動 Postgres、執行資料庫遷移，再啟動下列服務。

- 網頁應用程式，網址為 `http://localhost:3000`
- 身分驗證服務，網址為 `http://localhost:8081`
- 負責抓取匯率的 Docker Compose 背景服務

## 設定

將 `.env.example` 複製為 `.env`，並調整下列設定。

- `MIGRATION_DATABASE_URL` — 供資料庫遷移使用的擁有者角色
- `DATABASE_URL` — 網頁應用程式使用的資料庫角色
- `AUTH_DATABASE_URL` — 身分驗證服務存取驗證結構描述所用的角色
- `AUTH_MODE` — 本機使用 `none`，使用電子郵件一次性驗證碼的環境請選 `cognito`
- `AUTH_DOMAIN`、`COOKIE_DOMAIN` 和 `ALLOWED_REDIRECT_URIS` — 驗證路由和 Cookie

使用 `AUTH_MODE=cognito` 時，也需要填寫 `.env.example` 中的 Cognito 設定和 `SESSION_ENCRYPTION_KEY`。

## 更新

```bash
git pull
make up
```

Docker Compose 會重新建置服務，並透過 `migrate` 容器再次執行資料庫遷移。

## 部署至 AWS

正式環境的 CDK 堆疊使用 ECS Fargate、RDS、ALB、Cognito、API Gateway 和 Lambda。應用程式使用下列公開網域。

- `app.<domain>` — 位於 ALB 後方、在 ECS Fargate 上執行的網頁應用程式
- `auth.<domain>` — 位於 ALB 後方的 OTP 和 OAuth 服務
- `api.<domain>/v1/*` — 透過 API Gateway 和 Lambda 提供的 SQL REST API，供程式呼叫
- `mcp.<domain>/mcp` — 由專用的 API Gateway HTTP API 和 MCP Lambda 提供的託管 MCP 服務

MCP 自訂網域需要公開的 ACM 憑證，憑證名稱必須與 `mcp.<domain>` 完全相符。請保留 DNS 驗證用的 CNAME 以利續期，在 CDK 部署及 CI 設定中提供憑證 ARN，並與其他公開網域一起建立 `mcp.*` 的 DNS 記錄。

有關支援的部署順序和設定指令碼，請參閱儲存庫的[部署概覽（英文）](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md)和 [AWS CDK 指南（英文）](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md)。

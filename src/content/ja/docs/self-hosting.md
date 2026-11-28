---
title: セルフホスティングガイド
description: Docker Compose と Postgres で Expense Budget Tracker を自分のサーバーで動かす手順です。
---

## 必要なもの

- Docker と Docker Compose
- Postgres 18（Compose ファイルに含まれています）

## クイックスタート

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

この手順で Postgres が起動し、マイグレーションが実行されます。続いて、次のサービスが起動します。

- `http://localhost:3000` の Web アプリ
- `http://localhost:8081` の認証サービス
- Docker Compose 内の為替レート取得ワーカー

## 設定

`.env.example` を `.env` にコピーし、次の項目を設定します。

- `MIGRATION_DATABASE_URL` — マイグレーションに使うデータベース所有者ロール
- `DATABASE_URL` — Web プロセスが使うアプリ用ロール
- `AUTH_DATABASE_URL` — 認証サービスが使う認証スキーマ用ロール
- `AUTH_MODE` — ローカルで使う場合は `none`、メールの確認コードでログインする環境では `cognito`
- `AUTH_DOMAIN`、`COOKIE_DOMAIN`、`ALLOWED_REDIRECT_URIS` — 認証のルーティングと Cookie の設定

`AUTH_MODE=cognito` の場合は、`.env.example` にある Cognito の設定と `SESSION_ENCRYPTION_KEY` も必要です。

## 更新

```bash
git pull
make up
```

Docker Compose がサービスを再ビルドし、`migrate` コンテナでマイグレーションを再実行します。

## AWS へのデプロイ

本番環境の CDK スタックでは ECS Fargate、RDS、ALB、Cognito、API Gateway、Lambda を使います。アプリケーションの公開ドメインは次のとおりです。

- `app.<domain>` — ALB の背後にある ECS Fargate 上の Web アプリ
- `auth.<domain>` — ALB の背後にある、メールのワンタイムコードと OAuth を扱う認証サービス
- `api.<domain>/v1/*` — API Gateway と Lambda を使う、プログラム向けの SQL REST API
- `mcp.<domain>/mcp` — 専用の API Gateway HTTP API と MCP Lambda を使うホスト型 MCP サービス

MCP のカスタムドメインには、ドメイン名が `mcp.<domain>` と完全に一致するパブリック ACM 証明書が必要です。更新できるよう DNS 検証用の CNAME を残し、証明書の ARN を CDK のデプロイと CI に渡し、ほかの公開ドメインとあわせて `mcp.*` の DNS レコードを作成してください。

サポート対象のデプロイ手順とセットアップスクリプトは、リポジトリの [デプロイ概要（英語）](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) と [AWS CDK ガイド（英語）](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) を参照してください。

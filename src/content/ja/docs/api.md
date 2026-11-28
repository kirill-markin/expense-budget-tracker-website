---
title: API リファレンス
description: 家計データにプログラムからアクセスするためのエージェント設定手順と SQL API の仕様をまとめています。
---

## 概要

Expense Budget Tracker のプログラム向け公開 API は、次の URL から利用できます。

`https://api.expense-budget-tracker.com/v1/`

この API には 2 通りの接続方法があります。

1. `GET /v1/` から始める**エージェントによる接続設定**
2. 発行済みの長期間有効な ApiKey を使う **HTTP での直接アクセス**

すべてのリクエストには、Web アプリと同じ Postgres の行レベルセキュリティが適用されます。

MCP 対応のクライアントは、`https://mcp.expense-budget-tracker.com/mcp` のホスト型 [MCP コネクタ](/ja/docs/mcp-connector/) を利用し、ブラウザで OAuth 認可を行います。ここでは、長期間有効な `ApiKey` を使う別系統の Agent API について、接続設定と HTTP リクエストの仕様を説明します。

## ディスカバリー、ソースコード、実行時のスキーマ

まず次の URL を使います。

`https://api.expense-budget-tracker.com/v1/`

ディスカバリーレスポンスには、初回認証の方法と、次に呼び出すエンドポイントが記載されています。README と実装のソースコードへのリンクもあります。API は次のエンドポイントを公開しています。

- `GET /v1/schema`
- `GET /v1/openapi.json` と `GET /v1/swagger.json` は互換性確認用です。OpenAPI を提供していない旨と、ディスカバリーエンドポイントおよびソースコードへのリンクを返します。

`/v1/sql/query`、`/v1/sql/execute`、互換性のための `/v1/sql` で使えるリレーションと列の正確な一覧は、`schema` で確認してください。

## エージェントによる接続設定

Claude Code、Codex、OpenClaw などのエージェントに接続を任せる場合は、まずディスカバリーエンドポイントを呼び出し、サーバーが返すアクションに従います。

### 認証フロー

1. `GET https://api.expense-budget-tracker.com/v1/` を実行します。
2. 返された `send_code` アクションと `bootstrapUrl` を読み取ります。
3. ユーザーのメールアドレスを `https://auth.expense-budget-tracker.com/api/agent/send-code` に `POST` します。
4. `otpSessionToken` を受け取ります。
5. ユーザーに、メールで届いた 8 桁の確認コードを聞きます。
6. `code`、`otpSessionToken`、`label` を `https://auth.expense-budget-tracker.com/api/agent/verify-code` に `POST` します。
7. 長期間有効な `ApiKey` を受け取ります。
8. キーをチャットのメモリとは別の場所に保存します。
9. `GET https://api.expense-budget-tracker.com/v1/me` を実行します。
10. `GET https://api.expense-budget-tracker.com/v1/workspaces` を実行します。
11. 必要に応じて `POST https://api.expense-budget-tracker.com/v1/workspaces` でワークスペースを作成します。
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select` を実行します。
13. `GET https://api.expense-budget-tracker.com/v1/schema` を実行します。
14. 読み取りは `POST https://api.expense-budget-tracker.com/v1/sql/query`、承認済みの書き込みは `POST https://api.expense-budget-tracker.com/v1/sql/execute` で行います。

### 認証ヘッダー

- `Authorization: ApiKey <key>`

### ワークスペースの扱い

- `POST /v1/workspaces/{workspaceId}/select` で API キーの既定のワークスペースを保存します。
- 保存後は `/v1/sql/query`、`/v1/sql/execute`、互換性のための `/v1/sql` で `X-Workspace-Id` を省略できます。
- 1 回のリクエストに限って保存済みのワークスペースを上書きする場合は、`X-Workspace-Id: <workspaceId>` を使えます。
- ユーザーがアクセスできるワークスペースが 1 つだけで、そのキーに選択が保存されていない場合は、API がそのワークスペースを自動で選択して保存し、使用します。

ユーザー側の手順は [AI エージェントの設定](/ja/docs/agent-setup/) を参照してください。

## 発行済みのキーによる HTTP での直接アクセス

長期間有効な ApiKey があれば、スクリプト、cron ジョブ、ダッシュボード、独自アプリから同じ API を直接呼び出せます。

### 認証

ApiKey を認証ヘッダーに指定します。

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` が必要なのは、そのキーに既定のワークスペースが保存されていない場合か、そのリクエストだけ別のワークスペースを使う場合です。

- `Authorization: ApiKey ebta_your_key_here`
- 必要に応じて `X-Workspace-Id: <workspaceId>`

## エンドポイント一覧

- `GET /v1/` — 公開ディスカバリーエンドポイント
- `GET /v1/openapi.json` と `GET /v1/swagger.json` — 互換性確認用。ソースコードの場所を案内し、API 仕様は返しません
- `GET /v1/me` — 認証済みアカウントの情報
- `GET /v1/workspaces` — キーの所有者が利用できるワークスペースの一覧
- `POST /v1/workspaces` — ワークスペースを作成
- `POST /v1/workspaces/{workspaceId}/select` — このキーの既定のワークスペースを保存
- `GET /v1/schema` — SQL で利用可能なリレーションと列を確認
- `POST /v1/sql/query` — 読み取り専用の `SELECT` または `WITH ... SELECT` 文を 1 つ実行
- `POST /v1/sql/execute` — 承認済みの `INSERT`、`UPDATE`、`DELETE` 文のいずれか 1 つを実行
- `POST /v1/sql` — 複数の文をアトミックに実行するスクリプト用の互換エンドポイント

## SQL の利用条件

主なエンドポイントは、読み取りと書き込みに分かれています。

- `POST /v1/sql/query` は、読み取り専用の `SELECT` または `WITH ... SELECT` 文を 1 つだけ受け付けます。
- `POST /v1/sql/execute` は、`INSERT`、`UPDATE`、`DELETE` のいずれかの変更文を 1 つだけ受け付けます。対応する `WITH` 形式も使えます。
- 互換性のための `POST /v1/sql` は、制限付きの複数文スクリプトを受け付け、全体をアトミックに適用します。この動作が必要な場合に限って使用してください。

次の形式は利用できません。

- 通常の `/v1/sql/query` と `/v1/sql/execute` への複数文の送信
- `CREATE`、`DROP`、`ALTER` などの DDL
- `BEGIN`、`COMMIT`、`ROLLBACK` などのトランザクション制御文
- `set_config()`
- SQL コメント
- 引用符で囲んだ識別子
- ドル引用符で囲んだ文字列

サーバーは照会できるリレーションも制限します。SQL を生成する前に `/v1/schema` で利用可能なリレーションと列を確認してください。

現在公開されているリレーションは以下のとおりです。

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts`（読み取り専用）
- `fx_rates_raw`（読み取り専用）
- `fx_rates_daily`（読み取り専用）

## 上限

- 1 リクエストあたりの結果は 100 行まで
- 変更の対象は、変更文およびリクエストごとに 100 行まで
- SQL リクエスト全体の制限時間は 25 秒
- 1 キーあたり、毎秒 10 リクエスト、1 日 10,000 リクエストまで

## セキュリティ

- API キーは SHA-256 のハッシュとして保存します。平文は永続化しません。
- データベースの RLS でワークスペースを分離します。
- キーはアプリからいつでも失効させられます。
- ワークスペースからメンバーを削除すると、そのメンバーのキーはすべて自動で失効します。

---
title: アーキテクチャ
description: システムの構成、データモデル、複数通貨に対応する仕組み、認証モデルの概要。
---

## システム構成

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

6 つのコンポーネントで、1 つのデータベースを使います。

1. **web** — ダッシュボードと API ルートを備えた Next.js アプリ
2. **auth** — 認証ドメインで、メールの確認コードによるログインと、エージェントの初回認証を担当
3. **sql-api** — API Gateway 経由でプログラムからのアクセスを処理する AWS Lambda
4. **mcp** — ホスト型 MCP エンドポイント専用の AWS Lambda と API Gateway HTTP API
5. **worker** — ECB、CBR、NBS から日次の為替レートを取得
6. **Postgres** — 行レベルセキュリティを適用する、データの唯一の参照元

## データモデル

- **ledger_entries** — 口座ごとの資金の増減（収入、支出、資金移動）を、1 件につき 1 行の明細として記録
- **budget_lines** — 予算表のセルを追記方式で保存し、最新の書き込みを採用
- **budget_comments** — 予算表のセルに付けたメモを追記方式で保存
- **workspace_settings** — 集計通貨やワークスペース単位の設定
- **account_metadata** — 流動性の分類など、口座ごとのメタデータ
- **exchange_rates** — 照会時の換算に使う日次の為替レート
- **workspaces** / **workspace_members** — テナント間のデータ分離
- **accounts** — 台帳の明細から生成するビュー

## 複数通貨

金額はすべて元の通貨で保存します。読み取り時に `exchange_rates` を SQL で結合して集計通貨に換算するため、保存前の換算で精度が落ちることはありません。

## 認証

環境変数 `AUTH_MODE` で 2 つのモードを切り替えます。

- `none` — 認証なし。ローカルのワークスペースは 1 つ
- `cognito` — AWS Cognito を使い、メールで届くワンタイムの確認コードで認証。パスワードは不要で、誰でも登録可能

プログラムからアクセスする場合、公開ディスカバリーエンドポイントは `GET /v1/` です。エージェントは認証ドメインでメールの確認コードを使って認証し、長期間有効な ApiKey を取得した後、API Gateway 経由でプログラム向け API に SQL を送ります。

MCP 対応クライアントは、別のエンドポイント `https://mcp.expense-budget-tracker.com/mcp` に接続します。このエンドポイントは専用の API Gateway HTTP API と MCP Lambda が担当し、ユーザーはブラウザで認証ドメインを開き、OAuth で接続を許可します。

ユーザーごとに分離されたワークスペースが割り当てられます。RLS ポリシーは、プログラムからの SQL リクエストを含むすべてのクエリで、ワークスペースへの所属を確認します。

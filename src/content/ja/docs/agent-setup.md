---
title: AI エージェントの設定
description: Claude Code、Codex、OpenClaw に接続案内の URL をひとつ渡します。エージェントは案内に従い、8 桁の確認コードで認証してから、長期間有効な ApiKey を保存し、ワークスペースにアクセスします。
---

## エージェントに渡すリンク

次の URL をそのまま渡してください。

`https://api.expense-budget-tracker.com/v1/`

この公開ディスカバリーエンドポイントが、AI エージェント向けの正式な接続案内です。初回認証の方法、次に呼び出すエンドポイント、接続後の認証方式に加え、実行時のスキーマとオープンソースの実装の参照先が記載されています。

このガイドは、ターミナルで動くエージェントや HTTP クライアントが Agent API に直接接続する手順を説明します。MCP 対応クライアントは、ホスト型 [MCP コネクタ](/ja/docs/mcp-connector/) を利用できます。接続先は `https://mcp.expense-budget-tracker.com/mcp` で、ブラウザでの OAuth 認可を使うため、ApiKey の初回発行手順は不要です。

## ユーザーが行うこと

1. Claude Code、Codex、OpenClaw など、HTTP リクエストを送れるエージェントを開きます。
2. `https://api.expense-budget-tracker.com/v1/` を使って Expense Budget Tracker に接続するよう伝えます。
3. メールアドレスを聞かれたら、Expense Budget Tracker で使っているアドレスを伝えます。
4. 受信トレイを開き、届いたメールにある 8 桁の確認コードを見ます。
5. そのコードをエージェントに伝えます。
6. 発行された ApiKey をチャットのメモリとは別の場所に保存するよう伝えてから、データの取り込み、照会、予算管理などの作業に進みます。

ログイン時にキーを手動でコピーして貼り付ける必要はありません。メールの確認コードで認証が済むと、エージェントが自分で接続を設定します。

## エージェントが行うこと

一連の手順は次のとおりです。

1. `GET https://api.expense-budget-tracker.com/v1/` を実行します。
2. ディスカバリーレスポンスを読み、返されたアクションに従います。次の手順をハードコードしないでください。
3. 返された `bootstrapUrl` にユーザーのメールアドレスを `POST` します。
4. `otpSessionToken` と `verify_code` アクションを受け取ります。
5. ユーザーに、メールで届いた 8 桁の確認コードを聞きます。
6. `code`、`otpSessionToken`、接続の `label` を `https://auth.expense-budget-tracker.com/api/agent/verify-code` に `POST` します。
7. 新しい `ApiKey` を受け取ります。
8. キーをチャットのメモリとは別の場所に保存します。変数名は `EXPENSE_BUDGET_TRACKER_API_KEY` を推奨します。
9. `Authorization: ApiKey <key>` を付けて `GET https://api.expense-budget-tracker.com/v1/me` を実行します。
10. `GET https://api.expense-budget-tracker.com/v1/workspaces` を実行します。
11. 必要に応じて `POST /v1/workspaces` でワークスペースを作成します。
12. `POST /v1/workspaces/{workspaceId}/select` で既定のワークスペースを保存します。
13. `GET https://api.expense-budget-tracker.com/v1/schema` で利用可能なリレーションを確認します。
14. 読み取りは `POST https://api.expense-budget-tracker.com/v1/sql/query`、承認済みの書き込みは `POST https://api.expense-budget-tracker.com/v1/sql/execute` で行います。

ワークスペースは明示的に選択でき、その選択は API キーごとに保持されます。`POST /v1/workspaces/{workspaceId}/select` で選択すると、以後の `/v1/sql/query` と `/v1/sql/execute` では `X-Workspace-Id` を省略できます。特定のリクエストに限って別のワークスペースを使う場合は、`X-Workspace-Id` で上書きできます。互換性のための `POST /v1/sql` は、複数の文をアトミックに実行するスクリプト専用です。通常の読み取りや書き込みには使いません。

ユーザーがアクセスできるワークスペースが 1 つだけで、そのキーに選択が保存されていない場合は、バックエンドがそのワークスペースを自動で選択して保存し、使用します。

## エージェントが保存するもの

`verify-code` が返すキーは長期間有効です。チャットのメモリだけに頼らないでください。

- ユーザーがファイルへの書き込みを許可した場合は、ローカルの `.env` ファイルに `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` として保存します。
- 許可がない場合は、現在のシェルで `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` としてエクスポートし、セッション終了後も保持できる場所に保存するようユーザーに伝えます。

認証が必要なリクエストには次を使います。

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` は、保存済みのワークスペースを上書きするときか、まだ選択を保存していないときに使用

## AI エージェント向けの開始手順

まず次を実行します。

```bash
curl https://api.expense-budget-tracker.com/v1/
```

その後はサーバーが返すアクションに従います。次の手順がレスポンスに含まれていれば、その手順をハードコードせずに従ってください。

`verify-code` の実行後、返された `ApiKey` を安全に保存します。続いて次を取得します。

- `/v1/me` でアカウント情報
- `/v1/workspaces` で利用可能なワークスペース
- `/v1/schema` で利用可能な SQL リレーションと列
- `/v1/openapi.json` または `/v1/swagger.json` は、クライアントが慣例的な仕様 URL を確認するときのみ使用。API 仕様ではなく、案内とソースへのリンクが返ります。

## ユーザーが渡せるプロンプトの例

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## 設定後にできること

- 銀行の明細やカード会社からエクスポートした明細をインポートする
- 既存のカテゴリを使って取引を分類する
- 口座残高を銀行の残高と照合する
- カテゴリ、期間、取引先、口座ごとに支出を照会する
- 翌月の予算項目を更新する

個別のエンドポイントや認証の詳細は [API リファレンス](/ja/docs/api/) を参照してください。

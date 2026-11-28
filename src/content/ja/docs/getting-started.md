---
title: はじめに
description: クラウド版の登録も、セルフホスト版の初期設定も、数分で済みます。
---

## クラウド版

運用を任せられるクラウド版なら、すぐに使い始められます。

1. [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com) を開きます。
2. メールアドレスで登録します。ログインにはメールで届くワンタイムの確認コードを使います。
3. Web アプリで支出の記録を始めます。
4. MCP 対応のクライアントを使う場合は、`https://mcp.expense-budget-tracker.com/mcp` を追加し、ブラウザでアクセスを許可します。
5. ターミナルで動くエージェントや HTTP クライアントを使う場合は、`GET https://api.expense-budget-tracker.com/v1/` から始めます。

インストールやサーバーの設定は不要です。Postgres の行レベルセキュリティで、データはワークスペースごとに分離されます。

## エージェントとプログラムからのアクセス

同じクラウド版のアカウントで、次の方法を利用できます。

- `https://app.expense-budget-tracker.com` の Web 画面
- `https://mcp.expense-budget-tracker.com/mcp` のホスト型 [MCP コネクタ](/ja/docs/mcp-connector/)（ブラウザで OAuth 認可）
- `GET https://api.expense-budget-tracker.com/v1/` から始める [Agent API の設定](/ja/docs/agent-setup/)（設定後は `Authorization: ApiKey <key>` を指定して HTTP で直接リクエスト）

## セルフホスト版

ご自身で環境を運用する場合は、[セルフホスティングガイド](/ja/docs/self-hosting/) を参照してください。

## デモモード

アプリにはデモモードがあります。ヘッダーで「すべて」から「デモ」に切り替えると、データベースを用意せずにサンプルデータでアプリを試せます。

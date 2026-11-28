---
title: サポート
description: ホスト型 MCP サービスを含む Expense Budget Tracker のサポート窓口と、セキュリティ上の問題を報告する方法です。
slug: support
sections:
  - type: simple_markdown_page
---

## ホスト型サービスと MCP のサポート

ホスト型アプリ、アカウント、OAuth 認可、公開 MCP サーバーに関するお問い合わせは、[markinkirill@gmail.com](mailto:markinkirill@gmail.com) までメールでお送りください。可能な範囲で対応します。回答までの時間は保証していません。

調査に必要な情報だけをお知らせください。

- クライアント名とバージョン
- 問題が発生した日付、時刻、タイムゾーン
- 該当のエンドポイントまたはページ
- 問題が起きた OAuth の手順、または MCP ツール名
- エラーの正確な文面とリクエスト ID（表示された場合。機密情報は伏せてください）
- 期待していた動作と実際の動作

パスワード、セッション Cookie、OAuth コード、アクセストークン、リフレッシュトークン、API キー、加工していない家計データ、機密情報を伏せていないリクエスト本文は送らないでください。

## セキュリティ上の問題の報告

脆弱性が疑われる場合は、公開の GitHub Issue への投稿を避けてください。件名を **Expense Budget Tracker security report** とし、機密情報を除いた最小限の再現手順を添えて [markinkirill@gmail.com](mailto:markinkirill@gmail.com) にお送りください。有効な認証情報や家計データは記載しないでください。第三者がアクセスできる状態になった可能性がある場合は、まず **設定 → エージェントとプログラムからのアクセス → 接続済みのエージェント** で該当する接続を失効させ、影響を受けたほかの認証情報も更新してください。

## 不具合、セルフホスティング、コミュニティでの質問

再現できる不具合やセルフホスティングに関する質問、コミュニティでの議論など、公開できる内容は [GitHub の Issue](https://github.com/kirill-markin/expense-budget-tracker/issues) に投稿してください。事前に既存の Issue を検索し、ログやスクリーンショットから個人情報や機密情報を除いてください。デプロイや開発については、[セルフホスティングガイド](/ja/docs/self-hosting/) と [ソースリポジトリ（英語）](https://github.com/kirill-markin/expense-budget-tracker) を参照してください。

## MCP の問題を報告する前に

クライアントが Streamable HTTP によるリモート MCP、PKCE を使う OAuth 2.1 の認可コードフロー、動的クライアント登録（Dynamic Client Registration）に対応しているか確認してください。[MCP ガイド](/ja/docs/mcp-connector/) に記載された共通のエンドポイントをそのまま使って接続し直し、一度再試行してください。問題が続く場合は、機密情報を伏せたうえで、上記の情報をお送りください。

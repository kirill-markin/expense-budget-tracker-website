import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_JA = {
  locale: "ja",
  title: "機能",
  description:
    "複数通貨の管理、予算管理、ダッシュボード、ホスト型 MCP、Agent API、セルフホスティング、ワークスペースの分離に対応しています。",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "機能",
      intro: "家計データを自分で管理しながら、収支や残高を把握できます。",
      items: [
        {
          title: "複数通貨の口座",
          description:
            "取引は元の通貨のまま保存し、表示や集計の際に ECB、CBR、NBS の日次為替レートで集計通貨に換算します。この方法なら、保存前の換算で精度が落ちることを避けられます。",
        },
        {
          title: "予算表",
          description:
            "月ごとの収入と支出にカテゴリ別の予定額を設定し、実績額との差を確認できます。変更はすべて追記方式の監査ログに残ります。",
        },
        {
          title: "残高管理",
          description:
            "台帳の明細をもとに、各口座の残高の推移を自動で計算します。残高の合計は任意の通貨で表示でき、自分の口座間で動かしたお金は「資金移動」として記録できます。",
        },
        {
          title: "ダッシュボード",
          description:
            "支出の内訳や残高の推移をグラフで確認し、為替の影響を分析できます。アプリに組み込まれているため、外部の BI ツールは不要です。",
        },
        {
          title: "Agent API",
          description:
            "CLI や HTTP を直接使うエージェント向けの接続方法です。GET https://api.expense-budget-tracker.com/v1/ から始め、ApiKey で認証して、制限付きの SQL を実行します。行レベルセキュリティ（RLS）が常に適用され、ワークスペースの選択、レート制限、監査にも対応しています。",
        },
        {
          title: "ホスト型 MCP サーバー",
          description:
            "OAuth 対応のリモート MCP クライアントは https://mcp.expense-budget-tracker.com/mcp に接続し、必須の expenses:read スコープで家計データを照会できます。データの作成・変更・削除には任意の expenses:write スコープが必要です。クライアントがその権限を要求すると、OAuth の同意画面に表示されます。",
        },
        {
          title: "AI チャット",
          description:
            "アプリ内のチャットで家計データを確認できます。台帳の明細をもとに、支出について質問したり、期間を変えて比較したり、傾向を調べたりできます。",
        },
        {
          title: "ワークスペースの分離",
          description:
            "Postgres の行レベルセキュリティでデータを分離します。ユーザーごとにワークスペースが割り当てられます。共有ワークスペースにはほかのユーザーを招待でき、アクセス権も管理できます。",
        },
        {
          title: "セルフホスティング",
          description:
            "Docker Compose と Postgres で、手元の環境や自分のサーバーで動かせます。特定の事業者に縛られず、家計データを自分で管理できます。",
        },
        {
          title: "パスワード不要の認証",
          description:
            "AWS Cognito を使って、メールで届くワンタイムの確認コードでログインします。パスワードを覚える必要がなく、パスワードの漏えいも心配いりません。誰でも登録でき、ワークスペースは自動で作成されます。",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "ja" };

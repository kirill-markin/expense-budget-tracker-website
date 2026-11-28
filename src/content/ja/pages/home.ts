import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_JA = {
  locale: "ja",
  title: "Expense Budget Tracker｜オープンソースの家計管理ツール",
  description:
    "複数の通貨で支出や予算を管理できるオープンソースの家計管理ツールです。ダッシュボード、ホスト型 MCP サーバー、Agent API を備えています。",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "支出を記録する。",
        "予算を立てる。",
        "データは自分で管理する。",
      ],
      subtitle:
        "複数の通貨で口座と予算を管理し、ダッシュボードで家計を見渡せるオープンソースのツールです。初期設定も AI エージェントに任せられます。Claude Code、Codex、OpenClaw のいずれかに API の案内 URL をひとつ渡し、メールで届く確認コードを伝えれば、残りの接続手順はエージェントが進めます。",
      primaryLink: {
        label: "使い始める",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "GitHub で見る",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "OAuth 対応のリモート MCP クライアントの接続先",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "機能",
      intro: "家計データを自分で管理しながら、収支や残高を把握できます。",
      items: [
        {
          title: "複数通貨",
          description:
            "どの通貨の口座でも管理できます。換算には ECB、CBR、NBS の為替レートを使って自動で換算します。",
        },
        {
          title: "予算管理",
          description:
            "月ごとの予算表で、収入と支出の予定額と実績額をカテゴリ別に比較できます。",
        },
        {
          title: "ダッシュボード",
          description:
            "支出の内訳や残高の推移、為替が保有資産に与える影響をグラフで確認できます。",
        },
        {
          title: "セルフホスティング",
          description:
            "Docker Compose と Postgres で動作します。データは自分のサーバーに保存し、外部サービスに依存せずに運用できます。",
        },
        {
          title: "MCP と Agent API",
          description:
            "OAuth 対応のリモート MCP クライアントを接続すると、必須の expenses:read スコープで家計データを照会できます。データの作成・変更・削除には、クライアントが要求できる任意の expenses:write スコープが必要です。この権限は OAuth の同意画面に表示されます。CLI や HTTP を直接使うエージェントは、GET https://api.expense-budget-tracker.com/v1/ から始め、ApiKey で Agent API を利用できます。",
        },
        {
          title: "ワークスペースの分離",
          description:
            "Postgres の行レベルセキュリティで、ユーザーごとのワークスペースを分離します。招待すればほかのユーザーと共有できます。",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "ja" };

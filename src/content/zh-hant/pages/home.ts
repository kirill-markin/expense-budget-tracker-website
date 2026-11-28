import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ZH_HANT = {
  locale: "zh-hant",
  title: "Expense Budget Tracker｜開源個人理財工具",
  description:
    "開源的支出記錄與預算工具，支援多幣別、財務儀表板、託管 MCP 伺服器和 Agent API。",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "記錄支出。",
        "規劃預算。",
        "掌握自己的資料。",
      ],
      subtitle:
        "開源的個人理財工具，支援多幣別、預算規劃和財務儀表板，也能直接由 AI 代理程式完成設定。把 API 探索網址交給 Claude Code、Codex 或 OpenClaw，再用信中的驗證碼確認身分，其餘步驟由代理程式完成。",
      primaryLink: {
        label: "開始使用",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "在 GitHub 查看",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "將支援 OAuth 的遠端 MCP 用戶端連到這個網址",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "功能",
      intro:
        "記帳、編預算、看報表，財務資料由你掌握。",
      items: [
        {
          title: "多幣別",
          description:
            "以任意幣別記錄帳戶收支，並依 ECB、CBR 和 NBS 的匯率自動換算。",
        },
        {
          title: "預算規劃",
          description:
            "按收入和支出類別編排每月預算，在預算表比較預算金額和實際金額。",
        },
        {
          title: "儀表板",
          description:
            "從圖表查看支出明細、餘額走勢，以及匯率變動對整體資產的影響。",
        },
        {
          title: "自行架設",
          description:
            "使用 Docker Compose 和 Postgres。資料留在自己的伺服器上，無須仰賴第三方服務。",
        },
        {
          title: "MCP 和 Agent API",
          description:
            "支援 OAuth 的遠端 MCP 用戶端可用必要的 expenses:read 權限查詢財務資料。用戶端也可加選 expenses:write 權限。這項權限會顯示在 OAuth 授權畫面上，新增、修改或刪除資料時均須取得。使用 CLI 或直接透過 HTTP 存取的代理程式，請從 GET https://api.expense-budget-tracker.com/v1/ 開始，再用 ApiKey 呼叫 Agent API。",
        },
        {
          title: "工作空間隔離",
          description:
            "Postgres 的資料列層級安全性將各使用者的工作空間隔開。你也可以邀請他人共用工作空間。",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "zh-hant" };

import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_ZH_HANT = {
  locale: "zh-hant",
  title: "功能",
  description:
    "支援多幣別記帳、預算規劃、儀表板、託管 MCP、Agent API、自行架設和工作空間隔離。",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "功能",
      intro:
        "記帳、編預算、看報表，財務資料由你掌握。",
      items: [
        {
          title: "多幣別帳戶",
          description:
            "每筆交易都以原始幣別儲存。讀取時才按 ECB、CBR 和 NBS 的每日匯率換算成報表幣別，以免預先換算損失精度。",
        },
        {
          title: "預算表",
          description:
            "按收入和支出類別編排每月預算。設定預算金額，再和實際金額比較，追蹤兩者的差額。每次變更都會新增一筆記錄，方便查核。",
        },
        {
          title: "餘額追蹤",
          description:
            "系統依帳本記錄自動計算各帳戶的餘額，可用任意幣別查看總額。自己的帳戶之間有資金往來時，可以記為轉帳。",
        },
        {
          title: "儀表板",
          description:
            "用內建圖表查看支出分布和餘額走勢，也能分析匯率變動的影響，無須另用商業智慧工具。",
        },
        {
          title: "Agent API",
          description:
            "供命令列或直接發送 HTTP 請求的代理程式使用。從 GET https://api.expense-budget-tracker.com/v1/ 開始，再以 ApiKey 驗證身分並透過 Agent API 執行受限制的 SQL。所有請求都受資料列層級安全性（RLS）約束，並支援工作空間選擇、請求頻率限制和稽核。",
        },
        {
          title: "託管 MCP 伺服器",
          description:
            "支援 OAuth 的遠端 MCP 用戶端可連到 https://mcp.expense-budget-tracker.com/mcp，並使用必要的 expenses:read 權限查詢財務資料。用戶端也可加選 expenses:write 權限。這項權限會顯示在 OAuth 授權畫面上，新增、修改或刪除資料時均須取得。",
        },
        {
          title: "AI 聊天",
          description:
            "內建聊天介面可根據實際帳本記錄回答支出問題、比較不同期間的收支，或找出值得留意的變化。",
        },
        {
          title: "工作空間隔離",
          description:
            "Postgres 的資料列層級安全性會隔離資料。每位使用者都有一個工作空間，也能邀請他人加入共用工作空間，並管理存取權限。",
        },
        {
          title: "自行架設",
          description:
            "使用 Docker Compose 和 Postgres，可在本機或自己的伺服器上執行。不受特定供應商限制，財務資料由你完整掌握。",
        },
        {
          title: "免密碼登入",
          description:
            "透過 AWS Cognito 寄送一次性驗證碼到你的電子郵件信箱。登入無須密碼，也就沒有密碼外洩的風險。開放註冊，完成後會自動建立工作空間。",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "zh-hant" };

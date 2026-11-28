import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_ZH_HANT = {
  locale: "zh-hant",
  title: "費用",
  description:
    "可免費自行架設，也可以使用雲端版。程式碼開源，兩種方案都提供完整功能。",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "費用",
      intro: "每個方案都包含全部功能。",
      tiers: [
        {
          type: "link_tier",
          name: "自行架設",
          price: "免費",
          highlighted: false,
          bullets: [
            "GitHub 上的完整原始碼",
            "Docker Compose + Postgres",
            "包含全部功能",
            "伺服器和資料都由你掌握",
            "社群支援",
          ],
          cta: {
            label: "在 GitHub 查看",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "雲端版",
          price: "Beta 測試期間免費",
          highlighted: true,
          bullets: [
            "由我們代管，部署在 AWS",
            "自動備份",
            "包含全部功能",
            "用電子郵件收到的一次性驗證碼登入",
            "每日更新匯率",
          ],
          cta: {
            label: "開始使用",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "zh-hant" };

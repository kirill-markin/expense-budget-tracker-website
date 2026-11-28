import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages = {
  auth: {
    login: "登入",
    signup: "免費註冊",
    openApp: "開啟應用程式",
  },
  header: {
    features: "功能",
    pricing: "費用",
    docs: "使用文件",
    blog: "部落格",
    toggleMenu: "切換選單",
  },
  footer: {
    productTitle: "產品",
    openSourceTitle: "開源",
    legalTitle: "法律資訊",
    documentation: "使用文件",
    selfHostingGuide: "自行架設指南",
    support: "支援",
    privacyPolicy: "隱私權政策",
    termsOfService: "服務條款",
    builtBy: "由 Kirill Markin 開發",
    localeSwitcherAriaLabel: "選擇語言",
    localeSearchLabel: "搜尋語言",
    localeSearchEmpty: "找不到符合的語言。",
    operatedBy: "營運商為 SAMO DANNI EOOD · VAT：BG207395566 · 國家：保加利亞",
  },
  breadcrumbs: {
    home: "首頁",
    docs: "使用文件",
    blog: "部落格",
  },
  home: {
    humanTitle: "供個人使用",
    humanWebApp: "網頁版",
    agentTitle: "供 AI 代理程式使用",
    agentDescription:
      "將 Expense Budget Tracker 的 MCP 伺服器加入相容的用戶端，就能讓 AI 代理程式讀取和更新你的財務資料。",
    showcaseEyebrow: "實際操作畫面",
    showcaseTitle: "先看看預算工作空間，再了解各項功能",
    showcaseImageAlt:
      "Expense Budget Tracker 的介面，顯示 AI 聊天、預算類別、實際支出、本月資料和往後幾個月的預算。",
  },
  docs: {
    title: "使用文件",
    description:
      "快速入門、AI 代理程式和 MCP 設定、自行架設、API 參考和系統架構概覽。",
  },
  blogIndex: {
    title: "部落格",
    description: "Expense Budget Tracker 的最新消息、教學和實用心得。",
    empty: "文章即將發布。",
  },
  blogPost: {
    publishedLabel: "發布日期",
    bylinePrefix: "作者",
    relatedHeading: "延伸閱讀",
  },
  blogCta: {
    heading: "試用 Expense Budget Tracker",
    buttonLabel: "立即試用",
  },
  legal: {
    lastUpdated: "最後更新：",
  },
} satisfies ReturnType<typeof getSiteMessages>;

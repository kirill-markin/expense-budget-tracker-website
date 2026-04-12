import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "Expense Budget Tracker - 开源个人财务管理",
  description:
    "开源支出与预算追踪器，支持多币种、财务仪表盘，以及面向 Claude Code、Codex 和 OpenClaw 的智能体原生接入。",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "跟踪支出。",
        "规划预算。",
        "掌控你的数据。",
      ],
      subtitle:
        "这是一个开源个人财务追踪器，支持多币种、预算规划、财务仪表盘和智能体原生接入。把一个 API discovery URL 交给 Claude Code、Codex 或 OpenClaw，确认邮件验证码后，剩下的流程交给智能体完成。",
      primaryLink: {
        label: "立即开始",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "查看 GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "先对这个 discovery URL 发起 GET 请求：",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "功能",
      intro: "管理个人财务所需的核心能力，同时保留对自己数据的控制权。",
      items: [
        {
          title: "多币种",
          description: "支持任意币种账户，并基于 ECB、CBR 和 NBS 汇率自动换算。",
        },
        {
          title: "预算规划",
          description: "按月维护收入与支出预算网格，直接比较计划值和实际值。",
        },
        {
          title: "仪表盘",
          description: "直观看到支出结构、余额走势以及汇率变化对资产组合的影响。",
        },
        {
          title: "自托管",
          description: "基于 Docker Compose 与 Postgres。数据保留在你的服务器上。",
        },
        {
          title: "智能体原生 API",
          description:
            "把 discovery URL 交给 Claude Code、Codex 或 OpenClaw。智能体会请求邮箱、验证 8 位验证码、创建自己的 ApiKey、加载账户上下文并选择 workspace。",
        },
        {
          title: "Workspace 隔离",
          description:
            "通过 Postgres 行级安全隔离每个 workspace。可通过邀请分享访问权限。",
        },
      ],
    },
  ],
  body: "",
};

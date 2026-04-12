import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "Expense Budget Tracker - 开源个人财务管理工具",
  description:
    "开源个人财务管理工具，支持多币种、预算规划、财务仪表盘，以及面向 Claude Code、Codex 和 OpenClaw 的智能体原生接入。",
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
        "这是一款开源个人财务管理工具，支持多币种、预算规划、财务仪表盘和智能体原生接入。将一个 API 发现地址提供给 Claude Code、Codex 或 OpenClaw，确认邮件中的验证码后，其余流程都可以交给智能体自动完成。",
      primaryLink: {
        label: "立即开始",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "查看 GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "从这个发现地址开始，发送 GET 请求：",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "功能",
      intro: "管理个人财务所需的一切能力，同时不必放弃对自己数据的控制权。",
      items: [
        {
          title: "多币种",
          description:
            "支持以任意币种记录账户，并根据 ECB、CBR 和 NBS 汇率自动换算。",
        },
        {
          title: "预算规划",
          description:
            "按月规划收入和支出分类预算，直接对比计划与实际。",
        },
        {
          title: "仪表盘",
          description:
            "以可视化方式查看支出结构、余额随时间的变化，以及汇率波动对资产组合的影响。",
        },
        {
          title: "自托管",
          description:
            "基于 Docker Compose 和 Postgres 部署。数据保留在你的服务器上，无需依赖第三方服务。",
        },
        {
          title: "智能体原生 API",
          description:
            "将一个发现地址提供给 Claude Code、Codex 或 OpenClaw 后，智能体会请求你的邮箱、验证 8 位验证码、为自己创建 ApiKey、加载账户上下文、选择工作区，然后开始处理任务。",
        },
        {
          title: "工作区隔离",
          description:
            "基于 Postgres 的行级安全策略，每位用户都有独立的工作区，并可通过邀请共享访问权限。",
        },
      ],
    },
  ],
  body: "",
};

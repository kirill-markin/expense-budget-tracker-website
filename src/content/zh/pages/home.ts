import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "Expense Budget Tracker - 开源个人财务与预算工具",
  description:
    "开源的个人财务与预算工具，支持多币种、预算规划、财务看板，并为 Claude Code、Codex 和 OpenClaw 提供面向智能体的接入体验。",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "记录支出。",
        "规划预算。",
        "数据握在自己手里。",
      ],
      subtitle:
        "这是一款开源的个人财务与预算工具，支持多币种、预算规划、财务看板，以及面向 Claude Code、Codex 和 OpenClaw 的智能体接入。把同一个 API 发现入口交给 Claude Code、Codex 或 OpenClaw，确认邮件里的验证码后，后续流程就可以交给智能体继续完成。",
      primaryLink: {
        label: "立即开始",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "查看 GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "先对这个发现入口发起 GET 请求：",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "功能",
      intro: "个人财务管理该有的能力都在这里，同时数据控制权始终在你手里。",
      items: [
        {
          title: "多币种",
          description:
            "账户可按任意币种记录，系统会根据 ECB、CBR 和 NBS 汇率自动完成换算。",
        },
        {
          title: "预算规划",
          description:
            "在月度预算表里规划收入和各项支出，并直接对比预算与实际。",
        },
        {
          title: "仪表盘",
          description:
            "用清晰的图表查看支出构成、余额变化趋势，以及汇率波动对整体资产的影响。",
        },
        {
          title: "自托管",
          description:
            "基于 Docker Compose 和 Postgres 即可部署，数据留在你自己的服务器上，不依赖第三方托管服务。",
        },
        {
          title: "面向智能体的 API",
          description:
            "把同一个发现入口交给 Claude Code、Codex 或 OpenClaw 后，智能体会询问你的邮箱、校验 8 位验证码、为自己创建 ApiKey、加载账户上下文、选定工作区，然后开始处理任务。",
        },
        {
          title: "工作区隔离",
          description:
            "由 Postgres 行级安全在数据库层面强制隔离。每位用户默认拥有独立工作区，也可以通过邀请共享协作。",
        },
      ],
    },
  ],
  body: "",
};

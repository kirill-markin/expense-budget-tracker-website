import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "定价",
  description: "支持免费自行部署，也可选择托管云服务。开源，全部功能均可使用。",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "定价",
      intro: "无论选择哪种方案，全部功能都可使用，不设功能限制。",
      tiers: [
        {
          type: "link_tier",
          name: "自行部署",
          price: "免费",
          highlighted: false,
          bullets: [
            "GitHub 提供完整源代码",
            "基于 Docker Compose 和 Postgres 部署",
            "全部功能均可使用",
            "服务器和数据完全由你掌控",
            "社区支持",
          ],
          cta: {
            label: "前往 GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "云端服务",
          price: "测试期免费",
          highlighted: true,
          bullets: [
            "托管于 AWS",
            "自动备份",
            "全部功能均可使用",
            "邮箱一次性验证码登录",
            "汇率每日更新",
          ],
          cta: {
            label: "开始使用",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

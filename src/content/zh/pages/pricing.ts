import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "价格",
  description: "可免费自行托管，也可使用云端托管服务。开源，不设功能限制。",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "价格",
      intro: "所有方案都包含全部功能，没有任何功能限制。",
      tiers: [
        {
          type: "link_tier",
          name: "自托管",
          price: "免费",
          highlighted: false,
          bullets: [
            "GitHub 提供完整源代码",
            "Docker Compose + Postgres",
            "包含全部功能",
            "你的服务器，你的数据",
            "社区支持",
          ],
          cta: {
            label: "查看 GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "云端托管",
          price: "测试阶段免费",
          highlighted: true,
          bullets: [
            "AWS 托管部署",
            "自动备份",
            "包含全部功能",
            "邮箱一次性验证码登录",
            "每日汇率更新",
          ],
          cta: {
            label: "立即开始",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

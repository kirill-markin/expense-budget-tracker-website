import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "价格",
  description: "可免费自托管，也可使用托管云版本。开源，无功能阉割。",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "价格",
      intro: "所有方案都包含全部功能，没有 feature gating。",
      tiers: [
        {
          type: "link_tier",
          name: "自托管",
          price: "免费",
          highlighted: false,
          bullets: [
            "完整源代码托管在 GitHub",
            "Docker Compose + Postgres",
            "全部功能可用",
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
          name: "Cloud",
          price: "测试期免费",
          highlighted: true,
          bullets: [
            "托管在 AWS",
            "自动备份",
            "全部功能可用",
            "邮箱 OTP 登录",
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

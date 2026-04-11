import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_EN: PageContent = {
  locale: "en",
  title: "Pricing",
  description:
    "Free self-hosted deployment or managed cloud hosting. Open source, no feature gating.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Pricing",
      intro: "All features are available in every plan. No feature gating.",
      tiers: [
        {
          type: "link_tier",
          name: "Self-Hosted",
          price: "Free",
          highlighted: false,
          bullets: [
            "Full source code on GitHub",
            "Docker Compose + Postgres",
            "All features included",
            "Your server, your data",
            "Community support",
          ],
          cta: {
            label: "View on GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Free during beta",
          highlighted: true,
          bullets: [
            "Managed hosting on AWS",
            "Automatic backups",
            "All features included",
            "Email OTP authentication",
            "Daily FX rate updates",
          ],
          cta: {
            label: "Get Started",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

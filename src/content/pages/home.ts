import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT: PageContent = {
  title: "Expense Budget Tracker",
  description:
    "Open-source expense and budget tracker with multi-currency support, budget planning, and financial dashboards.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Track expenses.",
        "Plan budgets.",
        "Own your data.",
      ],
      subtitle:
        "Open-source personal finance tracker with multi-currency support, budget planning, and financial dashboards. Self-host on Postgres or use the cloud version.",
      primaryLink: {
        label: "Get Started",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "View on GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Free and open source.",
      hintLink: {
        label: "View on GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
    },
    {
      type: "feature_list",
      title: "Features",
      intro:
        "Everything you need to track personal finances, without giving up control of your data.",
      items: [
        {
          title: "Multi-Currency",
          description:
            "Track accounts in any currency. Automatic FX conversion from ECB, CBR, and NBS rates.",
        },
        {
          title: "Budget Planning",
          description:
            "Monthly budget grid with income and spending categories. Compare planned vs actual.",
        },
        {
          title: "Dashboards",
          description:
            "Visual breakdowns of spending, balances over time, and FX impact on your portfolio.",
        },
        {
          title: "Self-Hosted",
          description:
            "Docker Compose with Postgres. Your data stays on your server. No third-party dependencies.",
        },
        {
          title: "API Access",
          description:
            "SQL API with bearer token auth. Connect LLM agents, scripts, or dashboards directly.",
        },
        {
          title: "Workspace Isolation",
          description:
            "Row-level security in Postgres. Each user gets an isolated workspace. Share via invites.",
        },
      ],
    },
  ],
  body: "",
};

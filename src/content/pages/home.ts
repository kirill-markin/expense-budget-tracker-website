import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_METADATA = {
  title: "Expense Budget Tracker - Open Source Personal Finance",
  description:
    "Open-source expense and budget tracker with multi-currency support, financial dashboards, and agent-native onboarding for Claude Code, Codex, and OpenClaw.",
} as const;

export const HOME_PAGE_CONTENT: PageContent = {
  title: HOME_PAGE_METADATA.title,
  description: HOME_PAGE_METADATA.description,
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
        "Open-source personal finance tracker with multi-currency support, budget planning, financial dashboards, and agent-native setup. Give Claude Code, Codex, or OpenClaw one API discovery URL, confirm the email code, and let the agent handle the rest.",
      primaryLink: {
        label: "Get Started",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "View on GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Start with GET on this discovery URL:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
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
          title: "Agent-Native API",
          description:
            "Share one discovery URL with Claude Code, Codex, or OpenClaw. The agent asks for your email, verifies the 8-digit code, provisions its own ApiKey, loads account context, selects a workspace, and starts working.",
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

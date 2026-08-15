import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_EN: PageContent = {
  locale: "en",
  title: "Expense Budget Tracker - Open Source Personal Finance",
  description:
    "Open-source expense and budget tracker with multi-currency support, financial dashboards, a hosted MCP server, and an Agent API.",
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
      hintText: "Connect your OAuth-capable remote MCP client:",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
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
          title: "MCP and Agent API",
          description:
            "Connect an OAuth-capable remote MCP client to query your financial data with the required expenses:read scope. The client can also request the optional expenses:write scope, which appears on the OAuth consent screen and is required for mutations. For CLI or direct HTTP agents, start with GET https://api.expense-budget-tracker.com/v1/ and use the Agent API with an ApiKey.",
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

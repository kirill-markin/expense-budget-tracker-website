import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_EN: PageContent = {
  locale: "en",
  title: "Features",
  description:
    "Multi-currency tracking, budget planning, dashboards, hosted MCP access, an Agent API, self-hosting, and workspace isolation.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Features",
      intro:
        "Everything you need to track personal finances, without giving up control of your data.",
      items: [
        {
          title: "Multi-Currency Accounts",
          description:
            "Store every transaction in its native currency. Daily exchange rates from ECB, CBR, and NBS convert everything to your reporting currency at read time. No lossy pre-conversion.",
        },
        {
          title: "Budget Grid",
          description:
            "Monthly budget with income and spending categories. Set planned values, compare against actuals, and track the gap. Append-only audit trail for every change.",
        },
        {
          title: "Balance Tracking",
          description:
            "Automatic running balances per account derived from the ledger. View totals in any currency. Transfers between your own accounts are first-class citizens.",
        },
        {
          title: "Dashboards",
          description:
            "Visual spending breakdowns, balance charts over time, and FX impact analysis. Built into the app with no external BI tool needed.",
        },
        {
          title: "Agent API",
          description:
            "A separate path for CLI and direct HTTP agents. Start with GET https://api.expense-budget-tracker.com/v1/, then use the ApiKey-authenticated Agent API to run restricted SQL with full RLS enforcement, workspace selection, rate limits, and auditability.",
        },
        {
          title: "Hosted MCP Server",
          description:
            "OAuth-capable remote MCP clients can connect at https://mcp.expense-budget-tracker.com/mcp and query your financial data with the required expenses:read scope. A client can also request the optional expenses:write scope, which appears on the OAuth consent screen and is required for mutations.",
        },
        {
          title: "AI Chat",
          description:
            "Built-in chat interface that understands your financial data. Ask questions about spending, compare periods, or get insights - powered by your actual ledger entries.",
        },
        {
          title: "Workspace Isolation",
          description:
            "Postgres Row-Level Security enforces data isolation. Each user gets a workspace. Invite others to shared workspaces with full access controls.",
        },
        {
          title: "Self-Hosted",
          description:
            "Docker Compose with Postgres. Run locally or on your own server. No vendor lock-in. Full control over your financial data.",
        },
        {
          title: "Passwordless Auth",
          description:
            "Email OTP via AWS Cognito. No passwords to remember or leak. Open registration with automatic workspace provisioning.",
        },
      ],
    },
  ],
  body: "",
};

import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Multi-currency tracking, budget planning, dashboards, API access, self-hosting, and workspace isolation.",
};

const FEATURES = [
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
    title: "SQL API",
    description:
      "Programmatic access via API Gateway with bearer token auth. Run SQL queries with full RLS enforcement. Rate-limited, audited, and scoped to your workspace.",
  },
  {
    title: "AI Chat",
    description:
      "Built-in chat interface that understands your financial data. Ask questions about spending, compare periods, or get insights — powered by your actual ledger entries.",
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
] as const;

export default function FeaturesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Features</h1>
      <p className={styles.subtitle}>
        Everything you need to track personal finances, without giving up
        control of your data.
      </p>
      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <div key={feature.title} className={styles.card}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

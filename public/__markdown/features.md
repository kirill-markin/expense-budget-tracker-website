# Features

Everything you need to track personal finances, without giving up control of your data.

- **Multi-Currency Accounts** - Store every transaction in its native currency. Daily exchange rates from ECB, CBR, and NBS convert everything to your reporting currency at read time. No lossy pre-conversion.
- **Budget Grid** - Monthly budget with income and spending categories. Set planned values, compare against actuals, and track the gap. Append-only audit trail for every change.
- **Balance Tracking** - Automatic running balances per account derived from the ledger. View totals in any currency. Transfers between your own accounts are first-class citizens.
- **Dashboards** - Visual spending breakdowns, balance charts over time, and FX impact analysis. Built into the app with no external BI tool needed.
- **SQL API** - Programmatic access via API Gateway with bearer token auth. Run SQL queries with full RLS enforcement. Rate-limited, audited, and scoped to your workspace.
- **Agent Onboarding** - Share https://app.expense-budget-tracker.com/api/agent with Claude Code, Codex, or OpenClaw. The agent follows the discovery document, asks for your email and 8-digit code, creates its own connection, and keeps working through the agent API.
- **AI Chat** - Built-in chat interface that understands your financial data. Ask questions about spending, compare periods, or get insights - powered by your actual ledger entries.
- **Workspace Isolation** - Postgres Row-Level Security enforces data isolation. Each user gets a workspace. Invite others to shared workspaces with full access controls.
- **Self-Hosted** - Docker Compose with Postgres. Run locally or on your own server. No vendor lock-in. Full control over your financial data.
- **Passwordless Auth** - Email OTP via AWS Cognito. No passwords to remember or leak. Open registration with automatic workspace provisioning.

---
*[View the styled HTML version of this page](https://expense-budget-tracker.com/features/)*

*Tip: Append `.md` to any URL on https://expense-budget-tracker.com to get a clean Markdown version of that page.*
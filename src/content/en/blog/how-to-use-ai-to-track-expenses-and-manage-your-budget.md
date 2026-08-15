---
title: "How to Use AI to Track Expenses and Manage Your Budget"
description: "A practical guide to AI-powered personal finance. Connect through hosted MCP or the Agent API to parse bank statements, categorize transactions, track expenses, and manage your budget."
date: "2026-03-05"
---

You probably already use AI for personal finance in some form. Maybe you paste a bank statement into ChatGPT and ask it to categorize your spending. Or you screenshot your banking app and ask Claude to tally up how much you spent on groceries this month.

That works once. But the answer stays in the chat. Nothing gets saved, nothing gets tracked, and next week you do the same thing again. The AI reads your data, gives you a summary, and then it's gone.

There's a more useful way to use AI for expense tracking. Instead of asking the AI to analyze screenshots, give it actual write access to your financial database. Let the AI record transactions, update your budget, and verify balances directly — not just talk about them.

## What "AI expense tracking" actually looks like in practice

Kirill Markin, the creator of [Expense Budget Tracker](https://expense-budget-tracker.com/), has been categorizing every single personal transaction for over five years. He started doing it by hand — then started building tools to make it faster. The current system uses an AI agent that connects directly to the database through a SQL API.

His weekly routine looks like this: download bank statements (CSV or PDF), drop them into an AI agent, let the agent parse each transaction and record it. The agent already knows his expense categories from previous entries, so it matches most transactions correctly on its own. Kirill reviews what the AI did, fixes the few mistakes, and moves on. The whole process takes about 10 minutes, down from an hour when he was entering everything manually.

The same approach works with many AI tools, including [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and [OpenAI Codex](https://openai.com/index/codex/). MCP-capable clients can use the hosted connector with browser OAuth; terminal agents, scripts, and other HTTP clients can use the direct Agent API with a long-lived `ApiKey`. Both paths reach the same constrained, workspace-scoped financial data surface.

## How to connect your AI agent to your finances

[Expense Budget Tracker](https://expense-budget-tracker.com/) is an open-source personal finance system built on Postgres. It supports two complementary connection paths:

1. **Hosted MCP connector.** In an MCP-capable client, add `https://mcp.expense-budget-tracker.com/mcp` and authorize access in your browser through OAuth. The client then uses scoped OAuth access tokens for read and approved-write tools. The server is hosted, so there is no local MCP process to install or keep running. See the [MCP connector guide](/docs/mcp-connector/).
2. **Direct Agent API.** For terminal agents, scripts, and direct HTTP clients, start at `GET https://api.expense-budget-tracker.com/v1/`. The discovery response guides the agent through email OTP onboarding and returns a long-lived `ApiKey`, sent as `Authorization: ApiKey <key>`. Reads use `POST /v1/sql/query`; approved writes use `POST /v1/sql/execute`. Compatibility `POST /v1/sql` remains available only for atomic multi-statement scripts. See the [API reference](/docs/api/).

With either route, the agent can query your expense data and send approved changes through the dedicated write surface. The direct HTTP route looks like this for a read:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

The success response is a JSON envelope. `data.statements` contains one entry per executed statement; each includes `rows`, `rowCount`, `returnedRowCount`, `totalRowCount`, and `truncated`. `data` also exposes the selected `workspace` and current `limits` context.

## What your AI agent can do with this access

Once connected, the AI agent operates on your actual expense and budget data — not a copy, not a summary, but the live database:

**Parse and record expenses.** Drop a bank statement (CSV, PDF, or a screenshot of your banking app) into your AI agent. The agent reads each line, figures out the amount, date, counterparty, and category, then writes an INSERT statement to the `ledger_entries` table. Each expense goes directly into your database.

**Categorize transactions using your existing categories.** The agent starts by querying what categories you already use. If you've been categorizing "Whole Foods" as "groceries" for months, the AI picks that up and does the same. You don't need to re-explain your system every time.

**Check account balances.** After recording all expenses from a bank statement, the agent can query the `accounts` view and compare the totals against the numbers in your bank. If something doesn't add up, you know a transaction is missing.

**Update your budget forecast.** The `budget_lines` table holds your monthly budget plan — expected income and planned expenses per category. The AI agent can read this month's actuals, compare them to the plan, and suggest (or directly make) adjustments for next month.

**Work with multiple currencies.** Every transaction in the database stays in its original currency. Exchange rates are fetched daily from ECB, CBR, and NBS. The AI doesn't need to convert anything — the database handles currency math at query time.

The schema is intentionally flat and simple. Seven tables, clear column names, no deeply nested structures. AI models produce correct SQL statements against this schema on the first try because there's almost nothing to misunderstand.

## Built-in AI chat for quick tasks

Expense Budget Tracker also has an AI assistant built into the web interface. You connect your OpenAI or Anthropic API key in Settings, and the chat gets a `query_database` tool — the same SQL access, but from inside the app.

This is convenient for quick things: upload a screenshot of a receipt, ask the AI to add it as an expense, confirm, done. The built-in AI follows a strict protocol — it checks your existing categories, looks for duplicate transactions, verifies balances, and only writes to the database after you approve.

For bigger tasks — batch processing multiple bank statements, building automated workflows, integrating with other systems — the external SQL API is more practical. You can use it from any agent or script outside the app.

## Why hosted MCP and direct SQL are complementary

The hosted MCP server is the connector-friendly path for clients that speak the protocol. You add one HTTPS endpoint, authorize in the browser through OAuth, and use separate read and write tools. Expense Budget Tracker runs the remote service, so MCP does not require a process on your computer.

The direct Agent API is the broad HTTP path for terminal agents, scripts, cron jobs, dashboards, and custom applications. Its discovery and OTP flow yields a long-lived `ApiKey`, while the split SQL endpoints make the read/write boundary explicit.

These are two transports over the same constrained, workspace-scoped data surface, not competing architectures. Choose MCP when your client supports remote connectors and browser OAuth; choose the Agent API when direct HTTP is the better fit.

## Is it safe to give AI direct database access?

Yes, within the right constraints. The SQL API in Expense Budget Tracker enforces several layers of protection:

Every query runs through Postgres Row Level Security. The API key is tied to your user and workspace — the AI can only see and modify your expense data, nobody else's.

Only data operations are allowed: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. The AI agent can't create tables, drop anything, or change permissions. The primary query and execute endpoints accept one statement each; compatibility `/v1/sql` accepts only restricted atomic scripts. `set_config()` is blocked to prevent privilege escalation.

API keys are stored as SHA-256 hashes — the plaintext never sits in the database. You can revoke a key instantly from Settings. If you remove a workspace member, all their keys get deleted automatically.

Rate limits cap usage at 10 requests per second and 10,000 per day per key. Each SQL request has a 25-second total deadline, returns at most 100 rows, and can affect at most 100 rows. These numbers are more than enough for expense tracking and budgeting with AI, but they prevent any runaway behavior.

## Practical tips for AI-powered expense tracking

A few things that make the AI expense tracking workflow smoother, based on real daily use:

**Keep your expense categories consistent.** The AI learns from your existing data. If you sometimes call it "restaurants" and sometimes "dining out," the agent will get confused. Pick one name per category and stick with it.

**Verify balances every week.** After the AI records your expenses from a bank statement, check that the account balance in the system matches your bank. This catches missed or duplicate transactions early, before they compound.

**Start with one account.** Don't try to set up all your bank accounts, credit cards, and investment accounts on day one. Start with your main checking account. Let the AI handle that for a few weeks. Add more accounts once the workflow feels solid.

**Review AI categorization every time.** The AI gets most transactions right, but it will occasionally miscategorize something — especially new merchants or unusual expenses. Spend five minutes reviewing. Correcting the AI's mistakes improves future accuracy, because the next time it queries your categories, the corrected data is what it sees.

**Use the budget table, not just expense tracking.** Recording what you already spent is useful but limited. The real value is in maintaining a rolling 12-month budget — rows are categories, columns are months, future months contain your forecast. AI agents are good at updating these forecasts based on actual spending patterns. Ask the agent to adjust next month's budget after reviewing this month's actuals.

## Getting started

1. Sign up at [expense-budget-tracker.com](https://expense-budget-tracker.com/) (free, open source) or [self-host](https://github.com/kirill-markin/expense-budget-tracker) the app on your own server
2. For MCP, add `https://mcp.expense-budget-tracker.com/mcp` in a compatible client and authorize through browser OAuth
3. For direct HTTP, give your agent `GET https://api.expense-budget-tracker.com/v1/` and complete the email OTP flow when asked
4. Drop a bank statement into the connected agent and ask it to parse and record your expenses

The AI will discover your database schema, match your expense categories, and start writing transactions. Review what it recorded, fix anything off, and you've got an AI-managed budget running.

Kirill Markin wrote about his personal methodology in detail: [How I Use AI to Handle My Expenses from Bank Accounts and Budget](https://kirill-markin.com/articles/ai-expense-tracking-bank-accounts-budget/). Five years of every single transaction categorized and tracked — the same approach described in this article, battle-tested on real money across multiple currencies and countries.

The tool is MIT licensed and fully open source at [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Use the hosted version or run it yourself — the SQL API works the same either way.

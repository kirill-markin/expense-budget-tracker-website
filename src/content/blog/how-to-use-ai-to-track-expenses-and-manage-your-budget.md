---
title: "How to Use AI to Track Expenses and Manage Your Budget"
description: "A practical guide to AI-powered personal finance. Give your AI agent an API key, and it will parse bank statements, categorize transactions, track expenses, and manage your budget — all through a SQL API."
date: "2026-03-05"
---

You probably already use AI for personal finance in some form. Maybe you paste a bank statement into ChatGPT and ask it to categorize your spending. Or you screenshot your banking app and ask Claude to tally up how much you spent on groceries this month.

That works once. But the answer stays in the chat. Nothing gets saved, nothing gets tracked, and next week you do the same thing again. The AI reads your data, gives you a summary, and then it's gone.

There's a more useful way to use AI for expense tracking. Instead of asking the AI to analyze screenshots, give it actual write access to your financial database. Let the AI record transactions, update your budget, and verify balances directly — not just talk about them.

## What "AI expense tracking" actually looks like in practice

Kirill Markin, the creator of [Expense Budget Tracker](https://expense-budget-tracker.com/), has been categorizing every single personal transaction for over five years. He started doing it by hand — then started building tools to make it faster. The current system uses an AI agent that connects directly to the database through a SQL API.

His weekly routine looks like this: download bank statements (CSV or PDF), drop them into an AI agent, let the agent parse each transaction and record it. The agent already knows his expense categories from previous entries, so it matches most transactions correctly on its own. Kirill reviews what the AI did, fixes the few mistakes, and moves on. The whole process takes about 10 minutes, down from an hour when he was entering everything manually.

The same approach works with [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [OpenAI Codex](https://openai.com/index/codex/), custom GPTs, or any AI agent that can call HTTP endpoints. The key ingredient is direct database access — not a plugin, not a browser extension, but an API key that lets the AI read and write your financial data.

## How to connect your AI agent to your finances

[Expense Budget Tracker](https://expense-budget-tracker.com/) is an open-source personal finance system built on Postgres. It has a SQL API endpoint at `POST /v1/sql` that accepts SQL queries over HTTP and returns JSON results.

To connect any AI agent:

1. Open the app and go to **Settings → API Keys → Create key**
2. Copy the key (it starts with `ebt_` and you'll only see it once)
3. Tell your AI agent two things: the API endpoint URL and the key

That's it. The agent can now query and modify your expense data. No MCP server to run. No plugin to install. No custom integration to maintain. Any AI that can make an HTTP POST request — which is all of them — works out of the box.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: Bearer ebt_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

The response comes back as a JSON array of rows. No pagination tokens, no nested objects, no SDK.

## What your AI agent can do with this access

With the API key, the AI agent operates on your actual expense and budget data — not a copy, not a summary, but the live database:

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

## Why direct SQL is better than MCP servers and plugins

MCP servers, custom GPT actions, and provider-specific plugins are popular right now for connecting AI to external tools. For personal finance, they introduce unnecessary moving parts.

An MCP server is an extra process you have to run and keep alive. If it crashes, the AI loses access to your expense data mid-conversation. Custom GPT plugins only work with ChatGPT — they won't help you if you switch to Claude or build your own agent. Provider-specific integrations break whenever the provider updates their API.

A SQL API avoids all of this. The interface is an HTTP endpoint and the SQL language. Both have been around for decades and aren't going anywhere. Switch from one AI model to another — same API key, same endpoint, same SQL. The AI agent doesn't care whether it's running inside ChatGPT, Claude Code, or a Python script you wrote yourself.

## Is it safe to give AI direct database access?

Yes, within the right constraints. The SQL API in Expense Budget Tracker enforces several layers of protection:

Every query runs through Postgres Row Level Security. The API key is tied to your user and workspace — the AI can only see and modify your expense data, nobody else's.

Only data operations are allowed: SELECT, INSERT, UPDATE, DELETE. The AI agent can't create tables, drop anything, or change permissions. Multiple statements in a single request are blocked. So is `set_config()`, which prevents privilege escalation.

API keys are stored as SHA-256 hashes — the plaintext never sits in the database. You can revoke a key instantly from Settings. If you remove a workspace member, all their keys get deleted automatically.

Rate limits cap usage at 10 requests per second and 10,000 per day per key. Queries time out after 30 seconds. Responses return at most 100 rows. These numbers are more than enough for expense tracking and budgeting with AI, but they prevent any runaway behavior.

## Practical tips for AI-powered expense tracking

A few things that make the AI expense tracking workflow smoother, based on real daily use:

**Keep your expense categories consistent.** The AI learns from your existing data. If you sometimes call it "restaurants" and sometimes "dining out," the agent will get confused. Pick one name per category and stick with it.

**Verify balances every week.** After the AI records your expenses from a bank statement, check that the account balance in the system matches your bank. This catches missed or duplicate transactions early, before they compound.

**Start with one account.** Don't try to set up all your bank accounts, credit cards, and investment accounts on day one. Start with your main checking account. Let the AI handle that for a few weeks. Add more accounts once the workflow feels solid.

**Review AI categorization every time.** The AI gets most transactions right, but it will occasionally miscategorize something — especially new merchants or unusual expenses. Spend five minutes reviewing. Correcting the AI's mistakes improves future accuracy, because the next time it queries your categories, the corrected data is what it sees.

**Use the budget table, not just expense tracking.** Recording what you already spent is useful but limited. The real value is in maintaining a rolling 12-month budget — rows are categories, columns are months, future months contain your forecast. AI agents are good at updating these forecasts based on actual spending patterns. Ask the agent to adjust next month's budget after reviewing this month's actuals.

## Getting started

1. Sign up at [expense-budget-tracker.com](https://expense-budget-tracker.com/) (free, open source) or [self-host](https://github.com/kirill-markin/expense-budget-tracker) the app on your own server
2. Go to **Settings → API Keys → Create key** and copy the key
3. Give the key and the endpoint (`https://api.expense-budget-tracker.com/v1/sql`) to your AI agent
4. Drop a bank statement into the agent and ask it to parse and record your expenses

The AI will discover your database schema, match your expense categories, and start writing transactions. Review what it recorded, fix anything off, and you've got an AI-managed budget running.

Kirill Markin wrote about his personal methodology in detail: [How I Use AI to Handle My Expenses from Bank Accounts and Budget](https://kirill-markin.com/articles/ai-expense-tracking-bank-accounts-budget/). Five years of every single transaction categorized and tracked — the same approach described in this article, battle-tested on real money across multiple currencies and countries.

The tool is MIT licensed and fully open source at [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Use the hosted version or run it yourself — the SQL API works the same either way.

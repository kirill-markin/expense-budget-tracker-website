---
title: "How to Track Expenses and Manage Your Budget with Claude Code"
description: "Set up Claude Code as your personal finance assistant. Give it a SQL API key to your expense tracker, and it will parse bank statements, categorize transactions, check balances, and manage your budget — all from the terminal."
date: "2026-03-05"
---

Claude Code is Anthropic's AI agent that runs in your terminal. It can read files, write code, execute commands, and make HTTP requests. Most people use Claude Code for software development. But it turns out to be one of the best tools for managing personal finances — if you give it direct access to your financial database.

The setup: connect Claude Code to an open-source expense tracker through a SQL API, and it becomes a personal finance assistant that lives in your terminal. Drop a bank statement, ask Claude Code to record the transactions, check your balances, update your budget — all through natural conversation. No clicking through UI screens, no manual data entry.

## Why Claude Code works well for expense tracking

Claude Code is different from ChatGPT or the Claude web app in a few important ways that matter for personal finance:

**It runs locally and can read your files.** When you download a bank statement as a CSV or PDF, Claude Code can read it directly from your filesystem. No uploading, no copy-pasting, no screenshots. You say "parse the bank statement in ~/Downloads/chase-march-2026.csv" and Claude Code reads the file.

**It can execute code and HTTP requests.** Claude Code doesn't just suggest a curl command — it runs it. When it needs to insert 50 transactions into your expense database, it writes the SQL, sends the HTTP request, and confirms the result. The entire flow happens inside a single conversation.

**It remembers your setup across sessions.** Claude Code reads a `CLAUDE.md` file in your project directory at the start of every session. Put your API endpoint and expense categories there, and Claude Code knows how to access your finances every time you open a terminal. No re-explaining your system each time.

**It works offline with local files.** If you want to preprocess bank statements, clean up CSV formats, or write import scripts, Claude Code does all of that locally before anything touches the API.

## Setting up Claude Code for personal finance

You need two things: an expense tracker with a SQL API, and an API key.

[Expense Budget Tracker](https://expense-budget-tracker.com/) is an open-source personal finance system built on Postgres. It has a SQL API endpoint at `POST /v1/sql` — you send SQL in a JSON body, get back rows as JSON. Sign up at the hosted version or [self-host it](https://github.com/kirill-markin/expense-budget-tracker) on your own server.

### Step 1: Create an API key

Open the app, go to **Settings → API Keys → Create key**. Copy the key — it starts with `ebt_` and you'll only see it once.

### Step 2: Create a CLAUDE.md file

Make a directory for your personal finance work and add a `CLAUDE.md` that tells Claude Code about your setup:

```markdown
# Personal Finance

## Expense Tracker API

- Endpoint: https://api.expense-budget-tracker.com/v1/sql
- Auth: Bearer token in Authorization header
- API key is in the EBT_API_KEY environment variable
- Request: POST with JSON body {"sql": "your query"}
- Response: {"rows": [...], "rowCount": N}

## My expense categories

Income: salary, freelance, side-projects
Fixed: rent, utilities, insurance, subscriptions
Daily: groceries, dining-out, transport, coffee
Lifestyle: clothing, entertainment, healthcare, travel
Planning: taxes, big-purchases, savings, emergency-fund

## My accounts

- chase-checking (USD) — main checking account
- wise-eur (EUR) — European account
- cash-usd (USD) — cash

## Rules

- Always check existing categories before inserting transactions
- After importing, verify account balances match the bank
- Use the exact category names listed above
- Store transactions in their original currency
```

### Step 3: Export the API key

```bash
export EBT_API_KEY="ebt_your_key_here"
```

Add this to your `.zshrc` or `.bashrc` so it persists across terminal sessions.

### Step 4: Open Claude Code and start working

```bash
cd ~/finances
claude
```

Claude Code reads your `CLAUDE.md`, knows your API endpoint, your categories, your accounts. You're ready to go.

## Parsing bank statements with Claude Code

This is where Claude Code shines. Download your bank statement and tell Claude Code to process it:

```
> I downloaded my Chase statement to ~/Downloads/chase-march-2026.csv.
> Parse it and record all transactions to my chase-checking account.
```

Claude Code will:
1. Read the CSV file from your filesystem
2. Parse each row — date, amount, description
3. Match each transaction to one of your expense categories (from the `CLAUDE.md`)
4. Build INSERT statements for the `ledger_entries` table
5. Send each one through the SQL API
6. Report back what it recorded

You review the output, tell Claude Code to fix any miscategorized transactions, and you're done. A month's worth of bank transactions, processed in a few minutes.

For PDF statements or screenshots of your banking app, the same approach works. Claude Code can read images and PDFs, extract the transaction data, and record everything the same way.

## Checking balances and catching errors

After importing transactions, always verify that the numbers add up:

```
> Check my account balances and compare them to what I see in the bank:
> chase-checking should be $4,230.15
> wise-eur should be €1,847.50
```

Claude Code queries the `accounts` view through the SQL API, compares the balances, and flags any discrepancies. If your chase-checking shows $4,180.15 instead of $4,230.15, Claude Code can help you find the missing $50 — maybe a transaction that got skipped or double-counted.

This weekly balance check is one of the most important habits in personal finance. Kirill Markin, who built Expense Budget Tracker and has been categorizing every personal transaction for over five years, does this check every single week. It's what keeps the data trustworthy over time.

## Asking questions about your spending

Once your expense data is in the database, Claude Code can answer any question about your finances by writing SQL queries:

```
> How much did I spend on dining out in the last 3 months?
```

```
> What are my top 5 expense categories this month?
```

```
> Show me all transactions over $100 from last week.
```

```
> What's my average monthly grocery spending over the past 6 months?
```

Claude Code writes the SQL, runs it against the API, and gives you the answer in plain language. You don't need to know SQL yourself — Claude Code handles the query construction. But because the API is just SQL over HTTP, you can always ask Claude Code to show you the query it ran, verify it makes sense, or tweak it.

## Managing your budget forecast

Expense tracking is recording what already happened. Budgeting is planning what comes next. Both live in the same database.

The `budget_lines` table stores your monthly forecast — expected income and planned expenses for each category, for each month. You can manage this through Claude Code:

```
> Set my budget for April 2026:
> - groceries: $400
> - dining-out: $200
> - rent: $2,100
> - salary income: $8,500
> Copy everything else from March's budget.
```

Claude Code reads March's budget entries, creates April entries with your updates, and writes them through the SQL API. You now have a 12-month rolling forecast that you can scroll through in the web UI.

A good monthly routine: at the end of each month, open Claude Code and say something like:

```
> Compare my actual spending this month against the budget.
> For any category where I spent more than 20% over budget,
> adjust next month's forecast to be more realistic.
```

Claude Code reads the actuals from `ledger_entries`, compares them to the plan in `budget_lines`, and updates the forecast. This is the kind of analysis that takes 30 minutes manually and 2 minutes with Claude Code.

## Working with multiple currencies

If you have accounts in different currencies, Claude Code handles this naturally. The expense tracker stores every transaction in its original currency and fetches exchange rates daily from ECB, CBR, and NBS.

```
> I received €2,500 freelance payment into wise-eur yesterday.
> Record it as income, category: freelance.
```

Claude Code writes the INSERT with `currency: 'EUR'` and the correct amount. When you later ask "what's my total income this month in USD?", the database does the currency conversion at query time using the latest exchange rates. Claude Code just reports the result.

## What Claude Code can do that web UIs can't

The power of Claude Code for personal finance comes from combining file access, HTTP requests, and conversation in a single tool:

**Batch processing.** Drop five bank statements from different accounts into a folder, tell Claude Code to process all of them. It reads each file, inserts transactions into the right accounts, and verifies balances at the end. Doing this in a web UI would take an hour of clicking.

**Custom analysis.** "Which months in the last year had the highest spending on entertainment, and what were the biggest transactions?" No budgeting app has a button for that. Claude Code writes the SQL query, runs it, and explains the results.

**Format conversion.** Your bank exports a weird CSV format with merged columns and European date formatting? Tell Claude Code to clean it up first. It rewrites the file locally, then imports the clean version.

**Scripting.** Ask Claude Code to write a Python script that you can reuse: "Write a script that imports a Chase CSV and records all transactions. Save it to ~/finances/import-chase.py." Next time, you just run the script directly — with or without Claude Code.

## The database schema Claude Code works with

The Expense Budget Tracker database is designed to be easy for AI agents to work with. Seven flat tables:

| Table | What it stores |
|---|---|
| `ledger_entries` | Every income and expense transaction |
| `budget_lines` | Budget plan — amounts per category per month |
| `budget_comments` | Notes on specific budget cells |
| `exchange_rates` | Daily FX rates (fetched automatically) |
| `workspace_settings` | Reporting currency preference |
| `account_metadata` | Account liquidity classification |
| `accounts` | VIEW — running balances per account |

The `ledger_entries` table has clear columns: `event_id`, `ts`, `account_id`, `amount`, `currency`, `kind`, `category`, `counterparty`, `note`. Claude Code can write correct INSERT statements on the first try because the column names describe exactly what they hold.

## Security and access control

Giving Claude Code access to your expense database is safe within the constraints of the SQL API:

Every query runs through Postgres Row Level Security. The API key is tied to your user and workspace — Claude Code can only see your data, even on a shared database.

Only data queries are allowed: SELECT, INSERT, UPDATE, DELETE. Claude Code can't create or drop tables, can't modify permissions, can't run multiple statements in one request. The SQL API enforces this server-side, regardless of what Claude Code tries to send.

API keys are stored as SHA-256 hashes — the plaintext is never in the database. You can revoke a key from Settings at any time. Rate limits cap usage at 10 requests/second and 10,000 per day, with a 30-second timeout and 100-row limit per response.

The API key stays in your local environment variable. Claude Code reads it from `$EBT_API_KEY` when making requests — it never gets committed to a file or sent anywhere else.

## A real workflow: weekly expense tracking in 10 minutes

Kirill Markin has been running this exact workflow for years, and it comes down to a weekly session that looks roughly like this:

1. Download bank statements from all accounts (2 minutes)
2. Open Claude Code, tell it to process the files (3 minutes — Claude Code does the work, you watch)
3. Review what Claude Code recorded, fix any wrong categories (3 minutes)
4. Ask Claude Code to verify all account balances match the bank (1 minute)
5. If it's the end of the month, ask Claude Code to compare actuals vs budget and update the forecast (2 minutes)

That's 10 minutes for a complete picture of your finances — every transaction categorized, every balance verified, budget updated. The system works because the boring parts (parsing, categorizing, inserting, calculating) are exactly what Claude Code is good at, and the judgment parts (reviewing categories, deciding budget adjustments) stay with you.

## Getting started with Claude Code and Expense Budget Tracker

1. [Install Claude Code](https://docs.anthropic.com/en/docs/claude-code) if you haven't already
2. Sign up at [expense-budget-tracker.com](https://expense-budget-tracker.com/) or [self-host](https://github.com/kirill-markin/expense-budget-tracker) the app
3. Create an API key in **Settings → API Keys**
4. Set up a `CLAUDE.md` with your endpoint, categories, and accounts (see the example above)
5. Export your API key: `export EBT_API_KEY="ebt_..."`
6. Open Claude Code in your finances directory and drop in your first bank statement

Claude Code will figure out the database schema, match your categories, and start recording transactions. Review the results, fix anything that looks off, and you've got an AI-powered expense tracking setup running from your terminal.

The expense tracker is MIT licensed and fully open source at [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Claude Code is available at [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code). Both tools are free to start with.

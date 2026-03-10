---
title: "AI Expense Tracker Setup for Claude Code, Codex, and OpenClaw"
description: "How to connect Claude Code, Codex, or OpenClaw to an open-source expense tracker. Share one discovery URL, confirm the email code, and let the agent provision its own ApiKey and start working."
date: "2026-03-10"
---

If you want to use an AI agent for expense tracking, the annoying part is usually setup.

The usual flow looks like this:

1. Open the app
2. Create an API key
3. Copy the key
4. Paste it into your terminal agent
5. Explain which endpoint to call
6. Hope the agent uses the right workspace

That is workable, but it is not agent-native.

[Expense Budget Tracker](https://expense-budget-tracker.com/) now exposes a public discovery endpoint for terminal agents such as [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex, or OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

The user gives the agent that one link, then answers two questions:

- Which email should be used for login?
- What is the 8-digit code that just arrived in the inbox?

After that, the agent provisions its own `ApiKey`, loads the account, lists workspaces, selects one explicitly, and can start importing or querying transactions.

The project is open source on GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [Machine API implementation](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [Agent send-code route](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [Agent verify-code route](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## The one link to give your agent

This is the exact URL:

```text
https://api.expense-budget-tracker.com/v1/
```

That endpoint returns a machine-readable discovery document. The agent can read:

- where auth bootstrap lives
- which action to call first
- which auth header to use later
- which steps come next for workspace setup and SQL access

This is the core idea: instead of hardcoding onboarding instructions in a prompt, the product tells the agent how to connect.

## Example prompt for Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Ask me for the account email, wait for the 8-digit code from my inbox, finish the setup,
then import transactions from ~/Downloads/chase-march-2026.csv and verify the final balance.
```

## Example prompt for Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
When you need login information, ask me for the email and then the 8-digit code.
After setup, show me my latest 20 transactions and total grocery spend this month.
```

## Example prompt for OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, select my personal workspace and import the CSV file I uploaded.
Use existing categories when possible, and tell me if any balance does not match.
```

## How the AI expense tracker setup works

Here is the full HTTP flow behind that setup.

### 1. Read the discovery endpoint

The agent starts here:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

The response tells it to begin with `send_code` and includes the bootstrap URL on the auth domain.

### 2. Send the user email

The agent sends the email address to the auth service:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

If the request succeeds, the response contains an `otpSessionToken` and instructions to call `verify_code`.

### 3. Ask the user for the 8-digit email code

The user checks the inbox and sends the code back to the agent.

### 4. Verify the code and get an ApiKey

The agent then calls:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

The response includes a new `ApiKey`. That key is shown once and should be stored by the agent for later requests.

This is the main improvement over the old manual flow: the user does not need to create a key in Settings and copy it into the terminal.

### 5. Load account and workspace context

After verification, the agent uses `Authorization: ApiKey <key>` and loads the account:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebt_agent_live_..."
```

Then it lists workspaces:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebt_agent_live_..."
```

If needed, it can create a new workspace or explicitly select an existing one with `POST /v1/workspaces/{workspaceId}/select`.

### 6. Run SQL through the agent API

After that, normal data work happens through the app domain:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebt_agent_live_..." \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

The request must include both:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>`

Workspace selection is explicit. The server does not keep a hidden active workspace for the agent.

## What your agent can do after setup

Once connected, the agent can handle the boring finance work that should not require hours of clicking:

1. Parse CSV, PDF, or screenshot exports from the bank
2. Insert transactions into the ledger
3. Check balances against what the bank shows
4. Query spending by category, merchant, or period
5. Update budget lines for the next month

Here is a practical example for importing a statement:

```text
Import ~/Downloads/revolut-february-2026.csv into my EUR account.
Before writing anything, query my existing categories and the last 30 days of transactions to avoid duplicates.
After import, compare the resulting account balance with the closing balance in the CSV.
```

And here is an example for analysis:

```text
Show me my top 10 spending categories in the last 90 days, then compare them with the previous 90-day period.
Also list the largest transactions in categories where spending increased.
```

## Why this is better than manual API key setup

The new flow is simpler for both the user and the agent:

- the user does not have to copy a long-lived key manually
- the agent discovers the protocol from the product itself
- auth is separated from data access cleanly
- every SQL request is scoped to an explicit workspace
- the connection can be revoked later from the app

If you are building an AI expense tracking workflow, that matters. It removes a lot of prompt boilerplate and setup mistakes.

## Open-source expense tracker with agent setup

Expense Budget Tracker is MIT licensed and fully open source:

- [Project website](https://expense-budget-tracker.com/)
- [GitHub repository](https://github.com/kirill-markin/expense-budget-tracker)
- [README on GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [AI Agent Setup docs](https://expense-budget-tracker.com/docs/agent-setup/)
- [API Reference](https://expense-budget-tracker.com/docs/api/)

If you want to self-host it, start with:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

If you want to use the hosted version, give your agent this URL:

```text
https://api.expense-budget-tracker.com/v1/
```

That is enough for Claude Code, Codex, or OpenClaw to start the login flow on their own.

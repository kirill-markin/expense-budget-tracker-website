---
title: "Connect Claude Code, Codex, or OpenClaw to Your Expense Tracker with One Link"
description: "Expense Budget Tracker now supports agent-native onboarding. Share one discovery URL, confirm the email code, and your AI agent provisions its own ApiKey, selects a workspace, and starts importing or analyzing transactions."
date: "2026-03-10"
---

The old way to connect an AI agent to a finance system was awkward.

You had to open the app, create an API key in Settings, copy a secret shown once, paste it into your local agent environment, and then explain which endpoint to call. That works, but it is still a human-driven setup flow.

Expense Budget Tracker now has a better path for terminal agents such as [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex, or OpenClaw:

Give the agent one link:

`https://app.expense-budget-tracker.com/api/agent`

The agent reads the discovery document, asks for your email, waits for the 8-digit code from your inbox, provisions its own `ApiKey`, loads your account, picks a workspace, and starts working.

The human only needs to provide the email address and the email code.

## What actually happens

This is not a vague "AI integration" claim. There is a concrete HTTP flow behind it.

### Step 1: the agent reads the discovery document

The public endpoint is:

```bash
curl https://app.expense-budget-tracker.com/api/agent
```

That response tells the agent:

- the service name and version
- the auth bootstrap URL
- the auth scheme to use after login
- the ordered setup flow
- the first action to execute (`send_code`)

In other words, the agent does not need hardcoded instructions copied from a blog post. The product itself describes the protocol.

### Step 2: the agent sends the user's email

The discovery response points the agent to the auth service on `auth.expense-budget-tracker.com`.

The agent sends:

```json
{ "email": "user@example.com" }
```

to:

`POST https://auth.expense-budget-tracker.com/api/agent/send-code`

If the request is accepted, the server returns an `otpSessionToken` and tells the agent to call `verify_code` next.

### Step 3: the user provides the email code

The user receives an 8-digit code by email and pastes it back into the terminal conversation.

That is the only secret the human has to relay manually.

### Step 4: the agent verifies the code and gets its own key

The agent calls:

`POST https://auth.expense-budget-tracker.com/api/agent/verify-code`

with:

```json
{
  "code": "12345678",
  "otpSessionToken": "signed-token-from-send-code",
  "label": "Claude Code on kirill-macbook"
}
```

On success, the response contains:

- connection metadata
- a new `ApiKey`
- the next action: load the account on the app domain

The important difference from the old flow is this: the human never has to create or copy the key. The agent provisions its own connection after the email challenge is complete.

### Step 5: the agent loads account and workspace context

After verification, the agent uses:

`Authorization: ApiKey <key>`

and calls:

- `GET https://app.expense-budget-tracker.com/api/agent/me`
- `GET https://app.expense-budget-tracker.com/api/agent/workspaces`

If needed, it can also create a workspace or explicitly select one.

### Step 6: the agent starts running SQL

Actual data operations happen through:

`POST https://app.expense-budget-tracker.com/api/agent/sql`

with:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>`

That means the setup flow and the data flow are separated cleanly:

- auth happens through email OTP
- the agent gets a dedicated machine key
- every SQL request is scoped to an explicit workspace

## What this looks like from the user's side

The pitch is simple:

> Give your agent `https://app.expense-budget-tracker.com/api/agent`, then answer two questions: your email and the code from your inbox.

After that, you can move directly to the real task.

For example:

```text
Connect to Expense Budget Tracker using https://app.expense-budget-tracker.com/api/agent.
Use my account email when needed, ask me for the 8-digit email code, then import my latest bank statement from ~/Downloads/chase-march-2026.csv.
```

That is a much better user story than:

1. Open Settings
2. Create API key
3. Copy secret
4. Save it in an env var
5. Explain the endpoint
6. Hope the agent uses the right workspace

## Example prompts

### Claude Code

```text
Use https://app.expense-budget-tracker.com/api/agent to connect to my expense tracker.
Ask me for my email, wait for the email code, finish the setup, and then import all transactions from ~/Downloads/revolut-february.csv.
After importing, verify that the account balance matches the bank.
```

### Codex

```text
Connect yourself to Expense Budget Tracker through https://app.expense-budget-tracker.com/api/agent.
When you need the login details, ask me for the email and 8-digit code.
After setup, show me my latest 20 transactions and total grocery spending this month.
```

### OpenClaw

```text
Use https://app.expense-budget-tracker.com/api/agent to onboard yourself to my Expense Budget Tracker account.
Then choose my personal workspace and process the CSV file I uploaded.
Categorize each transaction using existing categories and tell me if any balance looks off.
```

## Why this is better than manual API key setup

Three reasons matter.

First, the flow is agent-first. The public discovery endpoint is designed for machine consumption, so the setup instructions live next to the implementation instead of inside a human-only tutorial.

Second, it is less fragile. The agent can discover the auth bootstrap URL and the expected next actions from the server response instead of relying on a stale prompt template.

Third, it reduces manual secret handling. The user confirms identity through email OTP, and the agent receives a dedicated key for later work. If that connection should stop working, it can be revoked from the app's agent connections settings.

## What the agent can do after setup

Once connected, the agent can handle the boring finance work that should not require hours of clicking:

1. Parse CSV, PDF, or screenshot exports from the bank
2. Insert transactions into the ledger
3. Check balances against what the bank shows
4. Query spending by category, merchant, or period
5. Update budget lines for the next month

This is the same general workflow as before, but the onboarding is now dramatically simpler.

## The larger point

If a product claims to work with AI agents, the setup should also be agent-native.

The user should not need to act like a human middleware layer that copies secrets from a settings screen into a terminal. The product should expose a public discovery entrypoint, a clean auth handshake, and an explicit machine workflow.

That is what Expense Budget Tracker now does.

If you want to try it, give your agent this link:

`https://app.expense-budget-tracker.com/api/agent`

If you want the step-by-step protocol, see the [AI Agent Setup](https://expense-budget-tracker.com/docs/agent-setup/) and [API Reference](https://expense-budget-tracker.com/docs/api/) pages.

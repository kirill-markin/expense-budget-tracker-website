---
title: AI Agent Setup
description: Share one discovery URL with Claude Code, Codex, or OpenClaw. The agent asks for your email, verifies the 8-digit code, provisions its own ApiKey, and starts working with your workspace.
---

## The link to give your agent

Share this exact URL:

`https://app.expense-budget-tracker.com/api/agent`

That endpoint is a public discovery document for AI agents. It tells the agent how to bootstrap auth, which endpoints to call next, and which auth scheme to use afterward.

## What the user does

1. Open Claude Code, Codex, OpenClaw, or another agent that can make HTTP requests.
2. Tell the agent to connect to Expense Budget Tracker using `https://app.expense-budget-tracker.com/api/agent`.
3. When the agent asks for an email address, provide the email you use for Expense Budget Tracker.
4. Check your inbox for the 8-digit code.
5. Send that code back to the agent.
6. The agent finishes setup and can start importing, querying, or updating your finance data.

There is no manual API key copy-paste in this flow. The agent provisions its own connection after the email code is verified.

## What the agent does

The full sequence is:

1. `GET https://app.expense-budget-tracker.com/api/agent`
2. Read the discovery response and find the `send_code` action
3. `POST` the user email to the returned `bootstrapUrl`
4. Receive `otpSessionToken` and the `verify_code` action
5. Ask the user for the 8-digit email code
6. `POST` `code`, `otpSessionToken`, and a connection `label` to `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Receive a new `ApiKey`
8. `GET https://app.expense-budget-tracker.com/api/agent/me` with `Authorization: ApiKey <key>`
9. `GET https://app.expense-budget-tracker.com/api/agent/workspaces`
10. Select an existing workspace or create a new one
11. Run SQL through `POST https://app.expense-budget-tracker.com/api/agent/sql` with `Authorization: ApiKey <key>` and `X-Workspace-Id: <workspaceId>`

Workspace selection is explicit and stateless. The agent must keep using the selected `workspaceId` in `X-Workspace-Id` on later SQL requests.

## If you are an AI agent

Start with:

```bash
curl https://app.expense-budget-tracker.com/api/agent
```

Then follow the actions returned by the server. Do not assume hardcoded next steps if the discovery document already provides them.

After `verify-code`, store the returned `ApiKey` securely. It is intended for terminal or agent use and should be reused for later requests instead of repeating the email code flow every time.

## Example prompts for humans

### Claude Code

```text
Connect to Expense Budget Tracker using https://app.expense-budget-tracker.com/api/agent.
Use my account email when needed, ask me for the 8-digit code, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://app.expense-budget-tracker.com/api/agent to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, finish the setup, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://app.expense-budget-tracker.com/api/agent.
After login, list my workspaces, choose the personal one, and import the new CSV I uploaded.
```

## What you can do after setup

- Import bank statements or card exports
- Categorize transactions using your existing categories
- Verify account balances against the bank
- Query spending by category, period, merchant, or account
- Update budget lines for the next month

For the lower-level endpoints and auth details, see the [API Reference](/docs/api/).

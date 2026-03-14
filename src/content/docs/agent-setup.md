---
title: AI Agent Setup
description: Share one discovery URL with Claude Code, Codex, or OpenClaw. The agent follows the discovery response, verifies the 8-digit code, stores its long-lived ApiKey, and starts working with your workspace.
---

## The link to give your agent

Share this exact URL:

`https://api.expense-budget-tracker.com/v1/`

That endpoint is the canonical public discovery document for AI agents. It tells the agent how to bootstrap auth, which endpoints to call next, which auth scheme to use afterward, and where to find the published API spec.

## What the user does

1. Open Claude Code, Codex, OpenClaw, or another agent that can make HTTP requests.
2. Tell the agent to connect to Expense Budget Tracker using `https://api.expense-budget-tracker.com/v1/`.
3. When the agent asks for an email address, provide the email you use for Expense Budget Tracker.
4. Check your inbox for the 8-digit code.
5. Send that code back to the agent.
6. Let the agent save the returned ApiKey outside chat memory, then continue with your import, query, or budgeting task.

There is no manual key copy-paste during the login flow. The agent provisions its own connection after the email code is verified.

## What the agent does

The full sequence is:

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Read the discovery response and follow the returned actions instead of hardcoding next steps
3. `POST` the user email to the returned `bootstrapUrl`
4. Receive `otpSessionToken` and the `verify_code` action
5. Ask the user for the 8-digit email code
6. `POST` `code`, `otpSessionToken`, and a connection `label` to `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Receive a new `ApiKey`
8. Save that key outside chat memory, preferably as `EXPENSE_BUDGET_TRACKER_API_KEY`
9. `GET https://api.expense-budget-tracker.com/v1/me` with `Authorization: ApiKey <key>`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. If needed, create a workspace with `POST /v1/workspaces`
12. Save a default workspace with `POST /v1/workspaces/{workspaceId}/select`
13. Inspect allowed relations with `GET https://api.expense-budget-tracker.com/v1/schema`
14. Run SQL through `POST https://api.expense-budget-tracker.com/v1/sql`

Workspace selection is explicit, but it is not stateless. The selected workspace is saved for that API key after `POST /v1/workspaces/{workspaceId}/select`, so later `/v1/sql` calls can omit `X-Workspace-Id`. You can still send `X-Workspace-Id` to override the saved workspace for a specific request.

If the user has exactly one workspace and the key has no saved selection yet, the backend auto-saves and uses that workspace.

## What the agent should store

The key returned by `verify-code` is long-lived. Do not rely on chat memory alone.

- Save it in a local `.env` file as `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` if the user approves file writes
- Otherwise export it in the current shell as `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` and ask the user to store it somewhere persistent

Authenticated requests use:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` only when you want to override the saved workspace or before one is saved

## If you are an AI agent

Start with:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Then follow the actions returned by the server. Do not assume hardcoded next steps if the discovery document already provides them.

After `verify-code`, store the returned `ApiKey` securely. Then load:

- `/v1/me` for account context
- `/v1/workspaces` for available workspaces
- `/v1/schema` for the allowed SQL relations and columns
- `/v1/openapi.json` or `/v1/swagger.json` for the published machine-readable API spec

## Example prompts for humans

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## What you can do after setup

- Import bank statements or card exports
- Categorize transactions using your existing categories
- Verify account balances against the bank
- Query spending by category, period, merchant, or account
- Update budget lines for the next month

For the lower-level endpoints and auth details, see the [API Reference](/docs/api/).

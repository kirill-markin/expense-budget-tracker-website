---
title: API Reference
description: Agent onboarding and SQL API reference for programmatic access to your financial data.
---

## Overview

Expense Budget Tracker exposes two programmatic interfaces:

1. **Agent API** for Claude Code, Codex, OpenClaw, or other autonomous agents
2. **Direct SQL API** for scripts and manual HTTP clients

Both use the same Postgres Row Level Security enforcement as the web app.

## Agent API

If you want an AI agent to connect itself, start here:

`https://api.expense-budget-tracker.com/v1/`

That public discovery endpoint tells the agent how to bootstrap auth and what to call next.

### Agent auth flow

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Read the returned `send_code` action and `bootstrapUrl`
3. `POST` the user email to `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Ask the user for the 8-digit code from email
5. `POST` `code`, `otpSessionToken`, and `label` to `https://auth.expense-budget-tracker.com/api/agent/verify-code`
6. Receive an `ApiKey`
7. `GET https://api.expense-budget-tracker.com/v1/me`
8. List, create, or select a workspace
9. Execute SQL with `POST https://api.expense-budget-tracker.com/v1/sql`

### Agent auth headers

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` for SQL requests

For a step-by-step human guide, see [AI Agent Setup](/docs/agent-setup/).

## Direct SQL API

The direct SQL API is useful for scripts or clients that already have a long-lived ApiKey.

### Authentication

Generate an API key in Settings within the app, or reuse an agent-provisioned key. Pass it as an ApiKey auth header:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

### Auth header

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>`

## Allowed Operations

- `SELECT` / `WITH` — read queries
- `INSERT` / `UPDATE` / `DELETE` — write operations

DDL statements (`CREATE`, `DROP`, `ALTER`) are blocked.

## Limits

- 100 rows per response
- 30-second statement timeout
- 10 requests/second, 10,000 requests/day per key

## Security

- API keys are stored as SHA-256 hashes (plaintext never persisted)
- RLS enforces workspace isolation at the database level
- Keys can be revoked at any time from Settings
- Removing a workspace member auto-revokes all their keys

---
title: API Reference
description: Agent onboarding and SQL API reference for programmatic access to your financial data.
---

## Overview

Expense Budget Tracker exposes one public machine API at:

`https://api.expense-budget-tracker.com/v1/`

You can use that same surface in two ways:

1. **Agent-native onboarding** starting from `GET /v1/`
2. **Direct HTTP usage** with an existing long-lived ApiKey

All requests use the same Postgres Row Level Security enforcement as the web app.

## Discovery and published specs

Start here:

`https://api.expense-budget-tracker.com/v1/`

The discovery response tells agents how to bootstrap auth and what to call next. The same API also publishes:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

Use `schema` when you need the exact list of allowed relations and columns exposed by `/v1/sql`.

## Agent-native onboarding

If you want Claude Code, Codex, OpenClaw, or another agent to connect itself, start with the discovery endpoint and follow the actions returned by the server.

### Auth flow

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Read the returned `send_code` action and `bootstrapUrl`
3. `POST` the user email to `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Receive `otpSessionToken`
5. Ask the user for the 8-digit code from email
6. `POST` `code`, `otpSessionToken`, and `label` to `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Receive a long-lived `ApiKey`
8. Save that key outside chat memory
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Optionally `POST https://api.expense-budget-tracker.com/v1/workspaces` to create a workspace
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Execute SQL with `POST https://api.expense-budget-tracker.com/v1/sql`

### Auth header

- `Authorization: ApiKey <key>`

### Workspace handling

- `POST /v1/workspaces/{workspaceId}/select` saves the default workspace for that API key
- after a workspace is saved, `/v1/sql` can omit `X-Workspace-Id`
- `X-Workspace-Id: <workspaceId>` is still supported when you want to override the saved workspace for one request
- if the user has exactly one workspace and the key has no saved selection yet, the API auto-saves and uses that workspace

For a step-by-step human guide, see [AI Agent Setup](/docs/agent-setup/).

## Direct HTTP usage with an existing key

Scripts, cron jobs, dashboards, and custom apps can call the same API directly once they already have a long-lived ApiKey.

### Authentication

Pass the key as an ApiKey auth header:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` is required only if the key does not already have a saved default workspace or if you want to override the saved workspace for that request.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` when needed

## Endpoint summary

- `GET /v1/` — public discovery document
- `GET /v1/openapi.json` and `GET /v1/swagger.json` — published API specs
- `GET /v1/me` — authenticated account context
- `GET /v1/workspaces` — list workspaces available to the key owner
- `POST /v1/workspaces` — create a workspace
- `POST /v1/workspaces/{workspaceId}/select` — save the default workspace for this key
- `GET /v1/schema` — inspect allowed relations and columns for SQL
- `POST /v1/sql` — run one restricted SQL statement

## SQL policy

`POST /v1/sql` accepts exactly one SQL statement per request.

Allowed statement types:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

Blocked or rejected patterns:

- multiple statements
- DDL such as `CREATE`, `DROP`, and `ALTER`
- transaction wrappers such as `BEGIN`, `COMMIT`, and `ROLLBACK`
- `set_config()`
- SQL comments
- quoted identifiers
- dollar-quoted strings

The server also restricts which relations can be queried. Use `/v1/schema` to inspect the exposed relations and columns before generating SQL.

Currently exposed relations:

- `ledger_entries`
- `accounts`
- `budget_lines`
- `budget_comments`
- `workspace_settings`
- `account_metadata`
- `exchange_rates`

## Limits

- 100 rows per response
- 30-second statement timeout
- 10 requests/second, 10,000 requests/day per key

## Security

- API keys are stored as SHA-256 hashes (plaintext never persisted)
- RLS enforces workspace isolation at the database level
- Keys can be revoked from the product at any time
- Removing a workspace member auto-revokes all their keys

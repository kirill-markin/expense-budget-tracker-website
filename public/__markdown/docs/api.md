# API Reference

## Overview

The SQL API lets you query your financial data programmatically. It uses the same Postgres RLS enforcement as the web app — your API key is scoped to your workspace.

## Authentication

Generate an API key in Settings within the app. Pass it as a Bearer token:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: Bearer ebt_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

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
---
title: Architecture
description: System overview, data model, multi-currency design, and auth model.
---

## System Overview

```
Browser UI  -->  Next.js web app  -->  Postgres (RLS)
                        |                  ^
                        v                  |
                 Auth service -------------+
                        ^
                        |
             Machine clients via API Gateway
                        ^
                        |
                Worker (FX fetchers) ------
```

Five components, one database:

1. **web** — Next.js app with UI dashboards and API routes
2. **auth** — Email OTP login and agent bootstrap on the auth domain
3. **sql-api** — AWS Lambda behind API Gateway for machine clients
4. **worker** — Fetches daily exchange rates from ECB, CBR, and NBS
5. **Postgres** — Single source of truth with row-level security

## Data Model

- **ledger_entries** — One row per account movement (income, spend, transfer)
- **budget_lines** — Append-only budget cells with last-write-wins
- **budget_comments** — Append-only notes attached to budget cells
- **workspace_settings** — Reporting currency and workspace-level settings
- **account_metadata** — Per-account metadata such as liquidity classification
- **exchange_rates** — Daily FX rates used for query-time conversion
- **workspaces** / **workspace_members** — Multi-tenant isolation
- **accounts** — View derived from ledger entries

## Multi-Currency

All amounts stored in native currency. Conversion to reporting currency happens at read time via SQL joins against `exchange_rates`. No lossy pre-conversion.

## Auth

Two modes via `AUTH_MODE` env var:

- `none` — No auth, single local workspace
- `cognito` — Passwordless email OTP via AWS Cognito, open registration

For machine clients, the public discovery entrypoint is `GET /v1/`. Agent onboarding uses email OTP on the auth domain, returns a long-lived ApiKey, and then runs SQL through the API Gateway machine API.

Each user gets an isolated workspace. RLS policies check membership on every query, including machine-facing SQL requests.

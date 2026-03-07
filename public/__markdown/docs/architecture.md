# Architecture

## System Overview

```
Browser UI  -->  Next.js (web)  -->  Postgres (RLS)
                                         ^
                Worker (FX fetchers) -----+
```

Four components, one database:

1. **web** — Next.js app with UI dashboards and API routes
2. **sql-api** — AWS Lambda behind API Gateway for machine clients
3. **worker** — Fetches daily exchange rates from ECB, CBR, and NBS
4. **Postgres** — Single source of truth with row-level security

## Data Model

- **ledger_entries** — One row per account movement (income, spend, transfer)
- **exchange_rates** — Daily FX rates (base, quote, date, rate)
- **budget_lines** — Append-only budget cells with last-write-wins
- **workspaces** / **workspace_members** — Multi-tenant isolation
- **accounts** — View derived from ledger entries

## Multi-Currency

All amounts stored in native currency. Conversion to reporting currency happens at read time via SQL joins against `exchange_rates`. No lossy pre-conversion.

## Auth

Two modes via `AUTH_MODE` env var:

- `none` — No auth, single local workspace
- `cognito` — Passwordless email OTP via AWS Cognito, open registration

Each user gets an isolated workspace. RLS policies check membership on every query.

---
*[View the styled HTML version of this page](https://expense-budget-tracker.com/docs/architecture/)*

*Tip: Append `.md` to any URL on https://expense-budget-tracker.com to get a clean Markdown version of that page.*
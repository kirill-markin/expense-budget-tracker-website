---
title: Privacy Policy
description: Privacy policy for Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: August 2026
---
## What We Collect

When you use the cloud version, we store the financial data you enter (transactions, budgets, account names) and your email address for authentication. Self-hosted instances do not send any data to us.

## Operator

The hosted Expense Budget Tracker service is operated by SAMO DANNI EOOD (VAT: BG207395566). Expense Budget Tracker was created by Kirill Markin, and [kirill-markin.com](https://kirill-markin.com/) is the related personal website for the same creator and product ecosystem.

This policy applies to the hosted website, app, API, and remote MCP service operated by us. Self-hosted instances remain under their operator's control.

## How We Use Your Data

Your financial data is used solely to provide the service. We do not sell your data or use it for advertising. Each workspace is isolated via Postgres row-level security.

## External AI Clients

When you connect an external AI client to the hosted MCP service using OAuth, you choose the client and authorize the access it receives. The financial data you ask that client to retrieve or change is also processed by the client and its AI or model provider under their own terms and privacy policies. We do not control that separate processing.

## Data Storage

Cloud data is stored in AWS RDS (Postgres) in the eu-central-1 region with daily automated backups. Data is encrypted at rest and in transit.

## Cookies

We use a `session` cookie for authentication (HttpOnly, Secure, SameSite=Lax). No tracking cookies or third-party analytics.

## Data Deletion

You can delete your account and all associated data at any time from Settings in the app. For self-hosted instances, you control the database directly.

## Open Source

The entire codebase is open source. You can audit exactly what the application does with your data.

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

Your financial data is used solely to provide the service. We do not sell it or use it for advertising. We disclose it to a third-party client only when you direct the service to do so, such as by authorizing an MCP connection. Each workspace is isolated via Postgres row-level security.

## MCP and Third-Party AI Clients

When you connect an AI client to the hosted MCP service, Expense Budget Tracker processes the OAuth authorization request, the requested tool and its arguments, the selected workspace, and the financial records needed to fulfill a read request or apply an approved write. Writes made through MCP become part of the same hosted financial data as changes made in the web app.

The service stores the registered client's name and redirect URLs, connection and scope metadata, creation, activity, and revocation timestamps, and one-way hashes of OAuth authorization codes and access and refresh tokens. It does not store the raw OAuth tokens. The MCP service does not store the AI client's conversation as a product conversation, although it receives each tool request and returns the requested result.

The AI client is a separate third party and may process or retain prompts, tool arguments, and returned financial data under its own terms and privacy policy. Review the client's policy before connecting it. You can revoke an MCP connection at any time from **Settings > Agent Access**. You can delete your account and associated hosted data from Settings as described below.

## Data Storage

Cloud data is stored in AWS RDS (Postgres) in the eu-central-1 region with daily automated backups. Data is encrypted at rest and in transit.

## Cookies

We use a `session` cookie for authentication (HttpOnly, Secure, SameSite=Lax). No tracking cookies or third-party analytics.

## Data Deletion

You can delete your account and all associated data at any time from Settings in the app. For self-hosted instances, you control the database directly.

## Open Source

The entire codebase is open source. You can audit exactly what the application does with your data.

---
title: Getting Started
description: Sign up for the cloud version or set up your own instance in minutes.
---

## Cloud Version

The fastest way to start is the managed cloud version:

1. Go to [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Sign up with your email (passwordless OTP)
3. Start tracking expenses in the web app
4. For an MCP-capable client, add `https://mcp.expense-budget-tracker.com/mcp` and authorize access in your browser
5. For a terminal agent or direct HTTP client, start from `GET https://api.expense-budget-tracker.com/v1/`

No installation, no server setup. Your data is isolated via workspace-level row-level security in Postgres.

## Agent and program access

The same hosted account works for:

- the web UI at `https://app.expense-budget-tracker.com`
- the hosted [MCP connector](/docs/mcp-connector/) at `https://mcp.expense-budget-tracker.com/mcp`, authorized through browser OAuth
- [Agent API setup](/docs/agent-setup/) at `GET https://api.expense-budget-tracker.com/v1/`, followed by direct HTTP requests using `Authorization: ApiKey <key>`

## Self-Hosted

If you prefer to run your own instance, see the [Self-Hosting Guide](/docs/self-hosting/).

## Demo Mode

The app includes a built-in demo mode. Toggle the All/Demo button in the header to explore the interface with sample data — no database needed.

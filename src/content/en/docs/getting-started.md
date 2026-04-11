---
title: Getting Started
description: Sign up for the cloud version or set up your own instance in minutes.
---

## Cloud Version

The fastest way to start is the managed cloud version:

1. Go to [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Sign up with your email (passwordless OTP)
3. Start tracking expenses in the web app
4. If you want to connect Claude Code, Codex, or OpenClaw, give the agent `https://api.expense-budget-tracker.com/v1/`

No installation, no server setup. Your data is isolated via workspace-level row-level security in Postgres.

## Agent and program access

The same hosted account works for:

- the web UI at `https://app.expense-budget-tracker.com`
- agent-native onboarding at `GET https://api.expense-budget-tracker.com/v1/`
- direct HTTP clients using `Authorization: ApiKey <key>`

## Self-Hosted

If you prefer to run your own instance, see the [Self-Hosting Guide](/docs/self-hosting/).

## Demo Mode

The app includes a built-in demo mode. Toggle the All/Demo button in the header to explore the interface with sample data — no database needed.

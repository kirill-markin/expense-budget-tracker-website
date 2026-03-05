---
title: Self-Hosting Guide
description: Run Expense Budget Tracker on your own server with Docker Compose and Postgres.
---

## Requirements

- Docker and Docker Compose
- Postgres 18 (included in the Compose file)

## Quick Start

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

This starts Postgres, runs migrations, and launches the web app at `http://localhost:3000`.

## Configuration

Copy `.env.example` to `.env` and adjust:

- `DATABASE_URL` — Postgres connection string
- `AUTH_MODE` — `none` for local use (no login), `cognito` for multi-user with email OTP

## Updating

```bash
git pull
make up
```

Docker Compose will rebuild and re-run migrations automatically.

## AWS Deployment

For production deployment on AWS (ECS Fargate + RDS + ALB + Cognito), see the [AWS CDK guide](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).

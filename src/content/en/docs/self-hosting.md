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

This starts Postgres, runs migrations, and launches:

- the web app at `http://localhost:3000`
- the auth service at `http://localhost:8081`
- the FX worker in Docker Compose

## Configuration

Copy `.env.example` to `.env` and adjust:

- `MIGRATION_DATABASE_URL` — owner role used by migrations
- `DATABASE_URL` — app role for the web process
- `AUTH_DATABASE_URL` — auth schema role for the auth service
- `AUTH_MODE` — `none` for local use, `cognito` for email OTP environments
- `AUTH_DOMAIN`, `COOKIE_DOMAIN`, and `ALLOWED_REDIRECT_URIS` — auth routing and cookies

When `AUTH_MODE=cognito`, you also need the Cognito settings and `SESSION_ENCRYPTION_KEY` from `.env.example`.

## Updating

```bash
git pull
make up
```

Docker Compose rebuilds the services and reruns migrations through the `migrate` container.

## AWS Deployment

The production CDK stack uses ECS Fargate, RDS, ALB, Cognito, API Gateway, and Lambda. Its public application domains are:

- `app.<domain>` — web app on ECS Fargate behind the ALB
- `auth.<domain>` — OTP and OAuth service behind the ALB
- `api.<domain>/v1/*` — machine SQL REST API through API Gateway and Lambda
- `mcp.<domain>/mcp` — hosted MCP service through a dedicated API Gateway HTTP API and MCP Lambda

The MCP custom domain requires a public ACM certificate for the exact `mcp.<domain>` name. Keep its DNS validation CNAME for renewal, provide the certificate ARN to the CDK deployment and CI, and create the `mcp.*` DNS record alongside the other public domains.

For the supported sequence and setup scripts, see the repository [deployment overview](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) and [AWS CDK guide](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md).

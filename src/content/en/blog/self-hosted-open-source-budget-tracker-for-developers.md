---
title: "Self-Hosted Budget Tracker: Open Source, Docker, and Postgres"
description: "Run an open-source expense and budget tracker locally with Docker and Postgres, then understand backups, privacy boundaries, and when hosted access fits."
date: "2026-03-05"
updated: "2026-09-03"
image: "/blog/self-hosted-open-source-budget-tracker-for-developers-v2.png"
keywords:
  - "self hosted budget tracker"
  - "open source budget tracker"
  - "self hosted expense tracker"
  - "Docker expense tracker"
  - "Postgres budget app"
  - "personal finance for developers"
---

The current Docker Compose setup refuses to resolve until you choose an authentication mode. For a local, no-login installation, the working command is explicit:

```bash
AUTH_MODE=none make up
```

That small detail says a lot about self-hosting personal finance software. Running the containers is easy. Deciding who can reach them, where backups live, and which optional services may receive financial data is the real job.

[Expense Budget Tracker](https://github.com/kirill-markin/expense-budget-tracker) is an MIT-licensed, open source budget tracker built with Next.js and Postgres. This guide follows the repository as it works now: a local Docker path for one technical user, a documented AWS/CDK production path, and separate managed endpoints for the hosted UI, MCP, and Agent API.

![Person maintains a self-contained rainwater system beside a separate reserve tank and disconnected hose](/blog/self-hosted-open-source-budget-tracker-for-developers-v2.png)

## First, choose the boundary you actually want

“Self-hosted” can describe several very different setups. They should not be treated as interchangeable.

| Setup | Where finance data lives | What you operate | Best fit |
| --- | --- | --- | --- |
| Local Docker Compose | Postgres in a Docker volume on your machine | Containers, updates, local access, backups | One technical user who mainly wants the web UI on one machine |
| Your AWS account with the documented CDK stack | RDS and application services in your AWS account | AWS, Cloudflare, domains, certificates, email delivery, secrets, monitoring, backups | A public or multi-user deployment where you accept the infrastructure work |
| Managed web app | Expense Budget Tracker's hosted environment | Your account and data-entry workflow | Someone who wants the UI without operating servers |
| Hosted MCP connector | The hosted workspace, accessed through the MCP service | OAuth consent and the client connection | An MCP-capable agent that needs scoped read or write access |
| Hosted Agent API | The hosted workspace, accessed through the API service | A long-lived ApiKey, workspace selection, and reviewed SQL | Scripts and terminal agents that can call HTTP directly |

The local Compose command does **not** create `api.your-domain.com` or `mcp.your-domain.com`. Those machine-access surfaces belong to the AWS architecture and the managed service. Pointing a hosted client at `https://mcp.expense-budget-tracker.com/mcp` means using the hosted workspace, not reaching into the Postgres container on your laptop.

This distinction is the first decision check for any self-hosted budget tracker: do you want local control of the web app and database, or remote integrations that require a larger deployment?

## Run the Docker expense tracker locally

You need Git, Docker, and Docker Compose. Clone the repository and start the stack from its root:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
AUTH_MODE=none make up
```

Then open [http://localhost:3000](http://localhost:3000).

`AUTH_MODE` is a required Compose variable. If you have not copied `.env.example` to `.env`, repeat the prefix on every Compose command. The commands below do that deliberately.

`make up` is a short alias for:

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml up -d
```

The current [Compose file](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/docker/compose.yml) defines Postgres 18, a one-shot migration service, the Next.js web app, the authentication service, and the exchange-rate worker. With `AUTH_MODE=none`, the web app uses the local identity instead of requiring Cognito login. Treat that mode as local development access, never as authentication for a public server.

You can inspect container state and follow the application logs with ordinary Compose commands:

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml ps
AUTH_MODE=none docker compose -f infra/docker/compose.yml logs -f web
```

Stop the stack with:

```bash
AUTH_MODE=none make down
```

The [Makefile](https://github.com/kirill-markin/expense-budget-tracker/blob/main/Makefile) maps that command to `docker compose down` without `-v`. Your Postgres data remains in the named `pgdata` volume and is reused the next time the stack starts.

That persistence is convenient, but it is not a backup. Host failure, disk corruption, an accidental volume deletion, or an explicit `docker compose down -v` can still remove the only copy.

### Keep this setup local

The Compose configuration publishes the web app on host port `3000`, Postgres on `5432`, and the auth service on `8081`. It also contains development database credentials. Do not put this configuration on an internet-facing host and assume Docker made it private.

For a workstation installation:

- use the machine firewall to limit network access;
- do not forward ports `3000`, `5432`, or `8081` from your router;
- do not expose `AUTH_MODE=none` through a public reverse proxy;
- keep the repository, `.env` files, and database dumps out of public or broadly shared folders.

The repository documents AWS/CDK as its production deployment. It does not promise a hardened recipe for every VPS, NAS, Kubernetes cluster, or home server, even if an experienced operator could adapt the code.

## What runs, and what stays in Postgres

The local architecture is small enough to inspect:

- **Next.js web app:** serves the budget, transaction, balance, dashboard, demo, and chat interfaces.
- **Postgres:** stores the ledger, budget plans, workspace settings, account metadata, and application state.
- **Migration container:** applies the repository's SQL migrations before the web service starts.
- **FX worker:** fetches public exchange-rate data and writes it through a restricted database role.
- **Auth service:** supports the authenticated deployment architecture; local web use bypasses Cognito when `AUTH_MODE=none`.

Postgres is the source of truth. That makes this a practical Postgres budget app for developers: you can inspect migrations, understand the relations, query your own database, and export it using standard Postgres tools. Row-level security and separate application roles still matter inside the app, but they do not replace host security or backups.

The exchange-rate worker makes outbound requests for rate data. It does not need to send your ledger rows to request those public rates. The optional AI features have a different boundary, which deserves its own review.

## Make a real backup before calling the data safe

For the default local Compose database, this creates a compressed Postgres archive on the host:

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml exec -T postgres \
  pg_dump -U tracker -d tracker --format=custom \
  > expense-budget-tracker.dump
```

Handle that file like a bank statement. It can contain transaction descriptions, balances, categories, notes, and other identifying details.

A workable backup routine needs four decisions:

1. **Frequency:** choose how much recent work you could accept losing.
2. **Second location:** copy the dump away from the Docker host so one disk failure cannot take both copies.
3. **Encryption and access:** protect the archive at rest and limit who can read it.
4. **Restore testing:** periodically restore into a separate compatible Postgres instance and verify transactions, budgets, and balances.

Before updating the application, create a fresh dump. Then pull the new code, rebuild the images, and start the stack again:

```bash
git pull
AUTH_MODE=none make build
AUTH_MODE=none make up
```

The migration container runs during startup. Read release changes before upgrading and keep the pre-upgrade dump until you have checked the application and completed a restore drill.

## Self-hosting does not automatically keep every byte local

The core local UI and Postgres database can run on your machine. Data leaves that boundary when you choose a feature or endpoint that sends it elsewhere.

### Built-in AI chat

The built-in chat uses an `OPENAI_API_KEY`. When you use it, prompts, attached or extracted content, and financial context needed for model calls can reach OpenAI. The current request path sets `store: false`, but the request still has to be processed by the provider, and other retention controls depend on your API organization. Review [OpenAI's current API data controls](https://developers.openai.com/api/docs/guides/your-data) before sending bank statements or ledger details.

Langfuse tracing is optional. It turns on only when its connection values and release value are configured together. When enabled, chat traces are exported to the `LANGFUSE_BASE_URL` you selected. A Langfuse Cloud URL introduces another external processor; a self-hosted Langfuse deployment moves that destination into infrastructure you operate.

If your requirement is “financial rows never go to an LLM provider,” leave the AI integration unset and do not use chat. Self-hosting the database does not cancel an outbound model request that you intentionally enable.

### Your own AWS deployment

The documented [AWS deployment](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) puts application services and RDS in your AWS account. It also adds more systems and trust relationships: Cloudflare for DNS and edge traffic, Cognito for authentication, Resend for login email, certificates for public domains, Secrets Manager, monitoring, and optional OpenAI and Langfuse connections.

The CDK stack includes managed database backup infrastructure. You still decide whether its retention meets your needs, watch failures, test restores, rotate secrets, apply updates, and respond to incidents. “My AWS account” is a useful control boundary, not the same thing as “no third parties.”

### Managed UI, hosted MCP, and hosted Agent API

The managed UI starts at [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com). It is the lowest-operations path, but the service operator and hosting providers are part of the data boundary. Read the [privacy policy](/privacy/) before putting real financial data there.

An MCP-capable client can connect to:

```text
https://mcp.expense-budget-tracker.com/mcp
```

The hosted MCP connector uses browser OAuth. The required `expenses:read` scope allows workspace discovery, schema inspection, and read queries. `expenses:write` is separate and is required for `sql_execute`. Start read-only unless the client genuinely needs to create, change, or delete financial records. The MCP client can also receive the data returned by tools, so its own privacy policy matters. See the [MCP connector guide](/docs/mcp-connector/) for the full flow.

The hosted Agent API is a different interface with a different credential. Begin at:

```bash
curl --fail --silent --show-error \
  https://api.expense-budget-tracker.com/v1/
```

After the email-code onboarding flow returns a long-lived key, direct requests use:

```text
Authorization: ApiKey <key>
```

The primary SQL endpoints deliberately separate one read from one approved write:

- `POST /v1/sql/query` accepts one restricted `SELECT` or `WITH ... SELECT`.
- `POST /v1/sql/execute` accepts one approved `INSERT`, `UPDATE`, or `DELETE`.

Workspace selection and Postgres row-level security apply on the server. They do not turn a hosted request into a self-hosted one, and the ApiKey is not accepted by the OAuth-based MCP endpoint. The [API reference](/docs/api/) documents discovery, workspace selection, schema inspection, request limits, and the exact SQL policy. The [expense tracking API guide](/blog/expense-tracking-api/) covers approval and reconciliation in more depth.

## What you take on when you self-host

Personal finance for developers can look pleasantly simple from the application side: one repository, one Compose command, one database. The operational work continues after the first successful page load.

For local Docker, you own:

- Docker and host operating-system updates;
- application updates and migration review;
- database dumps, encrypted off-machine copies, retention, and restore tests;
- disk capacity and container health;
- firewall rules and physical access to the machine;
- protection of `.env` files, API keys, model keys, and backups.

For a public deployment, add:

- a domain and DNS configuration;
- TLS certificates and renewal paths;
- authenticated access instead of `AUTH_MODE=none`;
- OTP email delivery and its credentials;
- database and service monitoring;
- alert handling, incident response, and recovery;
- cloud costs and provider account security.

The [self-hosting guide](/docs/self-hosting/) is the short setup reference. The source repository's deployment documentation is the authority for the supported AWS architecture.

## A practical decision checklist

A self-hosted expense tracker is a good fit when most of these are true:

- You are comfortable owning Docker and Postgres rather than only using them once.
- You will automate backups and test a restore, not just trust the volume.
- You want direct access to a standard database and source code you can audit or change.
- Local browser access is enough, or you are ready to operate the documented AWS stack.
- You can keep `AUTH_MODE=none` away from public networks.
- You will review every optional outbound path, especially AI chat and telemetry.

Use the managed app or another hosted option when these sound more accurate:

- You want to enter and review finances without patching infrastructure.
- You need reliable remote access but do not want to manage domains, TLS, auth, email, secrets, and monitoring.
- You are unlikely to notice a failed backup or delayed security update.
- OAuth-scoped MCP or the hosted Agent API solves the integration need without owning the full stack.

There is also a useful middle choice: run the local system with no AI keys, keep it off the public internet, and export encrypted Postgres backups to storage you control. You get the main benefit of a self-hosted budget tracker without pretending that a laptop Compose file is a production platform.

Start with `AUTH_MODE=none make up`, enter a few non-sensitive test transactions, stop and restart the stack, then create and verify a database dump. If that small operational loop feels reasonable, move real data in. If it already feels like a chore, the [managed setup](/docs/getting-started/) is probably the more honest choice.

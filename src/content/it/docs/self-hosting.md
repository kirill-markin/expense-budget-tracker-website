---
title: Guida al self-hosting
description: Esegui Expense Budget Tracker sul tuo server con Docker Compose e Postgres.
---

## Requisiti

- Docker e Docker Compose
- Postgres 18 (incluso nel file Compose)

## Avvio rapido

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Il comando avvia Postgres, esegue le migrazioni e avvia questi servizi:

- l’app web su `http://localhost:3000`
- il servizio di autenticazione su `http://localhost:8081`
- il worker che aggiorna i tassi di cambio in Docker Compose

## Configurazione

Copia `.env.example` in `.env` e configura queste variabili:

- `MIGRATION_DATABASE_URL` — ruolo proprietario del database usato per le migrazioni
- `DATABASE_URL` — ruolo dell’app per il processo web
- `AUTH_DATABASE_URL` — ruolo dello schema di autenticazione per il relativo servizio
- `AUTH_MODE` — `none` per l’uso locale, `cognito` per gli ambienti con accesso tramite codice di verifica monouso via email
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` e `ALLOWED_REDIRECT_URIS` — instradamento delle richieste di autenticazione e impostazioni dei cookie

Con `AUTH_MODE=cognito` servono anche le impostazioni di Cognito e la variabile `SESSION_ENCRYPTION_KEY` da `.env.example`.

## Aggiornamento

```bash
git pull
make up
```

Docker Compose ricostruisce i servizi ed esegue di nuovo le migrazioni tramite il container `migrate`.

## Distribuzione su AWS

Lo stack CDK di produzione usa ECS Fargate, RDS, ALB, Cognito, API Gateway e Lambda. I domini pubblici dell’applicazione sono:

- `app.<domain>` — app web su ECS Fargate dietro l’ALB
- `auth.<domain>` — servizio OTP e OAuth dietro l’ALB
- `api.<domain>/v1/*` — API REST SQL per client programmatici tramite API Gateway e Lambda
- `mcp.<domain>/mcp` — servizio MCP ospitato tramite un’API HTTP di API Gateway e una funzione Lambda dedicate

Il dominio personalizzato MCP richiede un certificato ACM pubblico per il nome di dominio esatto `mcp.<domain>`. Conserva il record CNAME di convalida DNS per il rinnovo, passa l’ARN del certificato alla configurazione di CDK e della CI, quindi crea il record DNS `mcp.*` insieme a quelli degli altri domini pubblici.

Per l’ordine dei passaggi e gli script di configurazione supportati, consulta la [panoramica della distribuzione](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) e la [guida ad AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) nel repository.

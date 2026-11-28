---
title: Guide d’auto-hébergement
description: Déployez Expense Budget Tracker sur votre propre serveur avec Docker Compose et Postgres.
---

## Prérequis

- Docker et Docker Compose
- Postgres 18 (inclus dans le fichier Compose)

## Démarrage rapide

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Ces commandes démarrent Postgres, exécutent les migrations et lancent les services suivants.

- L’application web à l’adresse `http://localhost:3000`.
- Le service d’authentification à l’adresse `http://localhost:8081`.
- Le processus de récupération des taux de change dans Docker Compose.

## Configuration

Copiez `.env.example` dans `.env`, puis renseignez les variables ci-dessous.

- `MIGRATION_DATABASE_URL` — rôle propriétaire utilisé pour les migrations.
- `DATABASE_URL` — rôle applicatif utilisé par le processus web.
- `AUTH_DATABASE_URL` — rôle du schéma d’authentification pour le service d’authentification.
- `AUTH_MODE` — `none` pour un usage local, `cognito` pour les environnements où la connexion se fait par code de vérification à usage unique reçu par e-mail.
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` et `ALLOWED_REDIRECT_URIS` — routage de l’authentification et cookies.

Si `AUTH_MODE=cognito`, renseignez également les paramètres Cognito et `SESSION_ENCRYPTION_KEY` indiqués dans `.env.example`.

## Mise à jour

```bash
git pull
make up
```

Docker Compose reconstruit les services et relance les migrations via le conteneur `migrate`.

## Déploiement sur AWS

La pile CDK de production utilise ECS Fargate, RDS, ALB, Cognito, API Gateway et Lambda. Elle expose les domaines publics suivants.

- `app.<domain>` — application web sur ECS Fargate derrière l’ALB.
- `auth.<domain>` — service OTP et OAuth derrière l’ALB.
- `api.<domain>/v1/*` — API REST SQL pour les agents et les programmes, via API Gateway et Lambda.
- `mcp.<domain>/mcp` — service MCP hébergé via une API HTTP dédiée dans API Gateway et une fonction Lambda MCP.

Le domaine personnalisé de MCP nécessite un certificat ACM public pour le nom exact `mcp.<domain>`. Conservez le CNAME de validation DNS pour le renouvellement, fournissez l’ARN du certificat au déploiement CDK et à la CI, et créez l’enregistrement DNS `mcp.*` aux côtés des autres domaines publics.

Pour connaître la procédure prise en charge et trouver les scripts de configuration, consultez la [présentation du déploiement (en anglais)](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) et le [guide AWS CDK (en anglais)](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md).

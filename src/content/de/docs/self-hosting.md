---
title: Anleitung zum Selbsthosting
description: Betreibe Expense Budget Tracker mit Docker Compose und Postgres auf deinem eigenen Server.
---

## Voraussetzungen

- Docker und Docker Compose
- Postgres 18 (in der Compose-Datei enthalten)

## Schnellstart

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Der Schnellstart fährt Postgres hoch, führt die Migrationen aus und startet die folgenden Dienste.

- Die Web-App unter `http://localhost:3000`
- Den Auth-Dienst unter `http://localhost:8081`
- Den Worker für Wechselkurse in Docker Compose

## Konfiguration

Kopiere `.env.example` nach `.env` und passe die folgenden Variablen an.

- `MIGRATION_DATABASE_URL` — Eigentümerrolle für Migrationen
- `DATABASE_URL` — App-Rolle für den Webprozess
- `AUTH_DATABASE_URL` — Rolle für das Auth-Schema des Auth-Dienstes
- `AUTH_MODE` — `none` für die lokale Nutzung, `cognito` für Umgebungen mit E-Mail-Einmalcode
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` und `ALLOWED_REDIRECT_URIS` — Routing für die Anmeldung und Cookies

Bei `AUTH_MODE=cognito` brauchst du auch die Cognito-Einstellungen und `SESSION_ENCRYPTION_KEY` aus `.env.example`.

## Aktualisieren

```bash
git pull
make up
```

Docker Compose baut die Dienste neu und führt die Migrationen über den Container `migrate` erneut aus.

## Bereitstellung auf AWS

Der CDK-Stack für die Produktion verwendet ECS Fargate, RDS, ALB, Cognito, API Gateway und Lambda. Das sind die öffentlichen Domains der Anwendung.

- `app.<domain>` — Web-App auf ECS Fargate hinter dem ALB
- `auth.<domain>` — OTP- und OAuth-Dienst hinter dem ALB
- `api.<domain>/v1/*` — SQL-REST-API für Programme über API Gateway und Lambda
- `mcp.<domain>/mcp` — gehosteter MCP-Dienst mit eigener HTTP-API in API Gateway und eigener Lambda-Funktion

Für die eigene MCP-Domain brauchst du ein öffentliches ACM-Zertifikat für genau den Namen `mcp.<domain>`. Behalte den CNAME-Eintrag zur DNS-Validierung, damit sich das Zertifikat erneuern lässt. Stelle den ARN des Zertifikats für die CDK-Bereitstellung und die CI bereit und lege den DNS-Eintrag `mcp.*` zusätzlich zu den Einträgen für die anderen öffentlichen Domains an.

Den unterstützten Ablauf und die Einrichtungsskripte findest du in der [Übersicht zur Bereitstellung](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) (auf Englisch) und in der [AWS-CDK-Anleitung](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) (auf Englisch).

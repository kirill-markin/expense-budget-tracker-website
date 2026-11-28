---
title: Architektur
description: Systemüberblick, Datenmodell, Unterstützung mehrerer Währungen und Authentifizierung.
---

## Systemüberblick

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

Sechs Komponenten nutzen dieselbe Datenbank.

1. **web** — Next.js-App mit Dashboards und API-Routen
2. **auth** — Anmeldung per E-Mail-Einmalcode und Einrichtung für Agenten auf der Auth-Domain
3. **sql-api** — AWS Lambda hinter API Gateway für programmatische Clients
4. **mcp** — eigene AWS-Lambda-Funktion mit HTTP-API in API Gateway für den gehosteten MCP-Endpunkt
5. **worker** — ruft täglich Wechselkurse von EZB, CBR und NBS ab
6. **Postgres** — maßgebliche Datenquelle mit Zugriffsschutz auf Zeilenebene

## Datenmodell

- **ledger_entries** — eine Zeile je Kontobewegung (Einnahme, Ausgabe, Umbuchung)
- **budget_lines** — Änderungen an Budgetzellen werden als neue Einträge gespeichert. Der jüngste Wert gilt.
- **budget_comments** — Notizen zu Budgetzellen. Der Verlauf lässt sich nur um neue Einträge ergänzen.
- **workspace_settings** — Berichtswährung und Einstellungen des Arbeitsbereichs
- **account_metadata** — Metadaten pro Konto, etwa die Liquiditätsstufe
- **exchange_rates** — tägliche Wechselkurse für die Umrechnung bei der Abfrage
- **workspaces** / **workspace_members** — Datentrennung zwischen Arbeitsbereichen
- **accounts** — Datenbanksicht auf Basis der Buchungen

## Mehrere Währungen

Die Datenbank speichert alle Beträge in ihrer ursprünglichen Währung. Die Umrechnung in die Berichtswährung erfolgt beim Abruf über SQL-Joins mit `exchange_rates`. Die Originalbeträge bleiben erhalten.

## Authentifizierung

Die Umgebungsvariable `AUTH_MODE` unterstützt zwei Modi.

- `none` — ein einzelner lokaler Arbeitsbereich ohne Anmeldung
- `cognito` — passwortlose Anmeldung per E-Mail-Einmalcode über AWS Cognito und offene Registrierung

Für programmatische Clients ist `GET /v1/` der öffentliche Discovery-Endpunkt. Agenten melden sich per E-Mail-Einmalcode auf der Auth-Domain an und erhalten einen langfristig gültigen ApiKey. Danach führen sie SQL über die programmatische Schnittstelle in API Gateway aus.

MCP-fähige Clients verbinden sich separat mit `https://mcp.expense-budget-tracker.com/mcp`. Der Pfad hat eine eigene HTTP-API in API Gateway und eine eigene Lambda-Funktion für MCP. Die interaktive Autorisierung erfolgt über OAuth im Browser auf der Auth-Domain.

Jeder Nutzer erhält einen getrennten Arbeitsbereich. RLS-Richtlinien prüfen bei jeder Abfrage die Mitgliedschaft, auch bei SQL-Anfragen von Programmen.

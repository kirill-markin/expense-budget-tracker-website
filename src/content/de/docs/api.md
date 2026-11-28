---
title: API-Referenz
description: So richtest du die Agent-API ein und greifst über die SQL-API auf deine Finanzdaten zu.
---

## Überblick

Expense Budget Tracker stellt unter dieser Adresse eine öffentliche API für Programme bereit.

`https://api.expense-budget-tracker.com/v1/`

Du kannst dieselbe API auf zwei Arten nutzen.

1. **Einrichtung durch einen Agenten** über `GET /v1/`
2. **Direkte HTTP-Anfragen** mit einem vorhandenen, langfristig gültigen ApiKey

Für alle Anfragen gilt derselbe Zugriffsschutz auf Zeilenebene in Postgres wie in der Web-App.

Wenn dein Client MCP unterstützt, nutze den gehosteten [MCP-Konnektor](/de/docs/mcp-connector/) unter `https://mcp.expense-budget-tracker.com/mcp` und autorisiere ihn im Browser über OAuth. Diese Seite beschreibt die separate Einrichtung der Agent-API und den direkten HTTP-Zugriff mit einem langfristig gültigen `ApiKey`.

## Discovery, Quellcode und aktuelles Schema

Beginne mit dem Discovery-Endpunkt.

`https://api.expense-budget-tracker.com/v1/`

Die Discovery-Antwort zeigt Agenten, wie sie die Anmeldung einleiten und was sie danach aufrufen. Sie verlinkt auch das README und den Quellcode. Die API bietet diese Endpunkte.

- `GET /v1/schema`
- `GET /v1/openapi.json` und `GET /v1/swagger.json` für Kompatibilitätsprüfungen. Sie weisen darauf hin, dass OpenAPI nicht verfügbar ist, und verweisen Clients auf Discovery und Quellcode.

Nutze `schema` für die genaue Liste der Relationen und Spalten, auf die `/v1/sql/query`, `/v1/sql/execute` und der Kompatibilitätsendpunkt `/v1/sql` zugreifen können.

## Einrichtung durch einen Agenten

Wenn Claude Code, Codex, OpenClaw oder ein anderer Agent seine Verbindung selbst einrichten soll, beginne beim Discovery-Endpunkt und folge den Aktionen, die der Server zurückgibt.

### Ablauf der Anmeldung

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Die zurückgegebene Aktion `send_code` und die `bootstrapUrl` lesen
3. Die E-Mail-Adresse des Nutzers per `POST` an `https://auth.expense-budget-tracker.com/api/agent/send-code` senden
4. `otpSessionToken` entgegennehmen
5. Den Nutzer nach dem 8-stelligen Bestätigungscode aus der E-Mail fragen
6. `code`, `otpSessionToken` und `label` per `POST` an `https://auth.expense-budget-tracker.com/api/agent/verify-code` senden
7. Einen langfristig gültigen `ApiKey` entgegennehmen
8. Den Schlüssel außerhalb des Chats speichern
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Optional mit `POST https://api.expense-budget-tracker.com/v1/workspaces` einen Arbeitsbereich anlegen
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Mit `POST https://api.expense-budget-tracker.com/v1/sql/query` Daten abfragen und freigegebene Änderungen per `POST https://api.expense-budget-tracker.com/v1/sql/execute` senden

### Authentifizierungsheader

- `Authorization: ApiKey <key>`

### Arbeitsbereich auswählen

- `POST /v1/workspaces/{workspaceId}/select` speichert den Standardarbeitsbereich für diesen API-Schlüssel
- Sobald ein Arbeitsbereich gespeichert ist, können `/v1/sql/query`, `/v1/sql/execute` und der Kompatibilitätsendpunkt `/v1/sql` den Header `X-Workspace-Id` weglassen
- Mit `X-Workspace-Id: <workspaceId>` kannst du den gespeicherten Arbeitsbereich weiterhin für eine einzelne Anfrage überschreiben
- Wenn der Nutzer genau einen Arbeitsbereich hat und für den Schlüssel noch keiner gespeichert ist, speichert und verwendet die API ihn automatisch

Eine Schritt-für-Schritt-Anleitung findest du unter [KI-Agenten einrichten](/de/docs/agent-setup/).

## Direkter HTTP-Zugriff mit einem vorhandenen Schlüssel

Skripte, Cronjobs, Dashboards und eigene Apps können dieselbe API direkt aufrufen, sobald sie einen langfristig gültigen ApiKey haben.

### Authentifizierung

Übergib den Schlüssel im Header `Authorization` mit dem Authentifizierungsschema `ApiKey`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` ist nur erforderlich, wenn für den Schlüssel noch kein Standardarbeitsbereich gespeichert ist oder du den gespeicherten Arbeitsbereich für diese Anfrage überschreiben willst.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` bei Bedarf

## Endpunkte im Überblick

- `GET /v1/` — öffentliches Discovery-Dokument
- `GET /v1/openapi.json` und `GET /v1/swagger.json` — Kompatibilitätsendpunkte mit Verweisen auf das Discovery-Dokument und den Quellcode. Eine API-Spezifikation liefern sie nicht.
- `GET /v1/me` — Angaben zum authentifizierten Benutzerkonto
- `GET /v1/workspaces` — die für den Inhaber des Schlüssels verfügbaren Arbeitsbereiche auflisten
- `POST /v1/workspaces` — einen Arbeitsbereich anlegen
- `POST /v1/workspaces/{workspaceId}/select` — den Standardarbeitsbereich für diesen Schlüssel speichern
- `GET /v1/schema` — zulässige Relationen und Spalten für SQL prüfen
- `POST /v1/sql/query` — eine schreibgeschützte Anweisung `SELECT` oder `WITH ... SELECT` ausführen
- `POST /v1/sql/execute` — eine genehmigte Anweisung `INSERT`, `UPDATE` oder `DELETE` ausführen
- `POST /v1/sql` — Kompatibilitätsendpunkt für atomare Skripte mit mehreren Anweisungen

## SQL-Regeln

Die primären Endpunkte trennen Lese- und Schreibzugriffe.

- `POST /v1/sql/query` akzeptiert genau eine schreibgeschützte Anweisung `SELECT` oder `WITH ... SELECT`
- `POST /v1/sql/execute` akzeptiert genau eine ändernde Anweisung `INSERT`, `UPDATE` oder `DELETE`, einschließlich der unterstützten Varianten mit `WITH`
- Der Kompatibilitätsendpunkt `POST /v1/sql` akzeptiert eingeschränkte Skripte mit mehreren Anweisungen und führt sie atomar aus. Nutze ihn nur, wenn das Skript diese atomare Ausführung braucht.

Der Server blockiert oder verwirft die folgenden SQL-Konstrukte.

- Mehrere Anweisungen auf den primären Endpunkten `/v1/sql/query` und `/v1/sql/execute`
- DDL wie `CREATE`, `DROP` und `ALTER`
- Transaktionsanweisungen wie `BEGIN`, `COMMIT` und `ROLLBACK`
- `set_config()`
- SQL-Kommentare
- Bezeichner in Anführungszeichen
- Zeichenketten mit Dollar-Quoting

Der Server beschränkt auch die abfragbaren Relationen. Prüfe über `/v1/schema`, welche Relationen und Spalten zur Verfügung stehen, bevor du SQL erzeugst.

Derzeit stehen diese Relationen zur Verfügung.

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (nur lesbar)
- `fx_rates_raw` (nur lesbar)
- `fx_rates_daily` (nur lesbar)

## Limits

- 100 zurückgegebene Zeilen pro Anfrage
- 100 betroffene Zeilen pro Schreibanweisung und Anfrage
- 25 Sekunden für die gesamte SQL-Anfrage
- 10 Anfragen pro Sekunde und 10.000 Anfragen pro Tag und Schlüssel

## Sicherheit

- Die API speichert Schlüssel als SHA-256-Hashes. Der Klartext wird nie dauerhaft gespeichert.
- RLS trennt Arbeitsbereiche auf Datenbankebene.
- Schlüssel lassen sich jederzeit in der App widerrufen.
- Wenn ein Mitglied aus einem Arbeitsbereich entfernt wird, widerruft der Dienst automatisch alle Schlüssel dieses Mitglieds.

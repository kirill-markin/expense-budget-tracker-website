---
title: KI-Agenten einrichten
description: Gib Claude Code, Codex oder OpenClaw eine Discovery-URL. Der Agent folgt den Angaben des Endpunkts, prüft den 8-stelligen Bestätigungscode und speichert seinen langfristig gültigen ApiKey für die Arbeit in deinem Arbeitsbereich.
---

## Diesen Link gibst du deinem Agenten

Teile genau diese URL.

`https://api.expense-budget-tracker.com/v1/`

Dieser Endpunkt liefert das maßgebliche öffentliche Discovery-Dokument für KI-Agenten. Es beschreibt, wie der Agent die Anmeldung einleitet, welche Endpunkte er anschließend aufruft, welches Authentifizierungsverfahren er danach nutzt und wo er das aktuelle Schema und den offenen Quellcode findet.

Diese Anleitung zeigt, wie Terminal-Agenten und HTTP-Clients direkten Zugang zur Agent-API einrichten. Wenn dein Client MCP unterstützt, nutze den gehosteten [MCP-Konnektor](/de/docs/mcp-connector/). Er verbindet sich mit `https://mcp.expense-budget-tracker.com/mcp` und holt deine Freigabe über OAuth im Browser ein. Dafür braucht er keinen ApiKey.

## Was du tust

1. Öffne Claude Code, Codex, OpenClaw oder einen anderen Agenten, der HTTP-Anfragen stellen kann.
2. Bitte den Agenten, sich über `https://api.expense-budget-tracker.com/v1/` mit Expense Budget Tracker zu verbinden.
3. Wenn der Agent nach einer E-Mail-Adresse fragt, gib die Adresse an, die du bei Expense Budget Tracker verwendest.
4. Schau im Posteingang nach dem 8-stelligen Bestätigungscode.
5. Gib den Code an den Agenten weiter.
6. Lass den Agenten den erhaltenen ApiKey außerhalb des Chats speichern. Fahre dann mit dem Import, der Abfrage oder deiner Budgetplanung fort.

Sobald der Bestätigungscode aus der E-Mail geprüft ist, richtet der Agent seine Verbindung selbst ein. Du brauchst bei der Anmeldung keinen Schlüssel zu kopieren.

## Was der Agent tut

So läuft die Einrichtung ab.

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Die Discovery-Antwort lesen und den zurückgegebenen Aktionen folgen. Die nächsten Schritte nicht fest im Client hinterlegen.
3. Die E-Mail-Adresse des Nutzers per `POST` an die zurückgegebene `bootstrapUrl` senden
4. `otpSessionToken` und die Aktion `verify_code` entgegennehmen
5. Den Nutzer nach dem 8-stelligen Bestätigungscode aus der E-Mail fragen
6. `code`, `otpSessionToken` und eine Verbindungsbezeichnung als `label` per `POST` an `https://auth.expense-budget-tracker.com/api/agent/verify-code` senden
7. Einen neuen `ApiKey` entgegennehmen
8. Den Schlüssel außerhalb des Chats speichern, vorzugsweise als `EXPENSE_BUDGET_TRACKER_API_KEY`
9. `GET https://api.expense-budget-tracker.com/v1/me` mit `Authorization: ApiKey <key>` aufrufen
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Bei Bedarf mit `POST /v1/workspaces` einen Arbeitsbereich anlegen
12. Mit `POST /v1/workspaces/{workspaceId}/select` einen Standardarbeitsbereich speichern
13. Die zulässigen Relationen mit `GET https://api.expense-budget-tracker.com/v1/schema` prüfen
14. Mit `POST https://api.expense-budget-tracker.com/v1/sql/query` Daten abfragen und freigegebene Änderungen per `POST https://api.expense-budget-tracker.com/v1/sql/execute` senden

Der Agent wählt den Arbeitsbereich explizit aus. Mit `POST /v1/workspaces/{workspaceId}/select` speichert der Server ihn für den jeweiligen API-Schlüssel. Danach können Aufrufe von `/v1/sql/query` und `/v1/sql/execute` den Header `X-Workspace-Id` weglassen. Gib `X-Workspace-Id` an, wenn du den gespeicherten Arbeitsbereich für eine einzelne Anfrage überschreiben willst. Der Kompatibilitätsendpunkt `POST /v1/sql` ist atomaren Skripten mit mehreren Anweisungen vorbehalten. Für gewöhnliche Lese- und Schreibvorgänge nutze die jeweiligen einzelnen Endpunkte.

Wenn der Nutzer genau einen Arbeitsbereich hat und dem Schlüssel noch keiner zugeordnet ist, speichert und verwendet das Backend diesen Arbeitsbereich automatisch.

## Was der Agent speichern sollte

Der von `verify-code` zurückgegebene Schlüssel ist langfristig gültig. Verlass dich zur Aufbewahrung nicht allein auf den Chat.

- Wenn der Nutzer das Schreiben von Dateien erlaubt, speichere den Schlüssel in einer lokalen `.env`-Datei als `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`
- Andernfalls exportiere ihn in der aktuellen Shell als `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` und bitte den Nutzer, ihn dauerhaft zu speichern

Verwende bei authentifizierten Anfragen diese Header.

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` nur, wenn du den gespeicherten Arbeitsbereich überschreibst oder noch keiner gespeichert ist

## Einstieg für KI-Agenten

Rufe zuerst den Discovery-Endpunkt auf.

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Folge dann den Aktionen, die der Server zurückgibt. Wenn die Discovery-Antwort die nächsten Schritte vorgibt, verwende diese Angaben.

Speichere nach `verify-code` den zurückgegebenen `ApiKey` sicher. Lade dann diese Informationen.

- `/v1/me` für Angaben zum Benutzerkonto
- `/v1/workspaces` für die verfügbaren Arbeitsbereiche
- `/v1/schema` für die zulässigen SQL-Relationen und Spalten
- `/v1/openapi.json` oder `/v1/swagger.json` nur, wenn der Client die üblichen Spezifikations-URLs prüft. Sie liefern Discovery- und Quellcode-Links. Eine API-Spezifikation ist dort nicht verfügbar.

## Beispielprompts für Nutzer

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## Was nach der Einrichtung möglich ist

- Kontoauszüge oder Kreditkartenexporte importieren
- Transaktionen deinen vorhandenen Kategorien zuordnen
- Kontostände mit den Angaben der Bank abgleichen
- Ausgaben nach Kategorie, Zeitraum, Händler oder Konto abfragen
- Budgetzeilen für den nächsten Monat aktualisieren

Mehr zu den Endpunkten und zur Authentifizierung findest du in der [API-Referenz](/de/docs/api/).

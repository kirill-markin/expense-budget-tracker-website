---
title: MCP-Konnektor
description: Verbinde einen MCP-Client über OAuth mit Expense Budget Tracker und frage Finanzdaten sicher ab oder aktualisiere sie.
---

## Überblick

Expense Budget Tracker bietet einen gehosteten Konnektor für das Model Context Protocol (MCP) unter dieser Adresse.

`https://mcp.expense-budget-tracker.com/mcp`

Der Endpunkt verwendet Streamable HTTP und OAuth. Gib diese URL einem MCP-Client, der entfernte Server über Streamable HTTP sowie OAuth-Discovery unterstützt. Zur Autorisierung öffnet sich ein Browser, in dem du dich anmeldest und den Zugriff freigibst.

Der Konnektor verwendet OAuth-Zugriffs- und Refresh-Tokens. Der langfristig gültige `ApiKey` aus der [Agent-API-Referenz](/de/docs/api/) gehört zu einer separaten Integration über direkte HTTP-Anfragen. Der MCP-Endpunkt akzeptiert ihn nicht.

## OAuth-Discovery und Verbindung

Der gehostete Konnektor veröffentlicht die Metadaten der geschützten Ressource hier.

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Diese Metadaten verweisen auf den Autorisierungsserver. Dessen Metadaten findest du unter dieser URL.

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Ein kompatibler Client geht so vor.

1. Er verbindet sich mit `https://mcp.expense-budget-tracker.com/mcp` und ermittelt die Metadaten der geschützten Ressource.
2. Er registriert sich dynamisch als öffentlicher OAuth-Client. Ein Client-Secret wird dabei nicht verwendet.
3. Er startet den Autorisierungscode-Flow und öffnet die Autorisierungs-URL im Browser des Nutzers.
4. Er verwendet PKCE für jede Autorisierungsanfrage. `S256` ist die einzige unterstützte Code-Challenge-Methode.
5. Er fordert `expenses:read` an. `expenses:write` fordert er nur an, wenn er `sql_execute` aufrufen muss.
6. Er tauscht den Autorisierungscode gegen Zugriffs- und Refresh-Tokens und erneuert bei Bedarf den Zugriff.

Kopiere keine Tokens in Prompts, Chatverläufe, Quelldateien oder Protokolle. Speichere sie ausschließlich im Speicher für Zugangsdaten deines MCP-Clients.

## Berechtigungen

- `expenses:read` ist erforderlich. Damit kann der Client Arbeitsbereiche ermitteln, das Schema einsehen und schreibgeschützte Abfragen stellen.
- `expenses:write` ist optional. Diese separate Berechtigung erlaubt `sql_execute`. Damit kann der Client Daten anlegen, ändern oder löschen.

Fordere nur die Berechtigungen an, die du für die Aufgabe brauchst. Wenn ein Client nur Daten auswertet oder Berichte erstellt, genügt `expenses:read`. `expenses:write` braucht er dafür nicht.

## Tools

### `list_workspaces`

Listet die für den angemeldeten Nutzer verfügbaren Arbeitsbereiche auf. Wähle vor dem Lesen oder Ändern von Daten den gewünschten Arbeitsbereich anhand der zurückgegebenen ID aus.

### `get_schema`

Gibt die Relationen und Spalten zurück, die MCP im ausgewählten Arbeitsbereich nutzen darf. Rufe das Tool vor dem Schreiben von SQL auf, um die tatsächlichen Tabellen- und Spaltennamen zu prüfen.

### `sql_query`

Führt eine einzelne eingeschränkte, schreibgeschützte SQL-Abfrage im ausgewählten Arbeitsbereich aus. Für diesen Abfragepfad erzwingt die Datenbank reinen Lesezugriff. Abfragen liefern höchstens 100 Zeilen und dürfen maximal 20 Sekunden laufen.

### `sql_execute`

Führt eingeschränktes SQL aus, das Daten im ausgewählten Arbeitsbereich ändert. Mit dem Tool lassen sich Daten auch löschen. Es erfordert die separate Berechtigung `expenses:write`. Bestätige den Arbeitsbereich und prüfe die genaue Anweisung, bevor du den Aufruf freigibst.

Der MCP-Server erlaubt Änderungen über `sql_execute`. Nur `sql_query` und der zugehörige Datenbankzugriff sind schreibgeschützt.

## Sicherer Einsatz

1. Rufe `list_workspaces` auf und bestätige den vorgesehenen Arbeitsbereich mit dem Nutzer.
2. Rufe `get_schema` auf, bevor du SQL erzeugst.
3. Verwende `sql_query` für Prüfungen, Summen, Abgleiche und Berichte.
4. Fordere `expenses:write` nur an, wenn die Aufgabe Daten ändern muss.
5. Zeige vor `sql_execute` die genaue Anweisung und ihre erwartete Wirkung. Bestätige den Arbeitsbereich erneut.
6. Prüfe das Ergebnis nach einem Schreibvorgang mit `sql_query`.

Der Server beschränkt die zulässigen SQL-Anweisungen und verfügbaren Relationen. Prüfe erzeugtes SQL zusätzlich sorgfältig.

## Limits

- Höchstens 100 Zeilen in SQL-Ergebnissen
- Maximal 20 Sekunden Ausführungszeit
- Zugriff nur auf Arbeitsbereiche, die dem angemeldeten Nutzer zur Verfügung stehen
- `sql_query` erlaubt eingeschränktes SQL und nutzt einen schreibgeschützten Datenbankzugriff
- `sql_execute` erfordert `expenses:write` zusätzlich zur vorgeschriebenen Leseberechtigung

## Datenschutz und Selbsthosting

Ein autorisierter MCP-Client kann Finanzdaten lesen und mit `expenses:write` auch ändern. Lies vor dem Verbinden die [Datenschutzerklärung](/de/privacy/) und die Hinweise des Clients zur Verarbeitung deiner Daten.

Die gehosteten URLs oben gelten nur für den verwalteten Dienst von Expense Budget Tracker. Folge für eine eigene Installation der [Anleitung zum Selbsthosting](/de/docs/self-hosting/) und konfiguriere den MCP-Endpunkt und die OAuth-Metadaten für deine Domains. Die Implementierung findest du im [Quellcode-Repository](https://github.com/kirill-markin/expense-budget-tracker).

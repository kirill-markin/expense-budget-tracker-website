---
title: Erste Schritte
description: Registriere dich für die Cloud-Version oder richte in wenigen Minuten deine eigene Instanz ein.
---

## Cloud-Version

Am schnellsten startest du mit der verwalteten Cloud-Version.

1. Öffne [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Registriere dich mit deiner E-Mail-Adresse und dem Bestätigungscode aus der E-Mail. Die Anmeldung läuft ohne Passwort.
3. Erfasse deine Ausgaben in der Web-App
4. Wenn dein Client MCP unterstützt, füge `https://mcp.expense-budget-tracker.com/mcp` hinzu und autorisiere den Zugriff im Browser
5. Terminal-Agenten und direkte HTTP-Clients beginnen mit `GET https://api.expense-budget-tracker.com/v1/`

Du musst weder etwas installieren noch einen Server einrichten. Postgres trennt die Daten der Arbeitsbereiche durch Zugriffsschutz auf Zeilenebene.

## Zugriff für Agenten und Programme

Dasselbe Cloud-Benutzerkonto gilt für die Web-App, MCP und die Agent-API.

- Die Weboberfläche unter `https://app.expense-budget-tracker.com`
- Den gehosteten [MCP-Konnektor](/de/docs/mcp-connector/) unter `https://mcp.expense-budget-tracker.com/mcp` mit OAuth-Autorisierung im Browser
- Die [Einrichtung der Agent-API](/de/docs/agent-setup/) über `GET https://api.expense-budget-tracker.com/v1/`, anschließend direkte HTTP-Anfragen mit `Authorization: ApiKey <key>`

## Selbst hosten

Wenn du lieber eine eigene Instanz betreibst, folge der [Anleitung zum Selbsthosting](/de/docs/self-hosting/).

## Demo-Modus

Die App hat einen integrierten Demo-Modus. Wechsle in der Kopfleiste von „Alle“ zu „Demo“, um die App mit Beispieldaten auszuprobieren. Dafür brauchst du keine Datenbank.

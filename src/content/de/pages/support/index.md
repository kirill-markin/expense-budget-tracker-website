---
title: Support
description: Hilfe zu Expense Budget Tracker und Hinweise zum Melden von Sicherheitsproblemen, auch beim gehosteten MCP-Dienst.
slug: support
sections:
  - type: simple_markdown_page
---

## Hilfe zum gehosteten Dienst und zu MCP

Bei Fragen zur gehosteten App, deinem Benutzerkonto, der OAuth-Autorisierung oder dem öffentlichen MCP-Server schreib an [markinkirill@gmail.com](mailto:markinkirill@gmail.com). Wir helfen im Rahmen unserer Möglichkeiten. Eine Antwort innerhalb einer bestimmten Frist können wir nicht zusagen.

Gib nur die Angaben an, die wir zur Fehlersuche brauchen.

- Name und Version des Clients
- Datum, Uhrzeit und Zeitzone des Fehlers
- Betroffener Endpunkt oder betroffene Seite
- OAuth-Schritt oder Name des MCP-Tools
- Genauer Fehlertext ohne sensible Angaben und, falls angezeigt, die Anfrage-ID
- Was du erwartet hast und was tatsächlich passiert ist

Sende keine Passwörter, Sitzungscookies, OAuth-Codes, Zugriffs- oder Refresh-Tokens, API-Schlüssel, Finanzdaten im Rohformat oder ungeschwärzte Anfrageinhalte.

## Sicherheitsprobleme melden

Melde eine vermutete Schwachstelle vertraulich per E-Mail an [markinkirill@gmail.com](mailto:markinkirill@gmail.com) mit dem Betreff **Expense Budget Tracker security report**. Beschreibe die kürzestmöglichen Schritte, mit denen sich das Problem nachvollziehen lässt, und entferne dabei sensible Angaben. Veröffentliche die Meldung keinesfalls als GitHub-Issue. Füge keine gültigen Zugangsdaten oder Finanzdaten bei. Falls der Zugriff möglicherweise für Unbefugte offensteht oder offenstand, widerrufe zuerst die Verbindung unter **Einstellungen > Zugriff für Agenten und Programme** und ersetze alle anderen betroffenen Zugangsdaten.

## Fehler, Selbsthosting und Fragen an die Community

Nutze den [GitHub-Issue-Tracker](https://github.com/kirill-markin/expense-budget-tracker/issues) für reproduzierbare Produktfehler, Fragen zum Selbsthosting und Diskussionen, die öffentlich sein dürfen. Suche zuerst in den vorhandenen Issues und entferne private Daten aus Protokollen und Screenshots. Die [Anleitung zum Selbsthosting](/de/docs/self-hosting/) und das [Quellcode-Repository](https://github.com/kirill-markin/expense-budget-tracker) helfen bei Fragen zu Bereitstellung und Entwicklung.

## Bevor du ein MCP-Problem meldest

Prüfe, ob dein Client Verbindungen zu entfernten MCP-Servern über Streamable HTTP, den OAuth-2.1-Autorisierungscode-Flow mit PKCE und Dynamic Client Registration unterstützt. Verwende den universellen Endpunkt genau wie in der [MCP-Anleitung](/de/docs/mcp-connector/) angegeben. Stelle die Verbindung neu her und versuche es noch einmal. Besteht das Problem weiter, sende die oben genannten Angaben ohne sensible Daten.

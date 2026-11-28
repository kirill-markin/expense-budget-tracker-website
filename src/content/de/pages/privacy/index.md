---
title: Datenschutzerklärung
description: Datenschutzerklärung für Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: August 2026
---
## Welche Daten wir erheben

Wenn du die Cloud-Version nutzt, speichern wir die Finanzdaten, die du eingibst (Transaktionen, Budgets, Kontonamen), sowie deine E-Mail-Adresse zur Anmeldung. Selbst gehostete Instanzen übermitteln uns keine Daten.

## Betreiber

SAMO DANNI EOOD (USt-IdNr. BG207395566) betreibt die gehostete Version von Expense Budget Tracker. Kirill Markin hat Expense Budget Tracker entwickelt. Seine persönliche Website [kirill-markin.com](https://kirill-markin.com/) gehört zum selben Produktumfeld.

Diese Erklärung gilt für die Website, App, API und den über das Internet erreichbaren MCP-Dienst, die wir betreiben. Selbst gehostete Instanzen bleiben unter der Kontrolle ihrer jeweiligen Betreiber.

## Wie wir deine Daten verwenden

Wir verwenden deine Finanzdaten ausschließlich, um den Dienst bereitzustellen. Wir verkaufen sie nicht und nutzen sie nicht für Werbung. Wir geben sie nur auf deine Anweisung an einen Drittanbieter-Client weiter, etwa wenn du eine MCP-Verbindung autorisierst. Postgres trennt die Daten der Arbeitsbereiche durch Zugriffsschutz auf Zeilenebene.

## MCP und KI-Clients von Drittanbietern

Wenn du einen KI-Client mit dem gehosteten MCP-Dienst verbindest, verarbeitet Expense Budget Tracker die OAuth-Autorisierungsanfrage, das angeforderte Tool und dessen Argumente, den ausgewählten Arbeitsbereich und die Finanzdaten, die für die Leseanfrage oder die genehmigte Änderung erforderlich sind. Änderungen über MCP werden in demselben Finanzdatenbestand gespeichert wie Änderungen über die Web-App.

Der Dienst speichert den Namen und die Weiterleitungs-URLs des registrierten Clients, Metadaten zur Verbindung und zu den Berechtigungen, die Zeitpunkte von Erstellung, Aktivität und Widerruf sowie Einweg-Hashes der OAuth-Autorisierungscodes sowie der Zugriffs- und Refresh-Tokens. Die OAuth-Tokens im Klartext speichern wir nicht. Der MCP-Dienst speichert die Unterhaltung des KI-Clients nicht als Chat in Expense Budget Tracker. Er empfängt die einzelnen Tool-Anfragen und gibt jeweils das angeforderte Ergebnis zurück.

Der KI-Client stammt von einem eigenständigen Drittanbieter. Dieser kann Prompts, Tool-Argumente und zurückgegebene Finanzdaten nach seinen eigenen Nutzungsbedingungen und seiner eigenen Datenschutzerklärung verarbeiten oder aufbewahren. Prüfe die Datenschutzerklärung des Anbieters, bevor du den Client verbindest. Unter **Einstellungen > Zugriff für Agenten und Programme** kannst du eine MCP-Verbindung jederzeit widerrufen. Dein Benutzerkonto und die zugehörigen gehosteten Daten kannst du wie unten beschrieben in den Einstellungen löschen.

## Datenspeicherung

Die Cloud-Daten liegen in AWS RDS (Postgres) in der Region eu-central-1. Wir sichern sie täglich automatisch. Wir verschlüsseln die Daten bei der Speicherung und bei der Übertragung.

## Cookies

Zur Anmeldung verwenden wir ein `session`-Cookie (HttpOnly, Secure, SameSite=Lax). Wir verwenden keine Tracking-Cookies und keine Analysedienste von Drittanbietern.

## Daten löschen

Du kannst dein Benutzerkonto und alle zugehörigen Daten jederzeit in den Einstellungen der App löschen. Bei selbst gehosteten Instanzen kontrollierst du die Datenbank direkt.

## Open Source

Der gesamte Quellcode ist offen. Du kannst genau prüfen, was die App mit deinen Daten macht.

---
title: "Ausgaben mit Claude Code erfassen und Kontostände abgleichen"
description: "Ein Link verbindet Claude Code mit Expense Budget Tracker. Prüfe und genehmige den Import, gleiche Kontostände ab und aktualisiere dein Budget ohne Bankanbindung."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "Ausgaben mit Claude Code erfassen"
  - "Ausgaben mit Claude verfolgen"
  - "Ausgaben-Tracker für Claude"
  - "Budgetplanung mit Claude Code"
  - "Claude mit Ausgaben-Tracker verbinden"
  - "Kontoauszug mit Claude Code importieren"
---

Beim Abgleich eines Kontoauszugs mit vier Buchungen kann die Differenz `0,00 €` betragen, obwohl die Budgetauswertung falsch ist. Wenn du einen Einkauf im Supermarkt für 54,20 € unter „Reisen“ statt unter „Lebensmittel“ buchst, stimmt der Kontostand weiterhin auf den Cent. In der Auswertung fehlen 54,20 € bei den Lebensmitteln.

Wenn du mit Claude Code Ausgaben erfasst, brauchst du zwei Prüfungen. Die gespeicherten Kontobewegungen müssen zum Kontostand bei der Bank führen. Die gespeicherten Kategorien müssen mit dem geprüften Auszug übereinstimmen. Claude Code kann die Datei einlesen, rechnen und die API aufrufen. Du wählst das Konto und die Kategorien, prüfst die vorgeschlagenen Buchungen und gibst die konkreten Änderungen frei.

Expense Budget Tracker hat keine direkte Bankanbindung und bietet für diesen Ablauf keinen Datei-Upload. Exportiere den Auszug selbst und lege ihn an einem Ort ab, den Claude Code lesen darf. Sende dann nur die freigegebenen Buchungen über die verwaltete Agent-API. Wenn du vor allem auf dauerhaften Bankzugriff verzichten willst, findest du im Artikel [Budget-Apps ohne Bankanbindung](/blog/budget-app-without-bank-linking/) (auf Englisch) eine ausführlichere Abwägung.

![Eine Restauratorin hebt eine falsch platzierte blaue Mosaikfliese aus einem Terrakottastreifen. Daneben steht eine Messingwaage im Gleichgewicht.](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Claude Code mit einem Discovery-Link verbinden

Installiere Claude Code und melde dich an. Anthropic beschreibt beides in seiner [offiziellen Kurzanleitung](https://code.claude.com/docs/de/quickstart). In der [CLI-Referenz](https://code.claude.com/docs/de/cli-reference) steht, wie Arbeitsverzeichnisse und zusätzlicher Dateizugriff funktionieren.

Starte `claude` in dem Verzeichnis, in dem der Kontoauszug liegt, oder erlaube den Zugriff auf das Verzeichnis mit einer Methode, die deine Installation unterstützt. Füge dann diesen Prompt ein.

```text
Connect to Expense Budget Tracker from this discovery link:
https://app.expense-budget-tracker.com/api/agent

Fetch it with GET, read the returned JSON, and follow the current action URLs. Do not
guess or hardcode the API flow. Ask me for my Expense Budget Tracker email and start
the email OTP flow.
After that request succeeds, tell me to check spam or junk if the message is not
visible, ask me for the 8-digit code, and follow the returned verification action.

After verification, ask me to approve a persistent storage location for the returned
ApiKey outside chat memory and source control. Load my account context, list my
workspaces, ask me to confirm the target workspace, save it as the default for this
key, and inspect the live schema. Run one small read-only query to confirm the selected
workspace. Do not write financial data.
```

Der [Agenten-Link auf der App-Domain](https://app.expense-budget-tracker.com/api/agent) gibt das aktuelle Discovery-Dokument zurück. Darin steht derzeit `https://api.expense-budget-tracker.com/v1/` als API-Basisadresse, zusammen mit den URLs für Anmeldung und SQL-Aktionen. Füge den Link auf der App-Domain ein. Claude Code soll den vom Dienst gelieferten URLs folgen, damit der Ablauf auch bei Änderungen aktuell bleibt.

Für Registrierung und Anmeldung gilt derselbe E-Mail-Ablauf. Sobald du den 8-stelligen Bestätigungscode weitergibst, erhält Claude Code einen langfristig gültigen `ApiKey`. Gib einen konkreten Speicherort frei, etwa eine Datei für Zugangsdaten, die von der Versionsverwaltung ausgeschlossen ist. Halte den Schlüssel aus `CLAUDE.md` und aus der Versionsverwaltung heraus. In [KI-Agenten einrichten](/de/docs/agent-setup/) findest du die Details zur Anmeldung und zur Auswahl des Arbeitsbereichs.

## Wann du die Agent-API oder MCP verwendest

Mit „Ausgaben-Tracker für Claude“ können zwei verschiedene Integrationen gemeint sein. Hier geht es um Claude Code im Terminal mit der Agent-API. In Claude und Claude Desktop kannst du den gehosteten MCP-Konnektor nutzen.

| | Claude Code mit Agent-API | Claude oder Claude Desktop mit MCP |
|---|---|---|
| Geeignet für | Arbeit im Terminal mit zugänglichen lokalen Dateien und direktem HTTP-Zugriff | Unterhaltungen in einem Claude-Client mit MCP-Unterstützung |
| Einstieg | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Anmeldung | Bestätigungscode per E-Mail, danach ein langfristig gültiger `ApiKey` | OAuth im Browser |
| Datenzugriff | Discovery-URLs für Lese- und Schreibendpunkte | Tool `sql_query` und optional `sql_execute` |
| Zugriff auf Kontoauszüge | Dateien und Verzeichnisse, auf die diese Claude-Code-Sitzung zugreifen kann | Der entfernte Konnektor hat keinen Zugriff auf lokale Dateien |

Jede Integration braucht ihre eigenen Zugangsdaten. Für Claude im Web oder als Desktop-App folge der [MCP-Anleitung zum Ausgaben-Tracking mit Claude](/blog/claude-expense-tracker-mcp-connector/) (auf Englisch). Wenn Claude Code bereits auf die Datei zugreifen kann, nutze den folgenden Ablauf über die Agent-API.

Berücksichtige außerdem, wo deine Daten verarbeitet werden und welche Dienste beim Selbsthosting verfügbar sind.

- Der Modellanbieter verarbeitet Daten unabhängig von der API und dem Speicher von Expense Budget Tracker. Lies die [Claude-Code-Dokumentation zur Datennutzung](https://code.claude.com/docs/de/data-usage) und die Bedingungen des in deiner Installation konfigurierten Anbieters, bevor du Daten aus einem Kontoauszug weitergibst.
- Das lokale Docker-Compose-Setup aus der [Anleitung zum Selbsthosting](/de/docs/self-hosting/) startet die Web-App, den Auth-Dienst, die Datenbank und den Worker für Wechselkurse. Die hier verwendete verwaltete Agent-API ist darin nicht enthalten. Die getrennte AWS-Bereitstellung aus dem Repository umfasst die öffentliche Schnittstelle für Programme.

## Den Import klar eingrenzen

Nimm für den ersten Durchlauf ein Konto, eine Währung und einen abgeschlossenen Auszugszeitraum. Mit einer CSV-Datei kannst du die einzelnen Zeilen leicht prüfen. Bei einem anderen Exportformat lass Claude Code zuerst bestätigen, dass es die Datei in deiner Umgebung lesen kann, und dir die eingelesenen Zeilen zeigen. Der Dateiname allein sagt nichts darüber aus, ob sich die Datei einlesen lässt.

Gib Claude Code diese sechs Angaben.

1. Den lokalen Pfad zum Auszug.
2. Das Bankkonto und das dazugehörige Konto in Expense Budget Tracker.
3. Die Kontowährung.
4. Das erste und letzte Buchungsdatum.
5. Den Anfangssaldo oder den letzten verlässlich bestätigten Kontostand.
6. Den Schlusssaldo laut Auszug.

Lass vorgemerkte Transaktionen bis zur Buchung außen vor. Bewahre die Quelldatei unverändert auf und lass Claude Code eine separate Vorschau erstellen.

Diesen Regelsatz kannst du in einer lokalen `CLAUDE.md` im Ordner für deine Finanzen hinterlegen.

```markdown
# Expense Budget Tracker workflow

- Start from https://app.expense-budget-tracker.com/api/agent and follow discovery.
- Confirm the target workspace and inspect the live schema before writing SQL.
- Use the read action for all inspection and reconciliation.
- Before a write, show the source totals, possible duplicates, exact SQL, and expected rows.
- Wait for my explicit approval of the complete change set.
- Use the write action only for the approved INSERT, UPDATE, or DELETE.
- Verify every write with a fresh read.
- Never invent a balancing entry or silently resolve an uncertain category.
- Keep the ApiKey outside this file and outside source control.
```

Ergänze feste Angaben wie deine tatsächlichen Kontonamen, Regeln für die Kategorisierung, die Buchungsregeln für Umbuchungen und die Berichtswährung. Übernimm die Beispielkategorien aus diesem Artikel nur, wenn sie zu deinem Buchungsjournal passen.

## Den Kontoauszug mit vollständiger Vorschau importieren

Sobald die Verbindung funktioniert, füge den folgenden Prompt ein und ersetze die Angaben in eckigen Klammern.

```text
Import [local statement path] into [tracker account] for [posted start date] through
[posted end date] in [currency]. The opening balance is [amount] and the bank's closing
balance is [amount].

First confirm the selected workspace and inspect the live schema. Use only the read
action to inspect the target account, existing categories, and ledger rows that overlap
the statement period. Confirm that you can read the local file, parse it, and prepare a
complete preview without writing anything.

For every source row, show its source identifier or row number, posted date, signed
amount, currency, target account, proposed transaction type, proposed category, and
duplicate status. Flag transfers, refunds, reimbursements, fees, foreign-currency rows,
unfamiliar counterparties, and uncertain classifications.

Then show the source row count and signed total, all proposed ledger rows, possible
duplicates, the exact SQL you would send, and the expected affected-row count. Stop
and wait for my explicit approval of the complete change set.
```

Bis du eine Änderung freigibst, darf Claude Code die Datenbank nur lesen. Es soll das aktuelle Schema prüfen, das passende Konto ermitteln und vorhandene Buchungen im selben Zeitraum abfragen. Stimmen Datum und Betrag überein, ist das ein Hinweis auf ein mögliches Duplikat. Beide Angaben können auch bei zwei echten Einkäufen identisch sein.

### Ein Beispiel mit vier Buchungen

Angenommen, der Auszug eines Girokontos weist einen Anfangssaldo von 1.250,00 € und vier gebuchte Posten aus.

| Zeile | Buchungsdatum | Beschreibung | Betrag mit Vorzeichen | Vorgeschlagener Typ | Vorgeschlagene Kategorie | Hinweis zur Prüfung |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Gehalt | +2.000,00 € | Einnahme | Gehalt | Eindeutig |
| 2 | 2026-09-02 | Supermarkt | −54,20 € | Ausgabe | Lebensmittel | Händler prüfen, falls unbekannt |
| 3 | 2026-09-03 | Umbuchung aufs Sparkonto | −300,00 € | Umbuchung | — | Gegenkonto bestätigen |
| 4 | 2026-09-04 | Café | −8,40 € | Ausgabe | Essen außer Haus | Eindeutig |

Die Summe der vier Beträge mit Vorzeichen beträgt `+1.637,40 €`. Zusammen mit dem Anfangssaldo von `1.250,00 €` ergibt das einen erwarteten Schlusssaldo von `2.887,40 €`. Dieses Beispiel passt auf einen Bildschirm. Bei einem längeren Import gehören ebenfalls alle Quellzeilen und alle offenen Fragen in die Vorschau.

Bestätige bei der Umbuchung das Gegenkonto, denn eine Bewegung zwischen deinen eigenen Konten ist keine Ausgabe. Auch bei Rückerstattungen und Auslagenerstattungen muss der tatsächliche Typ erhalten bleiben. Markiere eine unsichere Kategorisierung zur Prüfung, bevor eine Kategorie endgültig festgelegt wird.

### Einen konkreten Satz von Änderungen freigeben

Prüfe Arbeitsbereich, Konto, Zeitraum, Zeilenzahl, Summe der vorzeichenbehafteten Beträge, mögliche Duplikate sowie Buchungstypen und Kategorien. Gib die konkrete Vorschau und die zugehörigen SQL-Anweisungen frei. Ein allgemeiner Auftrag wie „alles importieren“ reicht dafür nicht aus.

Die Agent-API trennt Lese- und Schreibvorgänge. Claude Code verwendet die ermittelte Leseaktion für genau ein `SELECT` oder `WITH ... SELECT`. Die Schreibaktion nutzt es nur für ein ausdrücklich genehmigtes `INSERT`, `UPDATE` oder `DELETE`. Für Tabellen und Spalten ist das aktuelle Schema maßgeblich. Die [API-Referenz](/de/docs/api/) erklärt, welches SQL akzeptiert wird und welche Limits gelten.

### Lange INSERTs und UPDATEs vorab testen

Vor einem langen `INSERT` oder `UPDATE` weisen die aktuellen Discovery-Angaben den Agenten an, zuerst eine repräsentative Anweisung mit demselben SQL-Aufbau auszuführen. Bei einem `INSERT` sind das 1–3 Zeilen mit Literalwerten. Bei einem `UPDATE` ist es eine gezielt ausgewählte Zeile. Deine Freigabe gilt für den Test und die verbleibenden Zeilen aus den geprüften Änderungen.

Wenn der Test klappt, soll Claude Code sofort in aufeinanderfolgenden Blöcken von höchstens 100 Datensätzen weitermachen und jeden Block prüfen. Bei 247 genehmigten Zeilen und einem Test mit 3 Zeilen bleiben Blöcke von 100, 100 und 44 Zeilen. Wenn sich der Umfang ändert, eine neue Unklarheit auftaucht oder die Ausführung fehlschlägt, braucht es eine neue Freigabe. Weitere Blöcke innerhalb der geprüften Änderungen sind bereits freigegeben.

Das eingeschränkte SQL unterstützt `ON CONFLICT` nicht. Mögliche Duplikate müssen deshalb ausdrücklich behandelt werden. Leseabfragen liefern höchstens 100 Zeilen. Claude Code soll in den Metadaten der Antwort prüfen, wie viele Zeilen zurückgegeben wurden und ob das Ergebnis gekürzt wurde. Summen sollte es in SQL berechnen und Detailprüfungen auf eng eingegrenzte, sortierte Abfragen aufteilen. Eine gekürzte Antwort reicht für eine vollständige Importprüfung nicht aus.

### Die gespeicherten Zeilen erneut lesen

Eine erfolgreiche API-Antwort bestätigt, dass die Anfrage ausgeführt wurde. Ob alle gespeicherten Werte mit der Vorschau übereinstimmen, zeigt eine erneute Abfrage des betroffenen Kontos und Zeitraums. Vergleiche dabei diese Angaben.

- Anzahl der eingefügten Zeilen
- Buchungsdaten, Beträge mit Vorzeichen und Währungen
- Kontozuordnung
- Transaktionstypen und Kategorien
- Mögliche Duplikate
- Summen je Block und Gesamtsumme des Auszugs

Weicht etwas ab, arbeite zur Fehlersuche wieder schreibgeschützt. Prüfe eine konkrete Korrektur, bevor du erneut schreibst. Die [Anleitung zum Import von Kontoauszügen](/blog/how-to-import-bank-statements-into-an-expense-tracker/) (auf Englisch) geht näher auf überlappende Zeiträume, Rückerstattungen und Umbuchungen ein.

## Kontostand und Kategorien getrennt abgleichen

Beim Kontenabgleich prüfst du, ob die gespeicherten Kontobewegungen für denselben Buchungszeitraum zum Schlusssaldo der Bank führen.

Für ein gewöhnliches Einlagenkonto gilt:

**Erwarteter Schlusssaldo = Anfangssaldo + gebuchte Zuflüsse − gebuchte Abflüsse**

Wenn die Beträge bereits ein Vorzeichen haben:

**Erwarteter Schlusssaldo = Anfangssaldo + Summe der gebuchten Beträge mit Vorzeichen**

Bei Verbindlichkeitskonten wie Kreditkartenkonten kann eine andere Vorzeichenregel gelten. Claude Code soll die ermittelte Regel vor der Berechnung nennen.

Fahre mit diesem Prompt fort.

```text
Use the read action only. Reconcile [account] for [posted start date] through [posted
end date] against the bank closing balance of [amount and currency]. State the opening
boundary, the sign convention, the stored row count, and the signed movement total.

Show expected closing balance, bank closing balance, and the exact difference. If the
difference is not zero, list candidate missing, duplicated, excluded, wrong-date, or
mis-signed rows. Do not insert a balancing entry and do not change any data.

After the balance check, review category totals separately. List uncategorized rows,
transfer rows counted as spending, and categories that differ from the approved preview.
```

Im Beispiel mit vier Buchungen ergibt sich `1.250,00 € + 1.637,40 € = 2.887,40 €`. Weist die Bank ebenfalls einen Schlusssaldo von 2.887,40 € aus, beträgt die Differenz `0,00 €`.

Damit stimmt die Rechnung für das Konto im gewählten Zeitraum. Die Kategorien prüfst du separat. Wenn du den Supermarkteinkauf für 54,20 € von „Lebensmittel“ nach „Reisen“ umkategorisierst, bleibt die Differenz beim Kontostand null. Die Kategoriesummen verschieben sich trotzdem um 54,20 €. Zur Abnahme gehört daher auch die Prüfung der Kategorien.

Wenn eine Differenz bleibt, prüfe Anfangssaldo, fehlende oder doppelte Zeilen, Umbuchungen, vorgemerkte Posten, Vorzeichen, Buchungsdaten und Währungen. Füge nie eine erfundene Ausgleichsbuchung ein, um die Differenz verschwinden zu lassen. Die [Anleitung zum Abgleich mit dem Bankkonto](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) (auf Englisch) beschreibt die Fehlersuche genauer.

## Das Budget erst nach dem Abgleich aktualisieren

Kümmere dich erst um das Budget, wenn die gespeicherten Buchungen der Vorschau entsprechen, der Kontostand abgeglichen ist und die Kategoriesummen plausibel sind. Claude Code kann die tatsächlichen Einnahmen und Ausgaben mit `budget_lines` vergleichen und Änderungen vorschlagen. Aus einem ungewöhnlichen Monat ergibt sich noch kein neuer Plan für den nächsten.

```text
Confirm the workspace and inspect the current schema. Use the read action to compare
actual income and spending for [complete period] with the matching budget lines. Exclude
transfers using the stored transaction type and show uncategorized activity separately.

For each proposed budget change, show the category, current amount, actual amount,
proposed amount, difference, and reason. Then show the exact SQL and expected affected
rows. Do not write until I approve specific lines.

After approval, use the write action only for those lines and verify them with a fresh
read. Report any stored value that differs from the approved proposal.
```

Eine hohe Ausgabe kann eine Ausnahme sein. Wenn das Budget überschritten scheint, kann sich dahinter eine falsch kategorisierte Umbuchung oder Rückerstattung verbergen. Claude Code kann die Abweichungen berechnen und die SQL-Anweisungen vorbereiten. Über die Beträge für den nächsten Monat entscheidest du.

## Bei jedem Auszug dieselbe Reihenfolge einhalten

Gehe bei jedem Kontoauszug in dieser Reihenfolge vor.

1. Starte bei `https://app.expense-budget-tracker.com/api/agent` und folge der Discovery-Antwort.
2. Lade die Angaben zum Benutzerkonto, bestätige den Arbeitsbereich und prüfe das aktuelle Schema.
3. Gib Claude Code eine zugängliche Auszugsdatei und den eindeutigen Zeitraum mit Anfangs- und Schlusssaldo.
4. Lies die vorhandenen Buchungen für den überlappenden Zeitraum und erstelle die vollständige Importvorschau.
5. Gib einen konkreten Satz von Änderungen frei.
6. Teste ein langes `INSERT` mit 1–3 Zeilen und fahre dann in aufeinanderfolgenden Blöcken von höchstens 100 Zeilen fort.
7. Lies jeden gespeicherten Block erneut und vergleiche ihn mit der Vorschau.
8. Gleiche das Konto ohne Ausgleichsbuchung mit dem Schlusssaldo der Bank ab.
9. Prüfe die Kategoriesummen auch dann, wenn beim Kontostand keine Differenz bleibt.
10. Bereite Änderungen an Budgetzeilen separat vor, gib sie frei und prüfe sie.

Beginne mit einem Konto und einem abgeschlossenen Zeitraum. Wenn die Buchungen für diesen Auszug abgeglichen sind und das Budget geprüft ist, wiederhole den Ablauf für das nächste Konto. Claude Code übernimmt die wiederkehrende Arbeit mit Dateien und API-Aufrufen. Jede finanzielle Entscheidung bleibt für dich sichtbar, bevor sie deine Daten verändert.

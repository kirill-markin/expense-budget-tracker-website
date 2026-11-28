---
title: Configurazione degli agenti di IA
description: Condividi l’URL di discovery con Claude Code, Codex o OpenClaw. L’agente segue le istruzioni del servizio, usa il codice di verifica a 8 cifre, salva la sua ApiKey di lunga durata e accede al tuo spazio di lavoro.
---

## Il link da passare all’agente

Condividi questo URL esatto:

`https://api.expense-budget-tracker.com/v1/`

Questo endpoint restituisce il documento di discovery pubblico di riferimento per gli agenti di IA. Indica all’agente come avviare l’autenticazione, quali endpoint chiamare e come autenticare le richieste successive. Indica anche dove consultare lo schema esposto dall’API e il codice sorgente dell’implementazione.

Questa guida spiega come configurare l’API per gli agenti da terminale e per i client HTTP che la chiamano direttamente. Se il tuo client supporta MCP, usa il [connettore MCP ospitato](/it/docs/mcp-connector/). Il client si collega a `https://mcp.expense-budget-tracker.com/mcp` e ti chiede di autorizzare l’accesso nel browser tramite OAuth, senza seguire la procedura di creazione dell’ApiKey.

## Come collegare il tuo account

1. Apri Claude Code, Codex, OpenClaw o un altro agente in grado di effettuare richieste HTTP.
2. Chiedi all’agente di collegarsi a Expense Budget Tracker usando `https://api.expense-budget-tracker.com/v1/`.
3. Quando l’agente lo chiede, fornisci l’indirizzo email che usi per Expense Budget Tracker.
4. Cerca nella posta in arrivo il codice di verifica a 8 cifre.
5. Invia il codice all’agente.
6. Lascia che l’agente salvi l’ApiKey ricevuta fuori dalla memoria della chat. Poi puoi importare i dati, consultarli o pianificare il budget.

Durante l’accesso non devi copiare né incollare chiavi. L’agente configura la propria connessione dopo la verifica del codice ricevuto via email.

## Cosa fa l’agente

La sequenza completa è:

1. Esegue `GET https://api.expense-budget-tracker.com/v1/`
2. Legge la risposta di discovery e segue le azioni indicate dal servizio invece di fissare i passaggi nel codice
3. Invia l’indirizzo email dell’utente con `POST` al `bootstrapUrl` restituito
4. Riceve `otpSessionToken` e l’azione `verify_code`
5. Chiede all’utente il codice di verifica a 8 cifre ricevuto via email
6. Invia con `POST` il `code`, l’`otpSessionToken` e un `label` per la connessione a `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Riceve una nuova `ApiKey`
8. Salva la chiave al di fuori della memoria della chat, preferibilmente come `EXPENSE_BUDGET_TRACKER_API_KEY`
9. Esegue `GET https://api.expense-budget-tracker.com/v1/me` con `Authorization: ApiKey <key>`
10. Esegue `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Se serve, crea uno spazio di lavoro con `POST /v1/workspaces`
12. Imposta lo spazio di lavoro predefinito con `POST /v1/workspaces/{workspaceId}/select`
13. Verifica le relazioni consentite con `GET https://api.expense-budget-tracker.com/v1/schema`
14. Legge tramite `POST https://api.expense-budget-tracker.com/v1/sql/query` e invia le scritture approvate tramite `POST https://api.expense-budget-tracker.com/v1/sql/execute`

La selezione dello spazio di lavoro è esplicita e persistente. Dopo `POST /v1/workspaces/{workspaceId}/select`, lo spazio selezionato viene salvato per quella chiave API. Le successive chiamate a `/v1/sql/query` e `/v1/sql/execute` possono quindi omettere `X-Workspace-Id`. Puoi ancora inviare `X-Workspace-Id` per usare un altro spazio di lavoro in una singola richiesta. L’endpoint di compatibilità `POST /v1/sql` è riservato agli script atomici con più istruzioni. Per le normali letture e scritture usa gli endpoint dedicati.

Se l’utente ha un solo spazio di lavoro e la chiave non ne ha ancora uno salvato, il backend lo salva e lo usa automaticamente.

## Cosa deve conservare l’agente

La chiave restituita da `verify-code` ha una lunga durata. Evita di affidarti solo alla memoria della chat.

- Se l’utente autorizza la scrittura su file, salva la chiave in un file `.env` locale come `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`
- Altrimenti esportala nella shell corrente come `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` e chiedi all’utente di conservarla in un posizione in cui rimanga disponibile

Le richieste autenticate usano:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` solo per usare uno spazio diverso da quello salvato o quando non ne è ancora stato salvato uno

## Se sei un agente di IA

Esegui:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Segui poi le azioni restituite dal server. Usa i passaggi indicati nel documento di discovery quando sono disponibili, così il flusso segue le indicazioni del server.

Dopo `verify-code`, conserva in modo sicuro l’`ApiKey` restituita. Poi consulta:

- `/v1/me` per i dati dell’account autenticato
- `/v1/workspaces` per gli spazi di lavoro disponibili
- `/v1/schema` per le relazioni e le colonne SQL consentite
- `/v1/openapi.json` o `/v1/swagger.json` solo se un client prova gli URL convenzionali delle specifiche. Questi endpoint rimandano al documento di discovery e al codice sorgente. Le specifiche dell’API non sono disponibili a questi indirizzi

## Esempi di prompt per iniziare

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

## Cosa puoi fare dopo la configurazione

- Importare estratti conto bancari o file con i movimenti della carta
- Classificare le transazioni usando le categorie esistenti
- Riconciliare i saldi dei conti con quelli della banca
- Consultare le spese per categoria, periodo, esercente o conto
- Aggiornare le voci di budget del mese successivo

Per gli endpoint e i dettagli dell’autenticazione, consulta il [riferimento dell’API](/it/docs/api/).

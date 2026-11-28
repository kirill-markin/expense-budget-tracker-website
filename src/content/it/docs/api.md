---
title: Riferimento dell’API
description: Configurazione degli agenti e riferimento dell’API SQL per l’accesso programmatico ai tuoi dati finanziari.
---

## Panoramica

Expense Budget Tracker mette a disposizione di script e altri client un’unica API pubblica.

`https://api.expense-budget-tracker.com/v1/`

Puoi accedervi in due modi:

1. **Configurazione eseguita dall’agente** a partire da `GET /v1/`
2. **Accesso HTTP diretto** con un’ApiKey di lunga durata già disponibile

A tutte le richieste si applicano le stesse regole di sicurezza a livello di riga di Postgres dell’app web.

Se il tuo client supporta MCP, usa il [connettore MCP ospitato](/it/docs/mcp-connector/) su `https://mcp.expense-budget-tracker.com/mcp` e autorizzalo tramite OAuth nel browser. Questa pagina descrive la configurazione separata dell’API per agenti e le modalità di accesso diretto via HTTP, entrambe con un’`ApiKey` di lunga durata.

## Discovery, codice sorgente e schema esposto dall’API

Parti da questo indirizzo.

`https://api.expense-budget-tracker.com/v1/`

La risposta di discovery spiega agli agenti come avviare l’autenticazione e quali endpoint chiamare in seguito. Include i link al README e al codice sorgente. L’API espone:

- `GET /v1/schema`
- `GET /v1/openapi.json` e `GET /v1/swagger.json`, endpoint di compatibilità che segnalano l’assenza di OpenAPI e rimandano i client al documento di discovery e al codice sorgente

Usa `schema` per l’elenco esatto delle relazioni e colonne consentite da `/v1/sql/query`, `/v1/sql/execute` e dall’endpoint di compatibilità `/v1/sql`.

## Configurazione eseguita dall’agente

Per far sì che Claude Code, Codex, OpenClaw o un altro agente si colleghi in autonomia, fagli usare l’endpoint di discovery e seguire le azioni indicate dal server.

### Flusso di autenticazione

1. Esegui `GET https://api.expense-budget-tracker.com/v1/`
2. Leggi l’azione `send_code` e il `bootstrapUrl` restituiti
3. Invia l’indirizzo email dell’utente con `POST` a `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Ricevi `otpSessionToken`
5. Chiedi all’utente il codice di verifica a 8 cifre ricevuto via email
6. Invia `code`, `otpSessionToken` e `label` con `POST` a `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Ricevi un’`ApiKey` di lunga durata
8. Salva la chiave al di fuori della memoria della chat
9. Esegui `GET https://api.expense-budget-tracker.com/v1/me`
10. Esegui `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Se serve, crea uno spazio di lavoro con `POST https://api.expense-budget-tracker.com/v1/workspaces`
12. Esegui `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. Esegui `GET https://api.expense-budget-tracker.com/v1/schema`
14. Leggi con `POST https://api.expense-budget-tracker.com/v1/sql/query` e invia le scritture approvate con `POST https://api.expense-budget-tracker.com/v1/sql/execute`

### Header di autenticazione

- `Authorization: ApiKey <key>`

### Gestione dello spazio di lavoro

- `POST /v1/workspaces/{workspaceId}/select` salva lo spazio di lavoro predefinito per la chiave API
- Una volta salvato lo spazio, `/v1/sql/query`, `/v1/sql/execute` e l’endpoint di compatibilità `/v1/sql` possono omettere `X-Workspace-Id`
- Usa `X-Workspace-Id: <workspaceId>` per scegliere un altro spazio di lavoro per una singola richiesta
- Se l’utente ha un solo spazio di lavoro e la chiave non ne ha ancora uno salvato, l’API lo salva e lo usa automaticamente

Per una guida passo passo, consulta [Configurazione degli agenti di IA](/it/docs/agent-setup/).

## Accesso HTTP diretto con una chiave esistente

Script, processi cron, dashboard e app personalizzate possono chiamare direttamente la stessa API se dispongono già di un’ApiKey di lunga durata.

### Autenticazione

Invia la chiave nell’header di autenticazione usando lo schema ApiKey.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` è richiesto solo se la chiave non ha ancora uno spazio di lavoro predefinito salvato o se vuoi usarne uno diverso per quella richiesta.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` quando serve

## Riepilogo degli endpoint

- `GET /v1/` — documento di discovery pubblico
- `GET /v1/openapi.json` e `GET /v1/swagger.json` — endpoint di compatibilità che rimandano al codice sorgente, senza fornire specifiche API
- `GET /v1/me` — dati dell’account autenticato
- `GET /v1/workspaces` — elenca gli spazi di lavoro disponibili al titolare della chiave
- `POST /v1/workspaces` — crea uno spazio di lavoro
- `POST /v1/workspaces/{workspaceId}/select` — salva lo spazio di lavoro predefinito per questa chiave
- `GET /v1/schema` — mostra le relazioni e le colonne SQL consentite
- `POST /v1/sql/query` — esegue una sola istruzione in sola lettura `SELECT` o `WITH ... SELECT`
- `POST /v1/sql/execute` — esegue una sola istruzione approvata `INSERT`, `UPDATE` o `DELETE`
- `POST /v1/sql` — endpoint di compatibilità per script atomici con più istruzioni

## Regole SQL

Gli endpoint principali separano lettura e scrittura:

- `POST /v1/sql/query` accetta una sola istruzione di sola lettura, `SELECT` o `WITH ... SELECT`
- `POST /v1/sql/execute` accetta una sola istruzione di modifica, `INSERT`, `UPDATE` o `DELETE`, comprese le forme supportate con `WITH`
- L’endpoint di compatibilità `POST /v1/sql` esegue in modo atomico script con più istruzioni soggette a restrizioni. Usalo solo quando serve che tutte le istruzioni riescano o falliscano insieme

I seguenti costrutti vengono bloccati o rifiutati:

- Più istruzioni negli endpoint principali `/v1/sql/query` e `/v1/sql/execute`
- Istruzioni DDL come `CREATE`, `DROP` e `ALTER`
- Delimitatori di transazione come `BEGIN`, `COMMIT` e `ROLLBACK`
- `set_config()`
- Commenti SQL
- Identificatori tra virgolette
- Stringhe con delimitatori basati sul simbolo del dollaro

Il server limita anche le relazioni interrogabili. Prima di generare SQL, consulta `/v1/schema` per verificare le relazioni e le colonne esposte.

Relazioni attualmente esposte:

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (sola lettura)
- `fx_rates_raw` (sola lettura)
- `fx_rates_daily` (sola lettura)

## Limiti

- 100 righe restituite per richiesta
- 100 righe interessate per istruzione di modifica e richiesta
- 25 secondi al massimo per l’intera richiesta SQL
- 10 richieste al secondo e 10.000 richieste al giorno per chiave

## Sicurezza

- Le chiavi API vengono conservate come hash SHA-256. Le chiavi in chiaro non vengono mai salvate
- RLS isola gli spazi di lavoro a livello di database
- Puoi revocare le chiavi dall’app in qualsiasi momento
- Se rimuovi un membro da uno spazio di lavoro, tutte le sue chiavi vengono revocate automaticamente

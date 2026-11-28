---
title: Connettore MCP
description: Collega un client MCP a Expense Budget Tracker con OAuth per consultare o aggiornare i dati finanziari in sicurezza.
---

## Panoramica

Expense Budget Tracker offre un connettore Model Context Protocol (MCP) ospitato.

`https://mcp.expense-budget-tracker.com/mcp`

L’endpoint usa Streamable HTTP e OAuth. Passa questo URL a un client MCP che supporta i server remoti su Streamable HTTP e la discovery OAuth. Il flusso di autorizzazione apre il browser per consentirti di accedere e concedere i permessi richiesti.

Il connettore usa come credenziali MCP i token di accesso e di aggiornamento OAuth. L’`ApiKey` di lunga durata descritta nel [riferimento dell’API per agenti](/it/docs/api/) appartiene a un’integrazione HTTP diretta separata. L’endpoint MCP non la accetta.

## Discovery OAuth e connessione

Il connettore ospitato pubblica i metadati della risorsa protetta a questo indirizzo.

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Questi metadati indicano ai client il server di autorizzazione. I metadati del server sono disponibili a questo indirizzo.

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Un client compatibile segue questo flusso:

1. Si collega a `https://mcp.expense-budget-tracker.com/mcp` e individua i metadati della risorsa protetta.
2. Si registra dinamicamente come client OAuth pubblico, senza usare una chiave segreta del client.
3. Avvia il flusso con codice di autorizzazione e apre l’URL per autorizzare l’accesso nel browser dell’utente.
4. Usa PKCE per ogni richiesta di autorizzazione. L’unico metodo supportato per la code challenge è `S256`.
5. Richiede `expenses:read`. Aggiunge `expenses:write` solo se deve chiamare `sql_execute`.
6. Scambia il codice di autorizzazione con i token di accesso e di aggiornamento. Il client può quindi rinnovare l’accesso quando serve.

Non copiare i token nei prompt, nella cronologia della chat, nei file sorgente o nei log. Conservali solo nell’archivio delle credenziali del client MCP.

## Autorizzazioni

- `expenses:read` è obbligatoria. Consente di elencare gli spazi di lavoro, consultare lo schema ed eseguire query in sola lettura.
- `expenses:write` è facoltativa. Abilita lo strumento `sql_execute`, che può creare, modificare o eliminare dati.

Richiedi solo le autorizzazioni necessarie al compito. Per analizzare i dati o generare report basta `expenses:read`.

## Strumenti

### `list_workspaces`

Elenca gli spazi di lavoro a cui può accedere l’utente autenticato. Usa l’identificatore restituito per indicare in modo esplicito lo spazio di lavoro prima di leggere o modificare i dati.

### `get_schema`

Restituisce le relazioni e le colonne esposte a MCP per lo spazio di lavoro selezionato. Chiamalo prima di scrivere SQL per conoscere i nomi esatti delle tabelle e delle colonne.

### `sql_query`

Esegue una sola query SQL soggetta a restrizioni, in sola lettura, nello spazio selezionato. Il database impone la sola lettura anche a livello di esecuzione. Il risultato è limitato a 100 righe e il tempo massimo di esecuzione è di 20 secondi.

### `sql_execute`

Esegue SQL soggetto a restrizioni per modificare i dati nello spazio di lavoro selezionato. Può anche eliminare dati e richiede l’autorizzazione separata `expenses:write`. Verifica lo spazio di lavoro ed esamina l’istruzione esatta prima di approvare la chiamata.

Il server MCP espone anche `sql_execute`, che può modificare i dati. Per `sql_query`, il database impone la sola lettura.

## Uso sicuro

1. Chiama `list_workspaces` e chiedi all’utente di confermare lo spazio di lavoro da usare.
2. Chiama `get_schema` prima di generare SQL.
3. Usa `sql_query` per consultare i dati, calcolare totali, eseguire riconciliazioni e preparare report.
4. Richiedi `expenses:write` solo quando il compito richiede modifiche ai dati.
5. Prima di chiamare `sql_execute`, mostra l’istruzione esatta e il suo effetto previsto, quindi conferma di nuovo lo spazio di lavoro.
6. Dopo una scrittura, verifica il risultato con `sql_query`.

Il server limita le istruzioni SQL e le relazioni esposte. Anche con questi controlli, esamina sempre con attenzione l’SQL generato.

## Limiti

- Massimo 100 righe nei risultati SQL
- Tempo massimo di esecuzione di 20 secondi
- Accesso limitato agli spazi di lavoro disponibili all’utente autenticato
- `sql_query` usa un insieme ristretto di istruzioni SQL e il database impone la sola lettura
- `sql_execute` richiede `expenses:write` oltre all’autorizzazione di lettura obbligatoria

## Privacy e self-hosting

Un client MCP autorizzato può leggere i dati finanziari e, con `expenses:write`, modificarli. Prima di collegarlo, consulta l’[informativa sulla privacy](/it/privacy/) e le regole del client sulla gestione dei dati.

Gli URL indicati sopra valgono solo per il servizio gestito di Expense Budget Tracker. Per una tua installazione, parti dalla [guida al self-hosting](/it/docs/self-hosting/) e configura l’endpoint MCP e i metadati OAuth per i tuoi domini. L’implementazione è disponibile nel [repository del codice sorgente](https://github.com/kirill-markin/expense-budget-tracker).

---
title: Assistenza
description: Come ricevere assistenza e inviare segnalazioni di sicurezza per Expense Budget Tracker, compreso il servizio MCP ospitato.
slug: support
sections:
  - type: simple_markdown_page
---

## Assistenza per il servizio ospitato e MCP

Per ricevere assistenza con l’app ospitata, il tuo account, l’autorizzazione OAuth o il server MCP pubblico, scrivi a [markinkirill@gmail.com](mailto:markinkirill@gmail.com). Forniamo assistenza nei limiti delle nostre possibilità. I tempi di risposta possono variare e non sono garantiti.

Includi solo i dettagli diagnostici necessari per esaminare il problema.

- Nome e versione del client.
- Data, ora e fuso orario in cui si è verificato il problema.
- Endpoint o pagina interessati.
- Fase del flusso OAuth o nome dello strumento MCP.
- Messaggio di errore esatto, ripulito dai dati sensibili, ed eventuale ID della richiesta.
- Risultato atteso e risultato effettivo.

Non inviare mai password, cookie di sessione, codici OAuth, token di accesso o di aggiornamento, chiavi API, registrazioni finanziarie originali o il corpo di una richiesta senza aver oscurato i dati sensibili.

## Segnalazioni di sicurezza

Segnala in privato le potenziali vulnerabilità, senza aprire una segnalazione pubblica su GitHub. Scrivi a [markinkirill@gmail.com](mailto:markinkirill@gmail.com) con oggetto **Expense Budget Tracker security report** e includi una descrizione minima di come riprodurre il problema, priva di dati sensibili. Escludi credenziali attive e dati finanziari. Se l’accesso potrebbe essere compromesso, revoca prima la connessione da **Impostazioni > Accesso per agenti e programmi** e sostituisci tutte le altre credenziali coinvolte.

## Bug, self-hosting e domande per la community

Usa le [segnalazioni su GitHub](https://github.com/kirill-markin/expense-budget-tracker/issues) per i bug riproducibili, le domande sul self-hosting e le discussioni che possono essere pubbliche. Cerca prima tra le segnalazioni esistenti e rimuovi i dati privati da log e screenshot. La [guida al self-hosting](/it/docs/self-hosting/) e il [repository del codice sorgente](https://github.com/kirill-markin/expense-budget-tracker) spiegano come distribuire e sviluppare l’app.

## Prima di segnalare un problema con MCP

Verifica che il tuo client supporti MCP remoto su Streamable HTTP, il flusso OAuth 2.1 con codice di autorizzazione e PKCE, e la registrazione dinamica dei client. Usa l’endpoint universale esattamente come indicato nella [guida a MCP](/it/docs/mcp-connector/), poi riconnetti il client e riprova una volta. Se il problema persiste, invia i dettagli indicati sopra, dopo aver rimosso i dati sensibili.

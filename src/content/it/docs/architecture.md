---
title: Architettura
description: Panoramica del sistema, modello dei dati, supporto multivaluta e autenticazione.
---

## Panoramica del sistema

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

Il sistema comprende sei componenti, tra cui un unico database.

1. **web** — App Next.js con dashboard e route API
2. **auth** — Accesso con codice monouso via email e configurazione iniziale degli agenti sul dominio di autenticazione
3. **sql-api** — Funzione AWS Lambda dietro API Gateway per l’accesso programmatico
4. **mcp** — Funzione AWS Lambda e API HTTP di API Gateway dedicate all’endpoint MCP ospitato
5. **worker** — Recupera ogni giorno i tassi di cambio da BCE, CBR e NBS
6. **Postgres** — Unica fonte di riferimento per i dati, con sicurezza a livello di riga

## Modello dei dati

- **ledger_entries** — Una riga per ogni movimento del conto (entrata, spesa o trasferimento)
- **budget_lines** — Celle del budget con uno storico che conserva ogni modifica. Vale il valore scritto per ultimo
- **budget_comments** — Note associate alle celle del budget. Ogni scrittura aggiunge una nota allo storico
- **workspace_settings** — Valuta di rendicontazione e impostazioni dello spazio di lavoro
- **account_metadata** — Metadati per conto, come la classificazione per liquidità
- **exchange_rates** — Tassi di cambio giornalieri usati per la conversione al momento della query
- **workspaces** / **workspace_members** — Isolamento dei dati tra spazi di lavoro
- **accounts** — Vista ricavata dalle registrazioni

## Supporto multivaluta

Ogni importo è memorizzato nella valuta originale. La conversione nella valuta di rendicontazione avviene al momento della lettura tramite join SQL con `exchange_rates`. Gli importi originali mantengono così la loro precisione.

## Autenticazione

La variabile d’ambiente `AUTH_MODE` prevede due modalità:

- `none` — Nessuna autenticazione e un solo spazio di lavoro locale
- `cognito` — Accesso senza password tramite codice monouso via email con AWS Cognito e registrazione aperta

Per i client programmatici, l’endpoint pubblico di discovery è `GET /v1/`. Durante la configurazione, l’agente usa il codice di verifica monouso ricevuto via email sul dominio di autenticazione e riceve un’ApiKey di lunga durata. Può quindi eseguire istruzioni SQL tramite l’API per client programmatici esposta da API Gateway.

I client compatibili con MCP si collegano separatamente a `https://mcp.expense-budget-tracker.com/mcp`. La connessione passa per un’API HTTP di API Gateway e una funzione Lambda dedicate a MCP. L’autorizzazione interattiva avviene nel browser tramite OAuth sul dominio di autenticazione.

Ogni utente ha uno spazio di lavoro isolato. Le policy RLS verificano l’appartenenza allo spazio a ogni query, anche per le richieste SQL dei client programmatici.

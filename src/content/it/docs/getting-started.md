---
title: Primi passi
description: Inizia in pochi minuti. Registrati alla versione cloud o configura una tua istanza.
---

## Versione cloud

Per iniziare subito, usa la versione cloud gestita.

1. Vai su [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Registrati con il tuo indirizzo email. Accedi senza password con il codice di verifica monouso.
3. Inizia a registrare le spese nell’app web
4. Se usi un client compatibile con MCP, aggiungi `https://mcp.expense-budget-tracker.com/mcp` e autorizza l’accesso nel browser
5. Per un agente da terminale o un client HTTP diretto, parti da `GET https://api.expense-budget-tracker.com/v1/`

Non devi installare nulla né configurare un server. La sicurezza a livello di riga di Postgres isola i dati di ogni spazio di lavoro.

## Accesso per agenti e programmi

Con lo stesso account della versione cloud puoi usare:

- l’interfaccia web su `https://app.expense-budget-tracker.com`
- il [connettore MCP ospitato](/it/docs/mcp-connector/) su `https://mcp.expense-budget-tracker.com/mcp`, con autorizzazione OAuth nel browser
- l’[API per agenti](/it/docs/agent-setup/), a partire da `GET https://api.expense-budget-tracker.com/v1/`, per inviare richieste HTTP dirette con `Authorization: ApiKey <key>`

## Self-hosting

Se preferisci gestire la tua istanza, consulta la [guida al self-hosting](/it/docs/self-hosting/).

## Modalità demo

L’app include una modalità demo. Passa da **Tutto** a **Demo** nell’intestazione per esplorare l’interfaccia con dati di esempio, senza bisogno di un database.

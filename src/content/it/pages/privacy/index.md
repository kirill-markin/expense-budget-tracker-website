---
title: Informativa sulla privacy
description: Informativa sulla privacy di Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: agosto 2026
---
## Dati che raccogliamo

Quando usi la versione cloud, conserviamo i dati finanziari che inserisci, come transazioni, budget e nomi dei conti. Conserviamo il tuo indirizzo email per consentirti di accedere. Le istanze in self-hosting non ci inviano dati.

## Gestore

Il servizio ospitato di Expense Budget Tracker è gestito da SAMO DANNI EOOD (partita IVA BG207395566). Expense Budget Tracker è stato creato da Kirill Markin. [kirill-markin.com](https://kirill-markin.com/) è il suo sito personale, collegato al prodotto.

Questa informativa si applica al sito, all’app, all’API e al servizio MCP remoto che ospitiamo e gestiamo. Le istanze in self-hosting restano sotto il controllo di chi le gestisce.

## Come usiamo i tuoi dati

Usiamo i tuoi dati finanziari esclusivamente per fornire il servizio. Non li vendiamo né li usiamo per la pubblicità. Li comunichiamo a un client di terze parti solo su tua indicazione, per esempio quando autorizzi una connessione MCP. Ogni spazio di lavoro è isolato tramite la sicurezza a livello di riga di Postgres.

## MCP e client di IA di terze parti

Quando colleghi un client di IA al servizio MCP ospitato, Expense Budget Tracker elabora la richiesta di autorizzazione OAuth, lo strumento richiesto e i suoi argomenti, lo spazio di lavoro selezionato e le registrazioni finanziarie necessarie per rispondere a una richiesta di lettura o applicare una modifica approvata. Le modifiche apportate tramite MCP vengono salvate negli stessi dati finanziari della versione cloud che modifichi dall’app web.

Il servizio conserva il nome del client registrato e i suoi URL di reindirizzamento, i metadati della connessione e delle autorizzazioni e le date e gli orari di creazione, attività e revoca. Conserva gli hash unidirezionali dei codici di autorizzazione OAuth e dei token di accesso e di aggiornamento. I token OAuth in chiaro non vengono conservati. Il servizio MCP riceve ogni richiesta di esecuzione di uno strumento e restituisce il risultato richiesto. La conversazione del client di IA non viene salvata tra quelle dell’app.

Il client di IA è un servizio di terze parti e può elaborare o conservare i prompt, gli argomenti degli strumenti e i dati finanziari restituiti secondo le proprie condizioni e la propria informativa sulla privacy. Consulta l’informativa del client prima di collegarlo. Puoi revocare una connessione MCP in qualsiasi momento da **Impostazioni > Accesso per agenti e programmi**. Puoi eliminare il tuo account e i relativi dati ospitati dalle impostazioni, come descritto più avanti.

## Conservazione dei dati

I dati cloud sono conservati in AWS RDS (Postgres) nella regione eu-central-1, con backup automatici giornalieri. I dati sono cifrati sia in transito sia a riposo.

## Cookie

Usiamo un cookie `session` per l’autenticazione (HttpOnly, Secure, SameSite=Lax). Non usiamo cookie di tracciamento né strumenti di analisi di terze parti.

## Eliminazione dei dati

Puoi eliminare il tuo account e tutti i dati associati in qualsiasi momento dalle impostazioni dell’app. Per le istanze in self-hosting, controlli direttamente il database.

## Open source

L’intero codice sorgente è aperto. Puoi verificare esattamente cosa fa l’app con i tuoi dati.

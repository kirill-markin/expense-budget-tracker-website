---
title: "Come tenere traccia delle spese con Claude Code: collegamento, importazione e riconciliazione"
description: "Collega Claude Code a Expense Budget Tracker con un link, controlla e approva l’importazione degli estratti conto, riconcilia i saldi e aggiorna il budget senza collegare il conto bancario."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "monitorare le spese con Claude Code"
  - "registro delle spese con Claude"
  - "strumento per le spese con Claude"
  - "gestire il budget con Claude Code"
  - "collegare Claude a un registro delle spese"
  - "importare un estratto conto con Claude Code"
---

Un estratto conto di quattro righe può quadrare al centesimo, con una differenza di `€0.00`, anche se il budget contiene errori. Se registri una spesa di €54.20 al supermercato sotto Viaggi anziché sotto Spesa alimentare, il saldo del conto rimane corretto, ma i totali per categoria sono errati di €54.20.

Per tenere traccia delle spese con Claude Code servono due controlli. I movimenti registrati devono giustificare il saldo bancario e le categorie devono corrispondere a quelle che hai verificato esaminando l’estratto conto. Claude Code può leggere il file, fare i calcoli e chiamare l’API. Tu scegli il conto e le categorie, controlli le registrazioni proposte e approvi esattamente cosa verrà scritto.

Per questa procedura Expense Budget Tracker non si collega direttamente al conto bancario e non ha una funzione per caricare l’estratto conto. Esporta l’estratto, mettilo in una cartella a cui Claude Code può accedere e invia soltanto le registrazioni approvate tramite l’API per agenti gestita. Se la tua priorità è evitare un accesso permanente alla banca, la guida alle [app per il budget senza collegamento bancario (in inglese)](/blog/budget-app-without-bank-linking/) approfondisce vantaggi e limiti.

![Un restauratore di mosaici solleva una tessera blu fuori posto da una fascia di terracotta. Accanto, una bilancia in ottone è in equilibrio.](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Collega Claude Code con un solo link di discovery

Installa Claude Code e accedi seguendo la [guida rapida ufficiale di Anthropic](https://code.claude.com/docs/it/quickstart). Il [riferimento della CLI](https://code.claude.com/docs/it/cli-reference) spiega come funzionano le directory di lavoro e come autorizzare l’accesso ad altri file.

Avvia `claude` nella directory che contiene l’estratto conto oppure autorizza l’accesso a quella directory con un metodo supportato dalla tua configurazione. Poi incolla questo prompt:

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

Il [link per agenti sul dominio dell’app](https://app.expense-budget-tracker.com/api/agent) restituisce il documento di discovery fornito dal servizio. Al momento indica `https://api.expense-budget-tracker.com/v1/` come base dell’API e fornisce gli URL per l’autenticazione e le operazioni SQL. Incolla il link che punta al dominio dell’app. Claude Code deve seguire gli URL restituiti dal servizio, senza dare per scontato l’ordine delle chiamate.

Lo stesso flusso via email vale per la registrazione e l’accesso. Quando comunichi il codice di verifica a 8 cifre, Claude Code riceve un’`ApiKey` di lunga durata. Approva un percorso preciso dove conservarla, per esempio un file di credenziali escluso dal controllo di versione. Non inserire mai la chiave in `CLAUDE.md` e non includerla in un commit. La [guida alla configurazione degli agenti di IA](/it/docs/agent-setup/) descrive i passaggi di autenticazione e selezione dello spazio di lavoro.

## Quando usare l’API per agenti e quando usare MCP

L’espressione «registro delle spese con Claude» può indicare due integrazioni diverse. In questa guida si usa Claude Code da terminale con l’API per agenti. Claude e Claude Desktop possono usare il connettore MCP remoto ospitato.

| | Claude Code con API per agenti | Claude o Claude Desktop con MCP |
|---|---|---|
| Quando usarlo | Lavoro da terminale con file locali accessibili e chiamate HTTP dirette | Conversazioni in un client Claude compatibile con MCP |
| Punto di partenza | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Autenticazione | Codice monouso via email, poi un’`ApiKey` di lunga durata | OAuth nel browser |
| Interfaccia per i dati | URL di discovery che rimandano agli endpoint di lettura e scrittura | Strumento `sql_query` e, facoltativamente, `sql_execute` |
| Accesso all’estratto conto | File e directory disponibili nella sessione di Claude Code | Il connettore remoto non accede ai file locali |

Ogni integrazione ha le proprie credenziali. Per l’app web o desktop di Claude, segui la [guida al connettore MCP per Claude (in inglese)](/blog/claude-expense-tracker-mcp-connector/). Usa invece la procedura con l’API per agenti qui sotto se parti da un file a cui Claude Code può accedere.

Tieni presenti altri due aspetti:

- Il fornitore del modello tratta i dati separatamente dall’API e dall’archiviazione di Expense Budget Tracker. Prima di condividere un estratto conto, consulta la [documentazione sull’uso dei dati in Claude Code](https://code.claude.com/docs/it/data-usage) e le condizioni del fornitore configurato nella tua installazione.
- La configurazione Docker Compose locale descritta nella [guida al self-hosting](/it/docs/self-hosting/) avvia l’app web, il servizio di autenticazione, il database e il worker dei tassi di cambio. L’API per agenti gestita, usata qui, non è inclusa. Per l’API pubblica destinata ai client programmatici, il repository documenta una distribuzione separata su AWS.

## Definisci con precisione cosa importare

Alla prima importazione, usa un solo conto, una sola valuta e un periodo già chiuso dell’estratto conto. Un CSV è comodo perché le righe sono facili da controllare. Con altri formati, chiedi prima a Claude Code di confermare che può leggere il file nel tuo ambiente e di mostrarti le righe che ha estratto. Il nome del file da solo non basta a stabilire se il formato è supportato.

Passa a Claude Code queste sei informazioni:

1. Il percorso locale dell’estratto conto.
2. Il conto bancario e il conto corrispondente nell’app.
3. La valuta del conto.
4. La prima e l’ultima data di contabilizzazione.
5. Il saldo iniziale o l’ultimo saldo verificato.
6. Il saldo finale indicato nell’estratto.

Lascia fuori i movimenti in sospeso finché non vengono contabilizzati. Conserva il file originale e chiedi a Claude Code di preparare un’anteprima separata.

Puoi usare queste regole in un file locale `CLAUDE.md` nella directory delle finanze:

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

Aggiungi le informazioni che restano valide nel tempo, come i nomi effettivi dei conti, le regole per le categorie, la convenzione per i trasferimenti e la valuta di rendicontazione. Usa le categorie d’esempio di questo articolo solo se corrispondono a quelle del tuo registro contabile.

## Prepara un’anteprima completa dell’importazione

Quando la connessione funziona, incolla il prompt seguente e sostituisci i valori tra parentesi quadre:

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

Fino alla tua approvazione, l’agente lavora sul database in sola lettura. Claude Code deve verificare lo schema effettivo senza copiare i nomi delle colonne da un articolo, trovare il conto corrispondente e consultare le registrazioni già presenti per lo stesso intervallo di date. Una transazione con la stessa data e lo stesso importo è un possibile duplicato. Anche due acquisti distinti possono avere la stessa data e lo stesso importo.

### Un esempio con quattro movimenti

Supponiamo che un estratto del conto corrente mostri un saldo iniziale di €1,250.00 e quattro movimenti contabilizzati:

| Riga | Data di contabilizzazione | Descrizione | Importo con segno | Tipo proposto | Categoria proposta | Cosa verificare |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Stipendio | +€2,000.00 | Entrata | Stipendio | Nessun dubbio |
| 2 | 2026-09-02 | Supermercato | −€54.20 | Spesa | Spesa alimentare | Verifica l’esercente se non lo riconosci |
| 3 | 2026-09-03 | Trasferimento sul conto di risparmio | −€300.00 | Trasferimento | — | Conferma l’altro conto |
| 4 | 2026-09-04 | Bar | −€8.40 | Spesa | Pasti fuori casa | Nessun dubbio |

La somma dei quattro importi con il loro segno è `+€1,637.40`. Aggiungi il saldo iniziale di `€1,250.00` e ottieni un saldo finale atteso di `€2,887.40`. L’esempio entra in una schermata. Per un’importazione più lunga, l’anteprima deve comunque riportare ogni riga di origine e segnalare ogni dubbio.

Per il trasferimento, conferma su quale altro conto hai spostato il denaro. Uno spostamento tra i tuoi conti va registrato come trasferimento, senza conteggiarlo tra le spese. Mantieni il tipo corretto anche quando un acquisto viene rimborsato o qualcuno ti restituisce una spesa anticipata. Quando una classificazione è incerta, lasciala da confermare invece di assegnare la categoria più probabile.

### Approva le modifiche mostrate nell’anteprima

Controlla lo spazio di lavoro, il conto, l’intervallo di date, il numero di righe, il totale con segno, i possibili duplicati e le classificazioni. Approva l’anteprima specifica e l’SQL corrispondente, evitando un’istruzione generica come «importa tutto».

L’API per agenti separa letture e scritture. Claude Code usa l’azione di lettura indicata dal servizio per una sola istruzione `SELECT` o `WITH ... SELECT`. Usa l’azione di scrittura solo per un’istruzione `INSERT`, `UPDATE` o `DELETE` approvata esplicitamente. Per tabelle e colonne fa fede lo schema effettivo. Il [riferimento dell’API](/it/docs/api/) spiega le regole e i limiti per le istruzioni SQL.

### Fai una prova prima di inserire o aggiornare molte righe

Per un `INSERT` o un `UPDATE` su molte righe, le istruzioni di discovery chiedono all’agente di provare prima un caso rappresentativo con la stessa struttura SQL. Usa 1–3 righe di valori letterali per un `INSERT` o una sola riga specifica per un `UPDATE`. La tua approvazione vale sia per la prova sia per le righe rimanenti tra quelle che hai controllato.

Se la prova riesce, Claude Code deve proseguire subito con gruppi di non più di 100 registrazioni, uno alla volta, verificando ogni gruppo. Per un’importazione approvata di 247 righe, dopo una prova di 3 righe restano gruppi da 100, 100 e 44. Serve una nuova approvazione se cambiano le operazioni previste, emerge un dubbio o l’esecuzione fallisce. I gruppi successivi già coperti dall’approvazione possono proseguire.

L’API SQL non supporta `ON CONFLICT`. Gestisci quindi i duplicati in modo esplicito. Le letture restituiscono al massimo 100 righe. Claude Code deve controllare nei metadati della risposta il conteggio delle righe e l’eventuale troncamento, aggregare i totali in SQL e suddividere la verifica di dettaglio in query mirate con un ordinamento esplicito. Una risposta troncata lascia incompleto il controllo dell’importazione.

### Rileggi le righe salvate

Una risposta positiva dell’API conferma l’esecuzione della richiesta. Per sapere se i valori registrati corrispondono all’anteprima, interroga di nuovo il conto e il periodo interessati e confronta:

- Il numero di righe inserite.
- Le date, gli importi con segno e le valute.
- Il conto assegnato.
- I tipi di transazione e le categorie.
- I possibili duplicati.
- I totali per gruppo e il totale dell’intero estratto.

Se trovi una differenza, torna a esaminare i dati in sola lettura. Verifica una correzione specifica prima di scrivere di nuovo. La [guida all’importazione degli estratti conto (in inglese)](/blog/how-to-import-bank-statements-into-an-expense-tracker/) approfondisce i periodi sovrapposti, i rimborsi e i trasferimenti.

## Riconcilia il saldo e controlla le categorie a parte

Per riconciliare il saldo, verifica che i movimenti registrati portino allo stesso saldo finale dell’estratto conto, usando lo stesso intervallo di date di contabilizzazione.

Per un normale conto di deposito:

**saldo finale atteso = saldo iniziale + movimenti in entrata contabilizzati − movimenti in uscita contabilizzati**

Se i movimenti hanno già un segno:

**saldo finale atteso = saldo iniziale + somma dei movimenti contabilizzati con il loro segno**

I conti che rappresentano un debito, come le carte di credito, possono usare un’altra convenzione per i segni. Claude Code deve dichiarare la convenzione che ha trovato prima di fare il confronto.

Prosegui con questo prompt:

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

Nell’esempio con quattro movimenti, `€1,250.00 + €1,637.40 = €2,887.40`. Se anche l’estratto conto riporta un saldo finale di €2,887.40, la differenza tra i saldi è `€0.00`.

Lo zero conferma che i conti tornano per l’intervallo scelto. Le categorie richiedono una verifica a parte. Spostare la spesa di €54.20 al supermercato da Spesa alimentare a Viaggi lascia a zero la differenza tra i saldi e sposta €54.20 da una categoria all’altra. Controlla anche questi totali prima di considerare conclusa l’importazione.

Se la differenza è diversa da zero, verifica il saldo iniziale, le righe mancanti o duplicate, i trasferimenti, i movimenti in sospeso, i segni, le date e le valute. Non aggiungere mai una transazione fittizia per far quadrare i conti. La [guida alla riconciliazione (in inglese)](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) spiega in dettaglio come trovare l’origine della differenza.

## Aggiorna il budget dopo la riconciliazione

Passa al budget solo dopo aver verificato le righe salvate, riconciliato il conto e controllato i totali per categoria. Claude Code può confrontare i movimenti effettivi con `budget_lines` e preparare proposte di modifica. Se un mese è stato fuori dal comune, evita di prenderlo come riferimento automatico per il mese successivo.

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

Una spesa elevata può essere un’eccezione. Una spesa che sembra fuori budget può rivelarsi un trasferimento o un rimborso classificato male. Claude Code può calcolare gli scostamenti e preparare l’SQL. Gli importi del prossimo mese li decidi tu.

## Segui lo stesso ordine per ogni estratto conto

Per ogni estratto, mantieni questo ordine:

1. Parti da `https://app.expense-budget-tracker.com/api/agent` e segui le indicazioni di discovery.
2. Consulta i dati dell’account, conferma lo spazio di lavoro e verifica lo schema effettivo.
3. Dai a Claude Code un solo estratto conto accessibile e indica i saldi di riferimento.
4. Consulta le registrazioni che ricadono nello stesso periodo dell’estratto e prepara l’anteprima completa.
5. Approva le modifiche mostrate nell’anteprima.
6. Per un inserimento su molte righe, fai una prova con 1–3 righe, poi prosegui con gruppi di non più di 100, uno alla volta.
7. Rileggi ogni gruppo salvato e confrontalo con l’anteprima.
8. Riconcilia il conto con il saldo finale della banca senza aggiungere un movimento di quadratura.
9. Controlla i totali per categoria anche se la differenza tra i saldi è zero.
10. Prepara, approva e verifica separatamente eventuali modifiche alle voci di budget.

Parti da un solo conto e da un periodo chiuso. Quando hai riconciliato il conto e verificato il budget per quell’estratto, passa al conto successivo. Claude Code si occupa dei passaggi ripetitivi con file e API. Tu puoi esaminare ogni decisione finanziaria prima che cambi i dati.

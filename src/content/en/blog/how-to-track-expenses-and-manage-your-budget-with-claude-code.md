---
title: "Claude Code Expense Tracker: Connect, Import, and Reconcile"
description: "Connect Claude Code to Expense Budget Tracker with one link, preview and approve statement imports, reconcile balances, and update a budget without bank linking."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "Claude Code expense tracker"
  - "Claude expense tracker"
  - "expense tracker for Claude"
  - "Claude Code budget tracker"
  - "connect Claude to expense tracker"
  - "import bank statement with Claude Code"
---

A four-row statement can reconcile to `€0.00` and still leave your budget wrong. Classify a €54.20 supermarket purchase as Travel instead of Groceries and the account balance stays perfect, while the category report is off by €54.20.

A useful Claude Code expense tracker needs two checks, not one: the stored movements must explain the bank balance, and the stored categories must match the reviewed statement. Claude Code can do the file parsing, calculations, and API calls. You choose the account and categories, inspect the proposed records, and approve the exact writes.

Expense Budget Tracker does not keep a native bank connection or offer a statement-upload flow for this setup. Export the statement yourself, place it somewhere Claude Code is allowed to read, and send only the approved records through the managed Agent API. If avoiding persistent bank access is your main requirement, [Budget App Without Bank Linking](/blog/budget-app-without-bank-linking/) covers the broader trade-offs.

![A mosaic conservator lifts a misplaced blue tile from a terracotta band beside a level brass balance scale](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Connect Claude Code with one discovery link

Install and sign in to Claude Code using Anthropic's [official quickstart](https://code.claude.com/docs/en/quickstart). The [CLI reference](https://code.claude.com/docs/en/cli-reference) explains how working directories and additional file access work.

Open `claude` in the directory that contains the statement, or grant access to its directory using a method supported by your setup. Then paste this prompt:

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

The [app-scoped agent link](https://app.expense-budget-tracker.com/api/agent) returns the live discovery document. It currently supplies `https://api.expense-budget-tracker.com/v1/` as the API base, along with the authentication and SQL action URLs. Paste the app-domain link; Claude Code should follow the URLs returned by the service rather than memorizing the internal sequence.

The same email flow handles signup and login. Once you provide the 8-digit code, Claude Code receives a long-lived `ApiKey`. Approve a specific storage location, such as a secrets file excluded from source control. Never put the key in `CLAUDE.md` or commit it to a repository. [AI Agent Setup](/docs/agent-setup/) documents the underlying authentication and workspace sequence.

## Don't mix up the Agent API and MCP setups

“Claude expense tracker” can refer to two different integrations. This article uses Claude Code in a terminal with the Agent API. Claude and Claude Desktop can instead use the hosted remote MCP connector.

| | Claude Code with Agent API | Claude or Claude Desktop with MCP |
|---|---|---|
| Best fit | Terminal work with accessible local files and direct HTTP | Conversations in an MCP-capable Claude client |
| Starting point | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Authentication | Email OTP, then a long-lived `ApiKey` | Browser OAuth |
| Data interface | Discovery URLs leading to query and execute endpoints | `sql_query` and optional `sql_execute` tools |
| Statement access | Files and directories available to that Claude Code session | The remote connector does not provide local file access |

The credentials are not interchangeable. For the Claude web or desktop app, follow the [Claude expense tracker MCP guide](/blog/claude-expense-tracker-mcp-connector/). Use the Agent API workflow below when the job begins with a file available to Claude Code.

There are two more boundaries worth making explicit:

- Model-provider processing is separate from Expense Budget Tracker's API and storage. Review the [Claude Code data-usage documentation](https://code.claude.com/docs/en/data-usage) and the terms for the provider configured in your installation before sharing statement data.
- The local Docker Compose setup in the [self-hosting guide](/docs/self-hosting/) starts the web app, auth service, database, and FX worker. It does not provide the managed Agent API used here. The repository's AWS deployment is a separate setup that includes the public machine API.

## Give the import a precise boundary

Use one account, one currency, and one closed statement period for the first run. A CSV is convenient because its rows are easy to inspect. For any other export, first have Claude Code confirm that it can read the file in your environment and show the parsed rows. Do not assume support from the filename alone.

Give Claude Code these six facts:

1. The local path to the statement.
2. The bank account and its matching tracker account.
3. The account currency.
4. The first and last posted dates.
5. The opening or previous known-good balance.
6. The statement closing balance.

Leave pending transactions out until they post. Keep the source file unchanged and have Claude Code build a separate preview.

This is a useful local `CLAUDE.md` rule set for the finance directory:

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

Add stable details such as your real account names, category rules, transfer convention, and reporting currency. Do not copy example categories from this article unless they match your ledger.

## Import the statement through a complete preview

After the connection works, paste the following prompt and replace the bracketed values:

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

The database work stays read-only until you approve a change. Claude Code should inspect the live schema instead of copying column names from an article, find the matching account, and query existing rows across the same dates. A shared date and amount makes a transaction a duplicate candidate, not a confirmed duplicate. Two legitimate purchases can match both fields.

### A four-row worked example

Suppose a checking statement has an opening balance of €1,250.00 and four posted rows:

| Row | Posted | Description | Signed amount | Proposed type | Proposed category | Review note |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Salary | +€2,000.00 | Income | Salary | Clear |
| 2 | 2026-09-02 | Market | −€54.20 | Expense | Groceries | Check merchant if unfamiliar |
| 3 | 2026-09-03 | Savings transfer | −€300.00 | Transfer | — | Confirm the other account |
| 4 | 2026-09-04 | Cafe | −€8.40 | Expense | Dining | Clear |

The four signed amounts total `+€1,637.40`. Added to the `€1,250.00` opening balance, they produce an expected closing balance of `€2,887.40`. This example fits on one screen, but a longer import still needs every source row represented in the preview and every uncertainty called out.

The transfer needs its other account confirmed because moving money between your own accounts is not spending. Refunds and reimbursements also need their real type preserved. When a classification is uncertain, leave it flagged for a decision instead of choosing the most plausible category.

### Approve one exact change set

Review the workspace, account, date boundary, row count, signed total, duplicate candidates, and classifications. Approve the specific preview and SQL, rather than giving a broad instruction to “import everything.”

The Agent API separates reads and writes. Claude Code uses the discovered read action for one `SELECT` or `WITH ... SELECT`, then uses the write action only for an explicitly approved `INSERT`, `UPDATE`, or `DELETE`. The live schema remains the authority for tables and columns; the [API reference](/docs/api/) explains the SQL contract and limits.

### Probe long inserts and updates before batching

Before a long `INSERT` or `UPDATE`, the live discovery instructions tell the agent to send a representative probe with the same SQL shape: 1–3 literal rows for an `INSERT`, or one targeted row for an `UPDATE`. Your approval covers both the probe and the remaining rows in that reviewed change set.

If the probe succeeds, Claude Code should continue immediately in sequential batches of no more than 100 records, verifying each batch as it goes. A 247-row approved import with a 3-row probe leaves batches of 100, 100, and 44. A changed scope, a new ambiguity, or an execution failure creates a new approval point. Routine later batches in the already approved set do not.

Restricted SQL does not support `ON CONFLICT`, so duplicate handling must stay explicit. Read results are capped at 100 rows. Claude Code should check the response's row-count and truncation metadata, aggregate totals in SQL, and split detailed verification into narrow ordered reads. A truncated response is not a complete import check.

### Read the stored rows back

A successful API response proves that the request ran. It does not prove that every stored value matches the preview. Query the affected account and period again and compare:

- inserted row count
- dates, signed amounts, and currencies
- account assignment
- transaction types and categories
- duplicate candidates
- batch totals and the complete statement total

If anything differs, return to read-only diagnosis. Review one specific correction before another write. The [bank statement import guide](/blog/how-to-import-bank-statements-into-an-expense-tracker/) goes deeper on overlapping periods, refunds, and transfers.

## Reconcile the balance and the categories separately

Balance reconciliation asks whether the stored movements explain the bank's closing balance across the same posted dates.

For a normal deposit account:

**expected closing balance = opening balance + posted inflows − posted outflows**

With signed movements:

**expected closing balance = opening balance + sum of signed posted movements**

Liability accounts such as credit cards may use another sign convention. Claude Code should state the convention it found before calculating the comparison.

Continue with this prompt:

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

In the four-row example, `€1,250.00 + €1,637.40 = €2,887.40`. If the bank also closes at €2,887.40, the balance difference is `€0.00`.

That zero validates the account arithmetic for the chosen boundary. It does not validate the categories. Moving the €54.20 Market row from Groceries to Travel leaves the balance difference at zero while shifting €54.20 between category totals. Category review is a separate acceptance check.

When the difference is not zero, inspect the opening balance, missing or duplicated rows, transfers, pending items, signs, dates, and currencies. Never add a synthetic balancing transaction to make the difference disappear. The [reconciliation guide](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explains the diagnostic loop in more detail.

## Update the budget only after reconciliation

Only move to the budget after the rows read back correctly, the account reconciles, and the category totals make sense. A Claude Code budget tracker can compare actual activity with `budget_lines` and prepare proposed changes. One unusual month does not automatically define the next plan.

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

A large expense may be exceptional. Apparent overspending may turn out to be a miscategorized transfer or refund. Claude Code can calculate the differences and prepare the SQL; the next month's amounts remain your decision.

## Keep the same order for every statement

For each statement, keep the order fixed:

1. Start from `https://app.expense-budget-tracker.com/api/agent` and follow discovery.
2. Load account context, confirm the workspace, and inspect the live schema.
3. Give Claude Code one accessible statement file and explicit balance boundaries.
4. Read the overlapping ledger data and prepare the complete import preview.
5. Approve one exact change set.
6. For a long insert, run a 1–3 row probe, then sequential batches of no more than 100.
7. Read every stored batch back and compare it with the preview.
8. Reconcile the account to the bank's closing balance without a balancing entry.
9. Review category totals even when the balance difference is zero.
10. Prepare, approve, and verify any budget-line changes separately.

Start with one account and one closed period. Once that statement reaches a reconciled ledger and a reviewed budget, repeat the workflow for the next account. The repetitive file and API work stays with Claude Code, while every financial decision remains visible before it changes your records.

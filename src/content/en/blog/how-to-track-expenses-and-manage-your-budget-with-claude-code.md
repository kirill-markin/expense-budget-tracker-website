---
title: "Claude Code Expense Tracker in 2026: Import, Verify, and Budget"
description: "Connect Claude Code to Expense Budget Tracker, review a bank-statement import, verify balances, and manage your budget through the current Agent API."
date: "2026-03-05"
updated: "2026-08-20"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code.png"
keywords:
  - "Claude Code expense tracker"
  - "expense tracker for Claude"
  - "Claude personal finance"
  - "Claude Code budget"
  - "AI expense tracker"
  - "import bank statement with Claude Code"
---

A useful Claude Code expense tracker should begin with a read, not a write. Before one bank transaction enters the ledger, Claude Code can identify the workspace, inspect the live schema, check the target account and date range, and show you what it plans to change.

That review point is the reason to use a terminal agent for this job. Claude Code can handle the file and HTTP work, while you keep the financial judgment: which account is correct, whether a row is a transfer, which category fits, and whether the proposed write should happen at all.

That makes it an AI expense tracker with a visible approval boundary rather than a general finance chatbot.

Expense Budget Tracker supports that workflow through its direct Agent API. The starting point is one public discovery URL:

```text
https://api.expense-budget-tracker.com/v1/
```

From there, Claude Code can complete email OTP onboarding, store the returned long-lived `ApiKey` outside chat memory, inspect the allowed schema, and use separate endpoints for reads and approved writes.

![A tailor and client review a paper pattern and one test fabric piece before cutting the full bolt](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code.png)

## What this setup does—and where the data goes

Claude Code runs in your terminal and can work with a statement file you make available on your computer. That does not make the whole workflow offline or local-only.

[Anthropic's current Claude Code requirements](https://docs.anthropic.com/en/docs/claude-code/getting-started) specify an Internet connection. Authentication and AI processing use Anthropic or the model provider configured for your Claude Code installation. Relevant statement content, prompts, and API results may therefore be processed outside your computer under that provider's terms.

The rest of the path is separate:

| Boundary | What happens there |
|---|---|
| Your computer | The source statement starts as a local file. Claude Code gets only the file access you allow. |
| Claude Code and its model provider | Claude Code interprets the file, prepares queries, and explains results. Internet access is required for authentication and AI processing. |
| Direct Agent API | Claude Code sends the specific authenticated reads and approved writes needed for the task. The API cannot browse arbitrary files on your computer. |
| Expense Budget Tracker storage | Approved financial records are stored in the hosted database, or in infrastructure you control if you self-host the application. |

This is also different from the remote MCP connector for Claude and Claude Desktop. The direct API uses a long-lived `ApiKey` and is the path covered here. MCP uses browser OAuth at a different URL; it does not inherit access to local files merely because you connected it.

If your main requirement is no persistent bank connection, [Budget App Without Bank Linking](/blog/budget-app-without-bank-linking/) explains these data boundaries in more detail.

## Connect Claude Code through the discovery URL

Install and authenticate Claude Code using Anthropic's [official setup guide](https://docs.anthropic.com/en/docs/claude-code/getting-started). The [CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage) covers interactive and non-interactive command usage.

Once `claude` works in your terminal, open it in a directory where you keep your finance files and give it this prompt:

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Follow the discovery response instead of assuming endpoint details. Ask me for my
account email and then the 8-digit code from my inbox. Save the returned ApiKey
outside chat memory only after I approve the storage location.

After login, call /me, list my workspaces, ask me to confirm the target workspace,
save that workspace for this key, and inspect /schema. Do not write financial data yet.
```

The current onboarding sequence is:

1. `GET https://api.expense-budget-tracker.com/v1/` and follow the actions in the discovery response.
2. Provide the account email when Claude Code asks for it.
3. Provide the 8-digit email code. Successful verification returns a long-lived `ApiKey`.
4. Store the key outside chat memory, preferably as `EXPENSE_BUDGET_TRACKER_API_KEY` in a location you have approved. Do not commit it to a repository.
5. Call `/v1/me` and `/v1/workspaces` with `Authorization: ApiKey <key>`.
6. Select the intended workspace with `POST /v1/workspaces/{workspaceId}/select`.
7. Call `/v1/schema` before generating SQL.

The selected workspace is saved for that key. Later SQL requests can omit `X-Workspace-Id`, although Claude Code can still send the header when you want to override the saved workspace for one request. If the account has exactly one workspace and the key has no selection yet, the API can save and use it automatically. It is still worth naming the workspace in every review before a write.

The detailed auth flow and storage guidance live in [AI Agent Setup](/docs/agent-setup/).

## Give Claude Code a review rule before the first import

A local `CLAUDE.md` can preserve the operating rules for this finance directory without storing the key itself. Keep the instructions short and specific:

```markdown
# Expense Budget Tracker workflow

- Start from https://api.expense-budget-tracker.com/v1/ and inspect /schema.
- Use POST /v1/sql/query for every read.
- Before a write, show the target workspace, exact SQL, expected affected rows,
  source totals, and possible duplicates. Wait for my explicit approval.
- Use POST /v1/sql/execute only for the exact approved INSERT, UPDATE, or DELETE.
- Verify every write with a fresh /v1/sql/query request.
- Never invent a balancing transaction or silently change an uncertain category.
- Keep the ApiKey outside this file and outside chat memory.
```

Add your real account names, category conventions, transfer rules, and reporting currency if they are stable. Do not copy example categories into the tracker just because an article used them. Claude Code should query your existing data and use the live schema.

## Import one bank statement with Claude Code

The safest first import is intentionally small: one account, one currency, one closed statement period, and a file whose rows you can review. CSV is a good starting point because its structure is visible. Other formats need a file-specific extraction check before you can trust the resulting rows.

### 1. Fix the source boundary

Before Claude Code parses anything, identify:

- the bank account and its matching tracker account
- the account currency
- the first and last posted dates in the statement
- the opening or previous known-good balance
- the statement closing balance
- whether pending transactions appear in the file

Use posted transactions for the import and reconciliation. Keep pending activity outside the approved batch until it posts.

### 2. Inspect the target before drafting rows

Ask Claude Code to use the read endpoint first:

```text
I want to import ~/finances/checking-2026-07.csv.

Use /v1/sql/query only. Confirm the selected workspace, inspect /v1/schema, list the
available accounts, and identify the one account that matches this statement. Query
the statement date range in ledger_entries and look for overlap. Show me the account,
currency, date boundary, existing row count, and any possible duplicates. Do not write.
```

The primary read endpoint is:

```text
POST https://api.expense-budget-tracker.com/v1/sql/query
```

It accepts one read-only `SELECT` or `WITH ... SELECT`. The request body uses the current SQL generated from `/schema`:

```json
{
  "sql": "SELECT * FROM accounts LIMIT 100"
}
```

Claude Code should calculate totals and grouped results in SQL rather than pulling the entire ledger into the conversation. Query results are capped at 100 rows.

### 3. Review a preview, not a promise

Have Claude Code parse the statement into a preview table before it creates an `INSERT`. At minimum, the preview should include the source row, date, amount, currency, target account, proposed transaction type, proposed category, and duplicate status.

Review these rows closely:

- transfers between your own accounts
- refunds and reimbursements
- cash withdrawals and bank fees
- unfamiliar counterparties
- foreign-currency transactions
- rows near the beginning and end of the statement period
- any candidate that resembles an existing ledger entry

A matching date and amount can indicate a duplicate, but it is not proof. Two legitimate transactions can share both. If the source includes a stable bank identifier, use it as evidence when the live schema has a suitable field; otherwise keep it in the preview instead of forcing it into the database.

Then ask for a compact approval summary:

```text
Prepare the import preview without writing. Show:

1. the confirmed workspace and account
2. the source date range and currency
3. the count and signed total of source rows
4. every proposed ledger row
5. possible duplicates and uncertain classifications
6. the exact INSERT statement or statements you would send
7. the expected affected-row count

Stop and wait for my approval.
```

### 4. Send only the approved change set

The primary write endpoint is:

```text
POST https://api.expense-budget-tracker.com/v1/sql/execute
```

It accepts one approved `INSERT`, `UPDATE`, or `DELETE`, including supported `WITH` forms. It is deliberately separate from the read endpoint.

Each mutation is limited to 100 affected rows. For a long import, approve the complete proposed change set before execution. Claude Code should send 1–3 representative rows with the same SQL shape first. If that probe succeeds, it should immediately continue with the remaining approved rows in sequential batches of no more than 100. It should track and verify every batch, but it should not stop merely to ask you to continue or reconfirm. A changed scope, new ambiguity, or failed execution creates a new review point.

The SQL surface does not support `ON CONFLICT`, so duplicate handling must be explicit rather than hidden behind an upsert.

`POST /v1/sql` still exists for compatibility and restricted atomic multi-statement scripts. It is not the normal endpoint for statement reads or routine writes.

### 5. Read the rows back

An API success response is not the end of the import. Ask Claude Code to query the affected account and period again through `/v1/sql/query` and compare the stored result with the approved preview:

- affected row count
- dates and amounts
- original currency
- account assignment
- transaction types and categories
- duplicate count

Do not ask Claude Code to “fix whatever looks wrong.” If verification finds a difference, return to a read-only diagnosis, prepare one specific correction, and approve that correction separately.

The broader [bank statement import guide](/blog/how-to-import-bank-statements-into-an-expense-tracker/) covers transfers, refunds, overlapping periods, and other rows that can make a clean-looking import misleading.

## Reconcile one account before importing another

Reconciliation proves that the ledger movements explain the bank statement. Compare one bank account with its matching tracker account in the same currency and over the same posted boundary.

For a normal deposit account, the basic check is:

**expected closing balance = opening balance + posted inflows − posted outflows**

If the tracker uses signed movements, the equivalent is:

**expected closing balance = opening balance + sum of signed posted movements**

Liability accounts such as credit cards may use different sign conventions. Make Claude Code state the convention it found before comparing numbers.

Use a prompt that keeps the diagnosis read-only:

```text
Use /v1/sql/query only. Reconcile the imported checking account against the statement
closing balance of [amount and currency]. State the opening boundary and sign convention.
If the balances differ, show the exact difference and list candidate missing, duplicated,
or mis-signed rows. Do not insert a balancing entry and do not change existing data.
```

If the difference is not zero, inspect the opening balance, missing or duplicated transactions, transfers, pending items, signs, dates, and currencies. A synthetic balancing entry makes the screen match while hiding the cause.

A zero difference proves that the account movements add up. It does not prove that the categories are correct. Review category totals separately before moving to the next account. The [budget reconciliation guide](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) goes deeper into that distinction.

## Analyze spending through the read endpoint

Once the import is verified, Claude Code can use `ledger_entries` for read-only spending analysis. Keep the question precise and ask for the SQL so you can review the definition behind the answer.

```text
Inspect /v1/schema, then use /v1/sql/query to compare spending by category for the
latest three complete calendar months. Resolve explicit start and end dates before
writing the SQL. Exclude transfers according to the stored transaction type. Aggregate
in SQL, show the query, and explain any excluded or uncertain rows. Do not change data.
```

This matters because “spending” is not a universal column. A useful answer depends on the current schema, transaction types, account currency, refunds, and the exact date boundary. Claude Code can write the query, but you should still be able to see what it counted.

For one-off investigation, ask for narrow questions such as:

- Which categories changed most between two complete months?
- Which counterparties make up a category total?
- Are there possible duplicates in the latest imported period?
- Which actual categories have no matching budget line?

The 100-row result limit is usually enough when Claude Code groups and filters at the database boundary.

## Update a Claude Code budget without handing over the decision

Budget changes use the same review loop as statement imports. Claude Code can read `budget_lines`, compare the plan with actual ledger activity, and prepare a proposed `INSERT`, `UPDATE`, or `DELETE`. You decide whether the new amounts reflect your plans.

```text
Use /v1/sql/query to compare this month's actual income and spending with budget_lines.
Then draft next month's budget using the existing categories and current schema.

Show the current amount, proposed amount, difference, and reason for each changed line.
Show the exact SQL and expected affected rows. Do not call /v1/sql/execute until I
approve specific lines. After an approved write, query those lines again to verify them.
```

Do not let a high-spending month silently become the new plan. A large expense may be exceptional; a missing category may be a data problem; a transfer may have been misclassified. Claude Code can surface the differences, but a Claude Code budget still needs your judgment about what should happen next.

## Know the current Agent API boundary

The API exposes a small set of relations. Always treat `/v1/schema` as the current source of truth, but the present read/write split is:

| Relation | Access |
|---|---|
| `ledger_entries` | Read and approved write |
| `budget_lines` | Read and approved write |
| `workspace_settings` | Read and approved write |
| `account_metadata` | Read and approved write |
| `accounts` | Read-only |
| `fx_rates_raw` | Read-only |
| `fx_rates_daily` | Read-only |

The current Agent API limits are:

- 100 returned rows per query
- 100 affected rows per mutation statement and request
- 25-second total SQL request deadline
- 10 requests per second and 10,000 requests per day for each key

The SQL policy blocks DDL such as `CREATE`, `DROP`, and `ALTER`, transaction wrappers, SQL comments, quoted identifiers, dollar-quoted strings, `set_config()`, and restricted functions. The allowed functions are currently `SUM`, `COUNT`, `MIN`, `MAX`, `AVG`, and `COALESCE`. Use `ILIKE` instead of `LOWER(...)` for case-insensitive text search, and explicit date ranges instead of `NOW()` or `DATE_TRUNC()`. The primary endpoints accept one statement per request. `ON CONFLICT` is not supported.

These controls reduce the SQL surface, but they do not decide whether a category is right or whether a statement row is really a transfer. Row Level Security isolates workspaces at the database level. ApiKeys are stored as SHA-256 hashes and can be revoked from the product. You should still protect the plaintext key on your computer and review each financial mutation.

See the [API Reference](/docs/api/) for the current endpoint contract and limits.

## Claude Code Agent API and Claude MCP are separate paths

Searches for an expense tracker for Claude often mix terminal use with Claude or Claude Desktop connectors. Expense Budget Tracker supports both, but the setup and credentials are not interchangeable.

| | Claude Code with Agent API | Claude or Claude Desktop with MCP |
|---|---|---|
| Best fit | Local files, terminal workflows, scripts, and direct HTTP | Conversations in an MCP-capable Claude client |
| Start here | `https://api.expense-budget-tracker.com/v1/` | `https://mcp.expense-budget-tracker.com/mcp` |
| Authentication | Email OTP, then long-lived `ApiKey` | Browser OAuth |
| Read/write interface | `/v1/sql/query` and `/v1/sql/execute` | `sql_query` and optional `sql_execute` tools |
| Local file access | Depends on the files and permissions available to Claude Code | Not provided by the remote connector itself |

Use the [MCP Connector documentation](/docs/mcp-connector/) or the complete [Claude expense tracker MCP guide](/blog/claude-expense-tracker-mcp-connector/) when your goal is to connect Claude or Claude Desktop. Keep using this Agent API workflow when the task begins with a local statement and a terminal.

## A reusable prompt for the whole workflow

This prompt keeps discovery, preview, approval, and verification in one sequence:

```text
Connect to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/
and follow the discovery response. Use the ApiKey stored outside chat memory. Call /me,
list workspaces, confirm the target workspace with me, select it, and inspect /schema.

I want to import [local CSV path] into [account] for [closed date range] in [currency].
Use /v1/sql/query first to inspect the account, existing categories, and overlapping
ledger entries. Parse the file and prepare a complete preview. Flag possible duplicates,
transfers, refunds, reimbursements, fees, unusual counterparties, and uncertain categories.

Show the source totals, proposed rows, exact SQL, and expected affected-row count. Do not
write until I approve the complete change set. Use /v1/sql/execute only for that approved
write. For a long import, send a representative 1–3 row probe first. If it succeeds,
immediately continue the remaining approved rows in sequential batches of at most 100.
Verify every batch through /v1/sql/query, but do not ask me to reconfirm unless the scope
changes, new ambiguity appears, or execution fails.

Finally, reconcile this one account with the statement closing balance. If it does not
match, explain the difference without creating a balancing transaction or changing data.
```

Start with one account and one closed period. If the preview is understandable, the approved rows read back correctly, and the closing balance reconciles, you have a reviewable Claude personal finance workflow—not a chatbot with vague permission to change your books.

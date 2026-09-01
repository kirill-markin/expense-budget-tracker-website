---
title: "AI Receipt Scanner Expense Tracker: A Claude and Codex Workflow"
description: "Use Claude or Codex as an AI receipt scanner for Expense Budget Tracker: extract totals, preview an exact write, approve it, and verify the ledger entry."
date: "2026-09-01"
image: "/blog/ai-receipt-scanner-expense-tracker.png"
keywords:
  - "AI receipt scanner expense tracker"
  - "Claude AI receipt scanner"
  - "scan receipts with AI"
  - "Codex receipt scanner"
  - "receipt to expense tracker"
  - "budget app with receipt scanning"
---

A café receipt says `$27.82`, the card notification still says “pending,” and the paper is already curling beside the laptop. Leave it for a week and the merchant name, tip, and category all become harder to reconstruct.

Claude or Codex can turn that photo into a draft while the receipt is still in front of you. The agent reads the visible details, compares the proposed transaction with the accounts, categories, and recent entries in your ledger, and shows the exact write for review. Nothing changes until you approve that specific write.

The product boundary matters here. **Expense Budget Tracker has no native camera or receipt scanner, and it does not store the receipt image.** Claude, Codex, or the model provider in your setup interprets the image you supply. The tracker stores only the approved structured ledger data.

The image-reading capability comes from the chosen AI setup. [Anthropic documents that Claude can process and analyze visual input](https://platform.claude.com/docs/en/intro), while the [OpenAI Responses API accepts text, image, or file inputs](https://developers.openai.com/api/reference/cli/resources/responses/methods/create). That does not mean every Claude or Codex client can automatically open a local photo. The client still needs a supported attachment or an accessible file path, plus your permission. Image understanding is useful, but the numbers still need human review.

![Claude or Codex turns a receipt photo into a reviewable ledger-entry preview before an approved write](/blog/ai-receipt-scanner-expense-tracker.png)

## What the “scanner” does in this setup

This is an AI-assisted receipt-to-ledger workflow, not a built-in camera feature.

Think of it as a receipt-to-expense-tracker handoff: the model handles the supplied image, while Expense Budget Tracker handles the approved ledger data.

| Stage | What happens |
|---|---|
| Capture | You take a photo or save a scan in a location Claude or Codex can access. |
| Interpretation | The model reads visible fields such as merchant, date, subtotal, discount, tax, tip, total, currency, and payment clues. It marks anything uncertain. |
| Ledger inspection | The agent reads the selected Expense Budget Tracker workspace, live schema, accounts, categories, and possible duplicate entries. |
| Preview | The agent shows the extracted facts, uncertainties, category decision, and exact proposed write. |
| Approval | You approve that specific write, or correct it and request a new preview. |
| Verification | The agent writes one structured transaction and reads it back from the ledger. |
| Reconciliation | When the card or bank transaction posts, you match it against the recorded receipt entry instead of importing a second copy. |

That last step is what makes an **AI receipt scanner expense tracker** useful for an auditable ledger. Reading `$27.82` correctly is only the beginning. The entry also needs the right workspace, account, sign, currency, category, and duplicate decision.

If you specifically need an app with a native camera inbox and stored receipt attachments, this is not that product. Expense Budget Tracker is the structured-finance destination. Your normal file system, document archive, or another service remains the home for receipt images you need to retain.

## Use the direct Agent API or the remote MCP connector

Expense Budget Tracker supports two connection paths. They reach the same kind of financial data, but their credentials and client behavior are different.

### Direct Agent API for Claude Code, Codex, and HTTP-capable agents

The current direct path begins at:

```text
https://api.expense-budget-tracker.com/v1/
```

An agent starts with `GET /v1/`, follows the discovery response, completes email-code onboarding, and stores the returned long-lived `ApiKey` outside chat memory. It then calls `/v1/me`, lists and selects a workspace, inspects `/v1/schema`, reads through `/v1/sql/query`, and sends one approved mutation through `/v1/sql/execute`.

This path is a natural fit when Claude Code or Codex can already open the receipt file on your computer and make HTTP requests. The [AI Agent Setup guide](/docs/agent-setup/) covers the onboarding sequence, and the [API reference](/docs/api/) documents the current read/write contract. For a broader Claude Code terminal workflow, see [how to track expenses and manage your budget with Claude Code](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code/).

### Remote MCP with browser OAuth

An MCP-capable client can instead connect to:

```text
https://mcp.expense-budget-tracker.com/mcp
```

This route authorizes through browser OAuth. It uses MCP access and refresh tokens, not the Agent API’s `ApiKey`. Reads use tools such as `list_workspaces`, `get_schema`, and `sql_query`; writes require the separate `expenses:write` scope and use `sql_execute`.

The remote connector does not gain access to photos on your computer. The client or model still needs the receipt through an attachment or file mechanism it supports. The [MCP Connector guide](/docs/mcp-connector/) explains the OAuth flow and scopes.

Whichever path you choose, keep the same rule: receipt interpretation first, ledger inspection second, visible preview third, separate write approval last.

## A complete workflow for one small receipt

Consider a clear photo of this hypothetical restaurant receipt:

| Printed field | Visible value |
|---|---|
| Merchant | North Street Cafe, New York |
| Date and time | August 31, 2026, 12:17 PM |
| Food subtotal | `$24.00` |
| Discount | `-$2.00` |
| Tax | `$1.82` |
| Tip | `$4.00` |
| Final total | `$27.82` |
| Payment clue | Visa ending `4242` |

The arithmetic works: `$24.00 - $2.00 + $1.82 + $4.00 = $27.82`. That check is useful, but it does not prove the target account or category. The agent still needs the ledger.

### 1. Confirm the target before reading meaning into the image

Ask the agent to identify and show:

- the signed-in account context
- the exact workspace name and ID
- the target ledger account and its currency
- the receipt date and time zone
- the receipt currency

For this example, assume the user confirms workspace `Personal` with ID `workspace-personal-example`, account `a-visa_4242-usd`, currency `USD`, and New York local time for the receipt. These are hypothetical values, not built-in workspace, account, or category names. A card’s last four digits are a clue, not permission to pick an account silently. If two saved cards end in `4242`, the agent should stop and ask which one paid.

### 2. Inspect the live schema

The agent should call:

```text
GET https://api.expense-budget-tracker.com/v1/schema
```

The schema response is the source of truth for the relations, columns, constraints, and write semantics available now. Examples in an article can go stale; `/v1/schema` is what the agent should follow before generating SQL. For the current ledger schema, an `INSERT` must include the confirmed `workspace_id` explicitly. Saving a workspace on the API key sets the request context, but it does not remove that column from the row being inserted.

### 3. Extract facts, clues, and uncertainties separately

A solid extraction report would look like this:

| Field | Extracted value | Confidence or issue |
|---|---|---|
| Merchant | North Street Cafe | Clear |
| Transaction time | `2026-08-31 12:17` local | Clear; user confirmed the New York time zone |
| Currency | USD | `$` plus confirmed location; user confirmed account currency |
| Subtotal | `24.00` | Clear |
| Discount | `-2.00` | Clear |
| Tax | `1.82` | Clear |
| Tip | `4.00` | Clear |
| Total paid | `27.82` | Clear and arithmetic matches |
| Payment method | Visa ending `4242` | Clue matched to user-confirmed account |

Do not collapse uncertain text into a confident field. If the last total digit could be `2` or `7`, the right output is “unclear total; needs another image or manual confirmation,” not a plausible guess.

### 4. Decide between one transaction and a category split

This receipt is all restaurant spending, so one `Dining Out` ledger row is reasonable if that exact category already exists in the workspace. Tax, discount, and tip explain the final amount; they do not need separate rows for ordinary personal budgeting.

A grocery receipt containing food, medicine, and a kitchen appliance may justify a category split. In the current ledger model, that means multiple rows with the same `event_id`, usually in the same account. Each row gets its own category and signed amount, and those amounts must sum exactly to the original payment: `-27.82` for a `$27.82` spend.

The preview should state how receipt-wide tax, discounts, service charges, and rounding were allocated. Proportional allocation may fit one receipt; assigning a clearly item-specific discount may fit another. There is no universal split rule. If the allocation would be arbitrary, keep one row in a broader existing category or ask the user.

The agent should query existing ledger categories rather than inventing a cleaner-sounding taxonomy:

```sql
SELECT category, COUNT(*) AS use_count
FROM ledger_entries
WHERE kind = 'spend'
  AND category IS NOT NULL
GROUP BY category
ORDER BY use_count DESC
LIMIT 100
```

### 5. Check overlapping entries and return candidates, not verdicts

Before drafting an insert, query the confirmed account around the receipt date. For the sample receipt, a narrow duplicate check could be:

```sql
SELECT entry_id, event_id, ts, account_id, amount, currency, category, counterparty, note, external_id
FROM ledger_entries
WHERE event_id = 'receipt-2026-08-31-north-street-cafe-2782'
   OR (
     account_id = 'a-visa_4242-usd'
     AND currency = 'USD'
     AND ts >= '2026-08-29 00:00:00-04'
     AND ts < '2026-09-03 00:00:00-04'
     AND amount = -27.82
   )
ORDER BY ts
LIMIT 100
```

The agent sends that statement to `POST /v1/sql/query`. Here, `event_id` is a literal the agent created for this event; for a split, every related row would share it. It groups rows and supports point lookups, but the database does not treat it as a unique deduplication key. An exact `event_id` match is strong evidence to investigate, not permission to delete or overwrite anything.

A nearby same-amount row from a similar merchant is also only a duplicate candidate. Two real café payments can share the same amount, and a pending card notification may later post under a different merchant string or timestamp.

If a likely matching entry already exists, the preview should show it beside the receipt extraction and propose no insert unless the user resolves the conflict.

### 6. Show the exact entry and exact write

Assume the duplicate query returns no candidates and `Dining Out` is an existing category. The read-only preview can now be concrete:

| Ledger field | Proposed value |
|---|---|
| Workspace | `Personal` (`workspace-personal-example`) |
| Account | `a-visa_4242-usd` |
| Timestamp | `2026-08-31 12:17:00-04` |
| Amount | `-27.82` |
| Currency | `USD` |
| Kind | `spend` |
| Category | `Dining Out` |
| Counterparty | `North Street Cafe` |
| Note | `Receipt subtotal 24.00; discount -2.00; tax 1.82; tip 4.00` |
| Duplicate candidates | None in the queried window |

The preview should also show the exact SQL it intends to send:

```sql
INSERT INTO ledger_entries (
  event_id,
  ts,
  account_id,
  amount,
  currency,
  kind,
  category,
  counterparty,
  note,
  workspace_id
)
VALUES (
  'receipt-2026-08-31-north-street-cafe-2782',
  '2026-08-31 12:17:00-04',
  'a-visa_4242-usd',
  -27.82,
  'USD',
  'spend',
  'Dining Out',
  'North Street Cafe',
  'Receipt subtotal 24.00; discount -2.00; tax 1.82; tip 4.00',
  'workspace-personal-example'
)
```

This is still a preview. The agent should state the expected effect—one new ledger row in the confirmed workspace—and wait for an explicit approval such as “Approve this exact write.” A correction to any value, including the workspace, account, amount, category, or note, invalidates the old preview and requires a new one.

### 7. Execute only the approved statement, then read it back

After approval, the direct Agent API sends the exact statement to:

```text
POST https://api.expense-budget-tracker.com/v1/sql/execute
```

Then the agent verifies it through `/v1/sql/query`:

```sql
SELECT entry_id, event_id, ts, account_id, amount, currency, kind, category, counterparty, note, workspace_id
FROM ledger_entries
WHERE event_id = 'receipt-2026-08-31-north-street-cafe-2782'
LIMIT 100
```

The read-back should return exactly one row matching the approved preview. An HTTP success without this comparison is incomplete verification.

### 8. Reconcile when the card charge posts

The receipt records what happened at the counter. The posted card transaction confirms what reached the account. When that transaction appears in a later card export, query the same account, amount, date window, merchant clues, and any stable source ID. If the evidence points to the receipt-recorded row, exclude the statement row from the import rather than creating a second ledger entry.

If the posted amount differs, do not create a balancing entry. Investigate whether the receipt total was read incorrectly, a tip changed, a hold became final, or the card converted a foreign-currency charge. Prepare one visible correction and request separate approval.

For larger batches, the [bank statement import guide](/blog/how-to-import-bank-statements-into-an-expense-tracker/) covers overlapping periods and transfer handling. The [budget reconciliation guide](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explains how to compare posted account activity with a known-good balance.

## Where receipt reading gets difficult

Receipt photos are messy inputs. A careful Claude AI receipt scanner or Codex receipt scanner should surface these cases instead of smoothing them over.

| Hard case | Safe handling |
|---|---|
| Blurry, dark, folded, or cropped photo | Mark unreadable fields, request a new image or manual value, and do not write while the total, date, or currency is uncertain. |
| Subtotal versus total | Recalculate visible components and use the final amount actually paid. Check whether tax is included or added and whether a service charge is already in the total. |
| Tips | Distinguish printed suggested tips, handwritten tips, card authorization amounts, and the final total. Later compare with the posted card amount. |
| Discounts and coupons | Preserve the final paid total. For category splits, show how the discount was allocated rather than silently assigning it. |
| Returns and refunds | Treat a return receipt as evidence of a pending or completed refund, not as ordinary income. Record a refund as its own structured entry in the receiving account only when its status and amount are clear, then reconcile it when it posts. |
| Split-category receipt | Give the related rows one `event_id`; show every signed category amount, allocation rule, rounding decision, and sum. The rows must add up to the final paid total. |
| Cash versus card | Use the actual payment account. A merchant logo or wallet in the photo is not proof of payment method; ask when the tender line is missing. |
| Foreign currency | Keep the receipt currency explicit. If the card account uses another currency, do not invent an exchange rate or settlement amount; wait for the posted charge or get an exact confirmed amount. |
| Duplicate candidates | Compare date, signed amount, account, currency, merchant, and any stable source identifier. Present candidates for a decision instead of silently skipping or inserting. |

The same restraint applies to tax labels. A receipt can support recordkeeping, but the model should not declare every purchase a deductible business expense or make legal or tax decisions from the merchant name. Keep any document needed for tax or reimbursement proof in your own document system and get qualified advice for questions that depend on your circumstances.

## A reusable prompt for Claude or Codex

Paste this after the agent is connected, then replace the bracketed values. It works best with one receipt at a time while you are learning the workflow.

```text
Use the receipt image at [exact file path or attachment] and Expense Budget Tracker.
For the direct API, start from https://api.expense-budget-tracker.com/v1/ and follow
the discovery response. Use the stored ApiKey outside chat memory. If this connection
uses MCP instead, use the MCP workspace/schema/query tools and keep the same approval
boundary below.

Do not write yet. With the direct API, show my /me account context. List the available
workspaces and ask me to confirm the exact workspace. Inspect /v1/schema (or call
get_schema). Query the available accounts and confirm the exact account and its
currency with me. Do not infer an account only from the last four card digits.

Read the image and extract the merchant, receipt date and time, currency, subtotal,
tax, tip, service charge, discounts, returns, final total, and payment clues. Mark
anything blurry, cropped, ambiguous, or arithmetically inconsistent. Never invent a
missing value. Tell me whether one ledger row or a category split fits, and query my
existing categories before proposing names. For a split, use one event_id for its
related rows and prove that their signed amounts sum to the final total.

Use read-only queries to inspect overlapping ledger entries in the confirmed account
and date window. Show duplicate candidates with their evidence; do not assume that a
matching date and amount is either definitely the same purchase or definitely new.

Then show a read-only preview with the confirmed workspace, exact account, signed
amount, exact currency, timestamp, kind, existing category, counterparty, note, every
split amount if applicable, and duplicate candidates. Show the exact SQL write, include
the confirmed workspace_id in every INSERT, and state the expected affected-row count.
Do not create balancing entries, guessed conversions, or extra rows.

Stop and wait for my separate explicit approval of that exact write. After approval,
send only the approved statement through /v1/sql/execute (or sql_execute). Read the row
back through /v1/sql/query (or sql_query) and compare every stored field with the
approved preview. Report any mismatch without changing more data. Later, help me match
this receipt entry to the posted bank or card transaction without creating a duplicate.
```

The prompt is intentionally strict. “Scan receipts with AI” sounds like an extraction task, but the expensive errors usually happen after extraction: wrong account, wrong currency, made-up category, duplicate insert, or an unreviewed write.

## The data boundaries in plain language

No bank link does not mean no data leaves your computer. Each part of this workflow has a separate boundary.

| Boundary | Data involved |
|---|---|
| Your device or client | The receipt starts as a photo or file. The client gets only the file access you provide. |
| Claude, Codex, and the chosen model provider | Receipt contents and your instructions are processed according to that provider and client’s terms and settings. Review those terms for your setup; Expense Budget Tracker cannot add privacy guarantees on Anthropic’s or OpenAI’s behalf. |
| Direct Agent API or MCP connector | The agent sends the specific workspace/schema reads, ledger queries, and approved structured writes required for the task. The receipt image is not needed by either tracker connection. |
| Expense Budget Tracker storage | For this workflow, the tracker stores approved structured finance data such as amount, currency, account, category, counterparty, and note. It does not store the receipt image. |
| Your receipt archive | If you need the original image for returns, warranties, reimbursements, or records, you keep it in a separate location you choose. |

This can be a good fit when you want a [budget app without bank linking](/blog/budget-app-without-bank-linking/): no persistent bank feed is required for the receipt workflow, and each proposed ledger change stays visible. You still choose an AI provider, grant file access, and send selected financial reads and writes through the tracker connection.

## Is this the right kind of receipt scanning?

If “budget app with receipt scanning” means a built-in phone camera inbox and stored attachments, choose a product designed for that job. Use this workflow when you want to scan receipts with AI while keeping each ledger write visible and separate from the original image.

Use this workflow if you want:

- receipt capture without linking a bank account
- Claude or Codex to handle image interpretation and ledger lookup
- existing accounts and categories to guide the entry
- an exact preview before every write
- duplicate candidates instead of silent assumptions
- a verified structured ledger entry you can later reconcile

Expense Budget Tracker does not try to replace a searchable receipt archive.

Start with one clear receipt, one confirmed account, and one familiar category. Review the arithmetic, approve one exact entry, read it back, and match it when the charge posts. That short loop leaves an audit trail you can understand later.

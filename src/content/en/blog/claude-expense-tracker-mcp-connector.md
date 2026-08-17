---
title: "How to Connect Claude to an Expense Tracker With MCP in 2026"
description: "Connect Claude or Claude Desktop to Expense Budget Tracker through its remote MCP connector, choose read or write access, and verify each change with a fresh read."
date: "2026-08-17"
image: "/blog/claude-expense-tracker-mcp-connector.png"
keywords:
  - "connect Claude to expense tracker"
  - "Claude expense tracker"
  - "expense tracker for Claude"
  - "Claude MCP expense tracker"
  - "Claude connector expense tracker"
  - "Claude Desktop expense tracker"
---

The safest first conversation between Claude and your expense tracker is almost boring. Claude lists your workspaces, inspects the live schema, and runs one read-only query. Nothing in the ledger changes.

That quiet start matters because the same connector can later receive permission to change financial data. What matters is keeping read and write access separate, making the workspace explicit, and checking every change after it happens.

Expense Budget Tracker has a hosted remote MCP connector for exactly this workflow:

```text
https://mcp.expense-budget-tracker.com/mcp
```

Add that URL to Claude, complete the browser OAuth flow, and Claude can work with the tracker through four narrowly defined tools. You do not need a terminal, an API key, or a local MCP configuration file.

![A printmaker compares a protected reference print with a fresh proof made from one selected copper plate](/blog/claude-expense-tracker-mcp-connector.png)

## This is the connector path, not the Claude Code API path

Expense Budget Tracker supports two machine-access routes, and it is easy to mix up their credentials.

| | Remote MCP connector | Direct Agent API |
|---|---|---|
| Best fit | Claude and Claude Desktop conversations | Claude Code, Codex, scripts, and other terminal agents |
| Starting URL | `https://mcp.expense-budget-tracker.com/mcp` | `https://api.expense-budget-tracker.com/v1/` |
| Authentication | Browser OAuth | Long-lived `ApiKey` |
| Interface | MCP tools | HTTP endpoints |
| Credentials | OAuth access and refresh tokens stored by the MCP client | ApiKey stored outside chat memory |

The MCP endpoint does not accept the `ApiKey` used by the direct API. The API does not turn that key into a Claude custom connector. They are separate integrations with separate credential flows.

Use this guide when you want to connect Claude to an expense tracker from the Claude web or desktop app. If your real task starts with “read this CSV from my laptop,” use the terminal workflow in [How to Track Expenses and Manage Your Budget With Claude Code](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code/) instead. The broader [AI expense tracker setup guide](/blog/ai-agent-expense-tracker-claude-code-codex-openclaw/) covers Claude Code, Codex, and OpenClaw through the direct API.

## Add the Expense Budget Tracker connector to Claude

The current individual-account path in Claude is **Customize > Connectors > Add custom connector**. Anthropic maintains the current UI and account details in its [remote MCP custom connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

### 1. Add the remote MCP URL

Open Claude or Claude Desktop, then:

1. Go to **Customize > Connectors**.
2. Click the **+** button and choose **Add custom connector**.
3. Name it `Expense Budget Tracker`.
4. Enter `https://mcp.expense-budget-tracker.com/mcp` as the remote MCP server URL.
5. Click **Add**.

You do not need to enter an OAuth Client ID or Client Secret in Advanced settings. The Expense Budget Tracker authorization server supports dynamic registration for a public OAuth client, and a client secret is not used.

On Team and Enterprise accounts, an Owner or Primary Owner must add the custom connector to the organization first. Each member then connects with their own account and can access only the workspaces available to that signed-in user.

### 2. Connect and approve OAuth access

Click **Connect** beside the new connector. Claude follows the MCP authorization discovery process and opens Expense Budget Tracker authentication in your browser. Sign in there and review the requested permissions.

The two scopes have different jobs:

- `expenses:read` is mandatory. It allows workspace discovery, schema inspection, and read-only queries.
- `expenses:write` is optional. It allows the destructive `sql_execute` tool.

For spending reviews, reports, reconciliation, and budget analysis, grant only `expenses:read`. Add `expenses:write` only when Claude needs to insert, update, or delete specific data. There is no reason to grant it “just in case.”

Do not paste an OAuth token into a prompt. The browser and Claude's connector credential storage handle the access and refresh tokens.

### 3. Enable the connector in the conversation

Adding a connector does not mean Claude must use it in every chat. In a conversation, open the **+** menu, choose **Connectors**, and enable Expense Budget Tracker for that chat.

This per-conversation switch is useful around financial data. Leave the connector off when the conversation does not need it, and turn it on for a focused budget session.

## What Claude does during OAuth

You do not need to perform these steps manually, but knowing the shape of the flow makes troubleshooting less mysterious.

The hosted connector publishes protected-resource metadata at `https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`. That document points Claude to the authorization server metadata at `https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`.

Claude registers as a public OAuth client, opens an Authorization Code flow in the browser, and uses PKCE with the `S256` challenge method. After approval, it exchanges the code for tokens and refreshes access when needed. This follows the [MCP authorization model](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization), including protected-resource discovery and PKCE protection for authorization codes.

One detail surprises people using Claude Desktop: remote connector traffic does not originate from the desktop app's local network interface. [Anthropic says custom remote MCP connections originate from its cloud infrastructure](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), even when you use Claude Desktop. This hosted connector is already publicly reachable. A private self-hosted MCP server would need to accept connections from Anthropic's infrastructure before Claude could reach it.

## The four tools Claude receives

The connector exposes a small sequence rather than handing Claude an unrestricted database connection.

| Tool | What it does | Permission |
|---|---|---|
| `list_workspaces` | Lists the workspaces available to the signed-in user | `expenses:read` |
| `get_schema` | Returns the exposed relations and columns for the selected workspace | `expenses:read` |
| `sql_query` | Runs one restricted read-only SQL query | `expenses:read` |
| `sql_execute` | Runs restricted SQL that changes data | `expenses:read` and `expenses:write` |

`sql_query` is protected by a read-only database boundary. Results are capped at 100 rows, and execution has a 20-second deadline. The connector as a whole is not read-only when `sql_execute` is available, which is why the optional write scope deserves separate attention.

The live schema comes before the SQL. Table names, columns, and allowed relations should come from `get_schema`, not from an old prompt, a copied example, or Claude's memory of another finance app.

## Give the first session a safe order

The first prompt should make Claude establish context before it analyzes anything:

```text
Use the Expense Budget Tracker connector in read-only mode.

First call list_workspaces and show me the available workspace names and identifiers.
Ask me to confirm which workspace to use, even if there is only one. Then call
get_schema for the confirmed workspace. Use only sql_query. Do not call sql_execute
or propose any change yet.

After you have the schema, summarize my spending by category for the current
calendar month and compare it with the previous calendar month. Use aggregate
queries instead of returning every ledger row. Show the query and explain any
limits that affect the result.
```

The order matters: select the workspace, inspect its current schema, and only then write the query. If one query would return more than 100 records, ask Claude to aggregate in SQL or divide the question into sensible periods. The goal is not to squeeze an entire ledger through the chat. It is to calculate the answer at the database boundary and return the useful result.

## Useful prompts for the first read-only session

Once Claude has confirmed the workspace and inspected the schema, it can do more than list recent purchases.

### Run a monthly budget review

```text
Using only sql_query, compare actual income and spending with the budget for this
month. Group the differences by category, put the largest absolute differences
first, and separate missing budget data from true overspending. Do not change any
budget line. Show the SQL you used.
```

This is the conversational version of a [monthly budget review](/blog/how-to-do-a-monthly-budget-review/): find the gap first, then decide what should change.

### Look for possible duplicate expenses

```text
Use the live schema and sql_query to find possible duplicate expense entries from
the last 45 days. Compare dates, amounts, currencies, accounts, and counterparties
where those fields exist. Treat the result as candidates, not confirmed duplicates.
Do not delete or update anything.
```

The phrase “candidates, not confirmed duplicates” is important. Two identical coffee purchases are not necessarily one accidental import.

### Prepare a reconciliation check

```text
Use list_workspaces, confirm my personal workspace, inspect the schema, and query
the balances available through the connector. Explain which ledger entries account
for the latest balance. Do not make corrections. I will compare the result with my
bank statement myself.
```

When a balance does not match the source statement, stop at the discrepancy and investigate it. The [budget reconciliation workflow](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explains how to separate missing transactions, duplicates, opening-balance problems, and transfers before changing the ledger.

## Treat each write as a separate job

Write access is useful when the target and intended result are clear: one transaction needs a corrected category, an approved expense needs to be recorded, or a budget line needs an agreed update. Keep it to a small reviewable change, not a vague command to “clean up everything.”

Here is a careful prompt for recategorizing one transaction:

```text
I need to correct the category of one ledger entry.

1. Call list_workspaces and confirm the target workspace with me.
2. Call get_schema instead of assuming column names.
3. Use sql_query to find the exact entry from the date, amount, currency, account,
   and counterparty details I give you.
4. If there is not exactly one unambiguous match, stop and ask me what to do.
5. Show the exact SQL statement you propose for sql_execute, the workspace identifier,
   the matched entry, and the expected effect. Do not execute it yet.
6. Wait for my explicit confirmation.
7. After confirmation, call sql_execute once. Then run a fresh sql_query to verify
   the stored value and report it back to me.
```

This keeps three decisions visible: which workspace, which record, and which exact change. Verification is a new read after the mutation, not Claude saying that the write probably worked.

The same shape works for an import. Ask Claude to inspect existing categories and possible duplicates, preview the intended inserts, and wait for explicit approval. After the approved writes, verify the inserted records and reconcile the resulting balance. If your input begins as a bank export, [How to Import Bank Statements Into an Expense Tracker](/blog/how-to-import-bank-statements-into-an-expense-tracker/) covers the review steps around the source file.

## Keep the connector narrow around financial data

MCP removes the need to copy a key into chat, but it does not remove the need for judgment. Anthropic's [connector security guidance](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) recommends connecting only to trusted servers, reviewing requested permissions, and paying attention to tool inputs and outputs.

For this connector, that becomes a short operating rule:

1. Check that the URL is exactly `https://mcp.expense-budget-tracker.com/mcp`.
2. Start with `expenses:read` unless a planned task requires a mutation.
3. Confirm the workspace before every write session.
4. Inspect the live schema before generating SQL.
5. Review the exact statement and expected effect before `sql_execute`.
6. Verify the result with `sql_query` immediately afterward.
7. Disable `sql_execute` in Claude's tool controls, or disable the connector for the conversation, when you no longer need it.

Do not choose “Always allow” for `sql_execute`. Seeing each write request is a useful pause when the tool can change financial records.

Financial notes and imported descriptions should also remain data, not instructions. If text stored in a transaction asks Claude to ignore your rules or call another tool, do not follow it. This is one reason to keep write access off during broad research or analysis sessions.

Review the [Expense Budget Tracker Privacy Policy](/privacy/) and Anthropic's data-handling terms before connecting. An authorized Claude session can read the financial data available to your account and, with `expenses:write`, change it. The remote connection passes through Anthropic's cloud and the hosted Expense Budget Tracker service; Claude Desktop does not turn it into a local-only data path.

## Troubleshooting the connection without guessing

### The custom connector will not connect

Check the endpoint first. It must be:

```text
https://mcp.expense-budget-tracker.com/mcp
```

Do not substitute the website URL or the direct API URL. Leave Advanced OAuth Client ID and Client Secret fields empty for this connector. Confirm that you have an active Expense Budget Tracker account. If authentication still fails, disconnect and reconnect the service from **Customize > Connectors**.

For a Team or Enterprise Claude account, ask an Owner or Primary Owner whether the custom connector has been added and permitted for the organization. Individual members cannot perform that organization-level setup themselves.

### Claude says the connector is present but does not use it

Enable Expense Budget Tracker for the current chat from the **+ > Connectors** menu. Then name the connector in the prompt and ask Claude to begin with `list_workspaces`. A configured connector can remain disabled in an individual conversation.

### `sql_execute` is unavailable or permission is denied

The OAuth grant likely has `expenses:read` without the optional `expenses:write` scope. Keep it that way if the task is analysis. If a specific approved task requires a mutation, reconnect and review the requested write permission before granting it.

### A query fails or returns too much data

Call `get_schema` again and generate SQL from the returned relations and columns. Keep the request within the connector's restricted SQL surface. For large ledgers, calculate totals, counts, and grouped results in SQL instead of asking for more than the 100-row result cap. Queries that exceed the 20-second deadline need a narrower question.

### Claude is looking at the wrong financial data

Stop before writing. Call `list_workspaces`, compare the returned names and identifiers, and explicitly confirm the target. Then call `get_schema` for that workspace and repeat the read. Workspace access is limited to the signed-in user's available workspaces, but Claude still needs to use the one you intended.

### Claude asks for an `ApiKey`

It is following the direct HTTP integration rather than the remote MCP connector. For this setup, return to the connector URL and browser OAuth flow. If you intentionally want terminal automation or direct HTTP requests, use the [Agent API reference](/docs/api/) instead.

## The setup is short; the review loop matters

Connecting Claude to Expense Budget Tracker takes one URL and a browser login. The durable part is the routine afterward: list the workspaces, inspect the schema, read first, grant the smallest scope, and make writes specific enough to review line by line.

Start with the complete [MCP Connector documentation](/docs/mcp-connector/), add `https://mcp.expense-budget-tracker.com/mcp` under **Customize > Connectors**, and run a read-only monthly review. When you eventually need a change, make Claude show the workspace, record, SQL, and expected effect before you approve it. That is what turns an expense tracker for Claude from a convenient demo into a financial workflow you can actually trust.

---
title: MCP Connector
description: Connect an MCP client to Expense Budget Tracker with OAuth and safely query or update financial data.
---

## Overview

Expense Budget Tracker provides a hosted Model Context Protocol (MCP) connector at:

`https://mcp.expense-budget-tracker.com/mcp`

The endpoint uses Streamable HTTP and OAuth. Give this URL to an MCP client that supports remote Streamable HTTP servers and OAuth discovery. The authorization flow opens a browser so you can sign in and approve access.

The connector does not use an API key. OAuth access and refresh tokens are the MCP credentials. The long-lived `ApiKey` described in the [Agent API reference](/docs/api/) belongs to a separate direct HTTP integration and is not accepted by the MCP endpoint.

## OAuth discovery and connection

The hosted connector publishes its protected-resource metadata at:

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

That metadata points clients to the authorization server. Its metadata is available at:

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

A compatible client follows this flow:

1. Connect to `https://mcp.expense-budget-tracker.com/mcp` and discover the protected-resource metadata.
2. Register dynamically as a public OAuth client. A client secret is not used.
3. Start the Authorization Code flow and open the authorization URL in the user's browser.
4. Use PKCE for every authorization request. The only supported code challenge method is `S256`.
5. Request `expenses:read`. Add `expenses:write` only when the client needs to call `sql_execute`.
6. Exchange the authorization code for access and refresh tokens, then let the client refresh access when needed.

Do not copy tokens into prompts, chat history, source files, or logs. Store them only in the MCP client's credential storage.

## Scopes

- `expenses:read` is required. It allows workspace discovery, schema inspection, and read-only queries.
- `expenses:write` is optional. It separately allows the destructive `sql_execute` tool.

Use the smallest scope set that supports the task. A client that only analyzes or reports on data should request `expenses:read` without `expenses:write`.

## Tools

### `list_workspaces`

Lists the workspaces available to the signed-in user. Use the returned workspace identifier to make the target explicit before reading or changing data.

### `get_schema`

Returns the relations and columns exposed to MCP for the selected workspace. Call it before writing SQL instead of assuming table or column names.

### `sql_query`

Runs one restricted, read-only SQL query in the selected workspace. The query path is also enforced by a read-only database boundary. Results are capped at 100 rows, and execution has a 20-second deadline.

### `sql_execute`

Runs restricted SQL that changes data in the selected workspace. This tool is destructive and requires the separate `expenses:write` scope. Confirm the workspace and review the exact statement before approving a call.

The MCP server as a whole is not read-only because it exposes `sql_execute`. Read-only guarantees apply specifically to `sql_query` and its database boundary.

## Safe usage

1. Call `list_workspaces` and confirm the intended workspace with the user.
2. Call `get_schema` before generating SQL.
3. Use `sql_query` for inspection, totals, reconciliation, and reports.
4. Request `expenses:write` only for a task that must change data.
5. Before `sql_execute`, show the exact statement and its expected effect, then confirm the workspace again.
6. After a write, use `sql_query` to verify the result.

The server restricts the SQL surface and exposed relations. These controls complement, rather than replace, careful review of generated SQL.

## Limits

- maximum 100 rows in SQL results
- 20-second execution deadline
- access is limited to the signed-in user's available workspaces
- `sql_query` uses a restricted SQL surface and a read-only database boundary
- `sql_execute` requires `expenses:write` in addition to the mandatory read scope

## Privacy and self-hosting

An authorized MCP client can read financial data and, with `expenses:write`, change it. Review the [Privacy Policy](/privacy/) and the client's own data-handling policy before connecting it.

The hosted URLs above apply only to the managed Expense Budget Tracker service. For your own deployment, start with the [Self-Hosting Guide](/docs/self-hosting/) and configure the MCP endpoint and OAuth metadata for your domains. The implementation is available in the [source repository](https://github.com/kirill-markin/expense-budget-tracker).

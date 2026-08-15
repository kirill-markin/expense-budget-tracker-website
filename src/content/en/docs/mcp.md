---
title: MCP Guide
description: Connect a compatible AI client to Expense Budget Tracker through the hosted remote MCP server and understand its OAuth scopes, tools, and data boundaries.
---

Expense Budget Tracker exposes one hosted remote MCP endpoint:

```text
https://mcp.expense-budget-tracker.com/mcp
```

Use this same URL in every compatible client. The hosted server uses Streamable HTTP and OAuth 2.1; it does not accept API keys at this endpoint.

## Supported Clients

The endpoint works with ChatGPT and other MCP clients that support all of the following:

- remote MCP servers over Streamable HTTP;
- OAuth 2.1 authorization-code flow with PKCE; and
- OAuth Dynamic Client Registration.

Claude, Codex, OpenClaw, and other clients can use the same endpoint when their current version supports that remote transport and authentication flow. A client that supports only local `stdio` servers cannot connect to the hosted endpoint directly.

## Connect And Authorize

1. Add `https://mcp.expense-budget-tracker.com/mcp` as a custom remote MCP server in your client.
2. The client discovers the protected resource and authorization server, then registers its name and redirect URLs through Dynamic Client Registration.
3. Your browser opens the Expense Budget Tracker sign-in and consent flow. Sign in, review the client name and requested scopes, and approve only the access you want to grant.
4. The client exchanges the authorization code using PKCE and connects with short-lived access credentials. You do not copy a token into the client.
5. Ask the client to call `list_workspaces` before it reads or changes financial data.

The authorization server can grant these scopes:

| Scope | Access |
| --- | --- |
| `expenses:read` | List workspaces, inspect the allowed schema, and query financial data. |
| `expenses:write` | Run an allowed `INSERT`, `UPDATE`, or `DELETE` through `sql_execute`. Write access is separate from read access. |

A read-only connection receives `expenses:read`. A write-enabled connection receives both `expenses:read` and `expenses:write`.

## Tools

| Tool | Purpose | Boundary |
| --- | --- | --- |
| `list_workspaces` | Lists every workspace available to the signed-in user. | Read-only; requires `expenses:read`. |
| `get_schema` | Returns allowed relations, columns, constraints, limits, and agent guidance for one workspace. | Read-only; requires `expenses:read`. |
| `sql_query` | Runs exactly one policy-approved `SELECT` or `WITH ... SELECT`. | Read-only transaction under the restricted reader role; requires `expenses:read`. |
| `sql_execute` | Runs exactly one policy-approved `INSERT`, `UPDATE`, or `DELETE`. | Changes financial data and is not idempotent; requires `expenses:write`. |

The tools operate only on Expense Budget Tracker data. They cannot browse the web, access another service, run DDL, or bypass the relations and columns returned by `get_schema`.

## Select A Workspace

Call `list_workspaces` first. If exactly one workspace is returned, `workspaceId` may be omitted from the other calls. If more than one workspace is available, choose one of the returned IDs and pass that `workspaceId` explicitly to every `get_schema`, `sql_query`, and `sql_execute` call. The server rejects an ambiguous or inaccessible workspace instead of guessing.

Call `get_schema` after choosing the workspace and before composing SQL. The [API reference](/docs/api/) owns the detailed relation and SQL contract; this guide describes only the MCP connection and safety model.

## Read And Write Boundaries

Use `sql_query` for inspection and reporting. Use `sql_execute` only after the requested mutation is clear and the user has approved it. Because mutations are not idempotent, do not blindly retry an uncertain write: query the resulting state first, then retry only if the change is confirmed absent.

Workspace isolation is enforced server-side with Postgres row-level security and restricted database roles. OAuth scopes, workspace membership, the SQL policy, statement deadlines, and response-row limits are enforced by the service rather than left to the AI client.

## Privacy, Revocation, And Help

An AI client is a separate third party. It may process or retain prompts and tool results under its own terms and privacy policy. Review that policy before connecting financial data. The Expense Budget Tracker [privacy policy](/privacy/) explains what the hosted service processes and stores.

Revoke a connected MCP client from **Settings > Agent Access** in the hosted app. Revocation invalidates that connection's access and refresh credentials. For connection problems, use the [support page](/support/).

## Related Resources

- [API reference](/docs/api/)
- [Privacy policy](/privacy/)
- [Terms of service](/terms/)
- [Support](/support/)
- [Self-hosting guide](/docs/self-hosting/)
- [Source code](https://github.com/kirill-markin/expense-budget-tracker)

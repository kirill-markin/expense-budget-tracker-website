---
title: Support
description: Support and security-reporting guidance for Expense Budget Tracker, including the hosted MCP service.
slug: support
sections:
  - type: simple_markdown_page
---

## Hosted Service And MCP Support

For help with the hosted app, an account, OAuth authorization, or the public MCP server, email [markinkirill@gmail.com](mailto:markinkirill@gmail.com). Support is provided on a best-effort basis; response times are not guaranteed.

Include only the diagnostic details needed to investigate:

- the client name and version;
- the date, time, and time zone of the failure;
- the endpoint or page involved;
- the OAuth step or MCP tool name;
- the exact sanitized error and request ID, if one was shown; and
- what you expected and what happened instead.

Never send passwords, session cookies, OAuth codes, access or refresh tokens, API keys, raw financial records, or an unredacted request body.

## Security Reports

Do not disclose a suspected vulnerability in a public GitHub issue. Email [markinkirill@gmail.com](mailto:markinkirill@gmail.com) with the subject **Expense Budget Tracker security report** and a minimal, sanitized reproduction. Do not include live credentials or financial data. If access may have been exposed, first revoke the connection from **Settings > Agent Access** and rotate any other affected credential.

## Bugs, Self-Hosting, And Community Questions

Use the [GitHub issue tracker](https://github.com/kirill-markin/expense-budget-tracker/issues) for reproducible product bugs, self-hosting questions, and community discussion that can be public. Search existing issues first and remove private data from logs and screenshots. The [self-hosting guide](/docs/self-hosting/) and [source repository](https://github.com/kirill-markin/expense-budget-tracker) cover deployment and development questions.

## Before Reporting An MCP Problem

Confirm that your client supports remote MCP over Streamable HTTP, OAuth 2.1 authorization code with PKCE, and Dynamic Client Registration. Use the universal endpoint exactly as shown in the [MCP guide](/docs/mcp-connector/), then retry once after reconnecting. If the problem remains, send the sanitized details listed above.

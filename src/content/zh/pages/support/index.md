---
title: 支持
description: Expense Budget Tracker 的支持与安全报告说明，包括托管 MCP 服务。
slug: support
sections:
  - type: simple_markdown_page
---

## 托管服务与 MCP 支持

如需托管应用、账户、OAuth 授权或公共 MCP 服务器方面的帮助，请发送邮件至 [markinkirill@gmail.com](mailto:markinkirill@gmail.com)。支持按实际能力提供，不保证具体响应时间。

请仅提供排查所需的信息：

- 客户端名称和版本；
- 故障发生的日期、时间和时区；
- 涉及的端点或页面；
- OAuth 步骤或 MCP 工具名称；
- 经过脱敏的准确错误信息和请求 ID（如有）；
- 预期结果和实际发生的情况。

切勿发送密码、会话 Cookie、OAuth 授权码、访问令牌、刷新令牌、API 密钥、原始财务记录或未经脱敏的完整请求正文。

## 安全报告

不要在公开的 GitHub issue 中披露疑似漏洞。请以 **Expense Budget Tracker security report** 为邮件主题，将最小化且经过脱敏的复现步骤发送至 [markinkirill@gmail.com](mailto:markinkirill@gmail.com)。不要包含有效凭据或财务数据。如果访问权限可能已经泄露，请先前往**设置 > 智能体访问**撤销连接，并轮换其他受影响的凭据。

## 缺陷、自托管与社区问题

对于可以公开的可复现缺陷、自托管问题和社区讨论，请使用 [GitHub issue 跟踪器](https://github.com/kirill-markin/expense-budget-tracker/issues)。提交前先搜索现有 issue，并从日志和截图中删除私密数据。[自托管指南](/zh/docs/self-hosting/)和[源代码仓库](https://github.com/kirill-markin/expense-budget-tracker)提供部署与开发资料。

## 报告 MCP 问题前

请确认客户端支持通过 Streamable HTTP 连接远程 MCP、带 PKCE 的 OAuth 2.1 授权码流程，以及动态客户端注册。严格按照 [MCP 指南](/zh/docs/mcp-connector/)填写统一端点，重新连接后只重试一次。如果问题仍然存在，请发送上面列出的脱敏信息。

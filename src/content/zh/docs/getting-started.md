---
title: 开始使用
description: 几分钟内即可注册云端版本，或自行部署一个实例。
---

## 云端版本

最快的上手方式，是直接使用托管的云端版本：

1. 打开 [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. 使用你的邮箱注册（通过免密码的一次性验证码，即 OTP）
3. 在网页版应用中开始记录支出
4. 对于支持 MCP 的客户端，请添加 `https://mcp.expense-budget-tracker.com/mcp`，并在浏览器中授权访问
5. 对于终端智能体或直接 HTTP 客户端，请从 `GET https://api.expense-budget-tracker.com/v1/` 开始

无需安装，也不用配置服务器。你的数据会通过 Postgres 中基于工作区的行级安全策略相互隔离。

## 智能体与程序访问

同一个托管账户可同时用于以下入口：

- 网页界面：`https://app.expense-budget-tracker.com`
- 托管在 `https://mcp.expense-budget-tracker.com/mcp` 的 [MCP 连接器](/zh/docs/mcp-connector/)，通过浏览器 OAuth 授权
- 从 `GET https://api.expense-budget-tracker.com/v1/` 开始的 [Agent API 设置](/docs/agent-setup/)，随后使用 `Authorization: ApiKey <key>` 发起直接 HTTP 请求

## 自托管

如果你希望自行运行实例，请参阅[自托管指南](/docs/self-hosting/)。

## 演示模式

应用内置演示模式。点击页眉中的 `All/Demo` 切换按钮，即可用示例数据体验界面，无需数据库。

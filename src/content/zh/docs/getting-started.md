---
title: 开始使用
description: 几分钟内即可注册云端版本，或自行部署一个实例。
---

## 云端版本

最快的上手方式，是直接使用托管的云端版本：

1. 打开 [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. 使用你的邮箱注册（通过免密码的一次性验证码，即 OTP）
3. 在网页版应用中开始记录支出
4. 如果你想连接 Claude Code、Codex 或 OpenClaw，请将 `https://api.expense-budget-tracker.com/v1/` 作为 API 地址提供给智能体

无需安装，也不用配置服务器。你的数据会通过 Postgres 中基于工作区的行级安全策略相互隔离。

## 智能体与程序访问

同一个托管账户可同时用于以下入口：

- 网页界面：`https://app.expense-budget-tracker.com`
- 面向智能体的原生接入入口：`GET https://api.expense-budget-tracker.com/v1/`
- 使用 `Authorization: ApiKey <key>` 的直接 HTTP 客户端

## 自托管

如果你希望自行运行实例，请参阅[自托管指南](/docs/self-hosting/)。

## 演示模式

应用内置演示模式。点击页眉中的 `All/Demo` 切换按钮，即可用示例数据体验界面，无需数据库。

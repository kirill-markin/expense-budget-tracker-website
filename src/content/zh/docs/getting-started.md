---
title: 开始使用
description: 几分钟内注册云版本，或自行搭建一个实例。
---

## 云版本

最快的开始方式是使用托管云版本：

1. 打开 [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. 使用你的邮箱注册（免密码的一次性验证码，即 OTP）
3. 在 Web 应用中开始记录支出
4. 如果你想连接 Claude Code、Codex 或 OpenClaw，把 `https://api.expense-budget-tracker.com/v1/` 提供给智能体

无需安装，也无需配置服务器。你的数据会通过 Postgres 中按工作区划分的行级安全策略实现隔离。

## 智能体和程序访问

同一个托管账户可同时用于：

- Web 界面：`https://app.expense-budget-tracker.com`
- 面向智能体的原生接入入口：`GET https://api.expense-budget-tracker.com/v1/`
- 使用 `Authorization: ApiKey <key>` 的直接 HTTP 客户端

## 自托管

如果你希望运行自己的实例，请参阅[自托管指南](/docs/self-hosting/)。

## 演示模式

应用内置了演示模式。点击页眉中的 All/Demo 切换按钮，即可使用示例数据体验界面，无需数据库。

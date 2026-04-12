---
title: 隐私政策
description: Expense Budget Tracker 的隐私政策。
slug: privacy
sections:
  - type: legal_page
    lastUpdated: 2026年3月
---
## 我们收集什么

当你使用云端版本时，我们会存储你输入的财务数据（交易、预算、账户名称）以及用于身份验证的电子邮箱地址。自托管实例不会向我们发送任何数据。

## 运营方

托管版 Expense Budget Tracker 服务的运营方为 SAMO DANNI EOOD（VAT: BG207395566）。Expense Budget Tracker 由 Kirill Markin 创建，[kirill-markin.com](https://kirill-markin.com/) 是与同一创建者及产品生态相关的个人网站。

## 我们如何使用你的数据

你的财务数据仅用于提供服务。我们不会出售、共享你的数据，也不会将其用于广告。每个工作区都通过 Postgres 行级安全机制相互隔离。

## 数据存储

云端数据存储在 eu-central-1 区域的 AWS RDS（Postgres）中，并进行每日自动备份。数据在静态存储和传输过程中都会被加密。

## Cookie

我们使用 `session` Cookie 进行身份验证（HttpOnly、Secure、SameSite=Lax）。我们不使用跟踪 Cookie，也不使用第三方分析工具。

## 数据删除

你可以随时在应用的设置中删除账户及其所有相关数据。对于自托管实例，你可以直接控制数据库。

## 开源

整个代码库均为开源。你可以审计应用究竟如何处理你的数据。

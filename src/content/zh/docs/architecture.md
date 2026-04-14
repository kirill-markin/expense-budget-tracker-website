---
title: 架构
description: 系统总览、数据模型、多币种设计与认证方式。
---

## 系统概览

```
浏览器界面  -->  Next.js Web 应用  -->  Postgres（RLS）
                         |                   ^
                         v                   |
                      认证服务 ----------------+
                         ^
                         |
               通过 API Gateway 接入的程序化客户端
                         ^
                         |
                 Worker（汇率抓取器） ----------
```

五个组件，共用同一个数据库：

1. **web**：包含仪表盘界面和 API 路由的 Next.js 应用
2. **auth**：运行在认证域名上的邮箱 OTP 登录与智能体接入引导服务
3. **sql-api**：部署在 API Gateway 后方、供程序化客户端调用的 AWS Lambda
4. **worker**：负责从 ECB、CBR 和 NBS 抓取每日汇率
5. **Postgres**：启用行级安全（RLS）的唯一事实来源

## 数据模型

- **ledger_entries**：账户中的每一笔资金变动各占一行，包括收入、支出和转账
- **budget_lines**：采用仅追加模型的预算单元格记录，读取时以后写入值为准
- **budget_comments**：附加到预算单元格上的仅追加备注
- **workspace_settings**：报表币种和工作区级设置
- **account_metadata**：账户级元数据，例如流动性分类
- **exchange_rates**：查询时换算所用的每日汇率
- **workspaces** / **workspace_members**：用于多租户隔离
- **accounts**：根据 `ledger_entries` 派生出的视图

## 多币种

所有金额都按原币存储。报表币种转换发生在读取时，通过 SQL 关联 `exchange_rates` 完成，不做任何有损的预转换。

## 认证

认证模式由 `AUTH_MODE` 环境变量控制：

- `none`：不启用认证，使用单一本地工作区
- `cognito`：通过 AWS Cognito 提供基于邮箱 OTP 的无密码登录，并开放注册

对于程序化客户端，公开的发现入口为 `GET /v1/`。面向智能体的接入流程会在认证域名上完成邮箱 OTP 验证，返回长期有效的 `ApiKey`，之后再通过 API Gateway 后方的机器 API 执行 SQL。

每个用户都会得到隔离的工作区。RLS 策略会在每次查询时检查成员身份，包括面向程序化客户端发出的 SQL 请求。

---
title: 架构
description: 系统概览、数据模型、多币种设计与认证模型。
---

## 系统概览

```
浏览器界面  -->  Next.js Web 应用  -->  Postgres（RLS）
                         |                   ^
                         v                   |
                    认证服务 -----------------+
                         ^
                         |
               经 API Gateway 访问的机器客户端
                         ^
                         |
                  Worker（汇率抓取） ----------
```

五个组件，共用一个数据库：

1. **web**：提供仪表盘界面和 API 路由的 Next.js 应用
2. **auth**：运行在认证域名上的邮箱 OTP 登录与智能体接入服务
3. **sql-api**：位于 API Gateway 后方、面向机器客户端的 AWS Lambda
4. **worker**：从 ECB、CBR 和 NBS 拉取每日汇率
5. **Postgres**：启用行级安全（RLS）的单一事实来源

## 数据模型

- **ledger_entries**：每条账户资金变动对应一行记录，包括收入、支出和转账
- **budget_lines**：仅追加的预算单元格记录，以最后一次写入结果为准
- **budget_comments**：附加在预算单元格上的仅追加备注
- **workspace_settings**：报表货币和工作区级设置
- **account_metadata**：账户级元数据，例如流动性分类
- **exchange_rates**：用于查询时换算的每日外汇汇率
- **workspaces** / **workspace_members**：多租户隔离
- **accounts**：由 `ledger_entries` 派生出的视图

## 多币种

所有金额都以原始货币存储。转换为报表货币时，会在读取阶段通过 SQL 关联 `exchange_rates`。不会进行有损的预先转换。

## 认证

通过 `AUTH_MODE` 环境变量支持两种模式：

- `none`：无认证，单一本地工作区
- `cognito`：基于 AWS Cognito 的无密码邮箱 OTP 登录，开放注册

对于机器客户端，公开的发现入口是 `GET /v1/`。智能体接入流程在认证域名上通过邮箱 OTP 完成，返回长期有效的 `ApiKey`，随后通过 API Gateway 提供的机器 API 执行 SQL。

每个用户都会获得隔离的工作区。RLS 策略会在每一次查询时检查成员身份，包括面向机器客户端的 SQL 请求。

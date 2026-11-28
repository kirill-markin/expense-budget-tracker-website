---
title: 系統架構
description: 系統概覽、資料模型、多幣別設計和身分驗證模式。
---

## 系統概覽

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

以下六個元件共用一個資料庫。

1. **web** — 提供儀表板介面和 API 路由的 Next.js 應用程式
2. **auth** — 在驗證網域提供一次性電子郵件驗證碼登入及代理程式設定
3. **sql-api** — 由 API Gateway 接收程式用戶端請求，再交給 AWS Lambda 處理
4. **mcp** — 託管 MCP 端點使用專用的 AWS Lambda 和 API Gateway HTTP API
5. **worker** — 從 ECB、CBR 和 NBS 擷取每日匯率
6. **Postgres** — 採用資料列層級安全性，是系統資料的權威來源

## 資料模型

- **ledger_entries** — 每筆帳戶資金異動佔一列，包括收入、支出和轉帳
- **budget_lines** — 預算儲存格的變更只會新增記錄，以最後一次寫入為準
- **budget_comments** — 預算儲存格的備註，只會新增記錄
- **workspace_settings** — 報表幣別及工作空間層級的設定
- **account_metadata** — 各帳戶的中繼資料，例如流動性分類
- **exchange_rates** — 查詢時用來換算的每日匯率
- **workspaces** / **workspace_members** — 多租戶隔離
- **accounts** — 根據帳本記錄產生的檢視表

## 多幣別

所有金額都按原始幣別儲存。讀取時，SQL 查詢會聯結 `exchange_rates`，再將金額換算成報表幣別，避免預先換算造成的精度損失。

## 身分驗證

環境變數 `AUTH_MODE` 可設定兩種模式。

- `none` — 無須身分驗證，只有一個本機工作空間
- `cognito` — 透過 AWS Cognito 以電子郵件一次性驗證碼登入，開放註冊

程式用戶端的公開探索入口是 `GET /v1/`。設定代理程式時，先在驗證網域使用電子郵件一次性驗證碼，取得長期有效的 ApiKey，接著透過 API Gateway 提供的 API 執行 SQL。

支援 MCP 的用戶端另行連到 `https://mcp.expense-budget-tracker.com/mcp`。這條路徑由專用的 API Gateway HTTP API 和 MCP Lambda 處理，互動式授權則在瀏覽器中透過驗證網域的 OAuth 完成。

每位使用者都有獨立的工作空間。每次查詢都會由 RLS 檢查使用者是否為該工作空間的成員，程式用戶端發出的 SQL 請求也一樣。

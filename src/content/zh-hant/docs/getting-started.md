---
title: 快速入門
description: 註冊雲端版，或在幾分鐘內架設自己的服務。
---

## 雲端版

最快的入門方式是使用託管雲端版。

1. 前往 [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. 用電子郵件註冊，用收到的一次性驗證碼登入，無須密碼
3. 在網頁版開始記錄支出
4. 如使用支援 MCP 的用戶端，加入 `https://mcp.expense-budget-tracker.com/mcp`，並在瀏覽器中授權存取
5. 如使用終端機代理程式或直接呼叫 HTTP 的用戶端，請從 `GET https://api.expense-budget-tracker.com/v1/` 開始

無須安裝軟體或設定伺服器。Postgres 的資料列層級安全性會按工作空間隔離你的資料。

## 透過代理程式或其他程式存取

下列服務可使用同一個雲端帳號。

- `https://app.expense-budget-tracker.com` 的網頁介面
- `https://mcp.expense-budget-tracker.com/mcp` 的託管 [MCP 連接器](/zh-hant/docs/mcp-connector/)，透過瀏覽器中的 OAuth 授權
- [Agent API 設定](/zh-hant/docs/agent-setup/)，從 `GET https://api.expense-budget-tracker.com/v1/` 開始，接著以 `Authorization: ApiKey <key>` 直接發送 HTTP 請求

## 自行架設

如要執行自己的服務，請參閱[自行架設指南](/zh-hant/docs/self-hosting/)。

## 示範模式

應用程式內建示範模式。在頁首選擇「示範」（Demo），即可用範例資料試用介面，無須資料庫。需要時可切回「全部」（All）。

---
title: MCP 連接器
description: 透過 OAuth 將 MCP 用戶端連到 Expense Budget Tracker，並安全地查詢或更新財務資料。
---

## 概覽

Expense Budget Tracker 在以下網址提供託管的 Model Context Protocol（MCP）連接器。

`https://mcp.expense-budget-tracker.com/mcp`

此端點使用 Streamable HTTP 和 OAuth。請將網址交給支援遠端 Streamable HTTP 伺服器和 OAuth 探索的 MCP 用戶端。授權流程會開啟瀏覽器，讓你登入並核准存取。

MCP 連接器使用 OAuth 存取權杖和更新權杖作為憑證。[Agent API 參考](/zh-hant/docs/api/)所述的長期有效 `ApiKey` 只適用於透過 HTTP 直接呼叫 Agent API。

## OAuth 探索與連線

託管連接器在這個網址公布受保護資源的中繼資料。

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

這份中繼資料會指向授權伺服器。授權伺服器的中繼資料可在以下網址取得。

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

相容的用戶端會依序執行下列步驟。

1. 連到 `https://mcp.expense-budget-tracker.com/mcp`，取得受保護資源的中繼資料。
2. 動態註冊為公開 OAuth 用戶端，無須用戶端密鑰。
3. 啟動授權碼流程，在使用者的瀏覽器中開啟授權網址。
4. 每次授權請求都使用 PKCE。挑戰碼（code challenge）只支援 `S256`。
5. 申請 `expenses:read` 權限。只有在用戶端需要呼叫 `sql_execute` 時才加入 `expenses:write`。
6. 用授權碼換取存取權杖和更新權杖，再讓用戶端按需更新存取權。

請勿把權杖複製到提示文字、聊天記錄、原始碼檔案或記錄檔。只將權杖存放在 MCP 用戶端的憑證儲存區。

## 授權範圍

- `expenses:read` 是必要權限，可列出工作空間、檢視結構描述和執行唯讀查詢。
- `expenses:write` 是選用權限，另行授權可新增、修改或刪除資料的 `sql_execute` 工具。

只申請任務所需的權限。僅分析資料或產出報告的用戶端只需申請 `expenses:read`，無須 `expenses:write`。

## 工具

### `list_workspaces`

列出登入使用者可存取的工作空間。讀取或變更資料前，請使用傳回的工作空間識別碼指定目標。

### `get_schema`

傳回所選工作空間開放給 MCP 的關聯和欄位。撰寫 SQL 前先呼叫這項工具，確認資料表和欄位名稱。

### `sql_query`

在選定工作空間執行一條受限制的唯讀 SQL 查詢。此查詢路徑同時受資料庫層級的唯讀限制約束。結果最多傳回 100 列，執行時限為 20 秒。

### `sql_execute`

在選定工作空間執行受限制的 SQL 以變更資料。這項工具可變更或刪除資料，須另行取得 `expenses:write` 權限。核准呼叫前，請先確認工作空間並審查完整陳述式。

MCP 伺服器也提供 `sql_execute` 寫入工具。唯讀保證只適用於 `sql_query` 及其資料庫層級的限制。

## 安全使用方式

1. 呼叫 `list_workspaces`，向使用者確認要操作的工作空間。
2. 產生 SQL 前，先呼叫 `get_schema`。
3. 使用 `sql_query` 檢視資料、計算總額、對帳和製作報告。
4. 只有任務確實需要變更資料時，才申請 `expenses:write`。
5. 呼叫 `sql_execute` 前，先顯示要執行的完整陳述式和預期影響，再次確認工作空間。
6. 寫入後，以 `sql_query` 驗證結果。

伺服器會限制可執行的 SQL 和可存取的關聯。產生的 SQL 仍需仔細審查。

## 限制

- SQL 結果最多 100 列
- 執行時限為 20 秒
- 僅能存取已登入使用者可用的工作空間
- `sql_query` 只能使用受限制的 SQL，並受資料庫層級的唯讀限制
- `sql_execute` 除了必要的讀取權限，還需要 `expenses:write`

## 隱私與自行架設

取得授權的 MCP 用戶端可讀取財務資料，如另有 `expenses:write` 權限，也可變更資料。連線前請先查閱[隱私權政策](/zh-hant/privacy/)和用戶端自己的資料處理政策。

上述網址只供 Expense Budget Tracker 的託管服務使用。若要自行部署，請從[自行架設指南](/zh-hant/docs/self-hosting/)開始，在自己的網域設定 MCP 端點和 OAuth 中繼資料。實作可在[原始碼儲存庫（英文）](https://github.com/kirill-markin/expense-budget-tracker)查閱。

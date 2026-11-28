---
title: API 參考
description: 代理程式初始設定及 SQL API 參考，供程式存取你的財務資料。
---

## 概覽

Expense Budget Tracker 提供一套公開 API，供程式呼叫。

`https://api.expense-budget-tracker.com/v1/`

同一套 API 有兩種使用方式。

1. **由代理程式自行設定**，從 `GET /v1/` 開始
2. **直接使用 HTTP**，搭配現有且長期有效的 ApiKey

所有請求都受 Postgres 資料列層級安全性約束，與網頁版採用相同的規則。

若用戶端支援 MCP，請使用位於 `https://mcp.expense-budget-tracker.com/mcp` 的託管 [MCP 連接器](/zh-hant/docs/mcp-connector/)，並在瀏覽器中透過 OAuth 授權。本頁說明另一套整合方式，說明如何用長期有效的 `ApiKey` 設定 Agent API，以及直接發送 HTTP 請求時應遵循的規格。

## API 探索、原始碼和目前的結構描述

從這裡開始。

`https://api.expense-budget-tracker.com/v1/`

探索回應會告訴代理程式如何啟動身分驗證，以及接下來要呼叫什麼，也會提供 README 和實作原始碼的連結。API 提供以下端點。

- `GET /v1/schema`
- `GET /v1/openapi.json` 和 `GET /v1/swagger.json` 是供相容性檢查使用的端點，會告知用戶端目前未提供 OpenAPI，並引導用戶端查看探索文件及原始碼

若要取得 `/v1/sql/query`、`/v1/sql/execute` 和相容端點 `/v1/sql` 開放存取的確切關聯和欄位清單，請使用 `schema`。

## 由代理程式自行設定

若要讓 Claude Code、Codex、OpenClaw 或其他代理程式自行建立連線，請從探索端點開始，依照伺服器回應提供的動作執行。

### 身分驗證流程

1. `GET https://api.expense-budget-tracker.com/v1/`
2. 讀取回應提供的 `send_code` 動作和 `bootstrapUrl`
3. 以 `POST` 將使用者的電子郵件地址送至 `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. 接收 `otpSessionToken`
5. 向使用者索取電子郵件中的 8 位數驗證碼
6. 以 `POST` 將 `code`、`otpSessionToken` 和 `label` 送至 `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. 接收長期有效的 `ApiKey`
8. 將金鑰儲存在聊天記憶之外
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. 視需要呼叫 `POST https://api.expense-budget-tracker.com/v1/workspaces` 建立工作空間
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. 以 `POST https://api.expense-budget-tracker.com/v1/sql/query` 讀取資料，以 `POST https://api.expense-budget-tracker.com/v1/sql/execute` 送出已核准的寫入

### 驗證標頭

- `Authorization: ApiKey <key>`

### 工作空間選擇

- `POST /v1/workspaces/{workspaceId}/select` 會儲存該 API 金鑰的預設工作空間
- 儲存工作空間後，呼叫 `/v1/sql/query`、`/v1/sql/execute` 和相容端點 `/v1/sql` 時可省略 `X-Workspace-Id`
- 若要只在某次請求覆寫已儲存的工作空間，仍可使用 `X-Workspace-Id: <workspaceId>`
- 若使用者只有一個工作空間，且該金鑰還沒有預設工作空間，API 會自動儲存並使用該工作空間

需要逐步操作說明時，請參閱 [AI 代理程式設定](/zh-hant/docs/agent-setup/)。

## 用現有金鑰直接呼叫 HTTP

指令碼、cron 排程、儀表板和自訂應用程式如已有長期有效的 ApiKey，即可直接呼叫同一套 API。

### 身分驗證

透過 ApiKey 驗證標頭傳送金鑰。

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

僅在金鑰尚未儲存預設工作空間，或這次請求要覆寫已儲存的工作空間時，才需要 `X-Workspace-Id`。

- `Authorization: ApiKey ebta_your_key_here`
- 需要時使用 `X-Workspace-Id: <workspaceId>`

## 端點一覽

- `GET /v1/` — 公開探索文件
- `GET /v1/openapi.json` 和 `GET /v1/swagger.json` — 引導用戶端查找探索文件和原始碼的相容端點，不提供 API 規格
- `GET /v1/me` — 已驗證身分的帳號資訊
- `GET /v1/workspaces` — 列出金鑰持有人可存取的工作空間
- `POST /v1/workspaces` — 建立工作空間
- `POST /v1/workspaces/{workspaceId}/select` — 儲存這把金鑰的預設工作空間
- `GET /v1/schema` — 檢視允許在 SQL 中使用的關聯和欄位
- `POST /v1/sql/query` — 執行一條唯讀 `SELECT` 或 `WITH ... SELECT` 陳述式
- `POST /v1/sql/execute` — 執行一條已核准的 `INSERT`、`UPDATE` 或 `DELETE` 陳述式
- `POST /v1/sql` — 供多條陳述式以原子方式執行的相容端點

## SQL 規則

主要端點將讀取和寫入分開。

- `POST /v1/sql/query` 只接受一條唯讀 `SELECT` 或 `WITH ... SELECT` 陳述式
- `POST /v1/sql/execute` 只接受一條 `INSERT`、`UPDATE` 或 `DELETE` 變更陳述式，包括支援的 `WITH` 寫法
- 相容端點 `POST /v1/sql` 可在限制範圍內將多條陳述式一併執行，全部成功才會生效。只有需要這項特性時才使用

伺服器會封鎖或拒絕以下寫法。

- 在主要的 `/v1/sql/query` 或 `/v1/sql/execute` 端點送出多條陳述式
- `CREATE`、`DROP` 和 `ALTER` 等 DDL
- `BEGIN`、`COMMIT` 和 `ROLLBACK` 等資料庫交易控制陳述式
- `set_config()`
- SQL 註解
- 帶引號的識別字
- 用美元符號定界的字串

伺服器也限制可查詢的關聯。產生 SQL 前，請先用 `/v1/schema` 檢視開放的關聯和欄位。

目前開放下列關聯。

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts`（唯讀）
- `fx_rates_raw`（唯讀）
- `fx_rates_daily`（唯讀）

## 限制

- 每次請求最多傳回 100 列
- 每條資料變更陳述式和每次請求最多影響 100 列
- SQL 請求總時限為 25 秒
- 每把金鑰每秒最多 10 次請求，每天最多 10,000 次請求

## 安全性

- API 金鑰以 SHA-256 雜湊值儲存，系統不會保存明文
- RLS 在資料庫層級強制隔離工作空間
- 你可隨時在應用程式內撤銷金鑰
- 移除工作空間成員時，系統會自動撤銷該成員的所有金鑰

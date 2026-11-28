---
title: AI 代理程式設定
description: 只要將 API 探索網址交給 Claude Code、Codex 或 OpenClaw，代理程式就會依伺服器回應完成設定、驗證 8 位數驗證碼、儲存長期有效的 ApiKey，再開始在你的工作空間執行任務。
---

## 給代理程式的連結

請提供以下網址。

`https://api.expense-budget-tracker.com/v1/`

這是供 AI 代理程式使用的正式公開 API 探索端點。傳回的文件會說明如何開始驗證身分、接下來該呼叫哪些端點、之後採用哪種驗證方式，以及去哪裡查閱目前的結構描述和開源實作。

本指南適用於從終端機或 HTTP 用戶端直接連接 Agent API 的情況。若用戶端支援 MCP，請改用託管 [MCP 連接器](/zh-hant/docs/mcp-connector/)，連到 `https://mcp.expense-budget-tracker.com/mcp`，然後在瀏覽器中完成 OAuth 授權，無須設定 ApiKey。

## 使用者要做什麼

1. 開啟 Claude Code、Codex、OpenClaw，或其他可發送 HTTP 請求的代理程式。
2. 請代理程式使用 `https://api.expense-budget-tracker.com/v1/` 連線至 Expense Budget Tracker。
3. 代理程式詢問電子郵件地址時，提供你在 Expense Budget Tracker 使用的電子郵件地址。
4. 到收件匣查看 8 位數驗證碼。
5. 將驗證碼交給代理程式。
6. 讓代理程式將傳回的 ApiKey 儲存於聊天記憶之外，再繼續處理匯入、查詢或預算任務。

登入過程無須手動複製貼上金鑰。驗證碼核對成功後，代理程式會自行建立連線。

## 代理程式要做什麼

請依下列完整步驟操作。

1. `GET https://api.expense-budget-tracker.com/v1/`
2. 讀取探索回應，依照回應提供的動作執行，避免將後續步驟寫死
3. 以 `POST` 將使用者的電子郵件地址送至回應提供的 `bootstrapUrl`
4. 接收 `otpSessionToken` 和 `verify_code` 動作
5. 向使用者索取電子郵件中的 8 位數驗證碼
6. 以 `POST` 將 `code`、`otpSessionToken` 和連線的 `label` 送至 `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. 接收新的 `ApiKey`
8. 將金鑰儲存於聊天記憶之外，建議使用 `EXPENSE_BUDGET_TRACKER_API_KEY`
9. 以 `Authorization: ApiKey <key>` 呼叫 `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. 如有需要，以 `POST /v1/workspaces` 建立工作空間
12. 以 `POST /v1/workspaces/{workspaceId}/select` 儲存預設工作空間
13. 以 `GET https://api.expense-budget-tracker.com/v1/schema` 檢視允許存取的關聯
14. 以 `POST https://api.expense-budget-tracker.com/v1/sql/query` 讀取資料，以 `POST https://api.expense-budget-tracker.com/v1/sql/execute` 執行已核准的寫入操作

請明確指定工作空間。系統會保留這項設定。呼叫 `POST /v1/workspaces/{workspaceId}/select` 後，系統會記住該 API 金鑰所選的工作空間，因此之後呼叫 `/v1/sql/query` 和 `/v1/sql/execute` 時可省略 `X-Workspace-Id`。若要在某次請求改用另一個工作空間，仍可送出 `X-Workspace-Id`。相容端點 `POST /v1/sql` 只用於需要以原子方式執行多條陳述式的指令碼。一般讀寫請使用各自的端點。

若使用者只有一個工作空間，且該金鑰還沒有預設工作空間，後端會自動儲存並使用該工作空間。

## 代理程式應儲存什麼

`verify-code` 傳回的金鑰長期有效，請將它儲存在聊天記憶之外。

- 若使用者核准寫入檔案，請存入本機的 `.env` 檔案，格式為 `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`
- 如未核准寫入，請在目前的 shell 中匯出 `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`，並請使用者將它存放在能長期保存的位置

已驗證身分的請求使用以下標頭。

- `Authorization: ApiKey <key>`
- 在尚未儲存預設工作空間，或需覆寫已儲存的工作空間時，才使用 `X-Workspace-Id: <workspaceId>`

## 給 AI 代理程式的指示

從以下指令開始。

```bash
curl https://api.expense-budget-tracker.com/v1/
```

接著依伺服器傳回的動作執行。若探索文件已提供後續步驟，請使用文件中的動作。

完成 `verify-code` 後，請安全儲存傳回的 `ApiKey`，再查閱下列端點。

- `/v1/me` 取得帳號資訊
- `/v1/workspaces` 取得可用工作空間
- `/v1/schema` 查閱允許存取的 SQL 關聯和欄位
- 僅在用戶端查找標準規格網址時才呼叫 `/v1/openapi.json` 或 `/v1/swagger.json`。這些端點會傳回探索文件和原始碼的連結，沒有 API 規格

## 使用者可參考的提示詞

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## 設定完成後可以做什麼

- 匯入銀行對帳單或卡片交易匯出檔
- 按現有類別為交易分類
- 拿帳戶餘額和銀行記錄核對
- 按類別、期間、商家或帳戶查詢支出
- 更新下個月的預算項目

如需底層端點和身分驗證的細節，請參閱 [API 參考](/zh-hant/docs/api/)。

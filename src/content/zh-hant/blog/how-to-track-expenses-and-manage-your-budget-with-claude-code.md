---
title: "用 Claude Code 記帳，從連線、匯入對帳單到核對餘額"
description: "用一個連結將 Claude Code 接上 Expense Budget Tracker。預覽並核准對帳單匯入、核對餘額、更新預算，全程無須連結銀行帳戶。"
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "Claude Code 記帳"
  - "Claude 支出追蹤"
  - "適用於 Claude 的記帳工具"
  - "Claude Code 預算管理"
  - "Claude 連接記帳工具"
  - "用 Claude Code 匯入銀行對帳單"
---

一張只有四筆交易的對帳單，即使核對後的差額是 `€0.00`，預算報表仍可能有誤。把一筆 €54.20 的超市購物歸到「旅遊」，帳戶餘額還是完全正確，但食品採買類別的支出就少了 €54.20。

用 Claude Code 記帳時，需要做兩項檢查。帳上資金異動要能對上銀行餘額，各筆交易的分類也要符合你核對過的對帳單。Claude Code 可以解析檔案、計算金額、呼叫 API。帳戶和類別由你決定，預計新增的記錄和實際寫入的內容也要由你審查和核准。

Expense Budget Tracker 在這套流程中不會維持與銀行的直接連線，也沒有上傳對帳單的功能。先自行匯出對帳單，放到 Claude Code 有權讀取的位置，再透過託管的 Agent API 傳送已核准的記錄。若你最在意的是避免長期授權存取銀行資料，可以參閱[不需連結銀行帳戶的預算工具（英文）](/blog/budget-app-without-bank-linking/)，了解這種做法的取捨。

![馬賽克修復師從陶紅色飾帶上取下一塊放錯位置的藍色瓷磚，旁邊的黃銅天平仍保持平衡](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## 用一個探索連結接上 Claude Code

依照 Anthropic 的[官方快速入門（英文）](https://code.claude.com/docs/en/quickstart)安裝並登入 Claude Code。[CLI 參考（英文）](https://code.claude.com/docs/en/cli-reference)說明了工作目錄和額外檔案的存取方式。

在對帳單所在的目錄啟動 `claude`，或用你目前設定支援的方式讓它存取該目錄。接著貼上這段提示詞。

```text
Connect to Expense Budget Tracker from this discovery link:
https://app.expense-budget-tracker.com/api/agent

Fetch it with GET, read the returned JSON, and follow the current action URLs. Do not
guess or hardcode the API flow. Ask me for my Expense Budget Tracker email and start
the email OTP flow.
After that request succeeds, tell me to check spam or junk if the message is not
visible, ask me for the 8-digit code, and follow the returned verification action.

After verification, ask me to approve a persistent storage location for the returned
ApiKey outside chat memory and source control. Load my account context, list my
workspaces, ask me to confirm the target workspace, save it as the default for this
key, and inspect the live schema. Run one small read-only query to confirm the selected
workspace. Do not write financial data.
```

[應用程式網域上的代理程式入口](https://app.expense-budget-tracker.com/api/agent)會傳回最新的 API 探索文件。目前回應提供的 API 基底網址是 `https://api.expense-budget-tracker.com/v1/`，也會提供身分驗證和 SQL 操作的網址。貼上應用程式網域的連結即可，Claude Code 應依照服務回傳的網址操作。

註冊和登入使用同一套電子郵件流程。你提供 8 位數驗證碼後，Claude Code 會收到長期有效的 `ApiKey`。請核准一個具體的儲存位置，例如排除在版本控制之外的機密檔案。請勿將金鑰寫進 `CLAUDE.md` 或提交到儲存庫。[AI 代理程式設定](/zh-hant/docs/agent-setup/)列出了身分驗證和工作空間選擇的完整步驟。

## Agent API 和 MCP 各有一套設定

用 Claude 記帳有兩種整合方式。本文用的是終端機中的 Claude Code 搭配 Agent API。Claude 網頁版和 Claude Desktop 則可使用託管的遠端 MCP 連接器。

| | Claude Code 搭配 Agent API | Claude 網頁版或 Claude Desktop 搭配 MCP |
|---|---|---|
| 適用情境 | 在終端機處理可讀取的本機檔案，直接發送 HTTP 請求 | 在支援 MCP 的 Claude 用戶端中對話 |
| 入口 | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| 身分驗證 | 電子郵件一次性驗證碼，接著使用長期有效的 `ApiKey` | 瀏覽器 OAuth |
| 資料介面 | 探索回應提供的查詢與執行端點 | `sql_query` 和選用的 `sql_execute` 工具 |
| 對帳單存取 | 該次 Claude Code 工作階段可存取的檔案和目錄 | 遠端連接器無法存取本機檔案 |

這兩種方式的憑證無法互用。若使用 Claude 網頁版或桌面版，請參閱 [Claude 記帳工具的 MCP 指南（英文）](/blog/claude-expense-tracker-mcp-connector/)。若任務是從 Claude Code 可讀取的檔案開始，請依下方的 Agent API 流程操作。

分享檔案和選擇部署方式前，還有兩點要留意。

- 模型供應商處理資料的流程與 Expense Budget Tracker 的 API 和資料儲存分開。分享對帳單資料前，請查看 [Claude Code 資料使用說明（英文）](https://code.claude.com/docs/en/data-usage)，以及你所設定的供應商條款。
- [自行架設指南](/zh-hant/docs/self-hosting/)中的本機 Docker Compose 設定會啟動網頁應用程式、身分驗證服務、資料庫和匯率背景工作程序。這套設定不包含本文使用的託管 Agent API。如採用儲存庫中的 AWS 部署方式，則會包含供程式呼叫的公開 API。

## 界定這次匯入的範圍

第一次先用一個帳戶、一種幣別和一個已結束的對帳單期間。CSV 的資料列容易檢查，用起來方便。若用其他匯出格式，先請 Claude Code 確認在目前的環境中讀得到檔案，並顯示解析出的資料列。光看副檔名無法確認檔案是否可用。

請給 Claude Code 以下六項資料。

1. 對帳單的本機路徑。
2. 銀行帳戶及其在記帳工具中的對應帳戶。
3. 帳戶幣別。
4. 入帳日期的起訖範圍。
5. 期初餘額或上一個已核對無誤的餘額。
6. 對帳單的期末餘額。

等交易入帳後再匯入，先排除尚未入帳的交易。保留原始檔，由 Claude Code 另外產生預覽。

你可以在財務資料目錄的本機 `CLAUDE.md` 加上下列規則。

```markdown
# Expense Budget Tracker workflow

- Start from https://app.expense-budget-tracker.com/api/agent and follow discovery.
- Confirm the target workspace and inspect the live schema before writing SQL.
- Use the read action for all inspection and reconciliation.
- Before a write, show the source totals, possible duplicates, exact SQL, and expected rows.
- Wait for my explicit approval of the complete change set.
- Use the write action only for the approved INSERT, UPDATE, or DELETE.
- Verify every write with a fresh read.
- Never invent a balancing entry or silently resolve an uncertain category.
- Keep the ApiKey outside this file and outside source control.
```

再補上長期適用的細節，例如實際帳戶名稱、分類規則、轉帳的記錄方式和報表幣別。本文的範例類別只有在符合你的帳本時才適用。

## 先把對帳單做成完整預覽

確認連線成功後，貼上以下提示詞，並替換方括號中的值。

```text
Import [local statement path] into [tracker account] for [posted start date] through
[posted end date] in [currency]. The opening balance is [amount] and the bank's closing
balance is [amount].

First confirm the selected workspace and inspect the live schema. Use only the read
action to inspect the target account, existing categories, and ledger rows that overlap
the statement period. Confirm that you can read the local file, parse it, and prepare a
complete preview without writing anything.

For every source row, show its source identifier or row number, posted date, signed
amount, currency, target account, proposed transaction type, proposed category, and
duplicate status. Flag transfers, refunds, reimbursements, fees, foreign-currency rows,
unfamiliar counterparties, and uncertain classifications.

Then show the source row count and signed total, all proposed ledger rows, possible
duplicates, the exact SQL you would send, and the expected affected-row count. Stop
and wait for my explicit approval of the complete change set.
```

你核准變更之前，所有資料庫操作都維持唯讀。Claude Code 應查看即時結構描述以確認欄位名稱，找出對應帳戶，再查詢同一日期範圍內的既有記錄。日期和金額相同的交易只能先列為疑似重複。兩筆不同的消費也可能恰好出現在同一天，金額又一樣。

### 四筆交易的範例

假設一份支票帳戶對帳單的期初餘額為 €1,250.00，其中有四筆已入帳交易。

| 列 | 入帳日期 | 說明 | 含正負號的金額 | 建議類型 | 建議類別 | 檢查備註 |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | 薪資 | +€2,000.00 | 收入 | 薪資 | 清楚 |
| 2 | 2026-09-02 | 超市 | −€54.20 | 支出 | 食品採買 | 不熟悉店家時先確認 |
| 3 | 2026-09-03 | 轉至儲蓄帳戶 | −€300.00 | 轉帳 | — | 確認另一個帳戶 |
| 4 | 2026-09-04 | 咖啡店 | −€8.40 | 支出 | 外出用餐 | 清楚 |

四筆含正負號的金額合計 `+€1,637.40`，加上期初餘額 `€1,250.00`，預期期末餘額就是 `€2,887.40`。這個範例一個畫面就看得完。即使匯入的資料更多，預覽也要包含來源文件的每一列，並標明所有不確定之處。

在自己帳戶之間移動資金屬於轉帳，請先確認另一個帳戶。退款和收回代墊款也要保留各自正確的交易類型。如果不確定應歸入哪個類別，先標記起來等你決定。

### 核准一組確認過的變更

核對工作空間、帳戶、日期範圍、筆數、按正負號加總的金額、疑似重複項目和分類。核准的對象應是這份具體的預覽和 SQL，避免只說「全部匯入」。

Agent API 將讀取和寫入分開。Claude Code 用探索回應提供的讀取動作執行一條 `SELECT` 或 `WITH ... SELECT`，只有明確取得核准後，才用寫入動作執行 `INSERT`、`UPDATE` 或 `DELETE`。資料表和欄位以即時結構描述為準，[API 參考](/zh-hant/docs/api/)說明了 SQL 規格和各項限制。

### 大量新增或更新前先試跑

執行大批量的 `INSERT` 或 `UPDATE` 前，探索回應會要求代理程式先用相同寫法的 SQL 試跑少量具代表性的資料。`INSERT` 可直接指定 1–3 筆資料，`UPDATE` 則先針對一筆。你核准過的變更集涵蓋試跑和剩餘資料列。

試跑成功後，Claude Code 應立即依序分批處理，每批最多 100 筆，並逐批驗證。若已核准 247 筆匯入資料，先試跑 3 筆，剩下的批次就是 100、100 和 44 筆。如範圍變動、出現新的疑問或執行失敗，就需要重新核准。原先核准範圍內的例行批次可繼續執行。

受限制的 SQL 不支援 `ON CONFLICT`，重複項目要明確處理。每次讀取最多傳回 100 列。Claude Code 應檢查回應標示的筆數和是否截斷，用 SQL 加總金額，再縮小查詢範圍並指定排序，分批核對明細。回應遭截斷時，還有資料需要檢查。

### 重新讀取已儲存的資料列

API 回報成功，表示請求已執行。要確認儲存值是否符合預覽，請重新查詢受影響的帳戶和期間，並比對下列項目。

- 新增筆數
- 日期、含正負號的金額和幣別
- 交易所屬帳戶
- 交易類型和類別
- 疑似重複項目
- 各批次合計金額和整份對帳單的總額

如有出入，先回到唯讀查詢找出原因。先確認要做的具體修正，再進行下一次寫入。[銀行對帳單匯入指南（英文）](/blog/how-to-import-bank-statements-into-an-expense-tracker/)有更多關於期間重疊、退款和轉帳的說明。

## 分開核對帳戶餘額和交易分類

核對餘額時，要看已儲存的資金異動能否對上同一入帳期間的銀行期末餘額。

一般存款帳戶可用以下算式。

**預期期末餘額 = 期初餘額 + 已入帳流入金額 − 已入帳流出金額**

如果每筆金額都已標上正負號，可以直接加總。

**預期期末餘額 = 期初餘額 + 已入帳的含正負號金額合計**

信用卡等負債帳戶可能採用不同的正負號慣例。Claude Code 應先說明它確認到的慣例，再比較餘額。

接著使用這段提示詞。

```text
Use the read action only. Reconcile [account] for [posted start date] through [posted
end date] against the bank closing balance of [amount and currency]. State the opening
boundary, the sign convention, the stored row count, and the signed movement total.

Show expected closing balance, bank closing balance, and the exact difference. If the
difference is not zero, list candidate missing, duplicated, excluded, wrong-date, or
mis-signed rows. Do not insert a balancing entry and do not change any data.

After the balance check, review category totals separately. List uncategorized rows,
transfer rows counted as spending, and categories that differ from the approved preview.
```

在四筆交易的範例中，`€1,250.00 + €1,637.40 = €2,887.40`。若銀行的期末餘額也是 €2,887.40，餘額差就是 `€0.00`。

差額為零，表示帳本算出的餘額和銀行在同一期間的期末餘額相符。把 €54.20 的超市消費從「食品採買」移到「旅遊」，餘額差仍是零，兩個類別的合計金額卻各有 €54.20 的變動。因此各類別的總額還得另外核對。

差額不為零時，請檢查期初餘額、遺漏或重複的記錄、轉帳、未入帳項目、正負號、日期和幣別。請勿為了消除差額就憑空新增一筆交易來補差額。[餘額核對指南（英文）](/blog/how-to-reconcile-your-budget-with-your-bank-balance/)說明了如何逐步找出原因。

## 對帳完成後再更新預算

確認讀回的資料正確、帳戶對得上、各類別加總也合理，再處理預算。用 Claude Code 管理預算時，可以請它比較實際收支和 `budget_lines`，再提出變更建議。某個月的異常情況不一定要納入下個月的計畫。

```text
Confirm the workspace and inspect the current schema. Use the read action to compare
actual income and spending for [complete period] with the matching budget lines. Exclude
transfers using the stored transaction type and show uncategorized activity separately.

For each proposed budget change, show the category, current amount, actual amount,
proposed amount, difference, and reason. Then show the exact SQL and expected affected
rows. Do not write until I approve specific lines.

After approval, use the write action only for those lines and verify them with a fresh
read. Report any stored value that differs from the approved proposal.
```

大筆支出可能只是單次事件。看似超支，也有可能是轉帳或退款分錯了類。Claude Code 可以算出差額並準備 SQL，下個月的預算金額仍由你決定。

## 每份對帳單都照同一順序處理

每份對帳單都依下列順序處理。

1. 從 `https://app.expense-budget-tracker.com/api/agent` 開始，依探索回應執行。
2. 載入帳號資訊、確認工作空間，並檢視即時結構描述。
3. 給 Claude Code 一份可讀取的對帳單，並明確提供期初與期末餘額。
4. 讀取同一期間的帳本資料，產生完整的匯入預覽。
5. 核准一組明確的變更。
6. 大量新增時先試跑 1–3 筆，再依序分批處理，每批最多 100 筆。
7. 逐批讀回已儲存的資料，與預覽比對。
8. 核對帳戶餘額與銀行期末餘額，切勿為了補差額而新增分錄。
9. 即使餘額差是零，仍要核對各類別的合計金額。
10. 另外準備、核准並驗證預算項目的變更。

先用一個帳戶和一個已結束的期間。對帳完成且預算也核對過後，再用同樣的流程處理下一個帳戶。重複的檔案處理和 API 操作交給 Claude Code，每項財務決定則在改動記錄前先由你過目。

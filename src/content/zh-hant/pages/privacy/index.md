---
title: 隱私權政策
description: Expense Budget Tracker 的隱私權政策。
slug: privacy
sections:
  - type: legal_page
    lastUpdated: 2026 年 8 月
---
## 我們收集哪些資料

使用雲端版時，我們會儲存你輸入的財務資料，包括交易、預算和帳戶名稱，也會儲存用於身分驗證的電子郵件地址。自行架設的版本不會將任何資料傳給我們。

## 營運商

Expense Budget Tracker 的託管服務由 SAMO DANNI EOOD（VAT：BG207395566）營運。Expense Budget Tracker 由 Kirill Markin 開發，[kirill-markin.com](https://kirill-markin.com/) 是他的個人網站，與此產品相關。

本政策適用於我們營運的託管網站、應用程式、API 和遠端 MCP 服務。自行架設的版本由各自的營運者管理。

## 我們如何使用你的資料

你的財務資料僅用於提供服務。我們不會販售資料，也不會將資料用於廣告。只有在你指示服務提供資料時，例如授權 MCP 連線，我們才會向第三方用戶端揭露資料。每個工作空間都由 Postgres 的資料列層級安全性隔離。

## MCP 和第三方 AI 用戶端

將 AI 用戶端連到託管 MCP 服務時，Expense Budget Tracker 會處理 OAuth 授權請求、呼叫的工具及其參數、選定的工作空間，以及完成讀取請求或套用已核准變更所需的財務資料。透過 MCP 和網頁版所做的變更會存入同一套託管財務資料。

本服務會儲存已註冊用戶端的名稱、重新導向網址、連線及授權範圍的中繼資料，以及建立連線、使用連線和撤銷連線的時間。OAuth 授權碼、存取權杖和更新權杖均只保留單向雜湊值，服務不會儲存原始 OAuth 權杖。MCP 服務會收到各項工具請求並傳回對應結果，但不會將 AI 用戶端的對話儲存為本產品的對話記錄。

AI 用戶端是獨立的第三方，可能依自己的條款和隱私權政策處理或保留提示文字、工具參數及傳回的財務資料。連線前請先查看該用戶端的政策。你可隨時在 **設定 > 代理程式與其他程式的存取權限**（Settings > Agent and Program Access）撤銷 MCP 連線，也可以在設定中刪除使用者帳號和相關的託管資料，詳見下文。

## 資料儲存

雲端資料儲存在 AWS eu-central-1 區域的 RDS（Postgres），每天自動備份。資料在儲存和傳輸時均經過加密。

## Cookie

我們使用 `session` Cookie 進行身分驗證（HttpOnly、Secure、SameSite=Lax）。我們不使用追蹤 Cookie 或第三方分析工具。

## 刪除資料

你可隨時在應用程式的設定中刪除使用者帳號及所有相關資料。若是自行架設，資料庫由你直接控制。

## 開源

所有程式碼都已開源。你可以透過原始碼查核應用程式如何處理你的資料。

---
title: 支援
description: Expense Budget Tracker 的支援和安全通報指引，包含託管 MCP 服務。
slug: support
sections:
  - type: simple_markdown_page
---

## 託管服務和 MCP 支援

如需託管應用程式、帳號、OAuth 授權或公開 MCP 伺服器方面的協助，請寄信至 [markinkirill@gmail.com](mailto:markinkirill@gmail.com)。我們會盡力提供支援，回覆時間無法保證。

請只附上排查問題所需的資訊。

- 用戶端名稱和版本
- 問題發生的日期、時間和時區
- 涉及的端點或頁面
- OAuth 步驟或 MCP 工具名稱
- 去除敏感資訊後的完整錯誤訊息，以及畫面上顯示的請求 ID（如有）
- 預期結果和實際結果

請勿傳送密碼、工作階段 Cookie、OAuth 授權碼、存取權杖或更新權杖、API 金鑰、原始財務記錄或未去除敏感資訊的請求內容。

## 安全通報

請勿在公開的 GitHub 議題揭露疑似漏洞。請寄信至 [markinkirill@gmail.com](mailto:markinkirill@gmail.com)，主旨使用 **Expense Budget Tracker security report**，附上最精簡、已去除敏感資訊的重現步驟。請勿附上仍有效的憑證或財務資料。如果懷疑存取憑證外洩，請先在 **設定 > 代理程式與其他程式的存取權限**（Settings > Agent and Program Access）撤銷該連線，再更換其他受影響的憑證。

## 錯誤回報、自行架設和社群提問

可重現的產品錯誤、自行架設的問題，以及適合公開的社群討論，請到 [GitHub 議題追蹤區](https://github.com/kirill-markin/expense-budget-tracker/issues)。請先搜尋是否已有相關議題，並移除記錄檔和螢幕截圖中的私人資料。[自行架設指南](/zh-hant/docs/self-hosting/)和[原始碼儲存庫](https://github.com/kirill-markin/expense-budget-tracker)有部署和開發方面的說明。

## 回報 MCP 問題之前

請確認用戶端支援透過 Streamable HTTP 連線至遠端 MCP、使用 PKCE 的 OAuth 2.1 授權碼流程，以及動態用戶端註冊。請使用 [MCP 指南](/zh-hant/docs/mcp-connector/)列出的完整通用端點網址，重新連線後再試一次。如果問題仍未解決，請提供上面列出的診斷資訊，並先去除敏感資訊。

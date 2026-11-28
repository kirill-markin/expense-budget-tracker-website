---
title: "Claude Code で支出管理｜接続から銀行明細の取り込み、残高照合まで"
description: "リンクひとつで Claude Code を Expense Budget Tracker に接続。銀行と連携せずに明細の取り込み内容を確認・承認し、残高を照合して予算を更新できます。"
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "Claude Code 支出管理"
  - "Claude 家計簿"
  - "Claude で支出を記録"
  - "Claude Code 予算管理"
  - "Claude と家計簿アプリを接続"
  - "Claude Code で銀行明細をインポート"
---

銀行明細がたった 4 行で、残高の差額が `€0.00` でも、予算の集計はずれることがあります。スーパーでの €54.20 の買い物を「食料品」から「旅行」に付け替えると、口座残高はぴったり合ったまま、カテゴリごとの集計額が €54.20 ずれます。

Claude Code で支出を管理するなら、入出金の記録から計算した残高が銀行の残高と合うか、分類が確認済みの明細と合うかを、それぞれ確かめます。ファイルの解析、計算、API の呼び出しは Claude Code に任せられます。口座やカテゴリは自分で選び、登録予定の明細と、実際に書き込む内容を確認してから承認します。

この手順では、Expense Budget Tracker と銀行の常時接続や、アプリへの明細のアップロードは行いません。銀行明細を自分でエクスポートして Claude Code が読み取れる場所に置き、取り込みを承認した明細だけをクラウド版の Agent API に送信します。銀行への継続的なアクセスを避けたい場合は、[銀行連携なしで使う家計管理アプリ（英語）](/blog/budget-app-without-bank-linking/) に、選び方や運用上の違いをまとめています。

![水平に釣り合った真鍮の天秤のそばで、モザイクの修復士がテラコッタ色の帯に紛れた青いタイルを外している](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## 案内リンクひとつで Claude Code を接続する

Anthropic の [公式クイックスタート](https://code.claude.com/docs/ja/quickstart) に従って Claude Code をインストールし、ログインします。作業ディレクトリや追加のファイルアクセスの仕組みは、[CLI リファレンス](https://code.claude.com/docs/ja/cli-reference) で確認できます。

明細のあるディレクトリで `claude` を起動するか、お使いの環境に合った方法でそのディレクトリへのアクセスを許可します。その後、次のプロンプトを貼り付けます。

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

[アプリドメインのエージェント用リンク](https://app.expense-budget-tracker.com/api/agent) は、接続手順を示す最新の案内を返します。現在は、API のベース URL として `https://api.expense-budget-tracker.com/v1/` が記載され、認証と SQL の各アクションの URL も示されます。アプリ側のリンクを貼り付けると、Claude Code はサービスが返すその時点の URL に従って処理を進めます。

登録もログインも、同じメール認証の手順を使います。8 桁の確認コードを渡すと、Claude Code が長期間有効な `ApiKey` を受け取ります。バージョン管理の対象外にしたシークレットファイルなど、具体的な保存先を承認してください。キーを `CLAUDE.md` に書いたり、リポジトリにコミットしたりしないでください。認証とワークスペースの設定手順は [AI エージェントの設定](/ja/docs/agent-setup/) にあります。

## Agent API と MCP は接続方法が異なる

「Claude で支出を管理する」には 2 つの方法があります。この記事では、ターミナルの Claude Code から Agent API を使います。Claude の Web 版や Claude Desktop からは、ホスト型のリモート MCP コネクタを利用できます。

| | Claude Code と Agent API | Claude または Claude Desktop と MCP |
|---|---|---|
| 向いている用途 | アクセス可能なローカルファイルを使い、HTTP で直接操作するターミナル作業 | MCP 対応の Claude クライアントでの会話 |
| 接続先 | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| 認証 | メールで届くワンタイムの確認コードで認証し、長期間有効な `ApiKey` を取得 | ブラウザで OAuth 認可 |
| データ操作 | 案内の URL から照会・実行エンドポイントを利用 | `sql_query` と、任意の `sql_execute` ツール |
| 明細へのアクセス | その Claude Code セッションで利用できるファイルとディレクトリ | リモートコネクタからローカルファイルにはアクセスできない |

それぞれの接続方法で発行された認証情報は、その接続方式でのみ使えます。Claude の Web 版やデスクトップ版を使う場合は、[Claude から家計データに接続する MCP ガイド（英語）](/blog/claude-expense-tracker-mcp-connector/) を参照してください。Claude Code がアクセスできるファイルを起点に作業する場合は、このあとの Agent API の手順を使います。

次の 2 点も確認してください。

- モデル提供者によるデータ処理は、Expense Budget Tracker の API やデータ保存とは別です。明細データを共有する前に、[Claude Code のデータ利用に関するドキュメント](https://code.claude.com/docs/ja/data-usage) と、設定している提供者の利用規約を確認してください。
- [セルフホスティングガイド](/ja/docs/self-hosting/) のローカル Docker Compose 環境では、Web アプリ、認証サービス、データベース、為替レート取得ワーカーが起動します。ここで使うクラウド版の Agent API は含まれません。リポジトリにある AWS デプロイ構成はこれとは別で、プログラム向けの公開 API を含みます。

## インポートする口座と期間を決める

初回は 1 口座、1 通貨に絞り、すでに締めた期間の明細 1 回分を使います。CSV なら 1 行ずつ確認しやすくなります。ほかの形式では、ご自身の環境でファイルを読めるかを先に Claude Code に確かめさせ、解析結果の各行を表示させます。ファイル名だけで対応形式だと判断しないでください。

Claude Code には次の 6 つの情報を渡します。

1. 明細ファイルのローカルパス
2. 銀行口座と、アプリ側で対応する口座
3. 口座の通貨
4. 明細の計上日のうち、最初の日付と最後の日付
5. 期首残高、または以前に確認済みの残高
6. 明細の期末残高

未確定の取引は、銀行の明細に計上されるまで除外します。元ファイルはそのまま残し、Claude Code に別途プレビューを作らせます。

家計用のディレクトリでは、ローカルの `CLAUDE.md` に次のようなルールを書いておくと便利です。

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

実際の口座名、カテゴリ分けのルール、資金移動の記録方法、集計通貨など、普段変わらない情報も追加します。この記事のカテゴリ例は、自分の台帳のカテゴリと一致する場合にだけ使ってください。

## 全行のプレビューを確認してから取り込む

接続できたら、次のプロンプトを貼り付け、角括弧内の値を置き換えます。

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

変更を承認するまでは、データベースの操作を読み取り専用にします。Claude Code は記事から列名を写さず、実行時のスキーマを確認して対応する口座を探し、同じ期間の既存の台帳の明細を照会します。日付と金額の一致は重複の候補です。別々の買い物でも両方が一致することがあります。

### 4 行の明細で試す

決済用口座の期首残高が €1,250.00 で、明細に次の 4 件が記載されているとします。

| 行 | 計上日 | 摘要 | 符号付き金額 | 取引種別の案 | カテゴリ案 | 確認事項 |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | 給与 | +€2,000.00 | 収入 | 給与 | 問題なし |
| 2 | 2026-09-02 | スーパー | −€54.20 | 支出 | 食料品 | 心当たりがなければ店名を確認 |
| 3 | 2026-09-03 | 貯蓄口座への送金 | −€300.00 | 資金移動 | — | 移動先の口座を確認 |
| 4 | 2026-09-04 | カフェ | −€8.40 | 支出 | 外食 | 問題なし |

符号付き金額 4 件の合計は `+€1,637.40` です。期首残高 `€1,250.00` を足すと、計算上の期末残高は `€2,887.40` になります。この例は 1 画面に収まります。行数が増えても、元の明細全行をプレビューに含め、不明点は一つずつ明示します。

自分の口座間でお金を動かしても支出にはならないため、移動先の口座を確認します。返金や立替金の精算も、実際の取引種別を保って記録します。分類に迷う行は、もっともらしいカテゴリを選ばず、要確認のまま残します。

### 実際に書き込む内容をまとめて承認する

ワークスペース、口座、期間の範囲、行数、符号付き金額の合計、重複候補、分類を確認します。何を取り込むかは、プレビューと実際に送る SQL を確認したうえで具体的に承認します。

Agent API では読み取りと書き込みが分かれています。Claude Code は案内で取得した読み取りアクションで `SELECT` または `WITH ... SELECT` を 1 文実行し、明示的に承認された `INSERT`、`UPDATE`、`DELETE` に限って書き込みアクションを使います。テーブルや列の正確な情報は実行時のスキーマを確認してください。SQL の仕様と制限は [API リファレンス](/ja/docs/api/) にあります。

### 一括処理の前に少数の行で試す

長い `INSERT` や `UPDATE` を実行する場合、案内の指示に従い、同じ形式の SQL を少数の行で先に試します。`INSERT` なら値を直接指定した 1～3 行、`UPDATE` なら対象を絞った 1 行です。承認した変更一式には、試行分と残りの行が含まれます。

試行が成功したら、Claude Code はすぐに 100 行以下のバッチを順に実行し、バッチごとに結果を確認します。承認済みの 247 行のうち 3 行を試した場合、残りは 100 行、100 行、44 行です。対象範囲が変わった場合、新たな不明点が見つかった場合、実行に失敗した場合は、改めて承認が必要です。同じ承認済みの変更一式に含まれる通常の後続バッチは、そのまま進められます。

制限付き SQL では `ON CONFLICT` を使えないため、重複をどう扱うかは明示します。読み取り結果は 100 行までです。Claude Code はレスポンスの行数と結果の打ち切りを示すメタデータを確認し、合計は SQL で集計して、明細を確認するときは、並び順を指定し、範囲を絞って複数回に分けて照会します。結果が打ち切られていれば、まだ全件を確認できていません。

### 保存された行を読み直す

API が成功を返せば、リクエストが実行されたことはわかります。保存値までプレビューと一致するかは、対象口座と期間をもう一度照会し、次の項目を比較して確認します。

- 追加された行数
- 日付、符号付き金額、通貨
- 記録先の口座
- 取引種別とカテゴリ
- 重複候補
- バッチごとの合計と明細全体の合計

違いがあれば、読み取り専用の調査に戻ります。再度書き込む前に、具体的な修正内容を一つ確認します。[銀行明細の取り込みガイド（英語）](/blog/how-to-import-bank-statements-into-an-expense-tracker/) では、期間が重なる明細、返金、資金移動の扱いを詳しく説明しています。

## 残高とカテゴリをそれぞれ確認する

残高照合では、計上日の範囲をそろえ、記録した入出金から求めた期末残高が銀行の期末残高と一致するかを調べます。

一般的な預金口座なら、次のように計算します。

**計算上の期末残高 = 期首残高 + 計上済みの入金 − 計上済みの出金**

金額に符号が付いていれば、次の式を使えます。

**計算上の期末残高 = 期首残高 + 計上済みの符号付き金額の合計**

クレジットカードなどの負債口座では、符号の付け方が異なる場合があります。Claude Code に適用される符号のルールを確認させ、比較の計算に入る前に提示してもらいます。

続けて、次のプロンプトを使います。

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

4 行の例では `€1,250.00 + €1,637.40 = €2,887.40` です。銀行の期末残高も €2,887.40 なら、残高の差額は `€0.00` です。

差額がゼロなら、選んだ期間の口座の計算は合っています。カテゴリは別に確認します。スーパーの €54.20 を「食料品」から「旅行」に移しても残高の差額はゼロのままですが、カテゴリ別の集計は €54.20 ずれます。

差額があれば、期首残高、漏れや重複、資金移動、未確定の取引、符号、日付、通貨を確認します。差額を消すために架空の調整取引を追加しないでください。[残高の照合ガイド（英語）](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) に、原因を絞り込む流れをまとめています。

## 予算の更新は照合のあとで

読み直した行が正しく、口座残高が一致し、カテゴリ別の合計にも納得できたら、予算に進みます。Claude Code は、収支の実績を `budget_lines` と比較し、変更案を作れます。例外的な月の実績をそのまま翌月の計画にする必要はありません。

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

大きな支出は一度限りかもしれません。予算超過に見えても、実際には資金移動や返金の分類を誤っただけの場合があります。差額の計算と SQL の作成は Claude Code に任せ、翌月の金額は自分で決めます。

## 明細ごとに同じ順序で進める

どの明細でも、手順は同じです。

1. `https://app.expense-budget-tracker.com/api/agent` を出発点に、返された案内に従います。
2. アカウント情報を取得し、ワークスペースを確認して実行時のスキーマを調べます。
3. Claude Code が読める明細ファイルを 1 つ渡し、照合する期間と、その期首・期末の残高を明示します。
4. 期間が重なる台帳データを読み取り、全行のインポートプレビューを作ります。
5. 具体的な変更一式を承認します。
6. 行数の多い INSERT は 1～3 行で試してから、100 行以下のバッチを順に実行します。
7. 保存された各バッチを読み直し、プレビューと比較します。
8. 辻褄合わせの取引を追加せず、銀行の期末残高と口座残高を照合します。
9. 残高の差額がゼロでも、カテゴリ別の合計を確認します。
10. 予算項目の変更は、別途作成、承認、検証します。

まず 1 口座の確定済みの期間で試します。台帳の残高が銀行明細と一致し、予算も確認できたら、次の口座でも同じ手順を繰り返します。ファイルと API の定型作業は Claude Code に任せつつ、家計に関する判断は一つずつ、記録を変える前に確認できます。

---
title: "Claude Code로 지출 관리하기: 연결, 거래 내역 가져오기, 잔액 대사"
description: "링크 하나로 Claude Code를 Expense Budget Tracker에 연결하세요. 가져올 거래를 미리 보고 승인한 다음 은행 연동 없이 잔액을 대조하고 예산을 수정할 수 있습니다."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "Claude Code 지출 관리"
  - "Claude 지출 관리"
  - "Claude용 지출 관리 앱"
  - "Claude Code 예산 관리"
  - "Claude 지출 관리 앱 연결"
  - "Claude Code 은행 거래 내역 가져오기"
---

거래가 네 건뿐인 명세서에서 은행과의 잔액 차이가 `€0.00`이어도 예산 집계는 틀릴 수 있습니다. 슈퍼마켓에서 쓴 €54.20짜리 거래를 여행으로 분류하면 계좌 잔액은 그대로인데 식료품과 여행의 합계는 €54.20만큼 어긋납니다.

Claude Code로 지출을 관리할 때는 두 가지를 확인해야 합니다. 장부에 기록한 입출금으로 은행 잔액이 계산되는지, 카테고리가 검토한 명세서 내역과 맞는지 확인하세요. 파일 읽기, 계산, API 호출은 Claude Code가 맡을 수 있습니다. 계좌와 카테고리는 직접 고르고, 기록할 내용을 검토한 뒤 그 변경을 승인하세요.

이 방식에서는 Expense Budget Tracker가 은행 연결을 유지하거나 명세서 파일을 직접 받아 주지 않습니다. 명세서를 직접 내보내 Claude Code가 읽을 수 있는 곳에 두고, 승인한 기록만 관리형 에이전트 API로 보내세요. 은행 계좌에 상시 접근 권한을 주고 싶지 않다면 [은행 연동 없이 쓰는 예산 앱(영어)](/blog/budget-app-without-bank-linking/)에서 장단점을 더 살펴볼 수 있습니다.

![모자이크 복원가가 수평을 유지하는 황동 저울 옆에서 테라코타 띠에 잘못 놓인 파란 타일을 들어 올리는 모습](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## API 안내 링크 하나로 Claude Code 연결하기

Anthropic의 [공식 빠른 시작 가이드(영어)](https://code.claude.com/docs/en/quickstart)에 따라 Claude Code를 설치하고 로그인하세요. 작업 디렉터리와 추가 파일 접근 권한은 [CLI 레퍼런스(영어)](https://code.claude.com/docs/en/cli-reference)에서 확인할 수 있습니다.

명세서가 있는 디렉터리에서 `claude`를 실행하거나, 현재 환경에서 지원되는 방식으로 해당 디렉터리에 대한 접근 권한을 부여하세요. 그런 다음 아래 프롬프트를 붙여 넣으세요.

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

[앱 도메인의 에이전트 연결 링크](https://app.expense-budget-tracker.com/api/agent)는 서비스의 최신 연결 정보를 반환합니다. 현재 API 기본 주소는 `https://api.expense-budget-tracker.com/v1/`이며, 인증과 SQL 작업에 필요한 URL도 함께 제공됩니다. 앱 도메인 링크를 붙여 넣으면 Claude Code가 내부 호출 순서를 미리 정해 두지 않고 서비스가 반환한 URL을 따를 수 있습니다.

가입과 로그인에 같은 이메일 인증 절차를 사용합니다. 8자리 인증 코드를 알려 주면 Claude Code가 장기간 유효한 `ApiKey`를 받습니다. 버전 관리에서 제외한 비밀 정보 파일처럼 구체적인 저장 위치를 정하고 승인하세요. 키를 `CLAUDE.md`에 넣거나 저장소에 커밋하면 안 됩니다. 인증과 워크스페이스 설정 순서는 [AI 에이전트 설정](/ko/docs/agent-setup/)에 나와 있습니다.

## 에이전트 API와 MCP는 연결 방식이 다릅니다

‘Claude로 지출 관리’라고 할 때는 두 가지 연동 방식이 있습니다. 이 글은 터미널의 Claude Code와 에이전트 API를 사용합니다. Claude나 Claude Desktop에서는 호스팅형 원격 MCP 커넥터를 사용할 수 있습니다.

| | 에이전트 API를 사용하는 Claude Code | MCP를 사용하는 Claude 또는 Claude Desktop |
|---|---|---|
| 적합한 작업 | 로컬 파일을 읽고 HTTP를 직접 호출하는 터미널 작업 | MCP를 지원하는 Claude 클라이언트에서의 대화 |
| 시작 주소 | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| 인증 | 이메일 일회용 인증 코드 확인 후 장기간 유효한 `ApiKey` 발급 | 브라우저 OAuth |
| 데이터 접근 | API 안내 응답에서 조회 및 실행 엔드포인트를 제공 | `sql_query` 및 선택 사항인 `sql_execute` 도구 |
| 명세서 접근 | 해당 Claude Code 세션에서 접근할 수 있는 파일과 디렉터리 | 원격 커넥터는 로컬 파일 접근 기능을 제공하지 않음 |

두 방식의 인증 정보는 서로 바꿔 쓸 수 없습니다. Claude 웹 앱이나 데스크톱 앱에서는 [Claude 지출 관리 MCP 가이드(영어)](/blog/claude-expense-tracker-mcp-connector/)를 따르세요. Claude Code가 읽을 수 있는 파일에서 시작하는 작업이라면 아래 에이전트 API 절차를 사용하세요.

두 가지를 더 확인하세요.

- 모델 제공업체의 데이터 처리는 Expense Budget Tracker의 API 및 저장소와 별개입니다. 명세서 데이터를 공유하기 전에 [Claude Code 데이터 사용 문서(영어)](https://code.claude.com/docs/en/data-usage)와 현재 설정한 모델 제공업체의 약관을 확인하세요.
- [자체 호스팅 가이드](/ko/docs/self-hosting/)의 로컬 Docker Compose 구성은 웹 앱, 인증 서비스, 데이터베이스, 환율 작업 프로세스를 실행합니다. 여기서 사용하는 관리형 에이전트 API는 제공하지 않습니다. 저장소에 있는 AWS 배포 구성은 별도이며 프로그램용 공개 API를 포함합니다.

## 가져올 범위를 정확히 정하기

처음에는 계좌 하나, 통화 하나, 마감된 명세서 한 회분으로 시작하세요. CSV는 각 행을 확인하기 편합니다. 다른 형식이라면 먼저 Claude Code가 현재 환경에서 그 파일을 읽을 수 있는지 확인하고, 파싱한 행을 보여 달라고 하세요. 파일 이름만 보고 지원 여부를 판단하지 마세요.

Claude Code에 다음 여섯 가지 정보를 알려 주세요.

1. 명세서의 로컬 경로
2. 은행 계좌와 앱에서 그에 해당하는 계좌
3. 계좌 통화
4. 거래 반영일 기준 시작일과 종료일
5. 기초 잔액 또는 이전에 확인한 정확한 잔액
6. 명세서의 기말 잔액

은행에 아직 반영되지 않은 거래는 나중에 반영되면 포함하세요. 원본 파일은 그대로 두고 Claude Code가 별도의 미리보기를 만들도록 하세요.

재무 작업 디렉터리의 로컬 `CLAUDE.md`에는 다음 규칙을 넣어 둘 수 있습니다.

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

실제 계좌 이름, 카테고리 규칙, 이체를 기록하는 방식, 보고 기준 통화처럼 바뀌지 않는 정보도 추가하세요. 이 글의 예시 카테고리는 실제 장부에 있는 분류와 일치할 때만 사용하세요.

## 전체 미리보기를 확인한 뒤 가져오기

연결에 성공하면 아래 프롬프트를 붙여 넣고 대괄호 안의 값을 바꾸세요.

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

변경을 승인하기 전까지 데이터베이스 작업은 읽기 전용입니다. Claude Code는 글에 나온 열 이름을 그대로 쓰지 말고 현재 스키마를 확인하고, 해당 계좌를 찾아, 같은 기간에 이미 저장된 행을 조회해야 합니다. 날짜와 금액이 같으면 중복 가능성이 있습니다. 정상적인 구매 두 건의 날짜와 금액이 우연히 같을 수도 있습니다.

### 거래 네 건으로 계산해 보기

입출금 계좌의 기초 잔액이 €1,250.00이고 거래 네 건이 명세서에 반영됐다고 가정해 보겠습니다.

| 행 | 반영일 | 거래 내용 | 부호를 포함한 금액 | 제안 유형 | 제안 카테고리 | 검토 사항 |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | 급여 | +€2,000.00 | 수입 | 급여 | 확인 완료 |
| 2 | 2026-09-02 | 슈퍼마켓 | −€54.20 | 지출 | 식료품 | 낯선 곳이면 가맹점 확인 |
| 3 | 2026-09-03 | 저축 계좌로 이체 | −€300.00 | 이체 | — | 상대 계좌 확인 |
| 4 | 2026-09-04 | 카페 | −€8.40 | 지출 | 외식 | 확인 완료 |

각 금액에 부호를 적용해 네 건을 합하면 `+€1,637.40`입니다. 기초 잔액 `€1,250.00`을 더하면 예상 기말 잔액은 `€2,887.40`입니다. 이 예시는 한 화면에 들어갑니다. 가져올 내역이 길어져도 원본의 모든 행을 미리보기에 표시하고 불확실한 부분을 모두 알려야 합니다.

내 계좌 사이에서 돈을 옮기는 일은 지출에 해당하지 않으므로 이체의 상대 계좌를 확인해야 합니다. 환불이나 대신 낸 비용을 돌려받은 경우도 실제 거래 유형대로 기록하세요. 분류가 확실하지 않으면 그럴듯한 카테고리를 고르는 대신 표시해 두고 결정을 기다리세요.

### 검토한 변경 사항을 한 번에 승인하기

워크스페이스, 계좌, 기간 범위, 행 수, 부호를 포함한 합계, 중복 후보, 거래 분류를 확인하세요. “전부 가져와”라고 포괄적으로 지시하는 대신 미리보기에 나온 내역과 실제로 실행할 SQL을 확인한 뒤 승인하세요.

에이전트 API는 조회와 쓰기를 분리합니다. Claude Code는 API 안내 응답에 나온 조회 작업으로 `SELECT` 또는 `WITH ... SELECT` 문 하나를 실행합니다. 쓰기 작업은 명시적으로 승인한 `INSERT`, `UPDATE`, `DELETE`에만 사용합니다. 테이블과 열은 현재 스키마를 기준으로 확인하고, SQL 규약과 제한은 [API 레퍼런스](/ko/docs/api/)를 참고하세요.

### 추가하거나 수정할 행이 많으면 몇 행부터 시험하기

많은 행에 `INSERT`나 `UPDATE`를 적용할 때는 실제로 실행할 SQL과 같은 형태의 문으로 먼저 시험합니다. API 안내 응답의 지시를 따르세요. `INSERT`에는 값을 직접 지정한 1~3개 행을, `UPDATE`에는 대상 행 하나를 사용합니다. 검토한 변경 사항을 승인하면 이 시험과 나머지 행에도 같은 승인이 적용됩니다.

시험에 성공하면 Claude Code는 곧바로 한 번에 최대 100건씩 순서대로 처리하고 각 묶음을 검증합니다. 승인한 행이 247개이고 3개 행으로 먼저 시험했다면, 나머지는 100개, 100개, 44개씩 처리합니다. 범위가 바뀌거나 새로 불확실한 부분이 생기거나 실행이 실패하면 다시 승인해야 합니다. 이미 승인한 범위의 나머지 묶음은 그대로 진행할 수 있습니다.

제한된 SQL은 `ON CONFLICT`를 지원하지 않으므로 중복 후보는 명시적으로 처리해야 합니다. 조회 결과는 최대 100행입니다. Claude Code는 응답 메타데이터에서 행 수와 결과가 잘렸는지 확인하고 SQL로 합계를 구해야 합니다. 각 행을 검증할 때는 조회 범위를 좁혀 일정한 순서로 확인하세요. 일부가 잘린 응답만으로는 가져오기를 모두 검증할 수 없습니다.

### 저장한 행을 다시 조회하기

API가 성공 응답을 반환하면 요청이 실행된 것입니다. 각 값이 미리보기와 일치하는지는 따로 확인해야 합니다. 변경 사항이 있는 계좌의 해당 기간을 다시 조회해 다음 항목을 비교하세요.

- 삽입한 행 수
- 날짜, 부호를 포함한 금액, 통화
- 각 거래에 지정된 계좌
- 거래 유형과 카테고리
- 중복 후보
- 각 묶음의 합계와 전체 명세서 합계

차이가 있으면 다시 읽기 전용으로 원인을 찾으세요. 또 쓰기 작업을 하기 전에 어떤 내용을 고칠지 검토하세요. [은행 거래 명세서 가져오기 가이드(영어)](/blog/how-to-import-bank-statements-into-an-expense-tracker/)에서 기간이 겹치는 경우, 환불, 이체를 더 자세히 설명합니다.

## 잔액과 카테고리를 따로 검토하기

잔액 대사는 거래 반영일 기준으로 같은 기간을 잡아, 장부에 기록한 입출금을 더하고 뺀 결과가 은행의 기말 잔액과 일치하는지 확인하는 작업입니다.

일반 예금 계좌의 경우 다음과 같이 계산합니다.

**예상 기말 잔액 = 기초 잔액 + 반영된 입금 − 반영된 출금**

거래 금액에 부호를 붙여 기록했다면 다음과 같습니다.

**예상 기말 잔액 = 기초 잔액 + 부호를 포함한 반영 거래 금액의 합계**

신용카드 같은 부채 계좌는 부호를 다르게 쓸 수 있습니다. Claude Code는 비교하기 전에 어떤 부호 규칙을 확인했는지 밝혀야 합니다.

이어서 아래 프롬프트를 사용하세요.

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

앞의 거래 네 건에서는 `€1,250.00 + €1,637.40 = €2,887.40`입니다. 은행의 기말 잔액도 €2,887.40이면 잔액 차이는 `€0.00`입니다.

차이가 0이면 해당 기간의 잔액 계산이 맞는 것입니다. €54.20의 슈퍼마켓 거래를 식료품에서 여행으로 옮겨도 잔액 차이는 0입니다. 두 카테고리의 합계는 각각 €54.20만큼 달라지므로 카테고리는 따로 검토하세요.

차이가 0이 아니라면 기초 잔액, 누락되거나 중복된 행, 이체, 미반영 거래, 부호, 날짜, 통화를 확인하세요. 차이를 없애려고 임의의 조정 거래를 넣으면 안 됩니다. 더 자세한 진단 순서는 [예산 기록과 은행 잔액 대사 가이드(영어)](/blog/how-to-reconcile-your-budget-with-your-bank-balance/)를 참고하세요.

## 대사가 끝난 뒤 예산 업데이트하기

저장한 행을 다시 읽어 확인하고, 계좌 잔액이 은행 잔액과 맞고, 카테고리 합계도 확인한 뒤 예산을 살펴보세요. Claude Code는 실제 수입과 지출을 `budget_lines`의 예산 항목과 비교해 수정안을 만들 수 있습니다. 한 달의 지출이 이례적이었다면 그 달을 다음 달 예산의 기준으로 삼을 필요는 없습니다.

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

큰 지출이 일회성이었을 수도 있습니다. 초과 지출처럼 보였던 항목이 잘못 분류된 이체나 환불일 수도 있습니다. 차이 계산과 SQL 작성은 Claude Code에 맡기고, 다음 달 금액은 직접 결정하세요.

## 명세서마다 같은 순서로 진행하기

명세서마다 이 순서를 유지하세요.

1. `https://app.expense-budget-tracker.com/api/agent`에서 시작해 API 안내 응답의 지시를 따릅니다.
2. 사용자 계정 정보를 불러오고 워크스페이스를 확인한 뒤 현재 스키마를 살펴봅니다.
3. Claude Code가 읽을 수 있는 명세서 하나를 지정하고 잔액과 기간의 기준을 명확히 알려 줍니다.
4. 같은 기간의 장부 항목을 조회하고 가져올 내역 전체의 미리보기를 만듭니다.
5. 검토한 특정 변경 사항을 한 번에 승인합니다.
6. 삽입할 행이 많으면 1~3개 행으로 먼저 시험하고, 이후 한 묶음에 100개 이하씩 순서대로 처리합니다.
7. 저장한 묶음을 모두 다시 읽고 미리보기와 비교합니다.
8. 임의의 조정 항목을 추가하지 않고 계좌 잔액을 은행 기말 잔액과 대사합니다.
9. 잔액 차이가 0이어도 카테고리 합계를 검토합니다.
10. 예산 항목 변경은 별도로 준비하고 승인하고 검증합니다.

계좌 하나와 마감 기간 하나로 시작하세요. 해당 명세서로 장부의 잔액을 대사하고 예산 검토를 마쳤다면 다음 계좌에서 같은 작업을 반복하세요. 반복되는 파일 처리와 API 호출은 Claude Code가 맡고, 재무 결정은 기록에 반영되기 전에 직접 확인할 수 있습니다.

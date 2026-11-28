---
title: AI 에이전트 설정
description: Claude Code, Codex 또는 OpenClaw에 API 안내 URL을 알려 주세요. 에이전트는 응답에 따라 이메일로 받은 8자리 인증 코드를 확인하고 장기간 유효한 ApiKey를 저장한 뒤 워크스페이스에서 작업을 시작합니다.
---

## 에이전트에 알려 줄 링크

아래 URL을 그대로 전달하세요.

`https://api.expense-budget-tracker.com/v1/`

이 주소는 AI 에이전트가 연결을 시작할 때 사용하는 공식 공개 API 안내 엔드포인트입니다. 응답에는 인증을 시작하는 방법, 다음에 호출할 엔드포인트, 이후 사용할 인증 방식, 런타임 스키마와 오픈 소스 구현을 찾을 수 있는 위치가 담겨 있습니다.

이 가이드는 터미널 에이전트나 HTTP 클라이언트가 에이전트 API에 직접 연결하는 과정을 설명합니다. MCP를 지원하는 클라이언트라면 호스팅형 [MCP 커넥터](/ko/docs/mcp-connector/)를 사용하세요. `https://mcp.expense-budget-tracker.com/mcp`에 연결해 브라우저에서 OAuth로 접근을 승인하며, 아래의 ApiKey 발급 절차는 필요 없습니다.

## 사용자가 할 일

1. Claude Code, Codex, OpenClaw 또는 HTTP 요청을 보낼 수 있는 다른 에이전트를 엽니다.
2. `https://api.expense-budget-tracker.com/v1/`을 사용해 Expense Budget Tracker에 연결하라고 에이전트에게 요청합니다.
3. 에이전트가 이메일 주소를 물으면 Expense Budget Tracker에서 사용하는 주소를 알려 줍니다.
4. 받은편지함에서 8자리 인증 코드를 확인합니다.
5. 에이전트에게 그 코드를 전달합니다.
6. 에이전트가 발급받은 ApiKey를 채팅 메모리 밖에 저장하면 가져오기, 조회, 예산 관리 작업을 이어서 요청합니다.

로그인 과정에서 키를 직접 복사하거나 붙여 넣을 필요는 없습니다. 이메일 인증 코드가 확인되면 에이전트가 연결을 설정합니다.

## 에이전트가 할 일

전체 순서는 다음과 같습니다.

1. `GET https://api.expense-budget-tracker.com/v1/`
2. API 안내 응답을 읽고 그 안에 포함된 지시를 따릅니다. 다음 단계를 코드에 고정해 두지 않습니다.
3. 반환된 `bootstrapUrl`로 사용자 이메일을 `POST`합니다.
4. `otpSessionToken`과 `verify_code` 작업 지시를 받습니다.
5. 사용자에게 이메일로 받은 8자리 인증 코드를 요청합니다.
6. `code`, `otpSessionToken`, 연결 이름인 `label`을 `https://auth.expense-budget-tracker.com/api/agent/verify-code`에 `POST`합니다.
7. 새 `ApiKey`를 받습니다.
8. 키를 채팅 메모리 밖에 저장합니다. 가능하면 `EXPENSE_BUDGET_TRACKER_API_KEY`로 저장합니다.
9. `Authorization: ApiKey <key>`를 사용해 `GET https://api.expense-budget-tracker.com/v1/me`를 호출합니다.
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. 필요하면 `POST /v1/workspaces`로 워크스페이스를 만듭니다.
12. `POST /v1/workspaces/{workspaceId}/select`로 기본 워크스페이스를 저장합니다.
13. `GET https://api.expense-budget-tracker.com/v1/schema`로 사용할 수 있는 릴레이션을 확인합니다.
14. `POST https://api.expense-budget-tracker.com/v1/sql/query`로 조회하고, 승인된 쓰기 작업은 `POST https://api.expense-budget-tracker.com/v1/sql/execute`로 전송합니다.

워크스페이스는 명시적으로 선택하며, 선택 결과는 유지됩니다. `POST /v1/workspaces/{workspaceId}/select`를 호출하면 선택한 워크스페이스가 해당 API 키에 저장되므로 이후 `/v1/sql/query`와 `/v1/sql/execute` 요청에서는 `X-Workspace-Id`를 생략할 수 있습니다. 특정 요청에서만 다른 워크스페이스를 사용하려면 `X-Workspace-Id`를 보내세요. 호환용 `POST /v1/sql`은 원자적으로 실행할 여러 문장으로 구성된 스크립트에만 사용합니다. 일반적인 조회나 쓰기에는 각 전용 경로를 사용하세요.

사용자에게 워크스페이스가 하나뿐이고 이 키에 저장한 기본값이 없으면 백엔드가 해당 워크스페이스를 기본값으로 저장하고 사용합니다.

## 에이전트가 저장할 정보

`verify-code`가 반환하는 키는 장기간 유효합니다. 채팅 메모리에만 두지 마세요.

- 사용자가 파일 쓰기를 승인하면 로컬 `.env` 파일에 `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`로 저장합니다.
- 파일 쓰기를 승인하지 않은 경우 현재 셸에서 `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`를 환경 변수로 내보내고, 사용자에게 키를 계속 보관할 수 있는 곳에 저장해 달라고 요청합니다.

인증이 필요한 요청에는 다음 헤더를 사용합니다.

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>`는 저장된 기본 워크스페이스를 이번 요청에서 바꾸거나, 아직 기본값이 저장되지 않았을 때만 사용

## AI 에이전트라면

다음 명령으로 시작하세요.

```bash
curl https://api.expense-budget-tracker.com/v1/
```

이어서 서버의 API 안내 응답에 나온 작업 지시를 따르세요. 응답에서 다음 단계를 안내하면 미리 정해 둔 순서 대신 그 지시를 따르세요.

`verify-code`가 반환한 `ApiKey`를 안전하게 저장하고 아래 경로를 호출합니다.

- `/v1/me`로 사용자 계정 정보 확인
- `/v1/workspaces`로 접근할 수 있는 워크스페이스 확인
- `/v1/schema`로 허용되는 SQL 릴레이션 및 열 확인
- `/v1/openapi.json` 또는 `/v1/swagger.json`은 클라이언트가 일반적인 명세 URL을 확인할 때만 사용합니다. 두 경로는 API 명세 대신 API 안내 문서와 소스 링크를 반환합니다.

## 사용자가 붙여 넣을 수 있는 프롬프트 예시

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

## 설정 후 할 수 있는 일

- 은행 거래 내역서나 카드사에서 내려받은 파일 가져오기
- 기존 카테고리로 거래 분류하기
- 기록한 계좌 잔액을 은행 잔액과 대조하기
- 카테고리, 기간, 가맹점 또는 계좌별로 지출 조회하기
- 다음 달 예산 항목 업데이트하기

개별 엔드포인트와 인증 세부 정보는 [API 레퍼런스](/ko/docs/api/)를 참고하세요.

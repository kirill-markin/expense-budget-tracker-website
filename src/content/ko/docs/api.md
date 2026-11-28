---
title: API 레퍼런스
description: 프로그램에서 재무 데이터를 다룰 때 필요한 에이전트 연결 방법과 SQL API 레퍼런스입니다.
---

## 개요

Expense Budget Tracker는 아래 주소에서 프로그램용 공개 API를 하나 제공합니다.

`https://api.expense-budget-tracker.com/v1/`

같은 API를 두 가지 방식으로 사용할 수 있습니다.

1. **에이전트에서 연결 설정** — `GET /v1/`에서 시작
2. **HTTP로 직접 호출** — 이미 발급받은 장기 유효 ApiKey 사용

모든 요청에는 웹 앱과 동일한 Postgres 행 수준 보안이 적용됩니다.

MCP를 지원하는 클라이언트에서는 `https://mcp.expense-budget-tracker.com/mcp`의 호스팅형 [MCP 커넥터](/ko/docs/mcp-connector/)를 이용하고 브라우저에서 OAuth로 접근을 승인하세요. 이 문서는 장기간 유효한 `ApiKey`를 사용하는 별도의 에이전트 API 연결 방식과 직접 HTTP 호출 규약을 설명합니다.

## API 안내 문서, 소스 및 런타임 스키마

여기에서 시작하세요.

`https://api.expense-budget-tracker.com/v1/`

이 주소의 응답에는 에이전트가 인증을 시작하는 방법과 다음에 호출할 경로가 담겨 있습니다. README와 구현 소스 링크도 포함합니다. API는 다음 경로를 제공합니다.

- `GET /v1/schema`
- `GET /v1/openapi.json` 및 `GET /v1/swagger.json`: OpenAPI가 제공되지 않음을 알리고 클라이언트에 API 안내 문서와 소스 위치를 알려 주는 호환성 확인 경로

`/v1/sql/query`, `/v1/sql/execute`, 호환용 `/v1/sql`이 제공하는 릴레이션(테이블이나 뷰)과 열의 정확한 목록은 `schema`에서 확인하세요.

## 에이전트에서 연결 설정

Claude Code, Codex, OpenClaw 또는 다른 에이전트가 직접 연결을 설정하게 하려면 API 안내 엔드포인트에서 시작해 서버가 반환하는 작업 지시를 따르세요.

### 인증 흐름

1. `GET https://api.expense-budget-tracker.com/v1/`
2. 반환된 `send_code` 작업 지시와 `bootstrapUrl`을 읽습니다.
3. 사용자 이메일을 `https://auth.expense-budget-tracker.com/api/agent/send-code`에 `POST`합니다.
4. `otpSessionToken`을 받습니다.
5. 사용자에게 이메일로 받은 8자리 인증 코드를 요청합니다.
6. `code`, `otpSessionToken`, `label`을 `https://auth.expense-budget-tracker.com/api/agent/verify-code`에 `POST`합니다.
7. 장기간 유효한 `ApiKey`를 받습니다.
8. 키를 채팅 메모리 밖에 저장합니다.
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. 필요하면 `POST https://api.expense-budget-tracker.com/v1/workspaces`로 워크스페이스를 만듭니다.
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. `POST https://api.expense-budget-tracker.com/v1/sql/query`로 조회하고, 승인된 쓰기 작업은 `POST https://api.expense-budget-tracker.com/v1/sql/execute`로 전송합니다.

### 인증 헤더

- `Authorization: ApiKey <key>`

### 워크스페이스 처리

- `POST /v1/workspaces/{workspaceId}/select`는 해당 API 키의 기본 워크스페이스를 저장합니다.
- 워크스페이스를 저장한 뒤에는 `/v1/sql/query`, `/v1/sql/execute`, 호환용 `/v1/sql` 요청에서 `X-Workspace-Id`를 생략할 수 있습니다.
- 특정 요청에서 저장된 워크스페이스 대신 다른 대상을 쓰려면 `X-Workspace-Id: <workspaceId>`를 보낼 수 있습니다.
- 사용자에게 워크스페이스가 하나뿐이고 키에 저장한 기본값이 없으면 API에서 해당 워크스페이스를 기본값으로 저장하고 사용합니다.

단계별 사용 방법은 [AI 에이전트 설정](/ko/docs/agent-setup/)을 참고하세요.

## 기존 키로 HTTP 직접 호출

장기간 유효한 ApiKey를 이미 발급받았다면 스크립트, cron 작업, 대시보드, 맞춤 앱에서도 같은 API를 직접 호출할 수 있습니다.

### 인증

아래와 같이 ApiKey 인증 헤더에 키를 넣습니다.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id`는 키에 저장된 기본 워크스페이스가 아직 없거나 이번 요청에서만 다른 워크스페이스를 쓰려는 경우에 필요합니다.

- `Authorization: ApiKey ebta_your_key_here`
- 필요한 경우 `X-Workspace-Id: <workspaceId>`

## 엔드포인트 요약

- `GET /v1/` — 공개 API 안내 문서
- `GET /v1/openapi.json` 및 `GET /v1/swagger.json` — 소스를 찾을 수 있는 호환성 확인 경로. API 명세는 제공하지 않습니다.
- `GET /v1/me` — 인증된 사용자 계정 정보
- `GET /v1/workspaces` — 키 소유자가 접근할 수 있는 워크스페이스 목록
- `POST /v1/workspaces` — 워크스페이스 생성
- `POST /v1/workspaces/{workspaceId}/select` — 이 키의 기본 워크스페이스 저장
- `GET /v1/schema` — SQL에서 사용할 수 있는 릴레이션과 열 확인
- `POST /v1/sql/query` — 읽기 전용 `SELECT` 또는 `WITH ... SELECT` 문 하나 실행
- `POST /v1/sql/execute` — 승인된 `INSERT`, `UPDATE`, `DELETE` 문 중 하나 실행
- `POST /v1/sql` — 여러 문장으로 구성된 스크립트를 원자적으로 실행하는 호환용 엔드포인트

## SQL 정책

기본 엔드포인트는 조회와 쓰기를 분리합니다.

- `POST /v1/sql/query`는 읽기 전용 `SELECT` 또는 `WITH ... SELECT` 문을 정확히 하나 받습니다.
- `POST /v1/sql/execute`는 `INSERT`, `UPDATE`, `DELETE` 중 변경 문 하나를 받습니다. 지원되는 `WITH` 구문도 사용할 수 있습니다.
- 호환용 `POST /v1/sql`은 여러 SQL 문으로 된 제한된 스크립트를 받아 원자적으로 적용합니다. 이 동작이 필요한 경우에만 사용하세요.

다음 패턴은 차단되거나 거부됩니다.

- 기본 `/v1/sql/query` 및 `/v1/sql/execute` 엔드포인트의 복수 문장
- `CREATE`, `DROP`, `ALTER` 등 DDL
- `BEGIN`, `COMMIT`, `ROLLBACK` 등 트랜잭션의 시작과 종료를 제어하는 문
- `set_config()`
- SQL 주석
- 따옴표로 묶인 식별자
- 달러 기호로 인용한 문자열

서버는 조회 가능한 릴레이션도 제한합니다. SQL을 생성하기 전에 `/v1/schema`로 공개된 릴레이션과 열을 확인하세요.

현재 공개되는 릴레이션은 다음과 같습니다.

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts`(읽기 전용)
- `fx_rates_raw`(읽기 전용)
- `fx_rates_daily`(읽기 전용)

## 제한

- 요청당 반환 결과 최대 100행
- 데이터 변경 시 SQL 문 하나와 요청 한 건에 각각 최대 100행까지 영향
- SQL 요청 전체 제한 시간 25초
- 키 하나당 초당 10건, 하루 10,000건

## 보안

- API 키는 SHA-256 해시로 저장하며 평문은 저장하지 않습니다.
- RLS가 데이터베이스 수준에서 워크스페이스를 격리합니다.
- 앱에서 언제든지 키를 폐기할 수 있습니다.
- 워크스페이스에서 멤버를 제거하면 해당 멤버의 모든 키가 자동으로 폐기됩니다.

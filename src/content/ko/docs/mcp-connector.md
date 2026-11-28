---
title: MCP 커넥터
description: OAuth로 MCP 클라이언트를 Expense Budget Tracker에 연결해 재무 데이터를 안전하게 조회하거나 변경하는 방법입니다.
---

## 개요

Expense Budget Tracker의 호스팅형 Model Context Protocol(MCP) 커넥터 주소입니다.

`https://mcp.expense-budget-tracker.com/mcp`

이 엔드포인트는 Streamable HTTP와 OAuth를 사용합니다. 원격 Streamable HTTP 서버와 OAuth 메타데이터 검색을 지원하는 MCP 클라이언트에 이 URL을 입력하세요. 브라우저가 열리면 로그인한 뒤 접근을 승인하세요.

MCP 인증에는 OAuth 액세스 토큰과 갱신 토큰을 사용합니다. [에이전트 API 레퍼런스](/ko/docs/api/)에 나온 장기간 유효한 `ApiKey`는 HTTP를 직접 호출하는 별도 연동에 쓰는 키이며 MCP 엔드포인트에서는 사용할 수 없습니다.

## OAuth 메타데이터 검색과 연결

호스팅형 커넥터는 보호된 리소스의 메타데이터를 아래 주소에 공개합니다.

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

이 메타데이터는 클라이언트에 인가 서버의 위치를 알려 줍니다. 인가 서버의 메타데이터는 다음 주소에서 확인할 수 있습니다.

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

호환 클라이언트는 다음 순서로 연결합니다.

1. `https://mcp.expense-budget-tracker.com/mcp`에 연결해 보호된 리소스의 메타데이터를 찾습니다.
2. 공개 OAuth 클라이언트로 동적 등록합니다. 클라이언트 시크릿은 사용하지 않습니다.
3. 인가 코드 방식을 시작하고 사용자 브라우저에서 인가 URL을 엽니다.
4. 모든 인가 요청에 PKCE를 사용합니다. 지원되는 코드 챌린지 방식은 `S256`뿐입니다.
5. `expenses:read`를 요청합니다. `sql_execute`를 호출해야 할 때만 `expenses:write`를 추가합니다.
6. 인가 코드를 액세스 토큰과 갱신 토큰으로 교환합니다. 이후 필요할 때 클라이언트가 액세스 토큰을 갱신합니다.

토큰을 프롬프트, 채팅 기록, 소스 파일 또는 로그에 복사하지 마세요. MCP 클라이언트의 인증 정보 저장소에만 보관하세요.

## 권한 범위

- `expenses:read`는 필수입니다. 워크스페이스 목록 조회, 스키마 확인, 읽기 전용 쿼리를 허용합니다.
- `expenses:write`는 선택 사항입니다. 데이터를 추가·수정·삭제할 수 있는 `sql_execute` 도구를 사용하려면 이 별도 권한이 필요합니다.

작업에 필요한 최소한의 권한만 사용하세요. 데이터 분석이나 보고서 작성만 하는 클라이언트는 `expenses:read`만 요청하고 `expenses:write`는 요청하지 마세요.

## 도구

### `list_workspaces`

로그인한 사용자가 접근할 수 있는 워크스페이스를 나열합니다. 조회하거나 변경하기 전에 반환된 워크스페이스 식별자로 대상을 명확히 지정하세요.

### `get_schema`

선택한 워크스페이스에서 MCP로 접근할 수 있는 릴레이션과 열을 반환합니다. 테이블이나 열 이름을 추측하지 말고 SQL을 작성하기 전에 이 도구를 호출하세요.

### `sql_query`

선택한 워크스페이스에서 제한된 읽기 전용 SQL 쿼리 하나를 실행합니다. 데이터베이스에서도 이 쿼리 경로에 읽기 전용 제약을 적용합니다. 결과는 최대 100행이며 실행 제한 시간은 20초입니다.

### `sql_execute`

선택한 워크스페이스에서 데이터를 변경하는 제한된 SQL을 실행합니다. 이 도구는 기존 데이터를 바꾸거나 삭제할 수 있으므로 별도의 `expenses:write` 권한이 필요합니다. 호출을 승인하기 전에 워크스페이스를 확인하고 실행할 SQL 문을 그대로 검토하세요.

읽기 전용 보장은 `sql_query`와 해당 데이터베이스 경로에만 적용됩니다. MCP 서버에는 데이터를 변경할 수 있는 `sql_execute`도 있습니다.

## 안전하게 사용하기

1. `list_workspaces`를 호출하고 사용자에게 대상 워크스페이스를 확인합니다.
2. SQL을 생성하기 전에 `get_schema`를 호출합니다.
3. 내역을 확인하고 합계를 계산하거나, 잔액을 대조하거나, 보고서를 작성할 때는 `sql_query`를 사용합니다.
4. 데이터를 변경해야 하는 작업에서만 `expenses:write`를 요청합니다.
5. `sql_execute`를 실행하기 전에 실행할 SQL 문과 예상되는 변경 사항을 보여 주고 워크스페이스를 다시 확인합니다.
6. 쓰기 작업 후 `sql_query`로 결과를 검증합니다.

서버는 사용할 수 있는 SQL과 조회할 수 있는 릴레이션을 제한합니다. 이 제약을 활용하되 생성된 SQL도 주의 깊게 검토하세요.

## 제한

- SQL 결과 최대 100행
- 실행 제한 시간 20초
- 로그인한 사용자가 접근 권한을 가진 워크스페이스만 이용 가능
- `sql_query`는 허용된 SQL만 실행하며 데이터베이스에도 읽기 전용 제약 적용
- `sql_execute`에는 필수 읽기 권한 외에 `expenses:write`가 필요

## 개인정보 보호 및 자체 호스팅

승인된 MCP 클라이언트는 재무 데이터를 조회할 수 있으며, `expenses:write` 권한이 있으면 변경할 수도 있습니다. 연결하기 전에 [개인정보 처리방침](/ko/privacy/)과 해당 클라이언트의 데이터 처리 방침을 확인하세요.

위의 호스팅 URL은 관리형 Expense Budget Tracker 서비스에만 해당합니다. 직접 배포하려면 [자체 호스팅 가이드](/ko/docs/self-hosting/)를 참고해 자체 도메인에 맞는 MCP 엔드포인트와 OAuth 메타데이터를 설정하세요. 구현은 [소스 저장소](https://github.com/kirill-markin/expense-budget-tracker)에서 확인할 수 있습니다.

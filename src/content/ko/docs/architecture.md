---
title: 아키텍처
description: 시스템 구성과 데이터 모델, 여러 통화의 처리 방식, 인증 방식을 설명합니다.
---

## 시스템 개요

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

구성 요소 여섯 개가 데이터베이스 하나를 사용합니다.

1. **web** — 대시보드와 API 경로를 제공하는 Next.js 앱
2. **auth** — 인증 도메인에서 이메일 일회용 인증 코드로 로그인하고 에이전트 연결을 시작하는 인증 서비스
3. **sql-api** — API Gateway를 통해 프로그램의 요청을 처리하는 AWS Lambda
4. **mcp** — 호스팅형 MCP 엔드포인트를 처리하는 전용 AWS Lambda와 API Gateway HTTP API
5. **worker** — ECB, CBR, NBS에서 일별 환율을 가져오는 작업 프로세스
6. **Postgres** — 행 수준 보안을 적용하는 단일 기준 데이터 저장소

## 데이터 모델

- **ledger_entries** — 계좌의 자금 이동(수입, 지출, 이체)마다 행 하나
- **budget_lines** — 예산표 셀 값의 변경 이력을 추가 전용으로 보관하며, 가장 최근에 기록한 값이 적용됩니다.
- **budget_comments** — 예산표 셀에 붙는 메모를 보관하며, 기존 기록을 덮어쓰지 않고 새 기록을 추가합니다.
- **workspace_settings** — 보고 기준 통화와 워크스페이스 단위 설정
- **account_metadata** — 유동성 분류 등 계좌별 메타데이터
- **exchange_rates** — 조회 시 환산에 사용하는 일별 환율
- **workspaces** / **workspace_members** — 테넌트 간 데이터 격리
- **accounts** — 장부 항목을 바탕으로 만든 뷰

## 여러 통화 처리

모든 금액은 원래 통화로 저장합니다. 조회할 때 SQL 조인으로 `exchange_rates`를 참조해 보고 기준 통화로 환산합니다. 원래 통화와 금액 정보가 그대로 남습니다.

## 인증

환경 변수 `AUTH_MODE`로 두 모드 중 하나를 선택합니다.

- `none` — 인증 없이 로컬 워크스페이스 하나를 사용
- `cognito` — AWS Cognito에서 이메일 일회용 인증 코드로 로그인하며 누구나 가입 가능

프로그램에서 API에 연결하려면 공개 API 안내 엔드포인트인 `GET /v1/`에서 시작합니다. 에이전트는 인증 도메인에서 이메일 일회용 인증 코드를 확인하고 장기간 유효한 ApiKey를 받은 뒤 API Gateway의 프로그램용 API로 SQL을 실행합니다.

MCP를 지원하는 클라이언트는 별도로 `https://mcp.expense-budget-tracker.com/mcp`에 연결합니다. 이 경로는 전용 API Gateway HTTP API와 MCP Lambda가 처리하며, 사용자는 브라우저에서 인증 도메인의 OAuth 절차를 거쳐 접근을 승인합니다.

사용자마다 격리된 워크스페이스가 제공됩니다. RLS 정책은 프로그램의 SQL 요청을 포함한 모든 쿼리에서 사용자가 해당 워크스페이스의 멤버인지 확인합니다.

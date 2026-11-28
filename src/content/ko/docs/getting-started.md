---
title: 시작하기
description: 클라우드 버전에 가입하거나 몇 분 안에 직접 호스팅을 시작하는 방법입니다.
---

## 클라우드 버전

가장 빠르게 시작하는 방법은 관리형 클라우드 버전을 이용하는 것입니다.

1. [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)에 접속하세요.
2. 이메일로 가입하세요. 비밀번호 없이 일회용 인증 코드를 사용합니다.
3. 웹 앱에서 지출 기록을 시작하세요.
4. MCP를 지원하는 클라이언트에서는 `https://mcp.expense-budget-tracker.com/mcp`를 추가하고 브라우저에서 접근을 승인하세요.
5. 터미널 에이전트나 직접 HTTP를 호출하는 클라이언트는 `GET https://api.expense-budget-tracker.com/v1/`에서 시작하세요.

설치나 서버 설정이 필요 없습니다. Postgres의 행 수준 보안으로 워크스페이스마다 데이터가 분리됩니다.

## 에이전트와 프로그램에서 접속하기

호스팅 서비스의 사용자 계정 하나로 다음 경로를 모두 이용할 수 있습니다.

- `https://app.expense-budget-tracker.com`의 웹 앱
- `https://mcp.expense-budget-tracker.com/mcp`의 호스팅형 [MCP 커넥터](/ko/docs/mcp-connector/), 브라우저에서 OAuth로 접근 승인
- `GET https://api.expense-budget-tracker.com/v1/`에서 [에이전트 API 설정](/ko/docs/agent-setup/)을 시작한 뒤 `Authorization: ApiKey <key>`로 HTTP 요청 전송

## 자체 호스팅

자체 인스턴스를 운영하려면 [자체 호스팅 가이드](/ko/docs/self-hosting/)를 참고하세요.

## 데모 모드

앱 상단의 **전체/데모** 버튼으로 데모 모드를 켜면 데이터베이스 없이 예시 데이터로 화면을 둘러볼 수 있습니다.

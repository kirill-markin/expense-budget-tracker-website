---
title: 지원
description: 호스팅형 MCP 서비스를 포함한 Expense Budget Tracker의 지원 및 보안 문제 신고 안내입니다.
slug: support
sections:
  - type: simple_markdown_page
---

## 호스팅 서비스 및 MCP 지원

호스팅형 앱이나 사용자 계정, OAuth 인가, 공개 MCP 서버에 관해 도움이 필요하면 [markinkirill@gmail.com](mailto:markinkirill@gmail.com)으로 문의하세요. 가능한 범위에서 지원하며 응답 시간은 보장하지 않습니다.

문제 파악에 필요한 정보만 보내 주세요.

- 클라이언트 이름과 버전
- 문제가 발생한 날짜, 시간, 시간대
- 문제가 발생한 엔드포인트 또는 페이지
- 문제가 발생한 OAuth 단계 또는 MCP 도구 이름
- 민감한 정보만 가린 오류 메시지 원문과 요청 ID(표시된 경우)
- 예상한 결과와 실제 결과

비밀번호, 세션 쿠키, OAuth 코드, 액세스 토큰, 갱신 토큰, API 키, 재무 기록 원본, 민감한 정보를 가리지 않은 요청 본문은 보내지 마세요.

## 보안 문제 신고

취약점이 의심되면 공개 GitHub 이슈에 올리지 마세요. 제목을 **Expense Budget Tracker security report**로 하여 [markinkirill@gmail.com](mailto:markinkirill@gmail.com)으로 신고하세요. 민감한 정보를 제거하고 재현에 필요한 최소한의 정보만 포함하세요. 실제 인증 정보나 재무 데이터는 포함하지 마세요. 접근 권한이 유출됐을 가능성이 있다면 먼저 **설정 > 에이전트 및 프로그램 접근 권한**에서 연결을 해제하고 영향을 받은 다른 인증 정보도 교체하세요.

## 버그, 자체 호스팅 및 커뮤니티 질문

재현할 수 있는 제품 버그, 자체 호스팅 관련 질문, 공개해도 되는 커뮤니티 토론은 [GitHub 이슈 트래커](https://github.com/kirill-markin/expense-budget-tracker/issues)를 이용하세요. 먼저 기존 이슈를 검색하고 로그와 스크린샷에서 비공개 데이터를 제거하세요. 배포나 개발에 관한 내용은 [자체 호스팅 가이드](/ko/docs/self-hosting/)와 [소스 저장소](https://github.com/kirill-markin/expense-budget-tracker)에서 확인할 수 있습니다.

## MCP 문제를 신고하기 전에

클라이언트가 Streamable HTTP를 통한 원격 MCP, PKCE를 사용하는 OAuth 2.1 인가 코드 방식, 동적 클라이언트 등록을 지원하는지 확인하세요. [MCP 가이드](/ko/docs/mcp-connector/)에 나온 공용 엔드포인트를 그대로 사용하고, 연결을 다시 설정한 뒤 한 번 더 시도하세요. 그래도 문제가 발생하면 위에 나열한 진단 정보에서 민감한 내용을 가린 뒤 보내 주세요.

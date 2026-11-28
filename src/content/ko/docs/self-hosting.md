---
title: 자체 호스팅 가이드
description: Docker Compose와 Postgres로 자체 서버에서 Expense Budget Tracker를 실행하세요.
---

## 요구 사항

- Docker 및 Docker Compose
- Postgres 18(Compose 파일에 포함)

## 빠른 시작

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

위 명령으로 Postgres를 시작하고 마이그레이션을 적용하면 다음 구성 요소가 실행됩니다.

- `http://localhost:3000`의 웹 앱
- `http://localhost:8081`의 인증 서비스
- Docker Compose의 환율 작업 프로세스

## 설정

`.env.example`을 `.env`로 복사하고 다음 값을 설정하세요.

- `MIGRATION_DATABASE_URL` — 마이그레이션에 사용하는 데이터베이스 소유자 역할
- `DATABASE_URL` — 웹 프로세스에 사용하는 앱 역할
- `AUTH_DATABASE_URL` — 인증 서비스에 사용하는 인증 스키마 역할
- `AUTH_MODE` — 로컬에서는 `none`, 이메일 일회용 인증 코드를 사용하는 환경에서는 `cognito`
- `AUTH_DOMAIN`, `COOKIE_DOMAIN`, `ALLOWED_REDIRECT_URIS` — 인증 라우팅 및 쿠키 설정

`AUTH_MODE=cognito`를 사용하려면 `.env.example`의 Cognito 설정과 `SESSION_ENCRYPTION_KEY`도 필요합니다.

## 업데이트

```bash
git pull
make up
```

Docker Compose가 서비스를 다시 빌드하고 `migrate` 컨테이너에서 마이그레이션을 다시 실행합니다.

## AWS 배포

프로덕션 CDK 스택에는 ECS Fargate, RDS, ALB, Cognito, API Gateway, Lambda를 사용합니다. 공개 앱 도메인은 다음과 같습니다.

- `app.<domain>` — ALB 뒤의 ECS Fargate에서 실행되는 웹 앱
- `auth.<domain>` — ALB 뒤에서 동작하는 일회용 인증 코드 및 OAuth 서비스
- `api.<domain>/v1/*` — API Gateway와 Lambda를 사용하는 프로그램용 SQL REST API
- `mcp.<domain>/mcp` — 전용 API Gateway HTTP API와 MCP Lambda를 사용하는 호스팅형 MCP 서비스

MCP 사용자 지정 도메인에는 `mcp.<domain>`과 이름이 정확히 일치하는 공개 ACM 인증서가 필요합니다. 인증서 갱신을 위해 DNS 검증용 CNAME을 유지하세요. CDK 배포와 CI에 인증서 ARN을 제공하고 다른 공개 도메인과 함께 `mcp.*` DNS 레코드를 생성하세요.

지원되는 배포 절차와 설정 스크립트는 저장소의 [배포 개요(영어)](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md)와 [AWS CDK 가이드(영어)](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md)에서 확인하세요.

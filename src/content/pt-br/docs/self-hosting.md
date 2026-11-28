---
title: Guia de hospedagem própria
description: Rode o Expense Budget Tracker no seu próprio servidor com Docker Compose e Postgres.
---

## Requisitos

- Docker e Docker Compose
- Postgres 18 (incluído no arquivo do Compose)

## Início rápido

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

O comando inicia o Postgres, executa as migrações e coloca os serviços abaixo em execução.

- o app web em `http://localhost:3000`
- o serviço de autenticação em `http://localhost:8081`
- o worker de taxas de câmbio no Docker Compose

## Configuração

Copie `.env.example` para `.env` e ajuste as seguintes variáveis.

- `MIGRATION_DATABASE_URL` — função de proprietário do banco usada nas migrações
- `DATABASE_URL` — função do app usada pelo processo web
- `AUTH_DATABASE_URL` — função do esquema de autenticação usada pelo serviço de autenticação
- `AUTH_MODE` — `none` para uso local ou `cognito` para ambientes com código de verificação por e-mail
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` e `ALLOWED_REDIRECT_URIS` — roteamento da autenticação e cookies

Com `AUTH_MODE=cognito`, você também precisa das configurações do Cognito e da variável `SESSION_ENCRYPTION_KEY` de `.env.example`.

## Atualização

```bash
git pull
make up
```

O Docker Compose reconstrói os serviços e executa as migrações novamente pelo contêiner `migrate`.

## Implantação na AWS

A stack do CDK em produção usa ECS Fargate, RDS, ALB, Cognito, API Gateway e Lambda. Estes são os domínios públicos do app.

- `app.<domain>` — app web no ECS Fargate por trás do ALB
- `auth.<domain>` — serviço de autenticação com OTP e OAuth por trás do ALB
- `api.<domain>/v1/*` — API REST de SQL para clientes programáticos via API Gateway e Lambda
- `mcp.<domain>/mcp` — serviço MCP hospedado, atendido por uma API HTTP do API Gateway e uma função Lambda dedicadas ao MCP

O domínio personalizado do MCP exige um certificado público do ACM para o nome exato `mcp.<domain>`. Mantenha o CNAME de validação no DNS para a renovação, forneça o ARN do certificado ao processo de implantação do CDK e ao CI, e crie o registro DNS `mcp.*` junto com os outros domínios públicos.

Para ver a ordem das etapas de implantação e os scripts de configuração, consulte a [visão geral da implantação (em inglês)](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) e o [guia do AWS CDK (em inglês)](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) no repositório.

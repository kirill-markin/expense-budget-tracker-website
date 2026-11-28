---
title: Arquitetura
description: Visão geral do sistema, modelo de dados, suporte a várias moedas e modelo de autenticação.
---

## Visão geral do sistema

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

O sistema tem seis componentes, incluindo um único banco de dados.

1. **web** — app Next.js com painéis e rotas de API
2. **auth** — entrada com código de verificação por e-mail e configuração inicial de agentes no domínio de autenticação
3. **sql-api** — AWS Lambda por trás do API Gateway para clientes programáticos
4. **mcp** — AWS Lambda e API HTTP do API Gateway dedicadas ao endpoint MCP hospedado
5. **worker** — busca as taxas de câmbio diárias no ECB, CBR e NBS
6. **Postgres** — fonte única de dados com segurança em nível de linha

## Modelo de dados

- **ledger_entries** — uma linha por movimentação na conta (receita, despesa ou transferência)
- **budget_lines** — células do orçamento com registro de cada alteração, sem sobrescrever as anteriores. Vale a alteração mais recente
- **budget_comments** — notas vinculadas às células do orçamento, adicionadas sem sobrescrever as anteriores
- **workspace_settings** — moeda dos relatórios e configurações do espaço de trabalho
- **account_metadata** — metadados de cada conta, como a classificação de liquidez
- **exchange_rates** — taxas de câmbio diárias usadas para conversão na hora da consulta
- **workspaces** / **workspace_members** — isolamento entre espaços de trabalho
- **accounts** — visão derivada dos lançamentos

## Várias moedas

Todos os valores ficam armazenados na moeda original. A conversão para a moeda dos relatórios ocorre na hora da consulta por meio de junções SQL com `exchange_rates`. Os valores originais ficam intactos.

## Autenticação

A variável de ambiente `AUTH_MODE` define um dos dois modos.

- `none` — sem autenticação, com um único espaço de trabalho local
- `cognito` — autenticação sem senha via AWS Cognito, com código de verificação por e-mail e cadastro aberto

Para clientes programáticos, `GET /v1/` é o ponto de entrada público para descobrir como usar a API. Na configuração inicial, o agente valida o código de verificação enviado por e-mail no domínio de autenticação e recebe uma ApiKey de longa duração. Com a chave, ele executa SQL pela API para clientes programáticos no API Gateway.

Clientes compatíveis com MCP se conectam separadamente a `https://mcp.expense-budget-tracker.com/mcp`. Uma API HTTP do API Gateway e uma função Lambda dedicadas ao MCP atendem esse caminho. A autorização interativa usa OAuth no navegador pelo domínio de autenticação.

Cada usuário recebe um espaço de trabalho isolado. As políticas de RLS verificam se o usuário faz parte do espaço de trabalho em todas as consultas, inclusive nas requisições SQL de clientes programáticos.

---
title: Referência da API
description: Configuração de agentes e referência da API SQL para acesso programático aos seus dados financeiros.
---

## Visão geral

O Expense Budget Tracker disponibiliza uma única API pública para clientes programáticos neste endereço.

`https://api.expense-budget-tracker.com/v1/`

Você pode usar a mesma API de duas formas.

1. **Configuração pelo próprio agente** a partir de `GET /v1/`
2. **Uso direto por HTTP** com uma ApiKey de longa duração que você já tem

Todas as requisições aplicam a mesma segurança em nível de linha do Postgres (RLS) usada no app web.

Se o seu cliente oferece suporte a MCP, use o [conector MCP](/pt-br/docs/mcp-connector/) hospedado em `https://mcp.expense-budget-tracker.com/mcp` e autorize o acesso com OAuth no navegador. Este guia descreve a configuração da API para agentes e como fazer chamadas HTTP diretas com uma `ApiKey` de longa duração.

## Descoberta, código-fonte e esquema em tempo de execução

Comece por este endereço.

`https://api.expense-budget-tracker.com/v1/`

A resposta de descoberta informa aos agentes como iniciar a autenticação e quais endpoints chamar em seguida. Ela também inclui links para o README e para o código-fonte da implementação. A API expõe estes endpoints.

- `GET /v1/schema`
- `GET /v1/openapi.json` e `GET /v1/swagger.json`, endpoints de compatibilidade que informam que OpenAPI não está disponível e encaminham o cliente à descoberta e ao código-fonte

Use `schema` para obter a lista exata de relações e colunas permitidas por `/v1/sql/query`, `/v1/sql/execute` e pela rota de compatibilidade `/v1/sql`.

## Configuração pelo próprio agente

Se quiser que o Claude Code, o Codex, o OpenClaw ou outro agente se conecte por conta própria, comece pelo endpoint de descoberta e siga as ações retornadas pelo servidor.

### Fluxo de autenticação

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Ler a ação `send_code` e a `bootstrapUrl` retornadas
3. Enviar o e-mail do usuário via `POST` para `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Receber `otpSessionToken`
5. Pedir ao usuário o código de verificação de 8 dígitos enviado por e-mail
6. Enviar `code`, `otpSessionToken` e `label` via `POST` para `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Receber uma `ApiKey` de longa duração
8. Salvar a chave fora da memória do chat
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Se necessário, usar `POST https://api.expense-budget-tracker.com/v1/workspaces` para criar um espaço de trabalho
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Ler dados com `POST https://api.expense-budget-tracker.com/v1/sql/query` e enviar alterações aprovadas com `POST https://api.expense-budget-tracker.com/v1/sql/execute`

### Cabeçalho de autenticação

- `Authorization: ApiKey <key>`

### Seleção do espaço de trabalho

- `POST /v1/workspaces/{workspaceId}/select` salva o espaço de trabalho padrão para a chave de API
- Depois de salvar um espaço de trabalho, as rotas `/v1/sql/query`, `/v1/sql/execute` e a rota de compatibilidade `/v1/sql` podem omitir `X-Workspace-Id`
- `X-Workspace-Id: <workspaceId>` continua disponível para substituir o espaço salvo em uma requisição específica
- Se o usuário tiver exatamente um espaço de trabalho e a chave ainda não tiver uma seleção salva, a API salva e usa esse espaço automaticamente

Para ver o passo a passo de conexão, consulte o guia de [configuração de agentes de IA](/pt-br/docs/agent-setup/).

## Uso direto por HTTP com uma chave existente

Scripts, tarefas de cron, painéis e apps personalizados podem chamar a mesma API diretamente se já tiverem uma ApiKey de longa duração.

### Autenticação

Passe a chave no cabeçalho de autenticação ApiKey.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` só é necessário se a chave ainda não tiver um espaço de trabalho padrão salvo ou se você quiser substituir o espaço salvo nessa requisição.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` quando necessário

## Resumo dos endpoints

- `GET /v1/` — documento público de descoberta
- `GET /v1/openapi.json` e `GET /v1/swagger.json` — endpoints de compatibilidade que indicam onde encontrar o código-fonte, sem retornar uma especificação da API
- `GET /v1/me` — contexto da conta de usuário autenticada
- `GET /v1/workspaces` — lista os espaços de trabalho disponíveis para o titular da chave
- `POST /v1/workspaces` — cria um espaço de trabalho
- `POST /v1/workspaces/{workspaceId}/select` — salva o espaço de trabalho padrão para esta chave
- `GET /v1/schema` — consulta as relações e colunas permitidas em SQL
- `POST /v1/sql/query` — executa uma instrução `SELECT` ou `WITH ... SELECT` em modo somente leitura
- `POST /v1/sql/execute` — executa uma instrução `INSERT`, `UPDATE` ou `DELETE` já aprovada
- `POST /v1/sql` — endpoint de compatibilidade para scripts atômicos com várias instruções

## Política de SQL

Os endpoints principais separam leituras e alterações de dados.

- `POST /v1/sql/query` aceita exatamente uma instrução somente leitura, `SELECT` ou `WITH ... SELECT`
- `POST /v1/sql/execute` aceita exatamente uma instrução de alteração, `INSERT`, `UPDATE` ou `DELETE`, incluindo as formas compatíveis com `WITH`
- A rota de compatibilidade `POST /v1/sql` aceita scripts restritos com várias instruções e os executa de forma atômica. Use essa rota só quando precisar dessa execução atômica

O servidor bloqueia ou rejeita os seguintes usos.

- Várias instruções nos endpoints principais `/v1/sql/query` e `/v1/sql/execute`
- DDL, como `CREATE`, `DROP` e `ALTER`
- Controle de transações com `BEGIN`, `COMMIT` e `ROLLBACK`
- `set_config()`
- Comentários SQL
- Identificadores entre aspas
- Strings delimitadas por cifrões

O servidor também restringe as relações que podem ser consultadas. Use `/v1/schema` para verificar as relações e colunas expostas antes de gerar SQL.

As relações expostas atualmente são as seguintes.

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (somente leitura)
- `fx_rates_raw` (somente leitura)
- `fx_rates_daily` (somente leitura)

## Limites

- 100 linhas retornadas por requisição
- 100 linhas afetadas por instrução de alteração e também por requisição
- Prazo total de 25 segundos por requisição SQL
- 10 requisições por segundo e 10.000 por dia por chave

## Segurança

- As chaves de API são armazenadas como hashes SHA-256. O valor em texto puro nunca é gravado
- A segurança em nível de linha (RLS) isola os espaços de trabalho no banco de dados
- Você pode revogar chaves a qualquer momento no app
- Ao remover alguém de um espaço de trabalho, todas as chaves dessa pessoa são revogadas automaticamente

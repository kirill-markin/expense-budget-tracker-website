---
title: Configuração de agentes de IA
description: Passe uma única URL de descoberta para o Claude Code, o Codex ou o OpenClaw. O agente segue as instruções retornadas pelo serviço, verifica o código de 8 dígitos, salva a ApiKey de longa duração e começa a operar no seu espaço de trabalho.
---

## O link para passar ao agente

Compartilhe esta URL exata.

`https://api.expense-budget-tracker.com/v1/`

Esse endpoint é o documento público oficial de descoberta para agentes de IA. Ele informa ao agente como iniciar a autenticação, quais endpoints chamar em seguida, qual método de autenticação usar depois e onde encontrar o esquema disponível em tempo de execução e a implementação de código aberto.

Este guia explica como configurar o acesso direto à API para agentes a partir do terminal ou de um cliente HTTP. Se seu cliente oferece suporte a MCP, use o [conector MCP](/pt-br/docs/mcp-connector/) hospedado. Ele se conecta a `https://mcp.expense-budget-tracker.com/mcp` e solicita autorização interativa com OAuth no navegador, sem esse fluxo inicial de ApiKey.

## O que você faz

1. Abra o Claude Code, o Codex, o OpenClaw ou outro agente que possa fazer requisições HTTP.
2. Peça ao agente para se conectar ao Expense Budget Tracker usando `https://api.expense-budget-tracker.com/v1/`.
3. Quando o agente pedir um endereço de e-mail, informe o que você usa no Expense Budget Tracker.
4. Procure na caixa de entrada o código de verificação de 8 dígitos.
5. Envie esse código ao agente.
6. Deixe o agente salvar a ApiKey retornada fora da memória do chat. Depois, prossiga com a importação, a consulta ou o planejamento do orçamento.

Depois de verificar o código enviado por e-mail, o agente configura a própria conexão. Você entra sem precisar copiar e colar a chave.

## O que o agente faz

A sequência completa é a seguinte.

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Ler a resposta de descoberta e seguir as ações retornadas para determinar as próximas etapas
3. Enviar o e-mail do usuário via `POST` para a `bootstrapUrl` retornada
4. Receber `otpSessionToken` e a ação `verify_code`
5. Pedir ao usuário o código de verificação de 8 dígitos enviado por e-mail
6. Enviar `code`, `otpSessionToken` e o `label` da conexão via `POST` para `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Receber uma nova `ApiKey`
8. Salvar a chave fora da memória do chat, de preferência como `EXPENSE_BUDGET_TRACKER_API_KEY`
9. `GET https://api.expense-budget-tracker.com/v1/me` com `Authorization: ApiKey <key>`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Se necessário, criar um espaço de trabalho com `POST /v1/workspaces`
12. Salvar um espaço de trabalho padrão com `POST /v1/workspaces/{workspaceId}/select`
13. Inspecionar as relações permitidas com `GET https://api.expense-budget-tracker.com/v1/schema`
14. Ler dados com `POST https://api.expense-budget-tracker.com/v1/sql/query` e enviar alterações aprovadas com `POST https://api.expense-budget-tracker.com/v1/sql/execute`

O espaço de trabalho é selecionado explicitamente e essa escolha fica salva. Após `POST /v1/workspaces/{workspaceId}/select`, o espaço selecionado fica associado à chave de API. As chamadas seguintes a `/v1/sql/query` e `/v1/sql/execute` podem omitir `X-Workspace-Id`. Você ainda pode enviar `X-Workspace-Id` para substituir o espaço de trabalho salvo em uma requisição específica. Reserve a rota de compatibilidade `POST /v1/sql` para scripts atômicos com várias instruções. Use as rotas de consulta e execução para leituras e alterações comuns.

Se o usuário tiver exatamente um espaço de trabalho e a chave ainda não tiver uma seleção salva, o backend salva e usa esse espaço automaticamente.

## O que o agente deve armazenar

A chave retornada por `verify-code` é de longa duração. Guarde-a fora da memória do chat.

- Se o usuário aprovar a gravação de arquivos, salve a chave em um arquivo local `.env` como `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`
- Caso contrário, exporte a chave no shell atual como `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` e peça ao usuário que a armazene em um local persistente

As requisições autenticadas usam os seguintes cabeçalhos.

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` só para substituir o espaço de trabalho salvo ou enquanto não houver uma seleção salva

## Se você é um agente de IA

Comece com o comando abaixo.

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Em seguida, siga as ações retornadas pelo servidor. Se o documento de descoberta já fornece os próximos passos, use-os diretamente.

Depois de `verify-code`, armazene a `ApiKey` retornada em segurança. Em seguida, consulte os endpoints abaixo.

- `/v1/me` para obter o contexto da conta de usuário
- `/v1/workspaces` para listar os espaços de trabalho disponíveis
- `/v1/schema` para consultar as relações e colunas SQL permitidas
- `/v1/openapi.json` ou `/v1/swagger.json` somente quando um cliente testa as URLs convencionais da especificação. Essas rotas apontam para o documento de descoberta e para o código-fonte, sem retornar uma especificação da API

## Exemplos de prompts para pessoas

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

## O que você pode fazer depois da configuração

- Importar extratos bancários ou arquivos exportados do cartão
- Classificar transações usando suas categorias atuais
- Conciliar os saldos das contas com os saldos do banco
- Consultar despesas por categoria, período, estabelecimento ou conta
- Atualizar as linhas do orçamento do próximo mês

Para ver os endpoints e os detalhes de autenticação, consulte a [referência da API](/pt-br/docs/api/).

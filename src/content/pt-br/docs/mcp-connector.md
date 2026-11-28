---
title: Conector MCP
description: Conecte um cliente MCP ao Expense Budget Tracker com OAuth para consultar ou atualizar dados financeiros com segurança.
---

## Visão geral

O Expense Budget Tracker oferece um conector hospedado do Model Context Protocol (MCP) neste endereço.

`https://mcp.expense-budget-tracker.com/mcp`

O endpoint usa Streamable HTTP e OAuth. Passe essa URL para um cliente MCP com suporte a servidores Streamable HTTP remotos e à descoberta de OAuth. O fluxo de autorização abre um navegador para você entrar e aprovar o acesso.

As credenciais do conector MCP são os tokens de acesso e de atualização do OAuth. A `ApiKey` de longa duração descrita na [referência da API para agentes](/pt-br/docs/api/) pertence a uma integração HTTP direta e separada. O endpoint MCP não aceita essa chave.

## Descoberta e conexão OAuth

O conector hospedado publica os metadados do recurso protegido neste endereço.

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Esses metadados indicam aos clientes qual é o servidor de autorização. Os metadados desse servidor estão neste endereço.

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Um cliente compatível segue estas etapas.

1. Conecta-se a `https://mcp.expense-budget-tracker.com/mcp` e descobre os metadados do recurso protegido.
2. Registra-se dinamicamente como cliente OAuth público. O fluxo usa um cliente público sem segredo de cliente.
3. Inicia o fluxo de código de autorização (Authorization Code) e abre a URL de autorização no navegador do usuário.
4. Usa PKCE em todas as solicitações de autorização. `S256` é o único método de desafio de código aceito.
5. Solicita `expenses:read`. Adiciona `expenses:write` só se precisar chamar `sql_execute`.
6. Troca o código de autorização por tokens de acesso e de atualização e renova o acesso quando necessário.

Guarde os tokens somente no armazenamento de credenciais do cliente MCP. Nunca os copie para prompts, históricos de conversas, arquivos de código ou logs.

## Escopos

- `expenses:read` é obrigatório. Permite descobrir espaços de trabalho, inspecionar o esquema e fazer consultas somente leitura.
- `expenses:write` é opcional. Concede acesso separado à ferramenta `sql_execute`, que pode criar, alterar ou excluir dados.

Solicite apenas os escopos necessários para a tarefa. Se o cliente só analisa dados ou gera relatórios, basta solicitar `expenses:read`, sem `expenses:write`.

## Ferramentas

### `list_workspaces`

Lista os espaços de trabalho acessíveis ao usuário autenticado. Use o identificador retornado para definir explicitamente o espaço de trabalho antes de ler ou alterar dados.

### `get_schema`

Retorna as relações e colunas expostas ao MCP para o espaço de trabalho selecionado. Chame esta ferramenta antes de escrever SQL para obter os nomes exatos das tabelas e colunas.

### `sql_query`

Executa uma única consulta SQL restrita, somente leitura, no espaço de trabalho selecionado. O próprio banco de dados impõe a restrição de somente leitura. A consulta retorna até 100 linhas e tem limite de execução de 20 segundos.

### `sql_execute`

Executa SQL restrito que altera dados no espaço de trabalho selecionado. Essa ferramenta pode excluir dados e exige o escopo separado `expenses:write`. Confirme o espaço de trabalho e revise a instrução SQL exata antes de aprovar a chamada.

O servidor MCP também permite alterações via `sql_execute`. A garantia de somente leitura vale especificamente para `sql_query` e é imposta pelo banco de dados.

## Uso seguro

1. Chame `list_workspaces` e confirme com o usuário qual espaço de trabalho deve usar.
2. Chame `get_schema` antes de gerar SQL.
3. Use `sql_query` para inspeção, totais, conciliação e relatórios.
4. Solicite `expenses:write` só para tarefas que precisam alterar dados.
5. Antes de usar `sql_execute`, mostre a instrução exata e o efeito esperado, depois confirme novamente o espaço de trabalho.
6. Depois de alterar os dados, use `sql_query` para verificar o resultado.

O servidor restringe as instruções SQL aceitas e as relações expostas. Além desses controles, revise com cuidado o SQL gerado.

## Limites

- até 100 linhas por resultado SQL
- prazo de execução de 20 segundos
- acesso limitado aos espaços de trabalho disponíveis para o usuário autenticado
- `sql_query` aceita um conjunto restrito de instruções SQL e o banco de dados impõe a restrição de somente leitura
- `sql_execute` exige `expenses:write` além do escopo obrigatório de leitura

## Privacidade e hospedagem própria

Um cliente MCP autorizado pode ler dados financeiros e, com `expenses:write`, alterá-los. Consulte a [política de privacidade](/pt-br/privacy/) e a política de tratamento de dados do cliente antes de conectá-lo.

Os endereços acima valem apenas para o serviço gerenciado do Expense Budget Tracker. Para rodar sua própria instância, comece pelo [guia de hospedagem própria](/pt-br/docs/self-hosting/) e configure o endpoint MCP e os metadados OAuth para seus domínios. A implementação está disponível no [repositório do código-fonte](https://github.com/kirill-markin/expense-budget-tracker).

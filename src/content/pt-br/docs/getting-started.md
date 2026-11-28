---
title: Primeiros passos
description: Crie uma conta na versão na nuvem ou configure sua própria instância em minutos.
---

## Versão na nuvem

A forma mais rápida de começar é usar a versão gerenciada na nuvem.

1. Acesse [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Cadastre-se com seu e-mail e use o código de verificação para entrar sem senha
3. Comece a acompanhar suas despesas no app web
4. Se o seu cliente for compatível com MCP, adicione `https://mcp.expense-budget-tracker.com/mcp` e autorize o acesso no navegador
5. Se você usa um agente de terminal ou um cliente HTTP direto, comece com `GET https://api.expense-budget-tracker.com/v1/`

Você não precisa instalar nada nem configurar um servidor. A segurança em nível de linha no Postgres isola seus dados por espaço de trabalho.

## Acesso por agentes e programas

Você pode usar a mesma conta do serviço hospedado nestes três casos.

- a interface web em `https://app.expense-budget-tracker.com`
- o [conector MCP](/pt-br/docs/mcp-connector/) hospedado em `https://mcp.expense-budget-tracker.com/mcp`, com autorização OAuth pelo navegador
- a [configuração da API para agentes](/pt-br/docs/agent-setup/) a partir de `GET https://api.expense-budget-tracker.com/v1/`, seguida de requisições HTTP diretas com `Authorization: ApiKey <key>`

## Hospedagem própria

Se preferir rodar sua própria instância, veja o [guia de hospedagem própria](/pt-br/docs/self-hosting/).

## Modo de demonstração

O app tem um modo de demonstração integrado. Use o botão **Tudo/Demo** no cabeçalho para explorar a interface com dados de exemplo, sem precisar de um banco de dados.

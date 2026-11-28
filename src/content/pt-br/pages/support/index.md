---
title: Suporte
description: Como pedir suporte e relatar problemas de segurança no Expense Budget Tracker, incluindo o serviço MCP hospedado.
slug: support
sections:
  - type: simple_markdown_page
---

## Suporte ao serviço hospedado e ao MCP

Para pedir ajuda com o app hospedado, sua conta de usuário, a autorização OAuth ou o servidor MCP público, escreva para [markinkirill@gmail.com](mailto:markinkirill@gmail.com). Prestamos suporte conforme nossa disponibilidade, sem garantia de prazo de resposta.

Envie apenas as informações necessárias para investigar o problema.

- Nome e versão do cliente.
- Data, hora e fuso horário da falha.
- Endpoint ou página em que ocorreu a falha.
- Etapa do OAuth ou nome da ferramenta MCP.
- Mensagem exata do erro, com os dados sensíveis removidos, e ID da requisição, se exibido.
- O resultado que você esperava e o que aconteceu.

Nunca envie senhas, cookies de sessão, códigos OAuth, tokens de acesso ou de atualização, chaves de API, registros financeiros brutos ou o corpo de uma requisição sem ocultar os dados sensíveis.

## Relatos de problemas de segurança

Se você suspeitar de uma vulnerabilidade, mantenha o relato fora das issues públicas do GitHub. Envie um e-mail para [markinkirill@gmail.com](mailto:markinkirill@gmail.com) com o assunto **Expense Budget Tracker security report** e os passos mínimos para reproduzir o problema, com os dados sensíveis removidos. Ao preparar o relato, remova credenciais ativas e dados financeiros. Se o acesso pode ter sido comprometido, primeiro revogue a conexão em **Configurações > Acesso de agentes e programas** e substitua as demais credenciais afetadas.

## Bugs, hospedagem própria e perguntas à comunidade

Use as [issues do GitHub](https://github.com/kirill-markin/expense-budget-tracker/issues) para relatar bugs reproduzíveis, tirar dúvidas sobre hospedagem própria e conversar com a comunidade sobre assuntos que podem ser públicos. Pesquise as issues existentes primeiro e remova dados privados de logs e capturas de tela. O [guia de hospedagem própria](/pt-br/docs/self-hosting/) e o [repositório do código-fonte](https://github.com/kirill-markin/expense-budget-tracker) cobrem dúvidas de implantação e desenvolvimento.

## Antes de relatar um problema com MCP

Confirme que seu cliente oferece suporte a MCP remoto via Streamable HTTP, ao fluxo de código de autorização do OAuth 2.1 com PKCE e ao registro dinâmico de clientes (Dynamic Client Registration). Use o endpoint universal exatamente como aparece no [guia MCP](/pt-br/docs/mcp-connector/). Refaça a conexão e tente mais uma vez. Se o problema continuar, envie os detalhes de diagnóstico acima com os dados sensíveis removidos.

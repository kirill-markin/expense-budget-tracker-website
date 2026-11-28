---
title: Política de privacidade
description: Política de privacidade do Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: agosto de 2026
---
## O que coletamos

Quando você usa a versão na nuvem, armazenamos os dados financeiros que você insere (transações, orçamentos e nomes de contas) e seu endereço de e-mail para autenticação. Instâncias com hospedagem própria não nos enviam dados.

## Operadora do serviço

A SAMO DANNI EOOD (VAT: BG207395566) opera o serviço hospedado do Expense Budget Tracker. Kirill Markin criou o Expense Budget Tracker. O site pessoal do criador, [kirill-markin.com](https://kirill-markin.com/), também está ligado a esse conjunto de produtos.

Esta política se aplica ao site, ao app, à API e ao serviço MCP remoto que hospedamos. As instâncias com hospedagem própria continuam sob o controle de quem as opera.

## Como usamos seus dados

Usamos seus dados financeiros exclusivamente para prestar o serviço. Não vendemos esses dados nem os usamos para publicidade. Só os compartilhamos com um cliente de terceiros quando você instrui o serviço a fazer isso, por exemplo, ao autorizar uma conexão MCP. Isolamos cada espaço de trabalho com a segurança em nível de linha do Postgres.

## MCP e clientes de IA de terceiros

Quando você conecta um cliente de IA ao serviço MCP hospedado, o Expense Budget Tracker processa a solicitação de autorização OAuth, a ferramenta solicitada e seus argumentos, o espaço de trabalho selecionado e os registros financeiros necessários para responder à consulta ou aplicar a alteração aprovada. O serviço grava as alterações feitas via MCP nos mesmos dados financeiros hospedados que o app web usa.

O serviço armazena o nome e as URLs de redirecionamento do cliente registrado, os metadados da conexão e dos escopos, as datas e os horários de criação, atividade e revogação e os hashes unidirecionais dos códigos de autorização OAuth e dos tokens de acesso e de atualização. O serviço armazena somente os hashes dos tokens OAuth. O serviço MCP não salva a conversa do cliente de IA como uma conversa no app, embora receba cada chamada de ferramenta e devolva o resultado solicitado.

O cliente de IA é um terceiro independente e pode processar ou reter prompts, argumentos das ferramentas e dados financeiros retornados, de acordo com seus próprios termos e política de privacidade. Consulte a política do cliente antes de conectá-lo. Você pode revogar uma conexão MCP a qualquer momento em **Configurações > Acesso de agentes e programas**. Nas Configurações, você também pode excluir sua conta de usuário e os dados hospedados associados, conforme descrito abaixo.

## Armazenamento de dados

Os dados na nuvem ficam no AWS RDS (Postgres), na região eu-central-1, com backups automáticos diários. Os dados são criptografados em repouso e em trânsito.

## Cookies

Usamos um cookie `session` para autenticação (HttpOnly, Secure, SameSite=Lax). Não usamos cookies de rastreamento nem ferramentas de análise de terceiros.

## Exclusão de dados

Você pode excluir sua conta de usuário e todos os dados associados a qualquer momento nas Configurações do app. Em instâncias com hospedagem própria, você controla diretamente o banco de dados.

## Código aberto

Todo o código-fonte é aberto. Você pode auditar exatamente o que o app faz com seus dados.

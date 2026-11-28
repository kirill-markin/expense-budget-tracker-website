---
title: "Como controlar despesas com Claude Code e conciliar extratos"
description: "Conecte o Claude Code ao Expense Budget Tracker com um link, confira a prévia da importação do extrato antes de aprová-la, concilie saldos e atualize o orçamento sem conectar seu banco."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "controle de despesas com Claude Code"
  - "controle de gastos com Claude"
  - "app de despesas para Claude"
  - "controle de orçamento com Claude Code"
  - "conectar Claude a um app de despesas"
  - "importar extrato bancário com Claude Code"
---

A conciliação de um extrato de quatro linhas pode mostrar uma diferença de `€0.00` mesmo com um erro no orçamento. Classifique uma compra de supermercado de €54.20 como Viagens em vez de Supermercado e o saldo da conta continua certo, mas o relatório por categoria fica com uma diferença de €54.20.

Para acompanhar despesas com Claude Code, confira se os lançamentos explicam o saldo do banco e se as categorias registradas batem com o extrato que você revisou. O Claude Code pode extrair os dados do arquivo, fazer as contas e chamar a API. Você escolhe a conta e as categorias, revisa os registros propostos e aprova as alterações exatas.

Nesse fluxo, o Expense Budget Tracker não mantém conexão direta com o banco nem oferece envio de extratos pelo app. Exporte o extrato, coloque o arquivo onde o Claude Code tem permissão para ler e envie só os registros aprovados pela API gerenciada para agentes. Se sua prioridade é evitar que o app tenha acesso contínuo ao banco, veja o guia sobre [apps de orçamento sem conexão bancária (em inglês)](/blog/budget-app-without-bank-linking/).

![Um restaurador de mosaicos retira uma peça azul fora de lugar de uma faixa de terracota, ao lado de uma balança de latão equilibrada](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Conecte o Claude Code com um link de descoberta

Instale o Claude Code e entre seguindo o [guia rápido oficial da Anthropic (em inglês)](https://code.claude.com/docs/en/quickstart). A [referência da CLI (em inglês)](https://code.claude.com/docs/en/cli-reference) explica como funcionam os diretórios de trabalho e o acesso a outros arquivos.

Abra `claude` no diretório que contém o extrato ou conceda acesso a esse diretório por um método compatível com a sua configuração. Em seguida, cole o prompt abaixo.

```text
Connect to Expense Budget Tracker from this discovery link:
https://app.expense-budget-tracker.com/api/agent

Fetch it with GET, read the returned JSON, and follow the current action URLs. Do not
guess or hardcode the API flow. Ask me for my Expense Budget Tracker email and start
the email OTP flow.
After that request succeeds, tell me to check spam or junk if the message is not
visible, ask me for the 8-digit code, and follow the returned verification action.

After verification, ask me to approve a persistent storage location for the returned
ApiKey outside chat memory and source control. Load my account context, list my
workspaces, ask me to confirm the target workspace, save it as the default for this
key, and inspect the live schema. Run one small read-only query to confirm the selected
workspace. Do not write financial data.
```

O [link para agentes no domínio do app](https://app.expense-budget-tracker.com/api/agent) retorna o documento de descoberta atual. Hoje, ele fornece `https://api.expense-budget-tracker.com/v1/` como base da API, junto com as URLs de autenticação e das ações SQL. Cole o link do app para que o Claude Code siga os endereços retornados pelo serviço a cada conexão.

O mesmo fluxo por e-mail serve para criar uma conta e entrar. Depois que você informa o código de verificação de 8 dígitos, o Claude Code recebe uma `ApiKey` de longa duração. Aprove um local específico para guardar a chave, como um arquivo de segredos fora do controle de versão. Mantenha a chave fora do `CLAUDE.md` e de qualquer commit. O guia de [configuração de agentes de IA](/pt-br/docs/agent-setup/) detalha a autenticação e a escolha do espaço de trabalho.

## Quando usar a API para agentes ou o MCP

Você pode usar o Claude para controlar despesas de duas formas. Aqui, o Claude Code roda no terminal e usa a API para agentes. Já o Claude e o Claude Desktop podem usar o conector MCP remoto hospedado.

| | Claude Code com API para agentes | Claude ou Claude Desktop com MCP |
|---|---|---|
| Uso indicado | Trabalho no terminal com arquivos locais acessíveis e chamadas HTTP diretas | Conversas em um cliente Claude compatível com MCP |
| Ponto de partida | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Autenticação | Código de verificação por e-mail, seguido de uma `ApiKey` de longa duração | OAuth no navegador |
| Acesso aos dados | URLs de descoberta que levam aos endpoints de consulta e execução | Ferramenta `sql_query` e, opcionalmente, `sql_execute` |
| Acesso ao extrato | Arquivos e diretórios disponíveis para a sessão do Claude Code | O conector remoto não dá acesso a arquivos locais |

As credenciais de uma integração não funcionam na outra. Para usar o Claude no navegador ou no desktop, siga o [guia do conector MCP para Claude (em inglês)](/blog/claude-expense-tracker-mcp-connector/). Use o fluxo da API para agentes abaixo quando a tarefa começar com um arquivo que o Claude Code já pode acessar.

- O provedor do modelo processa os dados separadamente da API e do armazenamento do Expense Budget Tracker. Antes de compartilhar dados do extrato, consulte a [documentação de uso de dados do Claude Code (em inglês)](https://code.claude.com/docs/en/data-usage) e os termos do provedor configurado na sua instalação.
- A configuração local com Docker Compose, descrita no [guia de hospedagem própria](/pt-br/docs/self-hosting/), sobe o app web, o serviço de autenticação, o banco de dados e o worker de câmbio. A API gerenciada para agentes usada aqui fica fora dessa configuração local. A implantação na AWS descrita no repositório inclui a API pública para clientes programáticos e tem uma configuração própria.

## Defina o que entra na importação

Na primeira vez, use uma conta, uma moeda e um período de extrato já fechado. Um CSV facilita a revisão das linhas. Para qualquer outro formato, peça ao Claude Code que confirme se consegue ler o arquivo no seu ambiente e mostre as linhas que conseguiu extrair. A extensão do arquivo, por si só, não garante compatibilidade.

Passe estas seis informações ao Claude Code.

1. O caminho local do extrato.
2. A conta no banco e a conta correspondente no Expense Budget Tracker.
3. A moeda da conta.
4. A primeira e a última data de efetivação dos lançamentos.
5. O saldo inicial ou o último saldo anterior já conferido.
6. O saldo final do extrato.

Deixe as transações pendentes de fora até que sejam efetivadas. Mantenha o arquivo de origem intacto e peça ao Claude Code que gere uma prévia à parte.

Você pode usar estas regras em um `CLAUDE.md` local, no diretório de finanças.

```markdown
# Expense Budget Tracker workflow

- Start from https://app.expense-budget-tracker.com/api/agent and follow discovery.
- Confirm the target workspace and inspect the live schema before writing SQL.
- Use the read action for all inspection and reconciliation.
- Before a write, show the source totals, possible duplicates, exact SQL, and expected rows.
- Wait for my explicit approval of the complete change set.
- Use the write action only for the approved INSERT, UPDATE, or DELETE.
- Verify every write with a fresh read.
- Never invent a balancing entry or silently resolve an uncertain category.
- Keep the ApiKey outside this file and outside source control.
```

Inclua informações que mudam pouco, como os nomes reais das contas, as regras de categorização, a convenção para transferências e a moeda dos relatórios. Use as categorias dos exemplos do artigo só se elas corresponderem às dos seus lançamentos.

## Revise uma prévia completa antes de importar o extrato

Com a conexão funcionando, cole o prompt abaixo e substitua os valores entre colchetes.

```text
Import [local statement path] into [tracker account] for [posted start date] through
[posted end date] in [currency]. The opening balance is [amount] and the bank's closing
balance is [amount].

First confirm the selected workspace and inspect the live schema. Use only the read
action to inspect the target account, existing categories, and ledger rows that overlap
the statement period. Confirm that you can read the local file, parse it, and prepare a
complete preview without writing anything.

For every source row, show its source identifier or row number, posted date, signed
amount, currency, target account, proposed transaction type, proposed category, and
duplicate status. Flag transfers, refunds, reimbursements, fees, foreign-currency rows,
unfamiliar counterparties, and uncertain classifications.

Then show the source row count and signed total, all proposed ledger rows, possible
duplicates, the exact SQL you would send, and the expected affected-row count. Stop
and wait for my explicit approval of the complete change set.
```

Até você aprovar uma alteração, o agente só consulta o banco de dados. O Claude Code deve verificar os nomes das colunas no esquema atual, identificar a conta correspondente e consultar as linhas já registradas no mesmo intervalo de datas. Uma transação com data e valor iguais é uma possível duplicata. Duas compras legítimas podem ter a mesma data e o mesmo valor.

### Um exemplo com quatro linhas

Imagine que o extrato de uma conta corrente tenha saldo inicial de €1,250.00 e quatro lançamentos efetivados.

| Linha | Data de lançamento | Descrição | Valor com sinal | Tipo proposto | Categoria proposta | Observação para revisão |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Salário | +€2,000.00 | Receita | Salário | Sem dúvidas |
| 2 | 2026-09-02 | Supermercado | −€54.20 | Despesa | Supermercado | Confira o estabelecimento se não o reconhecer |
| 3 | 2026-09-03 | Transferência para a poupança | −€300.00 | Transferência | — | Confirme a outra conta |
| 4 | 2026-09-04 | Cafeteria | −€8.40 | Despesa | Refeições fora de casa | Sem dúvidas |

A soma dos quatro valores com sinal é `+€1,637.40`. Somada ao saldo inicial de `€1,250.00`, ela dá um saldo final esperado de `€2,887.40`. Este exemplo cabe em uma tela. Em uma importação maior, a prévia ainda precisa mostrar todas as linhas do extrato e sinalizar todas as dúvidas.

Em uma transferência, confirme a outra conta, pois movimentar dinheiro entre suas próprias contas não conta como despesa. Estornos e reembolsos também devem manter o tipo correspondente. Se houver dúvida sobre a classificação, deixe-a sinalizada para decisão.

### Aprove o conjunto exato de alterações

Revise o espaço de trabalho, a conta, as datas de início e fim, o número de linhas, a soma com sinais, as possíveis duplicatas e as classificações. Aprove a prévia e o SQL específicos. Uma instrução genérica para “importar tudo” deixa em aberto o que será alterado.

A API para agentes separa consultas de alterações. O Claude Code usa a ação de leitura retornada na descoberta para um único `SELECT` ou `WITH ... SELECT`. O agente só usa a ação de escrita para um `INSERT`, `UPDATE` ou `DELETE` que você tenha aprovado explicitamente. Confira as tabelas e colunas no esquema atual. A [referência da API](/pt-br/docs/api/) explica o contrato e os limites de SQL.

### Teste inserções e atualizações em grande volume antes de rodar os lotes

Antes de um `INSERT` ou `UPDATE` que afete muitas linhas, as instruções atuais de descoberta orientam o agente a enviar um teste representativo com a mesma estrutura SQL. Use de 1 a 3 linhas com valores literais para um `INSERT` ou uma única linha específica para um `UPDATE`. A aprovação cobre o teste e as linhas restantes do conjunto revisado.

Se o teste passar, o Claude Code deve seguir de imediato em lotes sequenciais de até 100 registros e verificar cada lote. Uma importação aprovada de 247 linhas, com 3 no teste, deixa lotes de 100, 100 e 44. Peça uma nova aprovação se o escopo mudar, surgir uma dúvida ou a execução falhar. Os lotes seguintes do conjunto já aprovado podem prosseguir.

O SQL restrito não aceita `ON CONFLICT`, então trate duplicatas de forma explícita. Os resultados de leitura têm limite de 100 linhas. O Claude Code deve verificar nos metadados da resposta a contagem de linhas e se houve truncamento, calcular os totais no SQL e dividir a conferência detalhada em consultas menores e ordenadas. Para conferir a importação inteira, inclua as linhas que ficaram fora de qualquer resposta truncada.

### Consulte novamente as linhas registradas

Uma resposta de sucesso da API confirma que a requisição foi executada. Consulte novamente a conta e o período afetados para verificar se os dados armazenados correspondem à prévia. Compare os itens abaixo.

- Número de linhas inseridas.
- Datas, valores com sinal e moedas.
- Conta atribuída.
- Tipos e categorias das transações.
- Possíveis duplicatas.
- Totais por lote e total do extrato completo.

Se encontrar diferenças, volte ao diagnóstico em modo somente leitura. Revise uma correção específica antes de alterar dados mais uma vez. O [guia de importação de extratos bancários (em inglês)](/blog/how-to-import-bank-statements-into-an-expense-tracker/) aprofunda a análise de períodos sobrepostos, estornos e transferências.

## Concilie o saldo e confira as categorias separadamente

Conciliar o saldo é conferir se as movimentações registradas explicam o saldo final do banco para o mesmo intervalo de datas de lançamento.

Em uma conta de depósito comum, calcule o saldo esperado com esta fórmula.

**saldo final esperado = saldo inicial + entradas efetivadas − saídas efetivadas**

Se os valores já têm sinal, use a soma das movimentações.

**saldo final esperado = saldo inicial + soma das movimentações efetivadas com sinal**

Contas que representam dívidas, como cartões de crédito, podem usar outra convenção de sinais. O Claude Code deve informar a convenção encontrada antes de calcular a diferença.

Continue com este prompt.

```text
Use the read action only. Reconcile [account] for [posted start date] through [posted
end date] against the bank closing balance of [amount and currency]. State the opening
boundary, the sign convention, the stored row count, and the signed movement total.

Show expected closing balance, bank closing balance, and the exact difference. If the
difference is not zero, list candidate missing, duplicated, excluded, wrong-date, or
mis-signed rows. Do not insert a balancing entry and do not change any data.

After the balance check, review category totals separately. List uncategorized rows,
transfer rows counted as spending, and categories that differ from the approved preview.
```

No exemplo das quatro linhas, `€1,250.00 + €1,637.40 = €2,887.40`. Se o banco também fechar em €2,887.40, a diferença de saldo será de `€0.00`.

A diferença zero confirma o cálculo do saldo para o intervalo escolhido. Ainda é preciso conferir as categorias. Mudar a categoria do lançamento de €54.20 de Supermercado para Viagens mantém a diferença de saldo em zero e desloca €54.20 entre os totais das categorias. Faça essa revisão à parte antes de dar a importação por concluída.

Se houver diferença no saldo, verifique o saldo inicial, as linhas ausentes ou duplicadas, as transferências, os itens pendentes, os sinais, as datas e as moedas. Investigue a origem da diferença sem criar um lançamento fictício para zerá-la. O [guia de conciliação (em inglês)](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) detalha essas etapas de diagnóstico.

## Atualize o orçamento depois da conciliação

Passe ao orçamento quando as linhas armazenadas baterem com a prévia, o saldo estiver conciliado e os totais por categoria fizerem sentido. O Claude Code pode comparar as receitas e despesas realizadas com os valores do orçamento em `budget_lines` e propor alterações. Um mês fora do comum pode não servir de base para o planejamento seguinte.

```text
Confirm the workspace and inspect the current schema. Use the read action to compare
actual income and spending for [complete period] with the matching budget lines. Exclude
transfers using the stored transaction type and show uncategorized activity separately.

For each proposed budget change, show the category, current amount, actual amount,
proposed amount, difference, and reason. Then show the exact SQL and expected affected
rows. Do not write until I approve specific lines.

After approval, use the write action only for those lines and verify them with a fresh
read. Report any stored value that differs from the approved proposal.
```

Uma despesa alta pode ser pontual. Um aparente estouro do orçamento pode ser uma transferência ou um estorno na categoria errada. O Claude Code pode calcular as diferenças e preparar o SQL. Você decide os valores do mês seguinte.

## Siga a mesma ordem para cada extrato

1. Comece por `https://app.expense-budget-tracker.com/api/agent` e siga a descoberta.
2. Consulte o contexto da conta de usuário, confirme o espaço de trabalho e inspecione o esquema atual.
3. Dê ao Claude Code acesso a um único arquivo de extrato e informe os saldos e as datas que delimitam o período.
4. Consulte os lançamentos do mesmo período e prepare a prévia completa da importação.
5. Aprove o conjunto exato de alterações.
6. Em uma inserção com muitas linhas, teste de 1 a 3 linhas e siga com lotes sequenciais de até 100.
7. Consulte cada lote armazenado e compare com a prévia.
8. Concilie a conta com o saldo final do banco, sem inventar um lançamento para fechar a conta.
9. Confira os totais por categoria, mesmo que a diferença no saldo seja zero.
10. Prepare, aprove e verifique à parte as alterações nas linhas do orçamento.

Comece com uma conta e um período fechado. Depois de conciliar os lançamentos do extrato e revisar o orçamento, repita o processo para a próxima conta. O Claude Code cuida do trabalho repetitivo com arquivos e chamadas à API. Você vê cada decisão financeira antes que ela altere seus registros.

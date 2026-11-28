import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_PT_BR = {
  locale: "pt-br",
  title: "Recursos",
  description:
    "Controle em várias moedas, planejamento de orçamento, painéis, acesso via MCP hospedado, API para agentes, hospedagem própria e isolamento de espaços de trabalho.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Recursos",
      intro:
        "Tudo de que você precisa para acompanhar suas finanças pessoais e manter o controle dos seus dados.",
      items: [
        {
          title: "Contas em várias moedas",
          description:
            "Cada transação é registrada na moeda original. Na hora da consulta, o app usa as taxas de câmbio diárias do ECB, CBR e NBS para converter os valores para a moeda dos relatórios. Os valores originais ficam intactos.",
        },
        {
          title: "Tabela de orçamento",
          description:
            "Orçamento mensal com categorias de receitas e despesas. Defina os valores previstos, compare com os realizados e acompanhe a diferença. Cada alteração é adicionada à trilha de auditoria sem sobrescrever registros anteriores.",
        },
        {
          title: "Acompanhamento de saldos",
          description:
            "O saldo de cada conta é calculado automaticamente com base nos lançamentos. Veja os totais em qualquer moeda. As movimentações entre suas próprias contas são registradas como transferências.",
        },
        {
          title: "Painéis",
          description:
            "Despesas detalhadas em gráficos, evolução dos saldos e análise do impacto do câmbio. Tudo no próprio app, sem precisar de uma ferramenta de BI externa.",
        },
        {
          title: "API para agentes",
          description:
            "Um caminho próprio para agentes de terminal ou que fazem chamadas HTTP diretas. Comece com GET https://api.expense-budget-tracker.com/v1/. Com autenticação por ApiKey, a API permite executar SQL restrito e selecionar o espaço de trabalho. Todas as operações seguem as regras de segurança em nível de linha (RLS), respeitam os limites de requisições e podem ser auditadas.",
        },
        {
          title: "Servidor MCP hospedado",
          description:
            "Clientes MCP remotos com suporte a OAuth podem se conectar em https://mcp.expense-budget-tracker.com/mcp e consultar seus dados financeiros com o escopo obrigatório expenses:read. O cliente também pode solicitar o escopo opcional expenses:write. Ele aparece na tela de consentimento do OAuth e é necessário para criar, alterar ou excluir dados.",
        },
        {
          title: "Chat com IA",
          description:
            "Faça perguntas sobre despesas, compare períodos ou analise suas finanças pelo chat integrado ao app. As respostas usam seus lançamentos.",
        },
        {
          title: "Isolamento de espaços de trabalho",
          description:
            "A segurança em nível de linha do Postgres isola os dados. Cada usuário recebe um espaço de trabalho e pode convidar outras pessoas para espaços compartilhados, com controles de acesso.",
        },
        {
          title: "Hospedagem própria",
          description:
            "Docker Compose com Postgres. Rode localmente ou no seu servidor, sem ficar preso a um fornecedor. Você tem controle total sobre seus dados financeiros.",
        },
        {
          title: "Autenticação sem senha",
          description:
            "Entre com um código de verificação enviado por e-mail via AWS Cognito. O cadastro é aberto e cria um espaço de trabalho automaticamente.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "pt-br" };

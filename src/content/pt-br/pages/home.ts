import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_PT_BR = {
  locale: "pt-br",
  title: "Expense Budget Tracker - Finanças pessoais com código aberto",
  description:
    "Controle de despesas e orçamentos com código aberto, suporte a várias moedas, painéis financeiros, servidor MCP hospedado e API para agentes.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Acompanhe suas despesas.",
        "Planeje seu orçamento.",
        "Controle seus dados.",
      ],
      subtitle:
        "Um app de código aberto para acompanhar suas finanças em várias moedas, planejar o orçamento e consultar painéis financeiros. Para conectar o Claude Code, o Codex ou o OpenClaw, compartilhe a URL de descoberta da API, confirme o código de verificação enviado por e-mail e deixe o agente concluir a configuração.",
      primaryLink: {
        label: "Começar",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Ver no GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "URL para conectar seu cliente MCP remoto com suporte a OAuth",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Recursos",
      intro:
        "Tudo de que você precisa para acompanhar suas finanças pessoais e manter o controle dos seus dados.",
      items: [
        {
          title: "Várias moedas",
          description:
            "Acompanhe contas em qualquer moeda. A conversão é automática, com taxas de câmbio do ECB, CBR e NBS.",
        },
        {
          title: "Planejamento do orçamento",
          description:
            "Use a tabela mensal para planejar receitas e despesas por categoria e comparar os valores previstos com os realizados.",
        },
        {
          title: "Painéis",
          description:
            "Veja as despesas por categoria, a evolução dos saldos e o impacto do câmbio na sua carteira.",
        },
        {
          title: "Hospedagem própria",
          description:
            "Docker Compose com Postgres. Seus dados ficam no seu servidor, sem dependências de terceiros.",
        },
        {
          title: "MCP e API para agentes",
          description:
            "Conecte um cliente MCP remoto com suporte a OAuth para consultar seus dados financeiros com o escopo obrigatório expenses:read. O cliente também pode solicitar o escopo opcional expenses:write. Ele aparece na tela de consentimento do OAuth e é necessário para criar, alterar ou excluir dados. Para agentes de terminal ou que fazem chamadas HTTP diretas, comece com GET https://api.expense-budget-tracker.com/v1/ e use a API para agentes com uma ApiKey.",
        },
        {
          title: "Isolamento de espaços de trabalho",
          description:
            "Segurança em nível de linha no Postgres. Cada usuário recebe um espaço de trabalho isolado e pode compartilhá-lo por convite.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "pt-br" };

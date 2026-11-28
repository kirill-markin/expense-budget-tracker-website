import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages = {
  auth: {
    login: "Entrar",
    signup: "Criar conta grátis",
    openApp: "Abrir app",
  },
  header: {
    features: "Recursos",
    pricing: "Preços",
    docs: "Documentação",
    blog: "Blog",
    toggleMenu: "Alternar menu",
  },
  footer: {
    productTitle: "Produto",
    openSourceTitle: "Código aberto",
    legalTitle: "Informações legais",
    documentation: "Documentação",
    selfHostingGuide: "Guia de hospedagem própria",
    support: "Suporte",
    privacyPolicy: "Política de privacidade",
    termsOfService: "Termos de serviço",
    builtBy: "Criado por Kirill Markin",
    localeSwitcherAriaLabel: "Selecionar idioma",
    localeSearchLabel: "Buscar idiomas",
    localeSearchEmpty: "Nenhum idioma encontrado.",
    operatedBy: "Operado por SAMO DANNI EOOD · VAT: BG207395566 · País: Bulgária",
  },
  breadcrumbs: {
    ariaLabel: "Caminho de navegação",
    home: "Início",
    docs: "Documentação",
    blog: "Blog",
  },
  home: {
    copyCode: {
      idle: "Copiar",
      copied: "Copiado",
      failed: "Não foi possível copiar",
    },
    humanTitle: "Para pessoas",
    humanWebApp: "App web",
    agentTitle: "Para agentes de IA",
    agentDescription:
      "Conecte seu agente de IA via MCP. Adicione o servidor do Expense Budget Tracker a um cliente MCP compatível para que ele possa consultar e atualizar seus dados financeiros.",
    showcaseEyebrow: "Interface do app",
    showcaseTitle: "Veja a tela de orçamento antes de conferir os recursos",
    showcaseImageAlt:
      "Interface do Expense Budget Tracker com chat de IA, categorias do orçamento, despesas realizadas, o mês atual e planos para os próximos meses.",
  },
  docs: {
    title: "Documentação",
    description:
      "Primeiros passos, configuração de agentes de IA e do MCP, hospedagem própria, referência da API e visão geral da arquitetura.",
  },
  blogIndex: {
    title: "Blog",
    description: "Novidades, tutoriais e análises sobre o Expense Budget Tracker.",
    empty: "Novas publicações em breve.",
  },
  blogPost: {
    publishedLabel: "Publicado em",
    bylinePrefix: "Por",
    relatedHeading: "Leia também",
  },
  blogCta: {
    heading: "Experimente o Expense Budget Tracker",
    buttonLabel: "Experimentar",
  },
  legal: {
    lastUpdated: "Última atualização:",
  },
} satisfies ReturnType<typeof getSiteMessages>;

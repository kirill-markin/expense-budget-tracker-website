import type { getSiteMessages } from "../messages";

export const messages: ReturnType<typeof getSiteMessages> = {
  auth: {
    login: "Accedi",
    signup: "Registrati gratis",
    openApp: "Apri l’app",
  },
  header: {
    features: "Funzionalità",
    pricing: "Prezzi",
    docs: "Documentazione",
    blog: "Blog",
    toggleMenu: "Mostra o nascondi il menu",
  },
  footer: {
    productTitle: "Prodotto",
    openSourceTitle: "Open source",
    legalTitle: "Note legali",
    documentation: "Documentazione",
    selfHostingGuide: "Guida al self-hosting",
    support: "Assistenza",
    privacyPolicy: "Informativa sulla privacy",
    termsOfService: "Condizioni del servizio",
    builtBy: "Creato da Kirill Markin",
    localeSwitcherAriaLabel: "Seleziona la lingua",
    localeSearchLabel: "Cerca una lingua",
    localeSearchEmpty: "Nessuna lingua trovata.",
    operatedBy: "Gestito da SAMO DANNI EOOD · Partita IVA: BG207395566 · Paese: Bulgaria",
  },
  breadcrumbs: {
    ariaLabel: "Percorso di navigazione",
    home: "Home",
    docs: "Documentazione",
    blog: "Blog",
  },
  home: {
    copyCode: {
      idle: "Copia",
      copied: "Copiato",
      failed: "Impossibile copiare",
    },
    humanTitle: "Per chi usa l’app direttamente",
    humanWebApp: "App web",
    agentTitle: "Per gli agenti di IA",
    agentDescription:
      "Collega il tuo agente di IA tramite MCP. Aggiungi il server di Expense Budget Tracker a un client MCP compatibile per consentire all’agente di leggere e aggiornare i tuoi dati finanziari.",
    showcaseEyebrow: "L’interfaccia dell’app",
    showcaseTitle: "Dai un’occhiata allo spazio di lavoro del budget prima di esplorare le funzionalità",
    showcaseImageAlt:
      "Interfaccia di Expense Budget Tracker con chat di IA, categorie del budget, spese effettive, mese corrente e budget per i mesi successivi.",
  },
  docs: {
    title: "Documentazione",
    description:
      "Primi passi, configurazione degli agenti di IA e di MCP, self-hosting, riferimento dell’API e panoramica dell’architettura.",
  },
  blogIndex: {
    title: "Blog",
    description: "Novità, tutorial e approfondimenti su Expense Budget Tracker.",
    empty: "Nuovi articoli in arrivo.",
  },
  blogPost: {
    publishedLabel: "Pubblicato il",
    bylinePrefix: "Di",
    relatedHeading: "Leggi anche",
  },
  blogCta: {
    heading: "Prova Expense Budget Tracker",
    buttonLabel: "Provalo",
  },
  legal: {
    lastUpdated: "Ultimo aggiornamento:",
  },
};

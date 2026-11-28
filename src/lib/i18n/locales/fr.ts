import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages: ReturnType<typeof getSiteMessages> = {
  auth: {
    login: "Se connecter",
    signup: "S’inscrire gratuitement",
    openApp: "Ouvrir l’application",
  },
  header: {
    features: "Fonctionnalités",
    pricing: "Tarifs",
    docs: "Docs",
    blog: "Blog",
    toggleMenu: "Ouvrir ou fermer le menu",
  },
  footer: {
    productTitle: "Produit",
    openSourceTitle: "Open source",
    legalTitle: "Informations légales",
    documentation: "Documentation",
    selfHostingGuide: "Guide d’auto-hébergement",
    support: "Assistance",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d’utilisation",
    builtBy: "Créé par Kirill Markin",
    localeSwitcherAriaLabel: "Choisir la langue",
    localeSearchLabel: "Rechercher une langue",
    localeSearchEmpty: "Aucune langue trouvée.",
    operatedBy: "Exploité par SAMO DANNI EOOD · TVA : BG207395566 · Pays : Bulgarie",
  },
  breadcrumbs: {
    home: "Accueil",
    docs: "Docs",
    blog: "Blog",
  },
  home: {
    humanTitle: "Pour vous",
    humanWebApp: "Application web",
    agentTitle: "Pour votre agent IA",
    agentDescription:
      "Ajoutez le serveur Expense Budget Tracker à un client MCP compatible pour que votre agent IA puisse consulter vos données financières et, avec votre autorisation, les modifier.",
    showcaseEyebrow: "Aperçu de l’application",
    showcaseTitle: "Découvrez l’espace de travail du budget",
    showcaseImageAlt:
      "Interface d’Expense Budget Tracker avec le chat IA, les catégories du budget, les dépenses réelles, le mois en cours et les prévisions.",
  },
  docs: {
    title: "Documentation",
    description:
      "Premiers pas, configuration des agents IA et de MCP, auto-hébergement, référence de l’API et présentation de l’architecture.",
  },
  blogIndex: {
    title: "Blog",
    description: "Actualités, tutoriels et conseils sur Expense Budget Tracker.",
    empty: "Les premiers articles seront bientôt disponibles.",
  },
  blogPost: {
    publishedLabel: "Publié le",
    bylinePrefix: "Par",
    relatedHeading: "À lire ensuite",
  },
  blogCta: {
    heading: "Essayez Expense Budget Tracker",
    buttonLabel: "Essayer",
  },
  legal: {
    lastUpdated: "Dernière mise à jour :",
  },
};

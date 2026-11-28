import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages = {
  auth: {
    login: "Anmelden",
    signup: "Kostenlos registrieren",
    openApp: "App öffnen",
  },
  header: {
    features: "Funktionen",
    pricing: "Preise",
    docs: "Dokumentation",
    blog: "Blog",
    toggleMenu: "Menü ein- oder ausblenden",
  },
  footer: {
    productTitle: "Produkt",
    openSourceTitle: "Open Source",
    legalTitle: "Rechtliches",
    documentation: "Dokumentation",
    selfHostingGuide: "Anleitung zum Selbsthosting",
    support: "Support",
    privacyPolicy: "Datenschutzerklärung",
    termsOfService: "Nutzungsbedingungen",
    builtBy: "Entwickelt von Kirill Markin",
    localeSwitcherAriaLabel: "Sprache auswählen",
    localeSearchLabel: "Sprachen suchen",
    localeSearchEmpty: "Keine passenden Sprachen gefunden.",
    operatedBy: "Betreiber: SAMO DANNI EOOD · USt-IdNr.: BG207395566 · Land: Bulgarien",
  },
  breadcrumbs: {
    home: "Startseite",
    docs: "Dokumentation",
    blog: "Blog",
  },
  home: {
    humanTitle: "Für dich",
    humanWebApp: "Web-App",
    agentTitle: "Für KI-Agenten",
    agentDescription:
      "Füge den MCP-Server von Expense Budget Tracker zu einem kompatiblen Client hinzu. Mit der passenden Freigabe kann dein KI-Agent deine Finanzdaten lesen und aktualisieren.",
    showcaseEyebrow: "Einblick in die App",
    showcaseTitle: "Ein Blick auf die Budgetplanung",
    showcaseImageAlt:
      "Oberfläche von Expense Budget Tracker mit KI-Chat, Budgetkategorien, Ist-Ausgaben, dem aktuellen Monat und Plänen für kommende Monate.",
  },
  docs: {
    title: "Dokumentation",
    description:
      "Erste Schritte, Einrichtung von KI-Agenten und MCP, Selbsthosting, API-Referenz und Überblick über die Architektur.",
  },
  blogIndex: {
    title: "Blog",
    description: "Neuigkeiten, Anleitungen und Tipps rund um Expense Budget Tracker.",
    empty: "Hier erscheinen bald Beiträge.",
  },
  blogPost: {
    publishedLabel: "Veröffentlicht",
    bylinePrefix: "Von",
    relatedHeading: "Weiterlesen",
  },
  blogCta: {
    heading: "Expense Budget Tracker ausprobieren",
    buttonLabel: "Jetzt ausprobieren",
  },
  legal: {
    lastUpdated: "Zuletzt aktualisiert:",
  },
} satisfies ReturnType<typeof getSiteMessages>;

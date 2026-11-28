import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages: ReturnType<typeof getSiteMessages> = {
  auth: {
    login: "Zaloguj się",
    signup: "Załóż bezpłatne konto",
    openApp: "Otwórz aplikację",
  },
  header: {
    features: "Funkcje",
    pricing: "Cennik",
    docs: "Dokumentacja",
    blog: "Blog",
    toggleMenu: "Otwórz lub zamknij menu",
  },
  footer: {
    productTitle: "Produkt",
    openSourceTitle: "Otwarty kod źródłowy",
    legalTitle: "Informacje prawne",
    documentation: "Dokumentacja",
    selfHostingGuide: "Instrukcja uruchomienia na własnym serwerze",
    support: "Pomoc",
    privacyPolicy: "Polityka prywatności",
    termsOfService: "Regulamin",
    builtBy: "Autor: Kirill Markin",
    localeSwitcherAriaLabel: "Wybierz język",
    localeSearchLabel: "Szukaj języków",
    localeSearchEmpty: "Brak pasujących języków",
    operatedBy: "Operator: SAMO DANNI EOOD · VAT: BG207395566 · Kraj: Bułgaria",
  },
  breadcrumbs: {
    home: "Strona główna",
    docs: "Dokumentacja",
    blog: "Blog",
  },
  home: {
    humanTitle: "Dla użytkowników",
    humanWebApp: "Aplikacja w przeglądarce",
    agentTitle: "Dla agentów AI",
    agentDescription:
      "Aby połączyć agenta AI, dodaj serwer Expense Budget Tracker do zgodnego klienta MCP. Agent będzie mógł odczytywać dane finansowe i wprowadzać w nich zmiany.",
    showcaseEyebrow: "Widok aplikacji",
    showcaseTitle: "Zobacz obszar roboczy z budżetem przed przejściem do listy funkcji",
    showcaseImageAlt:
      "Interfejs Expense Budget Tracker z czatem AI i tabelą budżetu, w której widać kategorie, faktyczne wydatki, bieżący miesiąc i plany na kolejne miesiące.",
  },
  docs: {
    title: "Dokumentacja",
    description:
      "Pierwsze kroki, konfiguracja agentów AI i MCP, własny hosting, dokumentacja API i przegląd architektury.",
  },
  blogIndex: {
    title: "Blog",
    description: "Aktualności, poradniki i wskazówki dotyczące Expense Budget Tracker.",
    empty: "Wpisy pojawią się wkrótce.",
  },
  blogPost: {
    publishedLabel: "Opublikowano",
    bylinePrefix: "Autor:",
    relatedHeading: "Czytaj dalej",
  },
  blogCta: {
    heading: "Wypróbuj Expense Budget Tracker",
    buttonLabel: "Wypróbuj",
  },
  legal: {
    lastUpdated: "Ostatnia aktualizacja:",
  },
};

import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_PL = {
  locale: "pl",
  title: "Expense Budget Tracker – aplikacja open source do finansów osobistych",
  description:
    "Aplikacja z otwartym kodem źródłowym do śledzenia wydatków i planowania budżetu. Obsługuje wiele walut i oferuje panele finansowe, serwer MCP w chmurze oraz API dla agentów.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Śledź wydatki.",
        "Planuj budżet.",
        "Zachowaj kontrolę nad danymi.",
      ],
      subtitle:
        "Aplikacja z otwartym kodem źródłowym do finansów osobistych. Obsługuje wiele walut i oferuje planowanie budżetu, panele finansowe oraz konfigurację przez agenta. Podaj Claude Code, Codex lub OpenClaw adres dokumentu z opisem API i przekaż kod weryfikacyjny z e-maila. Agent zajmie się resztą.",
      primaryLink: {
        label: "Zacznij korzystać",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Zobacz na GitHubie",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Podaj ten adres klientowi obsługującemu zdalne połączenia MCP i OAuth",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Funkcje",
      intro:
        "Zarządzaj finansami osobistymi i zachowaj kontrolę nad danymi.",
      items: [
        {
          title: "Wiele walut",
          description:
            "Prowadź konta w dowolnej walucie. Aplikacja automatycznie przelicza kwoty według kursów EBC, CBR i NBS.",
        },
        {
          title: "Planowanie budżetu",
          description:
            "Zaplanuj miesięczny budżet według kategorii wpływów i wydatków. Porównuj plan z wykonaniem.",
        },
        {
          title: "Panele finansowe",
          description:
            "Zobacz podział wydatków, zmiany sald w czasie i wpływ kursów walut na Twój portfel.",
        },
        {
          title: "Własny hosting",
          description:
            "Docker Compose z bazą Postgres. Dane pozostają na Twoim serwerze, bez zależności od usług zewnętrznych.",
        },
        {
          title: "MCP i API dla agentów",
          description:
            "Połącz klienta obsługującego zdalne połączenia MCP i OAuth. Do odczytu danych finansowych potrzebny jest zakres expenses:read. Klient może też poprosić o opcjonalny zakres expenses:write, który pojawia się na ekranie zgody OAuth i pozwala dodawać, zmieniać i usuwać dane. Agent działający w terminalu lub wysyłający bezpośrednie żądania HTTP zaczyna od GET https://api.expense-budget-tracker.com/v1/, a następnie korzysta z API dla agentów z kluczem ApiKey.",
        },
        {
          title: "Izolacja obszarów roboczych",
          description:
            "Zabezpieczenia na poziomie wierszy w Postgres. Każdy użytkownik otrzymuje odizolowany obszar roboczy, do którego może zaprosić inne osoby.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "pl" };

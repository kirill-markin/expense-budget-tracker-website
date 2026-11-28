import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_PL = {
  locale: "pl",
  title: "Funkcje",
  description:
    "Śledź finanse w wielu walutach, planuj budżet i analizuj dane na panelach finansowych. Dostępne są też serwer MCP w chmurze, API dla agentów, własny hosting i izolacja obszarów roboczych.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Funkcje",
      intro:
        "Zarządzaj finansami osobistymi i zachowaj kontrolę nad danymi.",
      items: [
        {
          title: "Konta w wielu walutach",
          description:
            "Zapisuj każdą transakcję w jej walucie źródłowej. Aplikacja przelicza kwoty na walutę raportowania dopiero przy odczycie, według dziennych kursów EBC, CBR i NBS. W rejestrze zachowuje oryginalne kwoty.",
        },
        {
          title: "Tabela budżetu",
          description:
            "Planuj miesięczny budżet według kategorii wpływów i wydatków. Ustal kwoty, porównaj je z faktycznymi wpływami i wydatkami i sprawdź różnice. Każda zmiana dodaje nową pozycję do historii audytu bez nadpisywania poprzednich.",
        },
        {
          title: "Śledzenie sald",
          description:
            "Aplikacja automatycznie wylicza bieżące saldo każdego konta z zapisów w rejestrze transakcji. Możesz wyświetlić sumy w dowolnej walucie. Przelew między własnymi kontami ma osobny typ zapisu.",
        },
        {
          title: "Panele finansowe",
          description:
            "Zobacz podział wydatków, zmiany sald w czasie i wpływ kursów walut na finanse. Wykresy i analizy znajdziesz w aplikacji, bez dodatkowego narzędzia BI.",
        },
        {
          title: "API dla agentów",
          description:
            "Osobna integracja dla agentów działających w terminalu lub wysyłających bezpośrednie żądania HTTP. Zacznij od GET https://api.expense-budget-tracker.com/v1/. Następnie uwierzytelnij się kluczem ApiKey i wykonuj dozwolone operacje SQL. API egzekwuje reguły RLS i limity żądań, pozwala wybrać obszar roboczy i umożliwia audyt operacji.",
        },
        {
          title: "Serwer MCP w chmurze",
          description:
            "Zdalni klienci MCP obsługujący OAuth mogą połączyć się przez https://mcp.expense-budget-tracker.com/mcp i odczytywać dane finansowe w ramach wymaganego zakresu expenses:read. Klient może też poprosić o opcjonalny zakres expenses:write, który pojawia się na ekranie zgody OAuth i jest wymagany do dodawania, zmieniania i usuwania danych.",
        },
        {
          title: "Czat AI",
          description:
            "Wbudowany czat korzysta z Twoich danych finansowych. Pytaj o wydatki, porównuj okresy i szukaj zależności na podstawie zapisów w rejestrze transakcji.",
        },
        {
          title: "Izolacja obszarów roboczych",
          description:
            "Postgres wymusza izolację danych na poziomie wierszy (RLS). Każdy użytkownik otrzymuje obszar roboczy. Możesz zapraszać inne osoby do wspólnych obszarów roboczych i zarządzać ich dostępem.",
        },
        {
          title: "Własny hosting",
          description:
            "Docker Compose z bazą Postgres. Uruchom aplikację lokalnie lub na własnym serwerze. Zachowujesz pełną kontrolę nad danymi finansowymi i nie uzależniasz się od dostawcy.",
        },
        {
          title: "Logowanie bez hasła",
          description:
            "Logujesz się jednorazowym kodem weryfikacyjnym wysyłanym e-mailem przez AWS Cognito. Nie trzeba zapamiętywać hasła i nie ma ryzyka jego wycieku. Rejestracja jest otwarta, a obszar roboczy powstaje automatycznie.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "pl" };

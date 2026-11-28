import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_PL = {
  locale: "pl",
  title: "Cennik",
  description:
    "Bezpłatne wdrożenie na własnym serwerze lub zarządzany hosting w chmurze. Otwarty kod źródłowy i pełny dostęp do funkcji.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Cennik",
      intro: "W obu wariantach masz dostęp do wszystkich funkcji.",
      tiers: [
        {
          type: "link_tier",
          name: "Własny hosting",
          price: "Bezpłatnie",
          highlighted: false,
          bullets: [
            "Pełny kod źródłowy na GitHubie",
            "Docker Compose + Postgres",
            "Dostęp do wszystkich funkcji",
            "Twój serwer, Twoje dane",
            "Pomoc społeczności",
          ],
          cta: {
            label: "Zobacz na GitHubie",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Chmura",
          price: "Bezpłatnie w wersji beta",
          highlighted: true,
          bullets: [
            "Hosting w AWS obsługiwany przez nas",
            "Automatyczne kopie zapasowe",
            "Dostęp do wszystkich funkcji",
            "Logowanie jednorazowym kodem weryfikacyjnym z e-maila",
            "Codzienna aktualizacja kursów walut",
          ],
          cta: {
            label: "Zacznij korzystać",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "pl" };

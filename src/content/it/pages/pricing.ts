import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_IT = {
  locale: "it",
  title: "Prezzi",
  description:
    "Self-hosting gratuito o hosting cloud gestito. Codice open source e tutte le funzionalità incluse.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Prezzi",
      intro: "Ogni piano include tutte le funzionalità.",
      tiers: [
        {
          type: "link_tier",
          name: "Self-hosting",
          price: "Gratis",
          highlighted: false,
          bullets: [
            "Codice sorgente completo su GitHub",
            "Docker Compose e Postgres",
            "Tutte le funzionalità incluse",
            "I tuoi dati sul tuo server",
            "Supporto della community",
          ],
          cta: {
            label: "Vai su GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Gratis durante la beta",
          highlighted: true,
          bullets: [
            "Hosting gestito su AWS",
            "Backup automatici",
            "Tutte le funzionalità incluse",
            "Accesso con codice di verifica monouso via email",
            "Tassi di cambio aggiornati ogni giorno",
          ],
          cta: {
            label: "Inizia",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "it" };

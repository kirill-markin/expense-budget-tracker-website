import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_DE = {
  locale: "de",
  title: "Preise",
  description:
    "Hoste die App kostenlos selbst oder nutze die verwaltete Cloud. Der Quellcode ist offen. Beide Varianten bieten alle Funktionen.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Preise",
      intro: "Alle Funktionen sind in jeder Variante verfügbar.",
      tiers: [
        {
          type: "link_tier",
          name: "Selbst hosten",
          price: "Kostenlos",
          highlighted: false,
          bullets: [
            "Vollständiger Quellcode auf GitHub",
            "Docker Compose + Postgres",
            "Alle Funktionen enthalten",
            "Dein Server, deine Daten",
            "Hilfe aus der Community",
          ],
          cta: {
            label: "Auf GitHub ansehen",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Kostenlos während der Beta",
          highlighted: true,
          bullets: [
            "Verwaltetes Hosting auf AWS",
            "Automatische Backups",
            "Alle Funktionen enthalten",
            "Anmeldung per Einmalcode aus der E-Mail",
            "Täglich aktualisierte Wechselkurse",
          ],
          cta: {
            label: "Jetzt starten",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "de" };

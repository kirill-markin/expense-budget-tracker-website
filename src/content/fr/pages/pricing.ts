import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_FR = {
  locale: "fr",
  title: "Tarifs",
  description:
    "Auto-hébergement gratuit ou hébergement cloud géré. Le code est open source et toutes les fonctionnalités sont incluses dans les deux offres.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Tarifs",
      intro: "Toutes les fonctionnalités sont incluses dans chaque offre.",
      tiers: [
        {
          type: "link_tier",
          name: "Auto-hébergement",
          price: "Gratuit",
          highlighted: false,
          bullets: [
            "Code source complet sur GitHub",
            "Docker Compose + Postgres",
            "Toutes les fonctionnalités incluses",
            "Vos données sur votre serveur",
            "Aide de la communauté",
          ],
          cta: {
            label: "Voir sur GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Gratuit pendant la bêta",
          highlighted: true,
          bullets: [
            "Hébergement géré sur AWS",
            "Sauvegardes automatiques",
            "Toutes les fonctionnalités incluses",
            "Connexion par code de vérification à usage unique reçu par e-mail",
            "Mise à jour quotidienne des taux de change",
          ],
          cta: {
            label: "Commencer",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "fr" };

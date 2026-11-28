import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_FR = {
  locale: "fr",
  title: "Expense Budget Tracker - Application open source de gestion des finances personnelles",
  description:
    "Suivez vos dépenses et votre budget avec une application open source qui prend en charge plusieurs devises et propose des tableaux de bord financiers, un serveur MCP hébergé et une API pour agents.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Suivez vos dépenses.",
        "Planifiez votre budget.",
        "Gardez la maîtrise de vos données.",
      ],
      subtitle:
        "Gérez vos finances personnelles avec une application open source multidevise qui réunit planification budgétaire et tableaux de bord financiers. Pour connecter Claude Code, Codex ou OpenClaw, transmettez à l’agent l’URL de découverte de l’API, confirmez le code de vérification reçu par e-mail et laissez-le faire le reste.",
      primaryLink: {
        label: "Commencer",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Voir sur GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "URL de connexion pour votre client MCP distant compatible avec OAuth",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Fonctionnalités",
      intro:
        "Tout ce qu’il vous faut pour suivre vos finances personnelles et garder la maîtrise de vos données.",
      items: [
        {
          title: "Comptes multidevises",
          description:
            "Suivez vos comptes dans la devise de votre choix. La conversion est automatique et s’appuie sur les taux de change de la BCE, de la Banque centrale de Russie et de la Banque nationale de Serbie.",
        },
        {
          title: "Planification budgétaire",
          description:
            "Préparez votre budget mensuel par catégorie de revenus et de dépenses. Comparez les montants prévus aux montants réels.",
        },
        {
          title: "Tableaux de bord",
          description:
            "Visualisez la répartition de vos dépenses, l’évolution de vos soldes et l’effet des taux de change sur votre portefeuille.",
        },
        {
          title: "Auto-hébergement",
          description:
            "Docker Compose avec Postgres. Vos données restent sur votre serveur, sans dépendance à des services tiers.",
        },
        {
          title: "MCP et API pour agents",
          description:
            "Connectez un client MCP distant compatible avec OAuth pour consulter vos données financières avec l’autorisation obligatoire expenses:read. Le client peut aussi demander l’autorisation facultative expenses:write, qui apparaît sur l’écran de consentement OAuth et permet d’ajouter, de modifier ou de supprimer des données. Pour un agent en ligne de commande ou un client HTTP direct, commencez par GET https://api.expense-budget-tracker.com/v1/, puis utilisez l’API pour agents avec une clé API (ApiKey).",
        },
        {
          title: "Isolation des espaces de travail",
          description:
            "La sécurité au niveau des lignes dans Postgres isole l’espace de travail de chaque utilisateur. Partagez un espace en invitant d’autres personnes.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "fr" };

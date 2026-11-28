import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_FR = {
  locale: "fr",
  title: "Fonctionnalités",
  description:
    "Suivi multidevise, planification budgétaire, tableaux de bord, accès MCP hébergé, API pour agents, auto-hébergement et isolation des espaces de travail.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Fonctionnalités",
      intro:
        "Tout ce qu’il vous faut pour suivre vos finances personnelles et garder la maîtrise de vos données.",
      items: [
        {
          title: "Comptes multidevises",
          description:
            "Enregistrez chaque transaction dans sa devise d’origine. À la consultation, l’application convertit les montants dans votre devise de référence aux taux quotidiens de la BCE, de la Banque centrale de Russie et de la Banque nationale de Serbie. L’application conserve les montants d’origine sans conversion préalable.",
        },
        {
          title: "Tableau budgétaire",
          description:
            "Établissez un budget mensuel par catégorie de revenus et de dépenses. Fixez les montants prévus, comparez-les aux montants réels et suivez l’écart. Chaque modification s’ajoute à l’historique, qui conserve les écritures précédentes.",
        },
        {
          title: "Suivi des soldes",
          description:
            "L’application calcule automatiquement l’évolution du solde de chaque compte à partir des écritures comptables. Consultez les totaux dans la devise de votre choix. Les transferts entre vos comptes constituent un type d’opération à part entière.",
        },
        {
          title: "Tableaux de bord",
          description:
            "Visualisez la répartition de vos dépenses, l’évolution de vos soldes et l’incidence des taux de change directement dans l’application, sans outil d’analyse externe.",
        },
        {
          title: "API pour agents",
          description:
            "Les agents en ligne de commande et les clients HTTP directs ont leur propre point d’entrée. Commencez par GET https://api.expense-budget-tracker.com/v1/, puis utilisez une clé API (ApiKey) pour exécuter des requêtes SQL restreintes via l’API pour agents. La sécurité au niveau des lignes (RLS) s’applique à chaque requête. L’API permet de sélectionner un espace de travail, limite le débit des requêtes et assure leur traçabilité.",
        },
        {
          title: "Serveur MCP hébergé",
          description:
            "Les clients MCP distants compatibles avec OAuth peuvent se connecter à https://mcp.expense-budget-tracker.com/mcp et consulter vos données financières avec l’autorisation obligatoire expenses:read. Pour ajouter, modifier ou supprimer des données, le client doit aussi demander l’autorisation facultative expenses:write, qui apparaît sur l’écran de consentement OAuth.",
        },
        {
          title: "Chat IA",
          description:
            "Posez des questions sur vos dépenses, comparez des périodes ou demandez une analyse dans le chat intégré. Les réponses s’appuient sur vos écritures comptables.",
        },
        {
          title: "Isolation des espaces de travail",
          description:
            "La sécurité au niveau des lignes dans Postgres garantit l’isolation des données. Chaque utilisateur dispose d’un espace de travail. Invitez d’autres personnes dans des espaces partagés et gérez leurs accès.",
        },
        {
          title: "Auto-hébergement",
          description:
            "Docker Compose avec Postgres. Exécutez l’application en local ou sur votre propre serveur. Vous gardez la maîtrise de vos données financières et restez libre de changer de fournisseur.",
        },
        {
          title: "Connexion sans mot de passe",
          description:
            "Recevez un code à usage unique par e-mail via AWS Cognito. Aucun mot de passe à retenir ou à protéger contre les fuites. L’inscription est ouverte à tous. Un espace de travail est créé automatiquement à l’inscription.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "fr" };

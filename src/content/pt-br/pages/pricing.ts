import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_PT_BR = {
  locale: "pt-br",
  title: "Preços",
  description:
    "Hospedagem própria gratuita ou hospedagem gerenciada na nuvem. O app tem código aberto e os dois planos incluem todos os recursos.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Preços",
      intro: "Todos os planos incluem todos os recursos.",
      tiers: [
        {
          type: "link_tier",
          name: "Hospedagem própria",
          price: "Grátis",
          highlighted: false,
          bullets: [
            "Código-fonte completo no GitHub",
            "Docker Compose + Postgres",
            "Todos os recursos incluídos",
            "Seus dados no seu servidor",
            "Suporte da comunidade",
          ],
          cta: {
            label: "Ver no GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Nuvem",
          price: "Grátis durante o beta",
          highlighted: true,
          bullets: [
            "Hospedagem gerenciada na AWS",
            "Backups automáticos",
            "Todos os recursos incluídos",
            "Acesso com código de verificação enviado por e-mail",
            "Taxas de câmbio atualizadas diariamente",
          ],
          cta: {
            label: "Começar",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "pt-br" };

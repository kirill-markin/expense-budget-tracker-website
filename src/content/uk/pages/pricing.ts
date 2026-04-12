import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_UK: PageContent = {
  locale: "uk",
  title: "Ціни",
  description:
    "Безкоштовне self-hosted розгортання або керований cloud-хостинг. Відкритий код без обмеження функцій.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Ціни",
      intro: "Усі функції доступні в кожному варіанті. Жодного feature gating.",
      tiers: [
        {
          type: "link_tier",
          name: "Self-hosted",
          price: "Безкоштовно",
          highlighted: false,
          bullets: [
            "Повний вихідний код на GitHub",
            "Docker Compose + Postgres",
            "Усі функції включено",
            "Ваш сервер, ваші дані",
            "Підтримка спільноти",
          ],
          cta: {
            label: "Переглянути на GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Безкоштовно під час бети",
          highlighted: true,
          bullets: [
            "Керований хостинг на AWS",
            "Автоматичні резервні копії",
            "Усі функції включено",
            "Email OTP-аутентифікація",
            "Щоденне оновлення FX-курсів",
          ],
          cta: {
            label: "Почати",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

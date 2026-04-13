import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_UK: PageContent = {
  locale: "uk",
  title: "Ціни",
  description:
    "Безкоштовне самостійне розгортання або керований хмарний хостинг. Відкритий код без обмежень за функціями.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Ціни",
      intro: "Усі функції доступні в кожному варіанті. Жодних обмежень за функціями.",
      tiers: [
        {
          type: "link_tier",
          name: "Самостійне розгортання",
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
          name: "Хмарна версія",
          price: "Безкоштовно під час бета-періоду",
          highlighted: true,
          bullets: [
            "Керований хостинг на AWS",
            "Автоматичні резервні копії",
            "Усі функції включено",
            "Вхід за одноразовим кодом із email",
            "Щоденне оновлення валютних курсів",
          ],
          cta: {
            label: "Почати користуватися",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_UK: PageContent = {
  locale: "uk",
  title: "Тарифи",
  description:
    "Безкоштовне розгортання на власному сервері або керований хмарний хостинг. Відкритий код без жодних обмежень за функціями.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Тарифи",
      intro: "Усі можливості доступні в кожному варіанті. Жодних обмежень за функціями.",
      tiers: [
        {
          type: "link_tier",
          name: "На власному сервері",
          price: "Безкоштовно",
          highlighted: false,
          bullets: [
            "Повний вихідний код на GitHub",
            "Docker Compose і Postgres",
            "Усі можливості включено",
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
          name: "Хмарний хостинг",
          price: "Безкоштовно під час бета-тестування",
          highlighted: true,
          bullets: [
            "Керований хостинг на AWS",
            "Автоматичні резервні копії",
            "Усі можливості включено",
            "Вхід за одноразовим кодом з електронної пошти",
            "Щоденне оновлення валютних курсів",
          ],
          cta: {
            label: "Почати безкоштовно",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

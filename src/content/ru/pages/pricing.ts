import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_RU: PageContent = {
  locale: "ru",
  title: "Цены",
  description:
    "Бесплатное самостоятельное размещение или управляемый облачный хостинг. Открытый исходный код без ограничений по функциям.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Цены",
      intro: "Все функции доступны в любом варианте. Без ограничений по функциям.",
      tiers: [
        {
          type: "link_tier",
          name: "Самостоятельное размещение",
          price: "Бесплатно",
          highlighted: false,
          bullets: [
            "Полный исходный код на GitHub",
            "Docker Compose + Postgres",
            "Все функции включены",
            "Ваш сервер, ваши данные",
            "Поддержка сообщества",
          ],
          cta: {
            label: "Открыть на GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Бесплатно во время беты",
          highlighted: true,
          bullets: [
            "Управляемый хостинг в AWS",
            "Автоматические резервные копии",
            "Все функции включены",
            "Вход по одноразовому коду из email",
            "Ежедневное обновление курсов валют",
          ],
          cta: {
            label: "Начать",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

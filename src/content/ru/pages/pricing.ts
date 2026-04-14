import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_RU: PageContent = {
  locale: "ru",
  title: "Тарифы",
  description:
    "Бесплатное самостоятельное размещение или облачная версия с управляемым хостингом. Открытый исходный код без ограничений по функциям.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Тарифы",
      intro: "Во всех вариантах доступны одни и те же функции. Никаких ограничений по возможностям.",
      tiers: [
        {
          type: "link_tier",
          name: "Самостоятельный хостинг",
          price: "Бесплатно",
          highlighted: false,
          bullets: [
            "Полный исходный код на GitHub",
            "Развертывание через Docker Compose и Postgres",
            "Все функции включены",
            "Ваш сервер, ваши данные",
            "Поддержка сообщества",
          ],
          cta: {
            label: "Открыть репозиторий",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Бесплатно на время бета-тестирования",
          highlighted: true,
          bullets: [
            "Управляемый хостинг в AWS",
            "Автоматические резервные копии",
            "Все функции включены",
            "Вход по одноразовому коду из письма",
            "Ежедневное обновление курсов валют",
          ],
          cta: {
            label: "Начать бесплатно",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

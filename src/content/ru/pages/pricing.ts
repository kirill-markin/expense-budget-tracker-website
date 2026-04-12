import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_RU: PageContent = {
  locale: "ru",
  title: "Цены",
  description:
    "Бесплатный self-hosted вариант или управляемый облачный хостинг. Открытый код без ограничения функций.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Цены",
      intro: "Все функции доступны в каждом варианте. Без feature gating.",
      tiers: [
        {
          type: "link_tier",
          name: "Self-hosted",
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
            label: "Смотреть на GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Бесплатно во время беты",
          highlighted: true,
          bullets: [
            "Управляемый хостинг на AWS",
            "Автоматические резервные копии",
            "Все функции включены",
            "Аутентификация по email OTP",
            "Ежедневное обновление FX-курсов",
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

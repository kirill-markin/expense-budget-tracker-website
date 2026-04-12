import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_RU: PageContent = {
  locale: "ru",
  title: "Expense Budget Tracker - личные финансы с открытым кодом",
  description:
    "Open-source трекер расходов и бюджета с мультивалютностью, финансовыми дашбордами и нативным онбордингом для Claude Code, Codex и OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Учитывайте расходы.",
        "Планируйте бюджет.",
        "Держите данные у себя.",
      ],
      subtitle:
        "Open-source трекер личных финансов с мультивалютностью, планированием бюджета, дашбордами и нативной настройкой для агентов. Дайте Claude Code, Codex или OpenClaw один URL обнаружения API, подтвердите код из письма и позвольте агенту сделать остальное.",
      primaryLink: {
        label: "Начать",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Смотреть на GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Начните с GET по этому URL обнаружения:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "Возможности",
      intro:
        "Все, что нужно для управления личными финансами без потери контроля над своими данными.",
      items: [
        {
          title: "Мультивалютность",
          description:
            "Учитывайте счета в любой валюте. Автоматическая конвертация по курсам ECB, CBR и NBS.",
        },
        {
          title: "Планирование бюджета",
          description:
            "Ежемесячная сетка бюджета с категориями доходов и расходов. Сравнивайте план и факт.",
        },
        {
          title: "Дашборды",
          description:
            "Визуальные срезы расходов, динамика балансов и влияние валютного курса на портфель.",
        },
        {
          title: "Self-hosted",
          description:
            "Docker Compose с Postgres. Ваши данные остаются на вашем сервере. Без сторонних зависимостей.",
        },
        {
          title: "API для агентов",
          description:
            "Передайте Claude Code, Codex или OpenClaw один URL обнаружения. Агент попросит email, проверит 8-значный код, создаст свою ApiKey, загрузит контекст счетов, выберет workspace и начнет работать.",
        },
        {
          title: "Изоляция workspace",
          description:
            "Row-level security в Postgres. У каждого пользователя изолированный workspace. Доступ можно делить через приглашения.",
        },
      ],
    },
  ],
  body: "",
};

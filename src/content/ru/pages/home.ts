import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_RU: PageContent = {
  locale: "ru",
  title: "Expense Budget Tracker - личные финансы с открытым исходным кодом",
  description:
    "Трекер расходов и бюджета с открытым исходным кодом, поддержкой нескольких валют, финансовыми панелями и подключением, рассчитанным на Claude Code, Codex и OpenClaw.",
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
        "Трекер личных финансов с открытым исходным кодом, поддержкой нескольких валют, планированием бюджета, финансовыми панелями и настройкой для работы через агентов. Передайте Claude Code, Codex или OpenClaw один URL обнаружения API, подтвердите код из письма и агент сам выполнит остальные шаги.",
      primaryLink: {
        label: "Начать",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Посмотреть на GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Начните с GET-запроса к этому URL обнаружения:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "Возможности",
      intro:
        "Все, что нужно для учета личных финансов без отказа от контроля над собственными данными.",
      items: [
        {
          title: "Поддержка нескольких валют",
          description:
            "Ведите счета в любой валюте. Автоматическая конвертация по курсам ECB, CBR и NBS.",
        },
        {
          title: "Планирование бюджета",
          description:
            "Ежемесячная таблица бюджета с категориями доходов и расходов. Сравнивайте плановые и фактические значения.",
        },
        {
          title: "Финансовые панели",
          description:
            "Наглядная разбивка расходов, динамика остатков во времени и влияние валютных курсов на ваш портфель.",
        },
        {
          title: "Самостоятельный хостинг",
          description:
            "Docker Compose с Postgres. Ваши данные остаются на вашем сервере. Без зависимостей от сторонних сервисов.",
        },
        {
          title: "API для работы через агентов",
          description:
            "Передайте Claude Code, Codex или OpenClaw один URL обнаружения. Агент запросит ваш email, проверит 8-значный код, создаст собственный ApiKey, загрузит контекст счетов, выберет рабочее пространство и начнет работу.",
        },
        {
          title: "Изоляция рабочих пространств",
          description:
            "Row-level security в Postgres. Каждый пользователь получает изолированное рабочее пространство. Доступ можно предоставить через приглашения.",
        },
      ],
    },
  ],
  body: "",
};

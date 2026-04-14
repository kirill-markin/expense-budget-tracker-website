import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_RU: PageContent = {
  locale: "ru",
  title: "Expense Budget Tracker - трекер личных финансов с открытым исходным кодом",
  description:
    "Трекер расходов и бюджета с открытым исходным кодом: мультивалютный учет, наглядные финансовые дашборды и удобное подключение для Claude Code, Codex и OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Следите за расходами.",
        "Планируйте бюджет.",
        "Храните данные у себя.",
      ],
      subtitle:
        "Трекер личных финансов с открытым исходным кодом, мультивалютным учетом, планированием бюджета, наглядными дашбордами и удобным запуском через агентов. Передайте Claude Code, Codex или OpenClaw один URL для обнаружения API, подтвердите код из письма, и агент сам завершит подключение.",
      primaryLink: {
        label: "Начать работу",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Открыть на GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Начните с GET-запроса к этому URL обнаружения API:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "Возможности",
      intro:
        "Все необходимое для учета личных финансов, при этом данные остаются под вашим контролем.",
      items: [
        {
          title: "Мультивалютный учет",
          description:
            "Ведите счета в любой валюте. Конвертация выполняется автоматически по курсам ECB, CBR и NBS.",
        },
        {
          title: "Планирование бюджета",
          description:
            "Ежемесячный бюджет по категориям доходов и расходов. Сравнивайте план и факт в одном месте.",
        },
        {
          title: "Финансовые дашборды",
          description:
            "Наглядная структура расходов, динамика балансов во времени и влияние валютных курсов на ваш портфель.",
        },
        {
          title: "Развертывание на своей инфраструктуре",
          description:
            "Docker Compose и Postgres. Данные остаются на вашем сервере, без привязки к сторонним сервисам.",
        },
        {
          title: "API для AI-агентов",
          description:
            "Передайте Claude Code, Codex или OpenClaw один URL для обнаружения API. Агент запросит email, проверит 8-значный код, выпустит собственный ApiKey, подтянет контекст счетов, выберет рабочее пространство и сразу приступит к работе.",
        },
        {
          title: "Изоляция рабочих пространств",
          description:
            "Разграничение доступа на уровне строк в Postgres. У каждого пользователя свое изолированное рабочее пространство, а доступ предоставляется только по приглашению.",
        },
      ],
    },
  ],
  body: "",
};

import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_UK: PageContent = {
  locale: "uk",
  title: "Expense Budget Tracker - особисті фінанси з відкритим кодом",
  description:
    "Трекер витрат і бюджету з відкритим кодом, підтримкою кількох валют, фінансовими дашбордами, розміщеним MCP-сервером і Agent API.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Відстежуйте витрати.",
        "Плануйте бюджет.",
        "Ваші дані належать вам.",
      ],
      subtitle:
        "Трекер особистих фінансів з відкритим кодом, підтримкою кількох валют, плануванням бюджету, фінансовими дашбордами та зручним стартом для агентів. Передайте Claude Code, Codex або OpenClaw URL для підключення до API, підтвердьте код із електронного листа, і далі агент сам виконає решту.",
      primaryLink: {
        label: "Почати",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Переглянути на GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Підключіть віддалений MCP-клієнт із підтримкою OAuth:",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Функції",
      intro:
        "Усе, що потрібно для керування особистими фінансами без компромісів у контролі над власними даними.",
      items: [
        {
          title: "Кілька валют",
          description:
            "Ведіть рахунки в будь-якій валюті. Курси ECB, CBR і NBS підтягуються автоматично для коректної конвертації.",
        },
        {
          title: "Планування бюджету",
          description:
            "Місячний бюджет із категоріями доходів і витрат. Зіставляйте заплановані суми з фактичними витратами без зайвих кроків.",
        },
        {
          title: "Дашборди",
          description:
            "Наочна структура витрат, динаміка балансів у часі та вплив валютних курсів на ваш портфель в одному місці.",
        },
        {
          title: "Власне розгортання",
          description:
            "Docker Compose із Postgres. Дані залишаються на вашому сервері без залежності від сторонніх сервісів.",
        },
        {
          title: "MCP та Agent API",
          description:
            "Підключіть віддалений MCP-клієнт із підтримкою OAuth, щоб запитувати фінансові дані з обов’язковим дозволом expenses:read. Клієнт також може запитати необов’язковий дозвіл expenses:write: він відображається на екрані згоди OAuth і потрібен для зміни даних. Для агентів командного рядка та прямих HTTP-запитів почніть із GET https://api.expense-budget-tracker.com/v1/ і використовуйте Agent API з ApiKey.",
        },
        {
          title: "Ізоляція робочих просторів",
          description:
            "Захист на рівні рядків у Postgres ізолює кожен робочий простір. Доступ відкривається лише за запрошенням.",
        },
      ],
    },
  ],
  body: "",
};

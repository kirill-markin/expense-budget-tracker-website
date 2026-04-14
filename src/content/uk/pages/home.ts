import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_UK: PageContent = {
  locale: "uk",
  title: "Expense Budget Tracker - особисті фінанси з відкритим кодом",
  description:
    "Трекер витрат і бюджету з відкритим кодом, підтримкою кількох валют, фінансовими дашбордами та зручним підключенням для Claude Code, Codex і OpenClaw.",
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
      hintText: "Почніть із GET-запиту до цієї URL-адреси API:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
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
          title: "API, готове до роботи з агентами",
          description:
            "Передайте Claude Code, Codex або OpenClaw один URL для підключення до API. Агент попросить вашу електронну пошту, перевірить 8-значний код, створить власний API-ключ, завантажить контекст рахунків, вибере потрібний робочий простір і одразу почне роботу.",
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

import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_UK: PageContent = {
  locale: "uk",
  title: "Expense Budget Tracker - особисті фінанси з відкритим кодом",
  description:
    "Трекер витрат і бюджету з відкритим кодом, підтримкою кількох валют, фінансовими панелями та зручним підключенням для Claude Code, Codex і OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Відстежуйте витрати.",
        "Плануйте бюджет.",
        "Контролюйте свої дані.",
      ],
      subtitle:
        "Трекер особистих фінансів з відкритим кодом, підтримкою кількох валют, плануванням бюджету, фінансовими панелями та зручним налаштуванням для агентів. Передайте Claude Code, Codex або OpenClaw URL-адресу виявлення API, підтвердьте код із електронної пошти, і агент зробить решту.",
      primaryLink: {
        label: "Почати",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Переглянути на GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Почніть із GET-запиту до цієї URL-адреси виявлення:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "Функції",
      intro:
        "Усе необхідне, щоб вести особисті фінанси без втрати контролю над своїми даними.",
      items: [
        {
          title: "Кілька валют",
          description:
            "Ведіть рахунки в будь-якій валюті. Автоматична конвертація за курсами ECB, CBR і NBS.",
        },
        {
          title: "Планування бюджету",
          description:
            "Місячна таблиця бюджету з категоріями доходів і витрат. Порівнюйте заплановане з фактичним.",
        },
        {
          title: "Фінансові панелі",
          description:
            "Наочний розподіл витрат, зміна балансів у часі та вплив валютних курсів на ваш портфель.",
        },
        {
          title: "Власне розгортання",
          description:
            "Docker Compose з Postgres. Ваші дані залишаються на вашому сервері. Без залежності від сторонніх сервісів.",
        },
        {
          title: "API для агентів",
          description:
            "Передайте Claude Code, Codex або OpenClaw URL-адресу виявлення API. Агент попросить вашу електронну пошту, перевірить 8-значний код, створить власний API-ключ, завантажить контекст рахунків, вибере робочий простір і почне роботу.",
        },
        {
          title: "Ізоляція робочих просторів",
          description:
            "Розмежування доступу на рівні рядків у Postgres. Кожен користувач отримує ізольований робочий простір. Доступ надається через запрошення.",
        },
      ],
    },
  ],
  body: "",
};

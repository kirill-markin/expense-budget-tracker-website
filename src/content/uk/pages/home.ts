import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_UK: PageContent = {
  locale: "uk",
  title: "Expense Budget Tracker - особисті фінанси з відкритим кодом",
  description:
    "Open-source трекер витрат і бюджету з мультивалютністю, фінансовими дашбордами та нативним онбордингом для Claude Code, Codex і OpenClaw.",
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
        "Open-source трекер особистих фінансів із мультивалютністю, бюджетним плануванням, дашбордами та нативним налаштуванням для агентів. Дайте Claude Code, Codex або OpenClaw один discovery URL, підтвердьте код з email і дозвольте агенту виконати решту.",
      primaryLink: {
        label: "Почати",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Переглянути на GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Почніть з GET для цього discovery URL:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "Можливості",
      intro:
        "Усе, що потрібно для керування особистими фінансами без втрати контролю над власними даними.",
      items: [
        {
          title: "Мультивалютність",
          description:
            "Ведіть рахунки в будь-якій валюті. Автоматична конвертація за курсами ECB, CBR і NBS.",
        },
        {
          title: "Планування бюджету",
          description:
            "Місячна сітка бюджету з категоріями доходів і витрат. Порівнюйте план із фактом.",
        },
        {
          title: "Дашборди",
          description:
            "Візуальні зрізи витрат, динаміка балансів і вплив курсових коливань на портфель.",
        },
        {
          title: "Self-hosted",
          description:
            "Docker Compose з Postgres. Дані залишаються на вашому сервері. Без сторонніх залежностей.",
        },
        {
          title: "API для агентів",
          description:
            "Передайте Claude Code, Codex або OpenClaw один discovery URL. Агент попросить email, перевірить 8-значний код, створить власну ApiKey, завантажить контекст рахунків, вибере workspace і почне працювати.",
        },
        {
          title: "Ізоляція workspace",
          description:
            "Row-level security у Postgres. Кожен користувач має ізольований workspace. Доступ можна ділити через запрошення.",
        },
      ],
    },
  ],
  body: "",
};

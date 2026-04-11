import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Expense Budget Tracker - Finanzas personales de código abierto",
  description:
    "Gestor open source de gastos y presupuestos con soporte multimoneda, paneles financieros y onboarding nativo para agentes con Claude Code, Codex y OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Controla gastos.",
        "Planifica presupuestos.",
        "Tus datos son tuyos.",
      ],
      subtitle:
        "Gestor open source de finanzas personales con soporte multimoneda, planificación presupuestaria, paneles financieros y configuración nativa para agentes. Dale a Claude Code, Codex u OpenClaw una sola URL de descubrimiento API, confirma el código enviado al correo y deja que el agente haga el resto.",
      primaryLink: {
        label: "Empezar",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Ver en GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Empieza con GET en esta URL de descubrimiento:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "Funciones",
      intro:
        "Todo lo que necesitas para gestionar tus finanzas personales sin renunciar al control de tus datos.",
      items: [
        {
          title: "Multimoneda",
          description:
            "Gestiona cuentas en cualquier divisa. Conversión automática con tipos de cambio de ECB, CBR y NBS.",
        },
        {
          title: "Planificación de presupuestos",
          description:
            "Cuadrícula presupuestaria mensual con categorías de ingresos y gastos. Compara lo planificado con lo real.",
        },
        {
          title: "Paneles",
          description:
            "Desgloses visuales de gastos, saldos a lo largo del tiempo e impacto del tipo de cambio en tu cartera.",
        },
        {
          title: "Autoalojado",
          description:
            "Docker Compose con Postgres. Tus datos se quedan en tu servidor. Sin dependencias de terceros.",
        },
        {
          title: "API nativa para agentes",
          description:
            "Comparte una única URL de descubrimiento con Claude Code, Codex u OpenClaw. El agente pide tu correo, verifica el código de 8 dígitos, crea su propia ApiKey, carga el contexto de cuentas, selecciona un workspace y empieza a trabajar.",
        },
        {
          title: "Aislamiento por workspace",
          description:
            "Seguridad a nivel de fila en Postgres. Cada usuario obtiene un workspace aislado. Comparte acceso mediante invitaciones.",
        },
      ],
    },
  ],
  body: "",
};

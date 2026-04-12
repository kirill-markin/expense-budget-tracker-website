import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Expense Budget Tracker - Finanzas personales de código abierto",
  description:
    "Gestor de gastos y presupuestos de código abierto con soporte para múltiples divisas, paneles financieros y configuración nativa para agentes con Claude Code, Codex y OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Registra gastos.",
        "Planifica presupuestos.",
        "Tus datos, bajo tu control.",
      ],
      subtitle:
        "Gestor de finanzas personales de código abierto con soporte para múltiples divisas, planificación presupuestaria, paneles financieros y configuración nativa para agentes. Dale a Claude Code, Codex u OpenClaw una única URL de descubrimiento de la API, confirma el código que recibes por correo y deja que el agente se encargue del resto.",
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
      title: "Características",
      intro:
        "Todo lo que necesitas para gestionar tus finanzas personales sin ceder el control de tus datos.",
      items: [
        {
          title: "Multidivisa",
          description:
            "Lleva cuentas en cualquier divisa. Conversión automática con tipos de cambio del BCE, CBR y NBS.",
        },
        {
          title: "Planificación presupuestaria",
          description:
            "Cuadrícula mensual de presupuesto con categorías de ingresos y gastos. Compara lo presupuestado con lo real.",
        },
        {
          title: "Paneles financieros",
          description:
            "Desgloses visuales de gastos, evolución de saldos e impacto del tipo de cambio en tu cartera.",
        },
        {
          title: "Autoalojado",
          description:
            "Docker Compose con Postgres. Tus datos se quedan en tu servidor. Sin dependencias de terceros.",
        },
        {
          title: "API nativa para agentes",
          description:
            "Comparte una única URL de descubrimiento con Claude Code, Codex u OpenClaw. El agente te pide el correo, verifica el código de 8 dígitos, crea su propia ApiKey, carga el contexto de las cuentas, selecciona un espacio de trabajo y empieza a trabajar.",
        },
        {
          title: "Aislamiento por espacio de trabajo",
          description:
            "Seguridad a nivel de fila en Postgres. Cada usuario tiene un espacio de trabajo aislado. Comparte acceso mediante invitaciones.",
        },
      ],
    },
  ],
  body: "",
};

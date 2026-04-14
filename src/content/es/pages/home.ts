import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Expense Budget Tracker - Finanzas personales de código abierto",
  description:
    "Gestor de gastos y presupuestos de código abierto con soporte multidivisa, paneles financieros e integración nativa con agentes como Claude Code, Codex y OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Registra gastos.",
        "Planifica presupuestos.",
        "Tus datos siguen siendo tuyos.",
      ],
      subtitle:
        "Gestor de finanzas personales de código abierto con soporte multidivisa, planificación presupuestaria, paneles financieros e integración nativa con agentes. Comparte con Claude Code, Codex u OpenClaw una única URL pública de descubrimiento, confirma el código que recibes por correo y deja que el agente se encargue del resto.",
      primaryLink: {
        label: "Empezar",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Ver en GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Empieza con una petición GET a esta URL de descubrimiento:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "Características",
      intro:
        "Todo lo que necesitas para llevar tus finanzas personales sin renunciar al control de tus datos.",
      items: [
        {
          title: "Multidivisa",
          description:
            "Gestiona cuentas en cualquier divisa. Conversión automática con tipos de cambio del BCE, el CBR y el NBS.",
        },
        {
          title: "Planificación presupuestaria",
          description:
            "Planifica cada mes en una cuadrícula de presupuesto con categorías de ingresos y gastos. Compara lo previsto con lo real.",
        },
        {
          title: "Paneles financieros",
          description:
            "Visualiza el desglose de tus gastos, la evolución de tus saldos y el impacto del tipo de cambio en tu cartera.",
        },
        {
          title: "Autoalojado",
          description:
            "Despliegue con Docker Compose y Postgres. Tus datos permanecen en tu servidor, sin dependencias de terceros.",
        },
        {
          title: "API nativa para agentes",
          description:
            "Comparte una única URL de descubrimiento con Claude Code, Codex u OpenClaw. El agente te pedirá el correo, verificará el código de 8 dígitos, generará su propia ApiKey, cargará el contexto de tus cuentas, seleccionará un espacio de trabajo y se pondrá a trabajar.",
        },
        {
          title: "Aislamiento por espacio de trabajo",
          description:
            "Seguridad a nivel de fila en Postgres para aislar los datos de cada espacio de trabajo. Cada usuario dispone de su propio espacio y puede compartir acceso mediante invitaciones.",
        },
      ],
    },
  ],
  body: "",
};

import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Expense Budget Tracker - Finanzas personales de código abierto",
  description:
    "Gestor de gastos y presupuestos de código abierto con soporte multidivisa, paneles financieros, un servidor MCP alojado y una API para agentes.",
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
      hintText: "Conecta tu cliente MCP remoto compatible con OAuth:",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
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
          title: "MCP y API para agentes",
          description:
            "Conecta un cliente MCP remoto compatible con OAuth para consultar tus datos financieros con el permiso obligatorio expenses:read. El cliente también puede solicitar el permiso opcional expenses:write, que aparece en la pantalla de consentimiento OAuth y es necesario para modificar datos. Para agentes de CLI o HTTP directo, empieza con GET https://api.expense-budget-tracker.com/v1/ y usa la API para agentes con una ApiKey.",
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

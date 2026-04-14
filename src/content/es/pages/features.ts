import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Funciones",
  description:
    "Seguimiento multidivisa, presupuestos, paneles, integración con agentes, acceso a la API, autoalojamiento y aislamiento por espacio de trabajo.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Funciones",
      intro:
        "Todo lo que necesitas para gestionar tus finanzas personales sin ceder el control de tus datos.",
      items: [
        {
          title: "Cuentas multidivisa",
          description:
            "Guarda cada transacción en su moneda original. Los tipos de cambio diarios del BCE, CBR y NBS convierten todo a tu moneda de referencia en el momento de la consulta. Sin preconversiones que hagan perder información.",
        },
        {
          title: "Tabla presupuestaria",
          description:
            "Presupuesto mensual con categorías de ingresos y gastos. Define los importes previstos, compáralos con los reales y controla la desviación. Registro de auditoría inmutable para cada cambio.",
        },
        {
          title: "Seguimiento de saldos",
          description:
            "Saldos acumulados automáticos por cuenta a partir del libro mayor. Consulta los totales en cualquier moneda. Las transferencias entre tus propias cuentas se tratan como movimientos de primera clase.",
        },
        {
          title: "Paneles",
          description:
            "Desgloses visuales del gasto, gráficos de saldos a lo largo del tiempo y análisis del impacto del tipo de cambio. Todo dentro de la aplicación, sin depender de una herramienta de BI externa.",
        },
        {
          title: "API SQL",
          description:
            "Acceso programático a través de API Gateway con autenticación mediante `ApiKey`. Ejecuta SQL restringido con RLS aplicado de forma estricta, espacio de trabajo predeterminado guardado con sustitución opcional mediante `X-Workspace-Id`, límites de uso y trazabilidad completa.",
        },
        {
          title: "Integración con agentes",
          description:
            "Comparte https://api.expense-budget-tracker.com/v1/ con Claude Code, Codex u OpenClaw. El agente sigue el documento de descubrimiento, te pide tu correo y el código de 8 dígitos, crea su propia conexión, guarda la clave recibida, selecciona un espacio de trabajo predeterminado y sigue trabajando a través de la API orientada a automatizaciones.",
        },
        {
          title: "Chat con IA",
          description:
            "Interfaz de chat integrada que entiende tus datos financieros. Haz preguntas sobre tus gastos, compara periodos u obtén conclusiones a partir de los apuntes reales de tu libro mayor.",
        },
        {
          title: "Aislamiento por espacio de trabajo",
          description:
            "La seguridad a nivel de fila de Postgres garantiza el aislamiento de los datos. Cada usuario dispone de su propio espacio de trabajo. Invita a otras personas a espacios compartidos con controles de acceso completos.",
        },
        {
          title: "Autoalojado",
          description:
            "Docker Compose con Postgres. Ejecútalo en local o en tu propio servidor. Sin dependencia de ningún proveedor. Control total sobre tus datos financieros.",
        },
        {
          title: "Autenticación sin contraseña",
          description:
            "Código de un solo uso por correo electrónico mediante AWS Cognito. Sin contraseñas que recordar ni que puedan filtrarse. Registro abierto con creación automática del espacio de trabajo.",
        },
      ],
    },
  ],
  body: "",
};

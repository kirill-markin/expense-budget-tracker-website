import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Funciones",
  description:
    "Seguimiento multidivisa, planificación presupuestaria, paneles, configuración para agentes, acceso a la API, autoalojamiento y aislamiento por espacio de trabajo.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Funciones",
      intro:
        "Todo lo que necesitas para llevar tus finanzas personales sin renunciar al control de tus datos.",
      items: [
        {
          title: "Cuentas multidivisa",
          description:
            "Guarda cada transacción en su divisa original. Los tipos de cambio diarios del ECB, CBR y NBS convierten todo a tu divisa de referencia al consultar los datos. Sin preconversiones con pérdida.",
        },
        {
          title: "Cuadro presupuestario",
          description:
            "Presupuesto mensual con categorías de ingresos y gastos. Define los importes previstos, compáralos con los reales y sigue la diferencia. Registro de auditoría inmutable para cada cambio.",
        },
        {
          title: "Seguimiento de saldos",
          description:
            "Saldos acumulados automáticos por cuenta a partir del libro mayor. Consulta los totales en cualquier divisa. Las transferencias entre tus propias cuentas se tratan como operaciones de primera clase.",
        },
        {
          title: "Paneles",
          description:
            "Desgloses visuales de gastos, gráficos de saldos a lo largo del tiempo y análisis del impacto del tipo de cambio. Todo integrado en la aplicación, sin necesidad de una herramienta de BI externa.",
        },
        {
          title: "API SQL",
          description:
            "Acceso programático a través de API Gateway con autenticación mediante `ApiKey`. Ejecuta SQL restringido con aplicación completa de RLS, selección guardada del espacio de trabajo con anulación opcional mediante `X-Workspace-Id`, límites de uso y capacidad de auditoría.",
        },
        {
          title: "Configuración para agentes",
          description:
            "Comparte https://api.expense-budget-tracker.com/v1/ con Claude Code, Codex u OpenClaw. El agente sigue el documento de descubrimiento, te pide tu correo y el código de 8 dígitos, crea su propia conexión, guarda la clave recibida, selecciona un espacio de trabajo predeterminado y sigue operando mediante la API para máquinas.",
        },
        {
          title: "Chat con IA",
          description:
            "Interfaz de chat integrada que entiende tus datos financieros. Haz preguntas sobre tus gastos, compara periodos u obtén conclusiones basadas en los apuntes reales de tu libro mayor.",
        },
        {
          title: "Aislamiento por espacio de trabajo",
          description:
            "La seguridad a nivel de fila de Postgres garantiza el aislamiento de los datos. Cada usuario obtiene un espacio de trabajo. Invita a otras personas a espacios de trabajo compartidos con controles de acceso completos.",
        },
        {
          title: "Alojamiento propio",
          description:
            "Docker Compose con Postgres. Ejecútalo en local o en tu propio servidor. Sin dependencia de un proveedor. Control total sobre tus datos financieros.",
        },
        {
          title: "Autenticación sin contraseña",
          description:
            "OTP por correo electrónico mediante AWS Cognito. Sin contraseñas que recordar ni exponer. Registro abierto con aprovisionamiento automático del espacio de trabajo.",
        },
      ],
    },
  ],
  body: "",
};

import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Funciones",
  description:
    "Seguimiento multimoneda, planificación presupuestaria, paneles, onboarding para agentes, acceso API, autoalojamiento y aislamiento por workspace.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Funciones",
      intro:
        "Todo lo que necesitas para gestionar tus finanzas personales sin renunciar al control de tus datos.",
      items: [
        {
          title: "Cuentas multimoneda",
          description:
            "Guarda cada transacción en su moneda original. Los tipos de cambio diarios de ECB, CBR y NBS convierten todo a tu moneda de referencia en tiempo de lectura. Sin preconversiones con pérdida.",
        },
        {
          title: "Cuadrícula presupuestaria",
          description:
            "Presupuesto mensual con categorías de ingresos y gastos. Define valores planificados, compáralos con los reales y sigue la diferencia. Historial append-only para cada cambio.",
        },
        {
          title: "Seguimiento de saldos",
          description:
            "Saldos corrientes automáticos por cuenta derivados del libro mayor. Ve totales en cualquier moneda. Las transferencias entre tus propias cuentas son entidades de primera clase.",
        },
        {
          title: "Paneles",
          description:
            "Desgloses visuales de gastos, gráficos de saldos en el tiempo y análisis del impacto FX. Integrado en la app sin necesitar una herramienta BI externa.",
        },
        {
          title: "API SQL",
          description:
            "Acceso programático mediante API Gateway con autenticación por ApiKey. Ejecuta SQL restringido con cumplimiento completo de RLS, selección guardada de workspace con override opcional `X-Workspace-Id`, límites de tasa y auditoría.",
        },
        {
          title: "Onboarding para agentes",
          description:
            "Comparte https://api.expense-budget-tracker.com/v1/ con Claude Code, Codex u OpenClaw. El agente sigue el documento de descubrimiento, pide tu correo y el código de 8 dígitos, crea su propia conexión, guarda la clave devuelta, selecciona un workspace por defecto y sigue trabajando mediante la API para máquinas.",
        },
        {
          title: "Chat con IA",
          description:
            "Interfaz de chat integrada que entiende tus datos financieros. Haz preguntas sobre gastos, compara periodos u obtén insights basados en tus apuntes reales del ledger.",
        },
        {
          title: "Aislamiento por workspace",
          description:
            "La seguridad Row-Level Security de Postgres aísla los datos. Cada usuario obtiene un workspace. Invita a otras personas a workspaces compartidos con controles de acceso completos.",
        },
        {
          title: "Autoalojado",
          description:
            "Docker Compose con Postgres. Ejecútalo localmente o en tu propio servidor. Sin vendor lock-in. Control total sobre tus datos financieros.",
        },
        {
          title: "Autenticación sin contraseña",
          description:
            "OTP por correo electrónico mediante AWS Cognito. Sin contraseñas que recordar o filtrar. Registro abierto con aprovisionamiento automático de workspace.",
        },
      ],
    },
  ],
  body: "",
};

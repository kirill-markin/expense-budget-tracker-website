import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Precios",
  description:
    "Despliegue autoalojado gratuito o alojamiento cloud gestionado. Código abierto, sin limitación de funciones.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Precios",
      intro:
        "Todas las funciones están disponibles en todos los planes. Sin bloqueo por funcionalidades.",
      tiers: [
        {
          type: "link_tier",
          name: "Autoalojado",
          price: "Gratis",
          highlighted: false,
          bullets: [
            "Código fuente completo en GitHub",
            "Docker Compose + Postgres",
            "Todas las funciones incluidas",
            "Tu servidor, tus datos",
            "Soporte de la comunidad",
          ],
          cta: {
            label: "Ver en GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Gratis durante la beta",
          highlighted: true,
          bullets: [
            "Hosting gestionado en AWS",
            "Copias de seguridad automáticas",
            "Todas las funciones incluidas",
            "Autenticación por OTP en correo",
            "Actualización diaria de tipos FX",
          ],
          cta: {
            label: "Empezar",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

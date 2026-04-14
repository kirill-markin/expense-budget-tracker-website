import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_ES: PageContent = {
  locale: "es",
  title: "Precios",
  description:
    "Despliegue autoalojado gratuito o alojamiento gestionado en la nube. Código abierto, sin funciones bloqueadas según el plan.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Precios",
      intro:
        "Todas las funciones están disponibles en todos los planes. Sin restricciones por plan.",
      tiers: [
        {
          type: "link_tier",
          name: "Autoalojado",
          price: "Gratis",
          highlighted: false,
          bullets: [
            "Código fuente completo disponible en GitHub",
            "Docker Compose + Postgres",
            "Todas las funciones incluidas",
            "Tu servidor, tus datos",
            "Soporte de la comunidad",
          ],
          cta: {
            label: "Ver repositorio en GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "En la nube",
          price: "Gratis durante la beta",
          highlighted: true,
          bullets: [
            "Alojamiento gestionado en AWS",
            "Copias de seguridad automáticas",
            "Todas las funciones incluidas",
            "Acceso con código de un solo uso por correo",
            "Actualización diaria de los tipos de cambio",
          ],
          cta: {
            label: "Crear cuenta",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

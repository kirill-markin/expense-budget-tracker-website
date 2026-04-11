import type { AppLocale } from "@/lib/i18n/config";

interface AuthMessages {
  readonly login: string;
  readonly signup: string;
  readonly openApp: string;
}

interface HeaderMessages {
  readonly features: string;
  readonly pricing: string;
  readonly docs: string;
  readonly blog: string;
  readonly toggleMenu: string;
}

interface FooterMessages {
  readonly productTitle: string;
  readonly openSourceTitle: string;
  readonly legalTitle: string;
  readonly documentation: string;
  readonly selfHostingGuide: string;
  readonly privacyPolicy: string;
  readonly termsOfService: string;
  readonly builtBy: string;
  readonly operatedBy: string;
}

interface BreadcrumbMessages {
  readonly home: string;
  readonly docs: string;
  readonly blog: string;
}

interface HomePageMessages {
  readonly humanTitle: string;
  readonly humanWebApp: string;
  readonly agentTitle: string;
  readonly showcaseEyebrow: string;
  readonly showcaseTitle: string;
  readonly showcaseImageAlt: string;
}

interface SiteMessages {
  readonly auth: AuthMessages;
  readonly header: HeaderMessages;
  readonly footer: FooterMessages;
  readonly breadcrumbs: BreadcrumbMessages;
  readonly home: HomePageMessages;
}

const SITE_MESSAGES: Readonly<Record<AppLocale, SiteMessages>> = {
  en: {
    auth: {
      login: "Log In",
      signup: "Sign Up Free",
      openApp: "Open App",
    },
    header: {
      features: "Features",
      pricing: "Pricing",
      docs: "Docs",
      blog: "Blog",
      toggleMenu: "Toggle menu",
    },
    footer: {
      productTitle: "Product",
      openSourceTitle: "Open Source",
      legalTitle: "Legal",
      documentation: "Documentation",
      selfHostingGuide: "Self-Hosting Guide",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      builtBy: "Built by Kirill Markin",
      operatedBy: "Operated by SAMO DANNI EOOD · VAT: BG207395566 · Country: Bulgaria",
    },
    breadcrumbs: {
      home: "Home",
      docs: "Docs",
      blog: "Blog",
    },
    home: {
      humanTitle: "For human",
      humanWebApp: "Web App",
      agentTitle: "For AI agent",
      showcaseEyebrow: "Real interface",
      showcaseTitle: "See the budget workspace before you read the feature list",
      showcaseImageAlt:
        "Expense Budget Tracker interface showing AI chat, budget categories, actual expenses, current month, and future plans.",
    },
  },
  es: {
    auth: {
      login: "Iniciar sesión",
      signup: "Crear cuenta gratis",
      openApp: "Abrir app",
    },
    header: {
      features: "Funciones",
      pricing: "Precios",
      docs: "Documentación",
      blog: "Blog",
      toggleMenu: "Abrir menú",
    },
    footer: {
      productTitle: "Producto",
      openSourceTitle: "Código abierto",
      legalTitle: "Legal",
      documentation: "Documentación",
      selfHostingGuide: "Guía de autoalojamiento",
      privacyPolicy: "Política de privacidad",
      termsOfService: "Términos del servicio",
      builtBy: "Creado por Kirill Markin",
      operatedBy: "Operado por SAMO DANNI EOOD · VAT: BG207395566 · País: Bulgaria",
    },
    breadcrumbs: {
      home: "Inicio",
      docs: "Documentación",
      blog: "Blog",
    },
    home: {
      humanTitle: "Para personas",
      humanWebApp: "Aplicación web",
      agentTitle: "Para agentes de IA",
      showcaseEyebrow: "Interfaz real",
      showcaseTitle:
        "Mira el espacio de trabajo del presupuesto antes de leer la lista de funciones",
      showcaseImageAlt:
        "Interfaz de Expense Budget Tracker con chat de IA, categorías de presupuesto, gastos reales, mes actual y planes futuros.",
    },
  },
};

export function getSiteMessages(locale: AppLocale): SiteMessages {
  return SITE_MESSAGES[locale];
}

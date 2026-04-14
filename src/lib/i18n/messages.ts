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
  readonly localeSwitcherAriaLabel: string;
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

interface DocsPageMessages {
  readonly title: string;
  readonly description: string;
}

interface BlogIndexMessages {
  readonly title: string;
  readonly description: string;
  readonly empty: string;
}

interface BlogPostMessages {
  readonly publishedLabel: string;
  readonly bylinePrefix: string;
  readonly relatedHeading: string;
}

interface LegalMessages {
  readonly lastUpdated: string;
}

interface SiteMessages {
  readonly auth: AuthMessages;
  readonly header: HeaderMessages;
  readonly footer: FooterMessages;
  readonly breadcrumbs: BreadcrumbMessages;
  readonly home: HomePageMessages;
  readonly docs: DocsPageMessages;
  readonly blogIndex: BlogIndexMessages;
  readonly blogPost: BlogPostMessages;
  readonly legal: LegalMessages;
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
      localeSwitcherAriaLabel: "Select language",
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
    docs: {
      title: "Documentation",
      description:
        "Getting started, self-hosting guide, API reference, and architecture overview.",
    },
    blogIndex: {
      title: "Blog",
      description: "Updates, tutorials, and insights about Expense Budget Tracker.",
      empty: "Posts coming soon.",
    },
    blogPost: {
      publishedLabel: "Published",
      bylinePrefix: "By",
      relatedHeading: "Read next",
    },
    legal: {
      lastUpdated: "Last updated:",
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
      localeSwitcherAriaLabel: "Seleccionar idioma",
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
    docs: {
      title: "Documentación",
      description:
        "Primeros pasos, guía de autoalojamiento, referencia de API y resumen de la arquitectura.",
    },
    blogIndex: {
      title: "Blog",
      description: "Novedades, tutoriales e ideas sobre Expense Budget Tracker.",
      empty: "Próximamente habrá publicaciones.",
    },
    blogPost: {
      publishedLabel: "Publicado",
      bylinePrefix: "Por",
      relatedHeading: "Sigue leyendo",
    },
    legal: {
      lastUpdated: "Última actualización:",
    },
  },
  ru: {
    auth: {
      login: "Войти",
      signup: "Создать аккаунт бесплатно",
      openApp: "Открыть приложение",
    },
    header: {
      features: "Возможности",
      pricing: "Цены",
      docs: "Документация",
      blog: "Блог",
      toggleMenu: "Открыть меню",
    },
    footer: {
      productTitle: "Продукт",
      openSourceTitle: "Открытый код",
      legalTitle: "Правовая информация",
      documentation: "Документация",
      selfHostingGuide: "Руководство по self-hosting",
      privacyPolicy: "Политика конфиденциальности",
      termsOfService: "Условия использования",
      builtBy: "Создано Кириллом Маркиным",
      localeSwitcherAriaLabel: "Выбрать язык",
      operatedBy: "Оператор: SAMO DANNI EOOD · VAT: BG207395566 · Страна: Болгария",
    },
    breadcrumbs: {
      home: "Главная",
      docs: "Документация",
      blog: "Блог",
    },
    home: {
      humanTitle: "Для человека",
      humanWebApp: "Веб-приложение",
      agentTitle: "Для ИИ-агента",
      showcaseEyebrow: "Настоящий интерфейс",
      showcaseTitle:
        "Посмотрите на рабочее пространство бюджета до чтения списка возможностей",
      showcaseImageAlt:
        "Интерфейс Expense Budget Tracker с ИИ-чатом, бюджетными категориями, фактическими расходами, текущим месяцем и будущими планами.",
    },
    docs: {
      title: "Документация",
      description:
        "Быстрый старт, руководство по self-hosting, справочник API и обзор архитектуры.",
    },
    blogIndex: {
      title: "Блог",
      description: "Обновления, руководства и идеи по Expense Budget Tracker.",
      empty: "Публикации скоро появятся.",
    },
    blogPost: {
      publishedLabel: "Опубликовано",
      bylinePrefix: "Автор",
      relatedHeading: "Читайте дальше",
    },
    legal: {
      lastUpdated: "Последнее обновление:",
    },
  },
  uk: {
    auth: {
      login: "Увійти",
      signup: "Створити акаунт безкоштовно",
      openApp: "Відкрити застосунок",
    },
    header: {
      features: "Можливості",
      pricing: "Ціни",
      docs: "Документація",
      blog: "Блог",
      toggleMenu: "Відкрити меню",
    },
    footer: {
      productTitle: "Продукт",
      openSourceTitle: "Відкритий код",
      legalTitle: "Юридична інформація",
      documentation: "Документація",
      selfHostingGuide: "Посібник із self-hosting",
      privacyPolicy: "Політика конфіденційності",
      termsOfService: "Умови використання",
      builtBy: "Створено Кирилом Маркіним",
      localeSwitcherAriaLabel: "Вибрати мову",
      operatedBy: "Оператор: SAMO DANNI EOOD · VAT: BG207395566 · Країна: Болгарія",
    },
    breadcrumbs: {
      home: "Головна",
      docs: "Документація",
      blog: "Блог",
    },
    home: {
      humanTitle: "Для людини",
      humanWebApp: "Вебзастосунок",
      agentTitle: "Для AI-агента",
      showcaseEyebrow: "Реальний інтерфейс",
      showcaseTitle:
        "Подивіться на робочий простір бюджету ще до списку можливостей",
      showcaseImageAlt:
        "Інтерфейс Expense Budget Tracker з AI-чатом, бюджетними категоріями, фактичними витратами, поточним місяцем і майбутніми планами.",
    },
    docs: {
      title: "Документація",
      description:
        "Швидкий старт, посібник із self-hosting, довідник API та огляд архітектури.",
    },
    blogIndex: {
      title: "Блог",
      description: "Оновлення, посібники та ідеї про Expense Budget Tracker.",
      empty: "Публікації незабаром з’являться.",
    },
    blogPost: {
      publishedLabel: "Опубліковано",
      bylinePrefix: "Автор",
      relatedHeading: "Читайте далі",
    },
    legal: {
      lastUpdated: "Останнє оновлення:",
    },
  },
  fa: {
    auth: {
      login: "ورود",
      signup: "ثبت‌نام رایگان",
      openApp: "باز کردن برنامه",
    },
    header: {
      features: "امکانات",
      pricing: "قیمت‌ها",
      docs: "مستندات",
      blog: "وبلاگ",
      toggleMenu: "باز کردن منو",
    },
    footer: {
      productTitle: "محصول",
      openSourceTitle: "متن‌باز",
      legalTitle: "حقوقی",
      documentation: "مستندات",
      selfHostingGuide: "راهنمای میزبانی شخصی",
      privacyPolicy: "حریم خصوصی",
      termsOfService: "شرایط استفاده",
      builtBy: "ساخته‌شده توسط Kirill Markin",
      localeSwitcherAriaLabel: "انتخاب زبان",
      operatedBy: "توسط SAMO DANNI EOOD اداره می‌شود · VAT: BG207395566 · کشور: بلغارستان",
    },
    breadcrumbs: {
      home: "خانه",
      docs: "مستندات",
      blog: "وبلاگ",
    },
    home: {
      humanTitle: "برای انسان",
      humanWebApp: "اپلیکیشن وب",
      agentTitle: "برای عامل هوش مصنوعی",
      showcaseEyebrow: "رابط واقعی",
      showcaseTitle: "قبل از خواندن فهرست امکانات، فضای کاری بودجه را ببینید",
      showcaseImageAlt:
        "رابط Expense Budget Tracker با گفت‌وگوی هوش مصنوعی، دسته‌بندی بودجه، هزینه‌های واقعی، ماه جاری و برنامه‌های آینده.",
    },
    docs: {
      title: "مستندات",
      description:
        "شروع سریع، راهنمای میزبانی شخصی، مرجع API و نمای کلی معماری.",
    },
    blogIndex: {
      title: "وبلاگ",
      description: "به‌روزرسانی‌ها، راهنماها و نکته‌ها درباره Expense Budget Tracker.",
      empty: "مطلب‌ها به‌زودی منتشر می‌شوند.",
    },
    blogPost: {
      publishedLabel: "منتشر شده",
      bylinePrefix: "نویسنده",
      relatedHeading: "ادامه مطلب",
    },
    legal: {
      lastUpdated: "آخرین به‌روزرسانی:",
    },
  },
  zh: {
    auth: {
      login: "登录",
      signup: "免费注册",
      openApp: "打开应用",
    },
    header: {
      features: "功能",
      pricing: "价格",
      docs: "文档",
      blog: "博客",
      toggleMenu: "打开菜单",
    },
    footer: {
      productTitle: "产品",
      openSourceTitle: "开源",
      legalTitle: "法律信息",
      documentation: "文档",
      selfHostingGuide: "自托管指南",
      privacyPolicy: "隐私政策",
      termsOfService: "服务条款",
      builtBy: "由 Kirill Markin 构建",
      localeSwitcherAriaLabel: "选择语言",
      operatedBy: "由 SAMO DANNI EOOD 运营 · VAT: BG207395566 · 国家：保加利亚",
    },
    breadcrumbs: {
      home: "首页",
      docs: "文档",
      blog: "博客",
    },
    home: {
      humanTitle: "面向个人用户",
      humanWebApp: "Web 应用",
      agentTitle: "面向 AI 智能体",
      showcaseEyebrow: "真实界面",
      showcaseTitle: "先看看预算工作区，再读功能列表",
      showcaseImageAlt:
        "Expense Budget Tracker 界面，展示 AI 聊天、预算分类、实际支出、当前月份和未来计划。",
    },
    docs: {
      title: "文档",
      description: "快速开始、自托管指南、API 参考和架构概览。",
    },
    blogIndex: {
      title: "博客",
      description: "关于 Expense Budget Tracker 的更新、教程和实践经验。",
      empty: "文章即将发布。",
    },
    blogPost: {
      publishedLabel: "发布于",
      bylinePrefix: "作者",
      relatedHeading: "继续阅读",
    },
    legal: {
      lastUpdated: "最后更新：",
    },
  },
  ar: {
    auth: {
      login: "تسجيل الدخول",
      signup: "إنشاء حساب مجانًا",
      openApp: "فتح التطبيق",
    },
    header: {
      features: "الميزات",
      pricing: "الأسعار",
      docs: "التوثيق",
      blog: "المدونة",
      toggleMenu: "فتح القائمة",
    },
    footer: {
      productTitle: "المنتج",
      openSourceTitle: "مفتوح المصدر",
      legalTitle: "قانوني",
      documentation: "التوثيق",
      selfHostingGuide: "دليل الاستضافة الذاتية",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      builtBy: "بناء Kirill Markin",
      localeSwitcherAriaLabel: "اختيار اللغة",
      operatedBy: "تدير الخدمة شركة SAMO DANNI EOOD · VAT: BG207395566 · الدولة: بلغاريا",
    },
    breadcrumbs: {
      home: "الرئيسية",
      docs: "التوثيق",
      blog: "المدونة",
    },
    home: {
      humanTitle: "للبشر",
      humanWebApp: "تطبيق الويب",
      agentTitle: "لوكلاء الذكاء الاصطناعي",
      showcaseEyebrow: "واجهة حقيقية",
      showcaseTitle: "شاهد مساحة عمل الميزانية قبل قراءة قائمة الميزات",
      showcaseImageAlt:
        "واجهة Expense Budget Tracker تعرض دردشة ذكاء اصطناعي وفئات الميزانية والمصروفات الفعلية والشهر الحالي والخطط القادمة.",
    },
    docs: {
      title: "التوثيق",
      description:
        "البدء السريع، دليل الاستضافة الذاتية، مرجع API، ونظرة عامة على البنية.",
    },
    blogIndex: {
      title: "المدونة",
      description: "تحديثات ودروس وأفكار عملية حول Expense Budget Tracker.",
      empty: "ستتوفر المقالات قريبًا.",
    },
    blogPost: {
      publishedLabel: "نُشر",
      bylinePrefix: "بقلم",
      relatedHeading: "اقرأ التالي",
    },
    legal: {
      lastUpdated: "آخر تحديث:",
    },
  },
  he: {
    auth: {
      login: "התחברות",
      signup: "הרשמה בחינם",
      openApp: "פתיחת האפליקציה",
    },
    header: {
      features: "יכולות",
      pricing: "מחירים",
      docs: "תיעוד",
      blog: "בלוג",
      toggleMenu: "פתיחת תפריט",
    },
    footer: {
      productTitle: "מוצר",
      openSourceTitle: "קוד פתוח",
      legalTitle: "משפטי",
      documentation: "תיעוד",
      selfHostingGuide: "מדריך אירוח עצמי",
      privacyPolicy: "מדיניות פרטיות",
      termsOfService: "תנאי שימוש",
      builtBy: "נבנה על ידי Kirill Markin",
      localeSwitcherAriaLabel: "בחירת שפה",
      operatedBy: "מופעל על ידי SAMO DANNI EOOD · VAT: BG207395566 · מדינה: בולגריה",
    },
    breadcrumbs: {
      home: "דף הבית",
      docs: "תיעוד",
      blog: "בלוג",
    },
    home: {
      humanTitle: "לבני אדם",
      humanWebApp: "אפליקציית ווב",
      agentTitle: "לסוכני AI",
      showcaseEyebrow: "ממשק אמיתי",
      showcaseTitle: "ראו את סביבת העבודה של התקציב לפני רשימת היכולות",
      showcaseImageAlt:
        "ממשק Expense Budget Tracker המציג צ'אט AI, קטגוריות תקציב, הוצאות בפועל, החודש הנוכחי ותוכניות עתידיות.",
    },
    docs: {
      title: "תיעוד",
      description:
        "התחלה מהירה, מדריך אירוח עצמי, הפניה ל-API וסקירת ארכיטקטורה.",
    },
    blogIndex: {
      title: "בלוג",
      description: "עדכונים, מדריכים ותובנות על Expense Budget Tracker.",
      empty: "פוסטים יפורסמו בקרוב.",
    },
    blogPost: {
      publishedLabel: "פורסם",
      bylinePrefix: "מאת",
      relatedHeading: "להמשך קריאה",
    },
    legal: {
      lastUpdated: "עודכן לאחרונה:",
    },
  },
};

export function getSiteMessages(locale: AppLocale): SiteMessages {
  return SITE_MESSAGES[locale];
}

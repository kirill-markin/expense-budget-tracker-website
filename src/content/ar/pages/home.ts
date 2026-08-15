import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_AR: PageContent = {
  locale: "ar",
  title: "Expense Budget Tracker - تتبّع النفقات والميزانية مفتوح المصدر",
  description:
    "متتبع مفتوح المصدر للنفقات والميزانية الشخصية يدعم العملات المتعددة، ويوفّر لوحات معلومات مالية وخادم MCP مستضافًا وAgent API.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "تتبّع نفقاتك.",
        "خطّط لميزانيتك.",
        "احتفظ بالسيطرة على بياناتك.",
      ],
      subtitle:
        "أداة مفتوحة المصدر لإدارة المال الشخصي تدعم العملات المتعددة، وتخطيط الميزانية، ولوحات المعلومات المالية، مع إعداد مهيأ للعمل مع الوكلاء. يكفي أن تمنح Claude Code أو Codex أو OpenClaw رابط اكتشاف واحدًا، ثم تؤكد رمز التحقق المرسل إلى بريدك الإلكتروني، ليتولى الوكيل بقية الإعداد.",
      primaryLink: {
        label: "ابدأ الآن",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "شاهده على GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "صِل عميل MCP بعيدًا يدعم OAuth:",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "المزايا",
      intro:
        "كل ما تحتاجه لمتابعة أموالك الشخصية من دون التنازل عن التحكم في بياناتك.",
      items: [
        {
          title: "دعم العملات المتعددة",
          description:
            "تابع حساباتك بأي عملة، مع تحويل تلقائي لأسعار الصرف استنادًا إلى بيانات ECB وCBR وNBS.",
        },
        {
          title: "تخطيط الميزانية",
          description:
            "جدول شهري للميزانية يضم فئات الدخل والإنفاق، ويتيح لك مقارنة ما خططت له بما تحقق فعليًا.",
        },
        {
          title: "لوحات المعلومات",
          description:
            "عرض بصري واضح للإنفاق، وتطور الأرصدة بمرور الوقت، وتأثير تغيّرات سعر الصرف في محفظتك.",
        },
        {
          title: "استضافة ذاتية",
          description:
            "Docker Compose مع Postgres. تبقى بياناتك على خادمك أنت، من دون اعتماد على خدمات طرف ثالث.",
        },
        {
          title: "MCP وAgent API",
          description:
            "صِل عميل MCP بعيدًا يدعم OAuth للاستعلام عن بياناتك المالية باستخدام النطاق الإلزامي expenses:read. ويمكن للعميل أيضًا طلب النطاق الاختياري expenses:write؛ ويظهر في شاشة موافقة OAuth ويلزم لإجراء التعديلات. للوكلاء عبر سطر الأوامر أو HTTP المباشر، ابدأ بطلب GET إلى https://api.expense-budget-tracker.com/v1/ واستخدم Agent API مع ApiKey.",
        },
        {
          title: "عزل مساحات العمل",
          description:
            "يوفّر Postgres عزلًا على مستوى الصفوف، بحيث يحصل كل مستخدم على مساحة عمل مستقلة يمكن مشاركتها عبر الدعوات.",
        },
      ],
    },
  ],
  body: "",
};

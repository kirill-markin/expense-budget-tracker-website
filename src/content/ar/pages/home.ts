import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_AR: PageContent = {
  locale: "ar",
  title: "Expense Budget Tracker - إدارة مالية شخصية مفتوحة المصدر",
  description:
    "متتبع نفقات وميزانية مفتوح المصدر مع دعم متعدد العملات ولوحات مالية وتهيئة أصلية لوكلاء Claude Code وCodex وOpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "تتبع المصروفات.",
        "خطط الميزانية.",
        "احتفظ ببياناتك عندك.",
      ],
      subtitle:
        "أداة مفتوحة المصدر لإدارة المال الشخصي مع دعم متعدد العملات وتخطيط الميزانية ولوحات المعلومات وتهيئة أصلية للوكلاء. أعط Claude Code أو Codex أو OpenClaw رابط discovery واحدًا، ثم أكّد رمز البريد واترك الوكيل يكمل الباقي.",
      primaryLink: {
        label: "ابدأ الآن",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "عرض على GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "ابدأ بطلب GET على رابط الاكتشاف التالي:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "الميزات",
      intro:
        "كل ما تحتاجه لإدارة أموالك الشخصية من دون التنازل عن التحكم في بياناتك.",
      items: [
        {
          title: "متعدد العملات",
          description: "إدارة الحسابات بأي عملة مع تحويل تلقائي باستخدام أسعار ECB وCBR وNBS.",
        },
        {
          title: "تخطيط الميزانية",
          description: "شبكة شهرية للإيرادات والمصروفات لمقارنة المخطط بالفعلي.",
        },
        {
          title: "لوحات المعلومات",
          description: "عرض مرئي للمصروفات والأرصدة وتأثير تغيرات سعر الصرف.",
        },
        {
          title: "استضافة ذاتية",
          description: "Docker Compose مع Postgres. تبقى بياناتك على خادمك.",
        },
        {
          title: "واجهة أصلية للوكلاء",
          description:
            "شارك رابط discovery مع الوكيل، ثم دعه يطلب البريد الإلكتروني ويؤكد رمز 8 أرقام ويُنشئ ApiKey خاصة به ويختار workspace.",
        },
        {
          title: "عزل workspace",
          description: "يضمن Postgres RLS عزل البيانات لكل workspace مع إمكانية المشاركة عبر الدعوات.",
        },
      ],
    },
  ],
  body: "",
};

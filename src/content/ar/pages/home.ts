import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_AR: PageContent = {
  locale: "ar",
  title: "Expense Budget Tracker - إدارة مالية شخصية مفتوحة المصدر",
  description:
    "متتبع نفقات وميزانية مفتوح المصدر يدعم تعدد العملات، ويوفّر لوحات مالية وتهيئة أصلية للوكلاء مع Claude Code وCodex وOpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "تابع مصروفاتك.",
        "خطّط لميزانيتك.",
        "أبقِ بياناتك تحت سيطرتك.",
      ],
      subtitle:
        "متتبع مالي شخصي مفتوح المصدر يدعم تعدد العملات، وتخطيط الميزانية، ولوحات المعلومات المالية، مع تهيئة أصلية للوكلاء. امنح Claude Code أو Codex أو OpenClaw رابط اكتشاف واحدًا، ثم أكّد رمز التحقق المرسل إلى بريدك واترك الوكيل يتولى الباقي.",
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
        "كل ما تحتاجه لمتابعة أموالك الشخصية من دون أن تتخلى عن السيطرة على بياناتك.",
      items: [
        {
          title: "متعدد العملات",
          description: "أدر حساباتك بأي عملة مع تحويل تلقائي استنادًا إلى أسعار ECB وCBR وNBS.",
        },
        {
          title: "تخطيط الميزانية",
          description: "شبكة شهرية للدخل والمصروفات تتيح لك مقارنة المخطط بالقيم الفعلية بسهولة.",
        },
        {
          title: "لوحات المعلومات",
          description: "تصورات واضحة للإنفاق والأرصدة عبر الوقت وأثر تغيّرات سعر الصرف.",
        },
        {
          title: "استضافة ذاتية",
          description: "Docker Compose مع Postgres، لتبقى بياناتك على خادمك وتحت سيطرتك.",
        },
        {
          title: "واجهة أصلية للوكلاء",
          description:
            "شارك رابط اكتشاف واحدًا مع الوكيل، وسيطلب بريدك الإلكتروني، ويتحقق من الرمز المكوَّن من 8 أرقام، وينشئ مفتاح ApiKey خاصًا به، ويختار مساحة العمل، ثم يبدأ العمل.",
        },
        {
          title: "عزل مساحات العمل",
          description: "يفرض Postgres RLS عزل البيانات لكل مساحة عمل، مع إمكانية مشاركة المساحات عبر الدعوات.",
        },
      ],
    },
  ],
  body: "",
};

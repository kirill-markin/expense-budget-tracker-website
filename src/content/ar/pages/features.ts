import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_AR: PageContent = {
  locale: "ar",
  title: "الميزات",
  description:
    "تتبع متعدد العملات وتخطيط الميزانية ولوحات المعلومات وSQL API والتهيئة للوكلاء والاستضافة الذاتية وعزل workspace.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "الميزات",
      intro:
        "كل ما تحتاجه لإدارة أموالك الشخصية من دون التنازل عن التحكم في بياناتك.",
      items: [
        {
          title: "حسابات متعددة العملات",
          description: "تُخزن كل معاملة بعملتها الأصلية ويجري التحويل إلى عملة التقرير وقت القراءة فقط.",
        },
        {
          title: "شبكة الميزانية",
          description: "ميزانية شهرية بفئات دخل ومصروفات مع مقارنة مباشرة بين المخطط والفعلي.",
        },
        {
          title: "تتبع الأرصدة",
          description: "تُحسب الأرصدة تلقائيًا من دفتر القيود، وتُعامل التحويلات بين حساباتك كحالة أساسية.",
        },
        {
          title: "SQL API",
          description: "وصول برمجي عبر API Gateway وApiKey مع SQL مقيد وتطبيق كامل لـ RLS.",
        },
        {
          title: "دردشة AI",
          description: "واجهة دردشة داخلية تفهم بياناتك المالية وتجيب عن أسئلة الإنفاق والميزانية.",
        },
      ],
    },
  ],
  body: "",
};

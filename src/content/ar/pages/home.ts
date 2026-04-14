import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_AR: PageContent = {
  locale: "ar",
  title: "Expense Budget Tracker - تتبّع النفقات والميزانية مفتوح المصدر",
  description:
    "متتبع مفتوح المصدر للنفقات والميزانية الشخصية يدعم العملات المتعددة، ويوفّر لوحات معلومات مالية وإعدادًا مهيأً للعمل مع Claude Code وCodex وOpenClaw.",
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
      hintText: "ابدأ بإرسال طلب GET إلى رابط الاكتشاف هذا:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
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
          title: "واجهة API مهيأة للوكلاء",
          description:
            "شارك رابط اكتشاف واحدًا مع Claude Code أو Codex أو OpenClaw. سيطلب الوكيل بريدك الإلكتروني، ويتحقق من الرمز ذي 8 أرقام، وينشئ ApiKey خاصًا به، ويحمّل سياق الحساب، ويختار مساحة العمل، ثم يبدأ العمل.",
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

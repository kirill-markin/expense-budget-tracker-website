import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_AR: PageContent = {
  locale: "ar",
  title: "الأسعار",
  description: "استضافة ذاتية مجانية أو استضافة سحابية مُدارة. مفتوح المصدر من دون حجب أي ميزة.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "الأسعار",
      intro: "كل الميزات متاحة في جميع الخطط، من دون حجب أي ميزة.",
      tiers: [
        {
          type: "link_tier",
          name: "استضافة ذاتية",
          price: "مجاني",
          highlighted: false,
          bullets: [
            "الشيفرة المصدرية كاملة على GitHub",
            "Docker Compose مع Postgres",
            "كل الميزات مشمولة",
            "خادمك، وبياناتك تحت سيطرتك",
            "دعم المجتمع",
          ],
          cta: {
            label: "عرض على GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "السحابة",
          price: "مجاني خلال المرحلة التجريبية",
          highlighted: true,
          bullets: [
            "استضافة مُدارة على AWS",
            "نسخ احتياطية تلقائية",
            "كل الميزات مشمولة",
            "تسجيل الدخول برمز تحقق عبر البريد الإلكتروني",
            "تحديث يومي لأسعار الصرف",
          ],
          cta: {
            label: "ابدأ الآن",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

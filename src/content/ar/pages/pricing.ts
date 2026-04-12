import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_AR: PageContent = {
  locale: "ar",
  title: "الأسعار",
  description: "استضافة ذاتية مجانية أو استضافة سحابية مُدارة. مفتوح المصدر ومن دون حجب ميزات.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "الأسعار",
      intro: "كل الميزات متاحة في جميع الخطط.",
      tiers: [
        {
          type: "link_tier",
          name: "استضافة ذاتية",
          price: "مجاني",
          highlighted: false,
          bullets: [
            "الكود الكامل على GitHub",
            "Docker Compose + Postgres",
            "كل الميزات متاحة",
            "خادمك وبياناتك",
            "دعم المجتمع",
          ],
          cta: {
            label: "عرض على GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "مجاني خلال البيتا",
          highlighted: true,
          bullets: [
            "استضافة مُدارة على AWS",
            "نسخ احتياطية تلقائية",
            "كل الميزات متاحة",
            "تسجيل دخول عبر OTP بالبريد",
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

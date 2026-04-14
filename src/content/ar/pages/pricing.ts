import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_AR: PageContent = {
  locale: "ar",
  title: "الأسعار",
  description:
    "شغّله مجانًا على خادمك، أو اختر استضافة سحابية مُدارة. المشروع مفتوح المصدر وجميع الميزات متاحة للجميع.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "الأسعار",
      intro: "جميع الميزات متاحة في كل خيار، من دون أي حجب للميزات.",
      tiers: [
        {
          type: "link_tier",
          name: "استضافة ذاتية",
          price: "مجاني",
          highlighted: false,
          bullets: [
            "الشيفرة المصدرية الكاملة متاحة على GitHub",
            "جاهز للتشغيل عبر Docker Compose وPostgres",
            "جميع الميزات متاحة",
            "خادمك وبياناتك تحت سيطرتك",
            "دعم من المجتمع",
          ],
          cta: {
            label: "تصفّح المشروع على GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "السحابة المُدارة",
          price: "مجاني خلال الفترة التجريبية",
          highlighted: true,
          bullets: [
            "استضافة مُدارة على AWS",
            "نسخ احتياطية تلقائية",
            "جميع الميزات متاحة",
            "تسجيل الدخول برمز تحقق يُرسل إلى البريد الإلكتروني",
            "تحديث يومي لأسعار الصرف",
          ],
          cta: {
            label: "ابدأ مجانًا",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

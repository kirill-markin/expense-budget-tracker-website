import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_FA: PageContent = {
  locale: "fa",
  title: "قیمت‌گذاری",
  description:
    "استقرار رایگان self-hosted یا میزبانی cloud مدیریت‌شده. متن‌باز و بدون محدودیت قابلیت.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "قیمت‌گذاری",
      intro: "همه قابلیت‌ها در همه پلن‌ها در دسترس هستند.",
      tiers: [
        {
          type: "link_tier",
          name: "میزبانی شخصی",
          price: "رایگان",
          highlighted: false,
          bullets: [
            "کد کامل در GitHub",
            "Docker Compose + Postgres",
            "همه قابلیت‌ها فعال",
            "سرور شما، داده‌های شما",
            "پشتیبانی جامعه",
          ],
          cta: {
            label: "مشاهده در GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "در دوره بتا رایگان",
          highlighted: true,
          bullets: [
            "میزبانی مدیریت‌شده روی AWS",
            "نسخه پشتیبان خودکار",
            "همه قابلیت‌ها فعال",
            "احراز هویت با ایمیل OTP",
            "به‌روزرسانی روزانه نرخ ارز",
          ],
          cta: {
            label: "شروع کنید",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

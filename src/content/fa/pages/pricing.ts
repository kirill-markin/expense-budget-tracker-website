import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_FA: PageContent = {
  locale: "fa",
  title: "قیمت‌گذاری",
  description:
    "استقرار رایگان به‌صورت خودمیزبان یا میزبانی ابری مدیریت‌شده. متن‌باز و بدون محدودیت قابلیتی.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "قیمت‌گذاری",
      intro: "همه قابلیت‌ها در همه طرح‌ها در دسترس هستند. هیچ قابلیتی قفل نشده است.",
      tiers: [
        {
          type: "link_tier",
          name: "خودمیزبان",
          price: "رایگان",
          highlighted: false,
          bullets: [
            "کد منبع کامل در GitHub",
            "Docker Compose به‌همراه Postgres",
            "همه قابلیت‌ها در دسترس",
            "سرور شما، داده‌های شما",
            "پشتیبانی انجمن",
          ],
          cta: {
            label: "مشاهده در GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "ابری",
          price: "در دوره بتا رایگان",
          highlighted: true,
          bullets: [
            "میزبانی مدیریت‌شده روی AWS",
            "پشتیبان‌گیری خودکار",
            "همه قابلیت‌ها در دسترس",
            "احراز هویت ایمیلی با رمز یک‌بارمصرف",
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

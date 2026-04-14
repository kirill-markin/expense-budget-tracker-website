import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_FA: PageContent = {
  locale: "fa",
  title: "قیمت‌گذاری",
  description:
    "استقرار رایگان روی سرور خودتان یا استفاده از نسخه ابری مدیریت‌شده. متن‌باز است و همه قابلیت‌ها در هر دو گزینه در دسترس‌اند.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "قیمت‌گذاری",
      intro: "همه قابلیت‌ها در هر دو گزینه در دسترس است. چیزی پشت دیوار پرداخت نیست.",
      tiers: [
        {
          type: "link_tier",
          name: "خودمیزبان",
          price: "رایگان",
          highlighted: false,
          bullets: [
            "کد کامل پروژه در GitHub",
            "راه‌اندازی با Docker Compose و Postgres",
            "همه قابلیت‌ها بدون محدودیت",
            "زیرساخت و داده‌ها در اختیار خودتان",
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
            "همه قابلیت‌ها بدون محدودیت",
            "ورود با کد یک‌بارمصرف ایمیلی",
            "به‌روزرسانی روزانه نرخ ارز",
          ],
          cta: {
            label: "شروع رایگان",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

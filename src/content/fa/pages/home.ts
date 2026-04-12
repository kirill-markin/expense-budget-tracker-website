import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_FA: PageContent = {
  locale: "fa",
  title: "Expense Budget Tracker - ابزار متن‌باز مدیریت مالی شخصی",
  description:
    "ابزار متن‌باز ثبت هزینه و مدیریت بودجه با پشتیبانی چندارزی، داشبوردهای مالی و راه‌اندازی بومی برای ایجنت‌ها در Claude Code، Codex و OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "هزینه‌ها را دنبال کنید.",
        "بودجه را برنامه‌ریزی کنید.",
        "مالک داده‌های خود بمانید.",
      ],
      subtitle:
        "ابزار متن‌باز مدیریت مالی شخصی با پشتیبانی چندارزی، برنامه‌ریزی بودجه، داشبوردهای مالی و راه‌اندازی بومی برای ایجنت‌ها. کافی است یک نشانی اکتشاف API را به Claude Code، Codex یا OpenClaw بدهید، کد تایید ایمیل را وارد کنید و بقیه کار را به ایجنت بسپارید.",
      primaryLink: {
        label: "شروع کنید",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "مشاهده در GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "برای شروع، یک درخواست GET به این نشانی اکتشاف بفرستید:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "ویژگی‌ها",
      intro:
        "هر آنچه برای مدیریت مالی شخصی نیاز دارید، بدون اینکه کنترل داده‌هایتان را از دست بدهید.",
      items: [
        {
          title: "چندارزی",
          description:
            "حساب‌ها را با هر ارزی ثبت و پیگیری کنید. تبدیل خودکار ارز با نرخ‌های ECB، CBR و NBS انجام می‌شود.",
        },
        {
          title: "برنامه‌ریزی بودجه",
          description:
            "جدول ماهانه بودجه با دسته‌بندی‌های درآمد و هزینه. مقدار برنامه‌ریزی‌شده را با مقدار واقعی مقایسه کنید.",
        },
        {
          title: "داشبوردها",
          description:
            "نمایی بصری از هزینه‌ها، روند مانده حساب‌ها در طول زمان و اثر نوسان ارز بر سبد دارایی شما.",
        },
        {
          title: "استقرار روی سرور خودتان",
          description:
            "با Docker Compose و Postgres اجرا می‌شود. داده‌های شما روی سرور خودتان می‌ماند و به سرویس‌های شخص ثالث وابسته نیست.",
        },
        {
          title: "API بومی برای ایجنت‌ها",
          description:
            "یک نشانی اکتشاف API را با Claude Code، Codex یا OpenClaw به اشتراک بگذارید. ایجنت ایمیل شما را می‌پرسد، کد ۸ رقمی را تایید می‌کند، ApiKey خودش را می‌سازد، اطلاعات حساب را بارگذاری می‌کند، یک فضای کاری را انتخاب می‌کند و شروع به کار می‌کند.",
        },
        {
          title: "جداسازی فضای کاری",
          description:
            "در Postgres از Row-level Security استفاده می‌شود. هر کاربر یک فضای کاری ایزوله دارد و می‌تواند دسترسی را از طریق دعوت‌نامه با دیگران به اشتراک بگذارد.",
        },
      ],
    },
  ],
  body: "",
};

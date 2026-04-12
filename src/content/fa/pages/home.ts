import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_FA: PageContent = {
  locale: "fa",
  title: "Expense Budget Tracker - مدیریت مالی شخصی متن‌باز",
  description:
    "ردیاب متن‌باز هزینه و بودجه با پشتیبانی چندارزی، داشبوردهای مالی و راه‌اندازی بومی برای Claude Code، Codex و OpenClaw.",
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
        "ردیاب متن‌باز مالی شخصی با پشتیبانی چندارزی، برنامه‌ریزی بودجه، داشبوردهای مالی و راه‌اندازی بومی برای عامل‌ها. کافی است یک discovery URL به Claude Code، Codex یا OpenClaw بدهید، کد ایمیل را تایید کنید و بقیه کار را به عامل بسپارید.",
      primaryLink: {
        label: "شروع کنید",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "مشاهده در GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "با GET روی این نشانی کشف شروع کنید:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "امکانات",
      intro:
        "همه چیزهایی که برای مدیریت مالی شخصی لازم دارید، بدون از دست دادن کنترل روی داده‌هایتان.",
      items: [
        {
          title: "چندارزی",
          description:
            "حساب‌ها را در هر ارزی مدیریت کنید. تبدیل خودکار با نرخ‌های ECB، CBR و NBS.",
        },
        {
          title: "برنامه‌ریزی بودجه",
          description:
            "جدول ماهانه بودجه با دسته‌بندی درآمد و هزینه. برنامه را با واقعیت مقایسه کنید.",
        },
        {
          title: "داشبوردها",
          description:
            "نمای دیداری از هزینه‌ها، روند مانده‌ها و اثر نرخ ارز بر سبد مالی شما.",
        },
        {
          title: "میزبانی شخصی",
          description:
            "Docker Compose با Postgres. داده‌های شما روی سرور خودتان می‌ماند.",
        },
        {
          title: "API بومی برای عامل‌ها",
          description:
            "یک discovery URL را با Claude Code، Codex یا OpenClaw به اشتراک بگذارید. عامل ایمیل را می‌گیرد، کد ۸ رقمی را تایید می‌کند، ApiKey خودش را می‌سازد و کار را شروع می‌کند.",
        },
        {
          title: "جداسازی workspace",
          description:
            "Row-level security در Postgres. هر کاربر workspace ایزوله خودش را دارد و دسترسی از طریق دعوت‌نامه‌ها به اشتراک گذاشته می‌شود.",
        },
      ],
    },
  ],
  body: "",
};

import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_FA: PageContent = {
  locale: "fa",
  title: "Expense Budget Tracker - نرم‌افزار متن‌باز مدیریت مالی شخصی",
  description:
    "نرم‌افزار متن‌باز ثبت هزینه و مدیریت بودجه با پشتیبانی از چند ارز، داشبوردهای مالی و اتصال مستقیم به ایجنت‌ها در Claude Code، Codex و OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "هزینه‌ها را ثبت کنید.",
        "بودجه را مدیریت کنید.",
        "داده‌ها را دست خودتان نگه دارید.",
      ],
      subtitle:
        "یک نرم‌افزار متن‌باز برای مدیریت مالی شخصی با پشتیبانی از چند ارز، بودجه‌بندی، داشبوردهای مالی و اتصال مستقیم به ایجنت‌ها. کافی است آدرس شناسایی API را به Claude Code، Codex یا OpenClaw بدهید، کد تایید ایمیل را وارد کنید و ادامه کار را به ایجنت بسپارید.",
      primaryLink: {
        label: "شروع کنید",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "مشاهده در GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "برای شروع، یک درخواست GET به این آدرس شناسایی API بفرستید:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "ویژگی‌ها",
      intro:
        "هر آنچه برای مدیریت مالی شخصی لازم دارید، بدون اینکه کنترل داده‌هایتان را واگذار کنید.",
      items: [
        {
          title: "چندارزی",
          description:
            "حساب‌ها را با هر ارزی ثبت و دنبال کنید. تبدیل ارز به‌صورت خودکار و با نرخ‌های ECB، CBR و NBS انجام می‌شود.",
        },
        {
          title: "برنامه‌ریزی بودجه",
          description:
            "بودجه ماهانه را با دسته‌بندی‌های درآمد و هزینه تنظیم کنید و رقم برنامه‌ریزی‌شده را کنار مبلغ واقعی ببینید.",
        },
        {
          title: "داشبوردها",
          description:
            "نمایی روشن از هزینه‌ها، روند تغییر مانده حساب‌ها در گذر زمان و اثر نوسان ارز بر سبد دارایی شما.",
        },
        {
          title: "استقرار روی سرور خودتان",
          description:
            "روی سرور خودتان با Docker Compose و Postgres اجرا می‌شود. داده‌ها نزد خودتان می‌ماند و به سرویس‌های شخص ثالث وابسته نمی‌شوید.",
        },
        {
          title: "API بومی برای ایجنت‌ها",
          description:
            "فقط کافی است آدرس شناسایی API را به Claude Code، Codex یا OpenClaw بدهید. ایجنت ایمیل شما را می‌گیرد، کد ۸ رقمی را تایید می‌کند، ApiKey خودش را می‌سازد، حساب‌ها را بارگذاری می‌کند، فضای کاری مناسب را انتخاب می‌کند و کار را ادامه می‌دهد.",
        },
        {
          title: "جداسازی فضای کاری",
          description:
            "دسترسی در Postgres با سیاست‌های امنیتی سطح‌ردیف کنترل می‌شود. هر کاربر فضای کاری جدا و ایزوله خودش را دارد و می‌تواند آن را از طریق دعوت‌نامه با دیگران به اشتراک بگذارد.",
        },
      ],
    },
  ],
  body: "",
};

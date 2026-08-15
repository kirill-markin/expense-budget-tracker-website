import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_FA: PageContent = {
  locale: "fa",
  title: "Expense Budget Tracker - نرم‌افزار متن‌باز مدیریت مالی شخصی",
  description:
    "نرم‌افزار متن‌باز ثبت هزینه و مدیریت بودجه با پشتیبانی از چند ارز، داشبوردهای مالی، سرور میزبانی‌شده MCP و Agent API.",
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
      hintText: "کلاینت راه‌دور MCP سازگار با OAuth را متصل کنید:",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
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
          title: "MCP و Agent API",
          description:
            "یک کلاینت راه‌دور MCP سازگار با OAuth را برای خواندن داده‌های مالی با مجوز الزامی expenses:read متصل کنید. کلاینت همچنین می‌تواند مجوز اختیاری expenses:write را درخواست کند؛ این مجوز در صفحه رضایت OAuth نمایش داده می‌شود و برای تغییر داده‌ها لازم است. برای ایجنت‌های خط فرمان یا HTTP مستقیم، با GET https://api.expense-budget-tracker.com/v1/ شروع کنید و از Agent API با ApiKey استفاده کنید.",
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

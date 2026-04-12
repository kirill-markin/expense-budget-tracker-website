import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_HE: PageContent = {
  locale: "he",
  title: "Expense Budget Tracker - ניהול כספים אישי בקוד פתוח",
  description:
    "כלי קוד פתוח למעקב אחר הוצאות ולתכנון תקציב, עם תמיכה בריבוי מטבעות, לוחות מחוונים פיננסיים ותהליך הגדרה מותאם לסוכנים כמו Claude Code, Codex ו-OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "עקבו אחר הוצאות.",
        "תכננו תקציבים.",
        "שמרו על הנתונים שלכם.",
      ],
      subtitle:
        "כלי קוד פתוח לניהול כספים אישיים עם תמיכה בריבוי מטבעות, תכנון תקציב, לוחות מחוונים פיננסיים ותהליך הגדרה מותאם לסוכנים. תנו ל-Claude Code, ל-Codex או ל-OpenClaw כתובת גילוי אחת של ה-API, אשרו את הקוד שנשלח באימייל, ותנו לסוכן לטפל בכל השאר.",
      primaryLink: {
        label: "התחילו",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "צפו בפרויקט ב-GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "התחילו בבקשת GET לכתובת הגילוי הזו:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "תכונות",
      intro:
        "כל מה שצריך כדי לעקוב אחר הכספים האישיים שלכם, בלי לוותר על השליטה בנתונים.",
      items: [
        {
          title: "ריבוי מטבעות",
          description:
            "עקבו אחר חשבונות בכל מטבע, עם המרות אוטומטיות לפי שערי ECB, CBR ו-NBS.",
        },
        {
          title: "תכנון תקציב",
          description:
            "טבלת תקציב חודשית עם קטגוריות הכנסה והוצאה, והשוואה בין התכנון לבין הביצוע בפועל.",
        },
        {
          title: "לוחות מחוונים",
          description:
            "תצוגה חזותית של ההוצאות, היתרות לאורך זמן והשפעת שערי המטבע על התיק שלכם.",
        },
        {
          title: "אירוח עצמי",
          description:
            "Docker Compose עם Postgres. הנתונים שלכם נשארים על השרת שלכם, בלי תלות בשירותי צד שלישי.",
        },
        {
          title: "API מותאם לסוכנים",
          description:
            "שתפו כתובת גילוי אחת עם Claude Code, Codex או OpenClaw. הסוכן יבקש את כתובת האימייל שלכם, יאמת את הקוד בן 8 הספרות, ינפיק לעצמו ApiKey, יטען את נתוני החשבונות, יבחר סביבת עבודה ויתחיל לעבוד.",
        },
        {
          title: "בידוד סביבת עבודה",
          description:
            "אבטחה ברמת שורה ב-Postgres מבודדת כל סביבת עבודה. אפשר לשתף גישה באמצעות הזמנות.",
        },
      ],
    },
  ],
  body: "",
};

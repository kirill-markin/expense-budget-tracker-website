import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_HE: PageContent = {
  locale: "he",
  title: "Expense Budget Tracker - מעקב הוצאות ותכנון תקציב בקוד פתוח",
  description:
    "כלי קוד פתוח לניהול כספים אישיים עם תמיכה בריבוי מטבעות, לוחות מחוונים פיננסיים וחיבור מובנה לסוכנים כמו Claude Code, Codex ו-OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "עקבו אחרי ההוצאות.",
        "תכננו את התקציב.",
        "השאירו את הנתונים אצלכם.",
      ],
      subtitle:
        "כלי קוד פתוח לניהול כספים אישיים עם תמיכה בריבוי מטבעות, תכנון תקציב, לוחות מחוונים פיננסיים וחיבור מובנה לסוכנים. פשוט מוסרים ל-Claude Code, ל-Codex או ל-OpenClaw כתובת גילוי אחת של ה-API, מאשרים את הקוד שנשלח למייל, והסוכן משלים את כל השאר.",
      primaryLink: {
        label: "התחילו",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "צפו בפרויקט ב-GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "התחילו בבקשת GET לכתובת הגילוי הבאה:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "תכונות",
      intro:
        "כל מה שצריך כדי לנהל את הכסף האישי שלכם, בלי לוותר על השליטה בנתונים.",
      items: [
        {
          title: "ריבוי מטבעות",
          description:
            "נהלו חשבונות בכל מטבע, עם המרה אוטומטית לפי שערים של ECB, CBR ו-NBS.",
        },
        {
          title: "תכנון תקציב",
          description:
            "טבלת תקציב חודשית עם קטגוריות הכנסה והוצאה, והשוואה ברורה בין התכנון לביצוע בפועל.",
        },
        {
          title: "לוחות מחוונים",
          description:
            "לוחות מחוונים שמציגים במבט אחד את ההוצאות, היתרות לאורך זמן והשפעת שערי החליפין על התיק שלכם.",
        },
        {
          title: "אירוח עצמי",
          description:
            "Docker Compose עם Postgres, להתקנה מקומית או על שרת משלכם. הנתונים נשארים אצלכם, בלי תלות בשירותי צד שלישי.",
        },
        {
          title: "API מותאם לסוכנים",
          description:
            "שתפו כתובת גילוי אחת עם Claude Code, Codex או OpenClaw. הסוכן יבקש את כתובת האימייל שלכם, יאמת את הקוד בן 8 הספרות, ינפיק לעצמו ApiKey, יטען את נתוני החשבונות, יבחר מרחב עבודה ויתחיל לעבוד.",
        },
        {
          title: "הפרדת מרחבי עבודה",
          description:
            "אבטחה ברמת שורה (Row-level security) ב-Postgres מבודדת כל מרחב עבודה. אפשר לשתף גישה באמצעות הזמנות.",
        },
      ],
    },
  ],
  body: "",
};

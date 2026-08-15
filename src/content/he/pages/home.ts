import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_HE: PageContent = {
  locale: "he",
  title: "Expense Budget Tracker - מעקב הוצאות ותכנון תקציב בקוד פתוח",
  description:
    "כלי קוד פתוח לניהול כספים אישיים עם תמיכה בריבוי מטבעות, לוחות מחוונים פיננסיים, שרת MCP מתארח ו-Agent API.",
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
      hintText: "חברו לקוח MCP מרוחק שתומך ב-OAuth:",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
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
          title: "MCP ו-Agent API",
          description:
            "חברו לקוח MCP מרוחק שתומך ב-OAuth כדי לשאול את הנתונים הפיננסיים שלכם עם ההרשאה הנדרשת expenses:read. הלקוח יכול לבקש גם את ההרשאה האופציונלית expenses:write; היא מוצגת במסך ההסכמה של OAuth ונדרשת לביצוע שינויים. לסוכני שורת פקודה או HTTP ישיר, התחילו עם GET https://api.expense-budget-tracker.com/v1/ והשתמשו ב-Agent API עם ApiKey.",
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

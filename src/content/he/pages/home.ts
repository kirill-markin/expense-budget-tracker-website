import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_HE: PageContent = {
  locale: "he",
  title: "Expense Budget Tracker - ניהול כספים אישי בקוד פתוח",
  description:
    "מעקב הוצאות ותקציב בקוד פתוח עם תמיכה בריבוי מטבעות, דשבורדים פיננסיים וחיבור מובנה לסוכני Claude Code, Codex ו-OpenClaw.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "עקבו אחרי הוצאות.",
        "תכננו תקציב.",
        "שמרו את הנתונים אצלכם.",
      ],
      subtitle:
        "כלי קוד פתוח לניהול כספים אישיים עם תמיכה בריבוי מטבעות, תכנון תקציב, דשבורדים פיננסיים והתחברות מובנית לסוכנים. תנו ל-Claude Code, Codex או OpenClaw כתובת discovery אחת, אשרו את הקוד מהאימייל ותנו לסוכן להשלים את השאר.",
      primaryLink: {
        label: "התחילו",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "צפו ב-GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "התחילו עם בקשת GET לכתובת discovery הזו:",
      hintLink: {
        label: "https://api.expense-budget-tracker.com/v1/",
        href: "https://api.expense-budget-tracker.com/v1/",
      },
    },
    {
      type: "feature_list",
      title: "יכולות",
      intro: "כל מה שצריך כדי לנהל כספים אישיים בלי לוותר על שליטה בנתונים.",
      items: [
        {
          title: "ריבוי מטבעות",
          description: "ניהול חשבונות בכל מטבע עם המרות אוטומטיות לפי שערי ECB, CBR ו-NBS.",
        },
        {
          title: "תכנון תקציב",
          description: "רשת תקציב חודשית עם קטגוריות הכנסה והוצאה והשוואה בין תכנון לביצוע.",
        },
        {
          title: "דשבורדים",
          description: "פירוק ויזואלי של הוצאות, מגמות יתרה והשפעת שערי מטבע.",
        },
        {
          title: "אירוח עצמי",
          description: "Docker Compose עם Postgres. הנתונים נשארים על השרת שלכם.",
        },
        {
          title: "API מובנה לסוכנים",
          description:
            "שתפו כתובת discovery אחת עם Claude Code, Codex או OpenClaw, ותנו לסוכן להשלים את תהליך החיבור וליצור ApiKey משלו.",
        },
        {
          title: "בידוד workspace",
          description: "Postgres RLS מבודד כל workspace, עם שיתוף גישה דרך הזמנות.",
        },
      ],
    },
  ],
  body: "",
};

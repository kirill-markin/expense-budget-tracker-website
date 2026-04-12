import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_HE: PageContent = {
  locale: "he",
  title: "יכולות",
  description:
    "מעקב רב-מטבעי, תכנון תקציב, דשבורדים, SQL API, חיבור סוכנים, אירוח עצמי ובידוד workspace.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "יכולות",
      intro: "כל מה שצריך כדי לנהל כספים אישיים בלי לוותר על שליטה בנתונים.",
      items: [
        {
          title: "חשבונות רב-מטבעיים",
          description: "כל תנועה נשמרת במטבע המקורי שלה ומומרת למטבע הדיווח בזמן קריאה בלבד.",
        },
        {
          title: "רשת תקציב",
          description: "תקציב חודשי לפי קטגוריות הכנסה והוצאה עם השוואה ישירה בין תכנון למציאות.",
        },
        {
          title: "מעקב יתרות",
          description: "היתרות מחושבות אוטומטית מה-ledger והעברות בין חשבונות נתמכות באופן מלא.",
        },
        {
          title: "SQL API",
          description: "גישה תכנותית דרך API Gateway ו-ApiKey עם SQL מוגבל ואכיפת RLS מלאה.",
        },
        {
          title: "צ'אט AI",
          description: "ממשק צ'אט פנימי שמבין את הנתונים הפיננסיים ויכול לענות על שאלות על הוצאות ותקציב.",
        },
      ],
    },
  ],
  body: "",
};

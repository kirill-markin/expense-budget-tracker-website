import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_HE: PageContent = {
  locale: "he",
  title: "מחירים",
  description: "אירוח עצמי בחינם או אירוח ענן מנוהל. קוד פתוח בלי חסימת יכולות.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "מחירים",
      intro: "כל היכולות זמינות בכל מסלול.",
      tiers: [
        {
          type: "link_tier",
          name: "אירוח עצמי",
          price: "חינם",
          highlighted: false,
          bullets: [
            "קוד מלא ב-GitHub",
            "Docker Compose + Postgres",
            "כל היכולות זמינות",
            "השרת שלכם, הנתונים שלכם",
            "תמיכת קהילה",
          ],
          cta: {
            label: "צפו ב-GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "חינם בתקופת הבטא",
          highlighted: true,
          bullets: [
            "אירוח מנוהל על AWS",
            "גיבויים אוטומטיים",
            "כל היכולות זמינות",
            "אימות אימייל OTP",
            "עדכון יומי של שערי מטבע",
          ],
          cta: {
            label: "התחילו",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

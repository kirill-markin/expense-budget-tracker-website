import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_HE: PageContent = {
  locale: "he",
  title: "מחירים",
  description: "אירוח עצמי ללא עלות או אירוח מנוהל בענן. קוד פתוח, בלי חסימת יכולות.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "מחירים",
      intro: "כל היכולות זמינות בכל מסלול. בלי חסימת יכולות.",
      tiers: [
        {
          type: "link_tier",
          name: "אירוח עצמי",
          price: "ללא עלות",
          highlighted: false,
          bullets: [
            "קוד המקור המלא זמין ב-GitHub",
            "Docker Compose ו-Postgres",
            "כל היכולות כלולות",
            "השרת שלכם, הנתונים שלכם",
            "תמיכת קהילה",
          ],
          cta: {
            label: "צפו בקוד ב-GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "ענן מנוהל",
          price: "ללא עלות בתקופת הבטא",
          highlighted: true,
          bullets: [
            "אירוח מנוהל ב-AWS",
            "גיבויים אוטומטיים",
            "כל היכולות כלולות",
            "אימות באימייל עם קוד חד-פעמי",
            "עדכון יומי של שערי חליפין",
          ],
          cta: {
            label: "התחילו עכשיו",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

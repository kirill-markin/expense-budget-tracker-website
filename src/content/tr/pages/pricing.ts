import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_TR = {
  locale: "tr",
  title: "Fiyatlandırma",
  description:
    "Kendi sunucunuzda ücretsiz kurulum veya yönetilen bulut hizmeti. Kaynak kodu açıktır ve tüm özellikler her planda kullanılabilir.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Fiyatlandırma",
      intro: "Tüm özellikler her planda kullanılabilir.",
      tiers: [
        {
          type: "link_tier",
          name: "Kendi sunucunuzda",
          price: "Ücretsiz",
          highlighted: false,
          bullets: [
            "Kaynak kodun tamamı GitHub'da",
            "Docker Compose + Postgres",
            "Tüm özellikler dahil",
            "Sunucu da veriler de sizin",
            "Topluluk desteği",
          ],
          cta: {
            label: "GitHub'da görüntüleyin",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Bulut",
          price: "Beta süresince ücretsiz",
          highlighted: true,
          bullets: [
            "AWS üzerinde yönetilen barındırma",
            "Otomatik yedeklemeler",
            "Tüm özellikler dahil",
            "E-postadaki tek kullanımlık kodla oturum açma",
            "Günlük döviz kuru güncellemeleri",
          ],
          cta: {
            label: "Başlayın",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "tr" };

import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_ID: Omit<PageContent, "locale"> & { readonly locale: "id" } = {
  locale: "id",
  title: "Harga",
  description:
    "Hosting mandiri gratis atau layanan cloud terkelola. Sumber terbuka dengan akses ke semua fitur di setiap paket.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Harga",
      intro: "Semua fitur tersedia di setiap paket.",
      tiers: [
        {
          type: "link_tier",
          name: "Hosting Mandiri",
          price: "Gratis",
          highlighted: false,
          bullets: [
            "Kode sumber lengkap di GitHub",
            "Docker Compose + Postgres",
            "Mencakup semua fitur",
            "Data tetap di server Anda",
            "Dukungan komunitas",
          ],
          cta: {
            label: "Lihat di GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Cloud",
          price: "Gratis selama masa beta",
          highlighted: true,
          bullets: [
            "Hosting terkelola di AWS",
            "Pencadangan otomatis",
            "Mencakup semua fitur",
            "Masuk dengan kode verifikasi sekali pakai lewat email",
            "Pembaruan kurs harian",
          ],
          cta: {
            label: "Mulai",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};

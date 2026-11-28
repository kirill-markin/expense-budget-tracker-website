import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages: ReturnType<typeof getSiteMessages> = {
  auth: {
    login: "Masuk",
    signup: "Daftar gratis",
    openApp: "Buka aplikasi",
  },
  header: {
    features: "Fitur",
    pricing: "Harga",
    docs: "Dokumentasi",
    blog: "Blog",
    toggleMenu: "Buka atau tutup menu",
  },
  footer: {
    productTitle: "Produk",
    openSourceTitle: "Sumber Terbuka",
    legalTitle: "Hukum",
    documentation: "Dokumentasi",
    selfHostingGuide: "Panduan Hosting Mandiri",
    support: "Dukungan",
    privacyPolicy: "Kebijakan Privasi",
    termsOfService: "Ketentuan Layanan",
    builtBy: "Dibuat oleh Kirill Markin",
    localeSwitcherAriaLabel: "Pilih bahasa",
    localeSearchLabel: "Cari bahasa",
    localeSearchEmpty: "Tidak ada bahasa yang cocok",
    operatedBy: "Dikelola oleh SAMO DANNI EOOD · VAT: BG207395566 · Negara: Bulgaria",
  },
  breadcrumbs: {
    ariaLabel: "Jalur navigasi",
    home: "Beranda",
    docs: "Dokumentasi",
    blog: "Blog",
  },
  home: {
    copyCode: {
      idle: "Salin",
      copied: "Disalin",
      failed: "Gagal menyalin",
    },
    humanTitle: "Untuk pengguna",
    humanWebApp: "Aplikasi web",
    agentTitle: "Untuk agen AI",
    agentDescription:
      "Hubungkan agen AI Anda melalui MCP. Tambahkan server Expense Budget Tracker ke klien MCP yang kompatibel agar agen dapat membaca dan memperbarui data keuangan Anda.",
    showcaseEyebrow: "Tampilan aplikasi",
    showcaseTitle: "Lihat tampilan ruang kerja untuk menyusun anggaran",
    showcaseImageAlt:
      "Antarmuka Expense Budget Tracker yang menampilkan obrolan AI, kategori anggaran, realisasi pengeluaran, bulan berjalan, dan rencana untuk bulan-bulan mendatang.",
  },
  docs: {
    title: "Dokumentasi",
    description:
      "Panduan memulai, penyiapan agen AI dan MCP, hosting mandiri, referensi API, dan ringkasan arsitektur.",
  },
  blogIndex: {
    title: "Blog",
    description: "Kabar terbaru, tutorial, dan panduan seputar Expense Budget Tracker.",
    empty: "Artikel akan segera hadir.",
  },
  blogPost: {
    publishedLabel: "Diterbitkan",
    bylinePrefix: "Oleh",
    relatedHeading: "Baca juga",
  },
  blogCta: {
    heading: "Coba Expense Budget Tracker",
    buttonLabel: "Coba sekarang",
  },
  legal: {
    lastUpdated: "Terakhir diperbarui:",
  },
};

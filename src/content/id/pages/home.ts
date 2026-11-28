import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_ID: Omit<PageContent, "locale"> & { readonly locale: "id" } = {
  locale: "id",
  title: "Expense Budget Tracker - Aplikasi Keuangan Pribadi Sumber Terbuka",
  description:
    "Aplikasi sumber terbuka untuk mencatat pengeluaran dan mengelola anggaran, dengan dukungan berbagai mata uang, dasbor keuangan, server MCP terkelola, dan API Agen.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Catat pengeluaran.",
        "Rencanakan anggaran.",
        "Kendalikan data Anda.",
      ],
      subtitle:
        "Catat keuangan pribadi dalam berbagai mata uang, susun anggaran, dan pantau saldo lewat dasbor di aplikasi sumber terbuka ini. Untuk menyiapkan akses agen, cukup berikan URL penemuan API ke Claude Code, Codex, atau OpenClaw dan konfirmasikan kode verifikasi dari email. Agen akan menangani sisanya.",
      primaryLink: {
        label: "Mulai",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Lihat di GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Hubungkan klien MCP jarak jauh yang mendukung OAuth:",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Fitur",
      intro:
        "Semua yang Anda perlukan untuk mencatat keuangan pribadi sambil tetap memegang kendali atas data Anda.",
      items: [
        {
          title: "Beragam Mata Uang",
          description:
            "Pantau rekening dalam mata uang apa pun. Konversi otomatis menggunakan kurs ECB, CBR, dan NBS.",
        },
        {
          title: "Perencanaan Anggaran",
          description:
            "Susun anggaran bulanan menurut kategori pemasukan dan pengeluaran. Bandingkan rencana dengan realisasi.",
        },
        {
          title: "Dasbor",
          description:
            "Lihat rincian pengeluaran, perubahan saldo dari waktu ke waktu, dan dampak kurs terhadap portofolio Anda.",
        },
        {
          title: "Hosting Mandiri",
          description:
            "Jalankan Docker Compose dengan Postgres. Data tetap berada di server Anda, tanpa ketergantungan pada pihak ketiga.",
        },
        {
          title: "MCP dan API Agen",
          description:
            "Hubungkan klien MCP jarak jauh yang mendukung OAuth untuk mengakses data keuangan dengan cakupan akses wajib expenses:read. Untuk menambah, mengubah, atau menghapus data, klien perlu meminta cakupan opsional expenses:write, yang akan ditampilkan di layar persetujuan OAuth. Untuk agen CLI atau klien HTTP langsung, mulai dari GET https://api.expense-budget-tracker.com/v1/ lalu gunakan API Agen dengan ApiKey.",
        },
        {
          title: "Isolasi Ruang Kerja",
          description:
            "Keamanan tingkat baris di Postgres mengisolasi ruang kerja setiap pengguna. Undang orang lain untuk berbagi ruang kerja.",
        },
      ],
    },
  ],
  body: "",
};

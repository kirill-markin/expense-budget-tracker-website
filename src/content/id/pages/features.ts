import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_ID: Omit<PageContent, "locale"> & { readonly locale: "id" } = {
  locale: "id",
  title: "Fitur",
  description:
    "Pencatatan dalam berbagai mata uang, perencanaan anggaran, dasbor, akses MCP terkelola, API Agen, hosting mandiri, dan isolasi ruang kerja.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Fitur",
      intro:
        "Semua yang Anda perlukan untuk mencatat keuangan pribadi sambil tetap memegang kendali atas data Anda.",
      items: [
        {
          title: "Rekening dalam Berbagai Mata Uang",
          description:
            "Aplikasi menyimpan setiap transaksi dalam mata uang aslinya. Saat data dibaca, aplikasi menghitung nilainya dalam mata uang pelaporan dengan kurs harian ECB, CBR, dan NBS. Nominal asli tetap utuh.",
        },
        {
          title: "Tabel Anggaran",
          description:
            "Susun anggaran bulanan dengan kategori pemasukan dan pengeluaran. Tetapkan nominal rencana, bandingkan dengan realisasi, dan pantau selisihnya. Setiap perubahan dicatat sebagai entri baru di jejak audit.",
        },
        {
          title: "Pemantauan Saldo",
          description:
            "Aplikasi menghitung saldo berjalan setiap rekening dari buku besar. Lihat total dalam mata uang apa pun. Aplikasi mencatat perpindahan dana antarrekening Anda sebagai transfer tersendiri.",
        },
        {
          title: "Dasbor",
          description:
            "Rincian pengeluaran, grafik perubahan saldo dari waktu ke waktu, dan analisis dampak kurs tersedia langsung di aplikasi tanpa alat BI eksternal.",
        },
        {
          title: "API Agen",
          description:
            "Jalur tersendiri untuk agen CLI dan klien HTTP langsung. Mulai dari GET https://api.expense-budget-tracker.com/v1/, lalu gunakan API Agen dengan autentikasi ApiKey untuk menjalankan SQL terbatas. Akses ini menerapkan RLS sepenuhnya, mendukung pemilihan ruang kerja, membatasi frekuensi permintaan, dan dapat diaudit.",
        },
        {
          title: "Server MCP Terkelola",
          description:
            "Klien MCP jarak jauh yang mendukung OAuth dapat terhubung ke https://mcp.expense-budget-tracker.com/mcp dan membaca data keuangan Anda dengan cakupan akses wajib expenses:read. Untuk menambah, mengubah, atau menghapus data, klien perlu meminta cakupan opsional expenses:write, yang akan ditampilkan di layar persetujuan OAuth.",
        },
        {
          title: "Obrolan AI",
          description:
            "Gunakan obrolan bawaan untuk bertanya tentang pengeluaran, membandingkan periode, atau mencari pola dari entri buku besar Anda.",
        },
        {
          title: "Isolasi Ruang Kerja",
          description:
            "Keamanan tingkat baris di Postgres memastikan data tiap ruang kerja terpisah. Setiap pengguna mendapat ruang kerja sendiri dan dapat mengundang orang lain ke ruang kerja bersama dengan kontrol akses penuh.",
        },
        {
          title: "Hosting Mandiri",
          description:
            "Jalankan Docker Compose dengan Postgres secara lokal atau di server sendiri. Anda memegang kendali penuh atas data keuangan tanpa terikat pada penyedia tertentu.",
        },
        {
          title: "Autentikasi Tanpa Kata Sandi",
          description:
            "Untuk masuk, gunakan kode verifikasi sekali pakai yang dikirim lewat email oleh AWS Cognito. Anda tidak perlu mengingat kata sandi atau mengkhawatirkan kebocorannya. Pendaftaran terbuka dan ruang kerja dibuat otomatis.",
        },
      ],
    },
  ],
  body: "",
};

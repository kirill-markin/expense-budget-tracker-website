---
title: Kebijakan Privasi
description: Kebijakan privasi Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: Agustus 2026
---
## Data yang Kami Kumpulkan

Saat Anda menggunakan versi cloud, kami menyimpan data keuangan yang Anda masukkan (transaksi, anggaran, dan nama rekening) dan alamat email Anda untuk autentikasi. Instalasi mandiri tidak mengirimkan data apa pun kepada kami.

## Pengelola

Layanan cloud Expense Budget Tracker dikelola oleh SAMO DANNI EOOD (VAT: BG207395566). Kirill Markin membuat Expense Budget Tracker. Situs pribadinya, [kirill-markin.com](https://kirill-markin.com/), juga terkait dengan ekosistem produk ini.

Kebijakan ini berlaku untuk situs web, aplikasi, API, dan layanan MCP jarak jauh yang kami kelola. Instalasi mandiri tetap berada di bawah kendali pengelolanya.

## Cara Kami Menggunakan Data Anda

Kami hanya menggunakan data keuangan Anda untuk menyediakan layanan. Kami tidak menjualnya atau menggunakannya untuk iklan. Kami hanya mengungkapkannya kepada klien pihak ketiga atas arahan Anda, misalnya ketika Anda memberikan otorisasi untuk koneksi MCP. Keamanan tingkat baris di Postgres mengisolasi setiap ruang kerja.

## MCP dan Klien AI Pihak Ketiga

Saat Anda menghubungkan klien AI ke layanan MCP terkelola, Expense Budget Tracker memproses permintaan otorisasi OAuth, alat yang dipanggil beserta argumennya, ruang kerja yang dipilih, dan catatan keuangan yang diperlukan untuk memenuhi permintaan baca atau menjalankan operasi tulis yang telah disetujui. Perubahan lewat MCP tersimpan dalam data keuangan cloud yang sama dengan perubahan lewat aplikasi web.

Layanan menyimpan nama dan URL pengalihan klien yang terdaftar, metadata koneksi dan cakupan akses, waktu pembuatan, aktivitas, dan pencabutan, serta hash satu arah dari kode otorisasi OAuth, token akses, dan token penyegaran. Layanan tidak menyimpan token OAuth dalam bentuk aslinya. Layanan MCP menerima setiap panggilan alat dan mengembalikan hasil yang diminta. Riwayat percakapan klien AI tidak disimpan sebagai percakapan di dalam Expense Budget Tracker.

Klien AI adalah pihak ketiga yang terpisah dan dapat memproses atau menyimpan prompt, argumen alat, serta data keuangan yang dikembalikan sesuai ketentuan dan kebijakan privasinya sendiri. Tinjau kebijakan klien sebelum menghubungkannya. Anda dapat mencabut koneksi MCP kapan saja melalui **Pengaturan > Akses agen dan program**. Anda dapat menghapus akun beserta data terkait yang tersimpan pada layanan melalui Pengaturan, seperti dijelaskan di bawah.

## Penyimpanan Data

Data cloud disimpan di AWS RDS (Postgres) di wilayah eu-central-1 dan dicadangkan secara otomatis setiap hari. Data dienkripsi saat disimpan dan saat dikirim.

## Cookie

Kami menggunakan cookie `session` untuk autentikasi (HttpOnly, Secure, SameSite=Lax). Kami tidak menggunakan cookie pelacakan. Kami juga tidak menggunakan layanan analitik pihak ketiga.

## Penghapusan Data

Anda dapat menghapus akun dan semua data yang terkait kapan saja melalui Pengaturan di aplikasi. Pada instalasi mandiri, Anda mengendalikan basis data secara langsung.

## Sumber Terbuka

Seluruh basis kode bersifat sumber terbuka. Anda dapat mengaudit secara langsung apa yang dilakukan aplikasi terhadap data Anda.

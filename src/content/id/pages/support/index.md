---
title: Dukungan
description: Panduan dukungan dan pelaporan keamanan untuk Expense Budget Tracker, termasuk layanan MCP terkelola.
slug: support
sections:
  - type: simple_markdown_page
---

## Dukungan untuk Layanan Terkelola dan MCP

Untuk bantuan terkait aplikasi terkelola, akun, otorisasi OAuth, atau server MCP publik, kirim email ke [markinkirill@gmail.com](mailto:markinkirill@gmail.com). Kami akan membantu sebisa mungkin tanpa menjamin waktu tanggapan.

Sertakan hanya informasi diagnostik yang diperlukan untuk menyelidiki masalah.

- nama dan versi klien
- tanggal, waktu, dan zona waktu saat masalah terjadi
- endpoint atau halaman yang terkait
- tahap OAuth atau nama alat MCP
- teks pesan kesalahan setelah informasi sensitif disamarkan, serta ID permintaan jika ditampilkan
- hasil yang Anda harapkan dan apa yang sebenarnya terjadi

Jangan pernah mengirim kata sandi, cookie sesi, kode OAuth, token akses atau penyegaran, kunci API, catatan keuangan mentah, atau isi permintaan yang masih memuat data sensitif.

## Laporan Keamanan

Jangan ungkap dugaan kerentanan di issue GitHub publik. Kirim email ke [markinkirill@gmail.com](mailto:markinkirill@gmail.com) dengan subjek **Expense Budget Tracker security report** dan langkah sesingkat mungkin untuk mengulangi masalah, tanpa data sensitif. Jangan sertakan kredensial aktif atau data keuangan. Jika kredensial akses mungkin telah bocor, cabut koneksi terlebih dahulu melalui **Pengaturan > Akses agen dan program**, lalu ganti kredensial lain yang terdampak.

## Bug, Hosting Mandiri, dan Pertanyaan Komunitas

Gunakan [pelacak issue GitHub](https://github.com/kirill-markin/expense-budget-tracker/issues) untuk bug produk yang bisa diulangi, pertanyaan tentang hosting mandiri, dan diskusi komunitas yang dapat dibuka untuk umum. Telusuri issue yang sudah ada terlebih dahulu dan hapus data pribadi dari log serta tangkapan layar. [Panduan hosting mandiri](/id/docs/self-hosting/) dan [repositori kode sumber](https://github.com/kirill-markin/expense-budget-tracker) membahas instalasi dan pengembangan.

## Sebelum Melaporkan Masalah MCP

Pastikan klien Anda mendukung MCP jarak jauh melalui Streamable HTTP, alur kode otorisasi OAuth 2.1 dengan PKCE, dan Dynamic Client Registration. Gunakan endpoint universal persis seperti yang tercantum di [panduan MCP](/id/docs/mcp-connector/). Hubungkan kembali klien, lalu coba sekali lagi. Jika masalah berlanjut, kirim informasi diagnostik yang tercantum di atas setelah menghapus data sensitif.

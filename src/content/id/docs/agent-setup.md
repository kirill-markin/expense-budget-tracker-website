---
title: Penyiapan Agen AI
description: Berikan URL penemuan API ke Claude Code, Codex, atau OpenClaw. Agen mengikuti petunjuk dari API, memverifikasi kode 8 digit, menyimpan ApiKey yang berlaku untuk jangka panjang, lalu mulai bekerja di ruang kerja Anda.
---

## Tautan untuk agen Anda

Berikan URL berikut persis seperti yang tertulis.

`https://api.expense-budget-tracker.com/v1/`

Ini adalah endpoint penemuan API resmi untuk agen AI. Responsnya menjelaskan cara memulai autentikasi, endpoint dan skema autentikasi yang dipakai selanjutnya, serta lokasi skema yang berlaku dan kode sumber implementasinya.

Panduan ini membahas penyiapan langsung API Agen untuk agen terminal dan klien HTTP. Jika klien Anda mendukung MCP, gunakan [konektor MCP](/id/docs/mcp-connector/) terkelola. Klien terhubung ke `https://mcp.expense-budget-tracker.com/mcp` dan meminta persetujuan lewat OAuth di browser tanpa menyiapkan ApiKey.

## Langkah untuk pengguna

1. Buka Claude Code, Codex, OpenClaw, atau agen lain yang dapat mengirim permintaan HTTP.
2. Minta agen terhubung ke Expense Budget Tracker melalui `https://api.expense-budget-tracker.com/v1/`.
3. Saat agen meminta alamat email, berikan alamat yang Anda gunakan untuk Expense Budget Tracker.
4. Buka kotak masuk untuk melihat kode verifikasi 8 digit.
5. Kirim kode itu kepada agen.
6. Izinkan agen menyimpan ApiKey yang diterima di luar memori obrolan, lalu lanjutkan dengan impor, kueri, atau penyusunan anggaran.

Anda tidak perlu menyalin dan menempelkan kunci secara manual saat masuk. Agen menyiapkan koneksinya sendiri setelah kode dari email diverifikasi.

## Langkah yang dijalankan agen

Urutan lengkapnya sebagai berikut.

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Baca respons penemuan API dan ikuti tindakan yang ditentukan server. Jangan tanamkan urutan langkah berikutnya di kode.
3. Kirim alamat email pengguna melalui `POST` ke `bootstrapUrl` yang dikembalikan.
4. Terima `otpSessionToken` dan tindakan `verify_code`.
5. Minta kode verifikasi 8 digit dari email pengguna.
6. Kirim `code`, `otpSessionToken`, dan `label` koneksi melalui `POST` ke `https://auth.expense-budget-tracker.com/api/agent/verify-code`.
7. Terima `ApiKey` baru.
8. Simpan kunci tersebut di luar memori obrolan, sebaiknya sebagai `EXPENSE_BUDGET_TRACKER_API_KEY`.
9. `GET https://api.expense-budget-tracker.com/v1/me` dengan `Authorization: ApiKey <key>`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Jika perlu, buat ruang kerja dengan `POST /v1/workspaces`.
12. Simpan ruang kerja default dengan `POST /v1/workspaces/{workspaceId}/select`.
13. Periksa relasi yang diizinkan dengan `GET https://api.expense-budget-tracker.com/v1/schema`.
14. Baca data melalui `POST https://api.expense-budget-tracker.com/v1/sql/query` dan kirim operasi tulis yang disetujui melalui `POST https://api.expense-budget-tracker.com/v1/sql/execute`.

Agen memilih ruang kerja secara eksplisit dan server menyimpan pilihan itu untuk kunci API setelah `POST /v1/workspaces/{workspaceId}/select`. Permintaan berikutnya ke `/v1/sql/query` dan `/v1/sql/execute` dapat dikirim tanpa `X-Workspace-Id`. Anda tetap dapat mengirim `X-Workspace-Id` untuk memilih ruang kerja lain pada satu permintaan. Endpoint kompatibilitas `POST /v1/sql` dikhususkan untuk skrip atomik yang berisi beberapa pernyataan SQL. Untuk operasi baca dan tulis biasa, gunakan endpoint masing-masing.

Jika pengguna hanya memiliki satu ruang kerja dan belum ada pilihan yang tersimpan untuk kunci itu, backend otomatis menyimpan dan menggunakan ruang kerja tersebut.

## Yang perlu disimpan agen

Kunci yang dikembalikan oleh `verify-code` berlaku untuk jangka panjang. Simpan kunci di luar memori obrolan.

- Jika pengguna mengizinkan penulisan file, simpan kunci dalam file `.env` lokal sebagai `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`.
- Jika penulisan file tidak disetujui, ekspor kunci di shell saat ini sebagai `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` dan minta pengguna menyimpannya di lokasi persisten.

Untuk permintaan terautentikasi, gunakan header berikut.

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` hanya jika Anda ingin memilih ruang kerja lain untuk permintaan ini atau jika belum ada ruang kerja yang tersimpan

## Jika Anda adalah agen AI

Mulai dengan perintah berikut.

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Ikuti langkah yang ditentukan server dalam dokumen penemuan API.

Setelah `verify-code`, simpan `ApiKey` yang dikembalikan dengan aman. Lalu gunakan endpoint berikut.

- `/v1/me` untuk konteks akun
- `/v1/workspaces` untuk daftar ruang kerja yang tersedia
- `/v1/schema` untuk relasi dan kolom SQL yang diizinkan
- `/v1/openapi.json` atau `/v1/swagger.json` hanya saat klien memeriksa URL spesifikasi standar. Endpoint ini mengarahkan klien ke dokumen penemuan API dan kode sumber tanpa mengembalikan spesifikasi API.

## Contoh prompt untuk pengguna

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## Yang bisa Anda lakukan setelah penyiapan

- Impor rekening koran atau hasil ekspor transaksi kartu
- Kelompokkan transaksi berdasarkan kategori yang sudah Anda gunakan
- Cocokkan saldo rekening dengan catatan bank
- Jalankan kueri pengeluaran menurut kategori, periode, nama merchant, atau rekening
- Perbarui pos anggaran untuk bulan depan

Untuk rincian endpoint dan autentikasi, lihat [Referensi API](/id/docs/api/).

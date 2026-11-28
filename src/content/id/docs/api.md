---
title: Referensi API
description: Penyiapan agen dan referensi API SQL untuk mengakses data keuangan Anda secara terprogram.
---

## Ringkasan

Expense Budget Tracker menyediakan satu API publik untuk klien mesin di alamat berikut.

`https://api.expense-budget-tracker.com/v1/`

API yang sama dapat digunakan dengan dua cara.

1. **Penyiapan langsung oleh agen** dimulai dari `GET /v1/`
2. **Permintaan HTTP langsung** dengan ApiKey yang berlaku untuk jangka panjang yang sudah tersedia

Semua permintaan tunduk pada aturan keamanan tingkat baris di Postgres (Row Level Security atau RLS) yang sama dengan aplikasi web.

Jika klien Anda mendukung MCP, gunakan [konektor MCP](/id/docs/mcp-connector/) terkelola di `https://mcp.expense-budget-tracker.com/mcp` dan berikan otorisasi melalui OAuth di browser. Halaman ini membahas penyiapan API Agen dan ketentuan untuk mengirim permintaan HTTP langsung. Keduanya menggunakan `ApiKey` yang berlaku untuk jangka panjang.

## Penemuan API, kode sumber, dan skema yang berlaku

Mulai dari URL berikut.

`https://api.expense-budget-tracker.com/v1/`

Respons penemuan API menjelaskan kepada agen cara memulai autentikasi dan endpoint berikutnya yang perlu dipanggil. Respons itu juga menautkan README dan kode implementasi. API menyediakan endpoint berikut.

- `GET /v1/schema`
- `GET /v1/openapi.json` dan `GET /v1/swagger.json` untuk pemeriksaan kompatibilitas. Responsnya menyatakan bahwa OpenAPI tidak tersedia dan mengarahkan klien ke dokumen penemuan API dan kode sumber.

Gunakan `schema` untuk melihat daftar pasti relasi dan kolom yang diizinkan melalui `/v1/sql/query`, `/v1/sql/execute`, dan endpoint kompatibilitas `/v1/sql`.

## Penyiapan langsung oleh agen

Agar Claude Code, Codex, OpenClaw, atau agen lain dapat menyiapkan koneksi sendiri, mulai dari endpoint penemuan API dan ikuti tindakan yang dikembalikan server.

### Alur autentikasi

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Baca tindakan `send_code` dan `bootstrapUrl` yang dikembalikan.
3. Kirim alamat email pengguna melalui `POST` ke `https://auth.expense-budget-tracker.com/api/agent/send-code`.
4. Terima `otpSessionToken`.
5. Minta kode verifikasi 8 digit dari email pengguna.
6. Kirim `code`, `otpSessionToken`, dan `label` melalui `POST` ke `https://auth.expense-budget-tracker.com/api/agent/verify-code`.
7. Terima `ApiKey` yang berlaku untuk jangka panjang.
8. Simpan kunci di luar memori obrolan.
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Jika perlu, gunakan `POST https://api.expense-budget-tracker.com/v1/workspaces` untuk membuat ruang kerja.
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Baca dengan `POST https://api.expense-budget-tracker.com/v1/sql/query` dan kirim operasi tulis yang disetujui melalui `POST https://api.expense-budget-tracker.com/v1/sql/execute`.

### Header autentikasi

- `Authorization: ApiKey <key>`

### Pemilihan ruang kerja

- `POST /v1/workspaces/{workspaceId}/select` menyimpan ruang kerja default untuk kunci API tersebut
- setelah ruang kerja disimpan, `/v1/sql/query`, `/v1/sql/execute`, dan endpoint kompatibilitas `/v1/sql` dapat dikirim tanpa `X-Workspace-Id`
- `X-Workspace-Id: <workspaceId>` tetap dapat digunakan untuk memilih ruang kerja lain pada satu permintaan
- jika pengguna hanya memiliki satu ruang kerja dan belum ada pilihan yang disimpan untuk kunci tersebut, API otomatis menyimpan dan menggunakan ruang kerja itu

Untuk panduan langkah demi langkah bagi pengguna, lihat [Penyiapan Agen AI](/id/docs/agent-setup/).

## Permintaan HTTP langsung dengan kunci yang sudah ada

Skrip, tugas cron, dasbor, dan aplikasi kustom dapat langsung memakai API yang sama dengan ApiKey yang berlaku untuk jangka panjang.

### Autentikasi

Kirim kunci melalui header autentikasi ApiKey.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` hanya diperlukan jika kunci tersebut belum memiliki ruang kerja default yang tersimpan atau jika Anda ingin memilih ruang kerja lain untuk permintaan itu.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` bila diperlukan

## Ringkasan endpoint

- `GET /v1/` — dokumen penemuan API publik
- `GET /v1/openapi.json` dan `GET /v1/swagger.json` — endpoint pemeriksaan kompatibilitas yang mengarahkan ke dokumen penemuan API dan kode sumber, tanpa menyediakan spesifikasi API
- `GET /v1/me` — konteks akun yang terautentikasi
- `GET /v1/workspaces` — daftar ruang kerja yang tersedia bagi pemilik kunci
- `POST /v1/workspaces` — buat ruang kerja
- `POST /v1/workspaces/{workspaceId}/select` — simpan ruang kerja default untuk kunci ini
- `GET /v1/schema` — periksa relasi dan kolom yang diizinkan untuk SQL
- `POST /v1/sql/query` — jalankan satu pernyataan `SELECT` atau `WITH ... SELECT` yang hanya membaca data
- `POST /v1/sql/execute` — jalankan satu pernyataan `INSERT`, `UPDATE`, atau `DELETE` yang disetujui
- `POST /v1/sql` — endpoint kompatibilitas untuk skrip atomik dengan beberapa pernyataan SQL

## Aturan SQL

Endpoint utama memisahkan operasi baca dan tulis.

- `POST /v1/sql/query` menerima tepat satu pernyataan `SELECT` atau `WITH ... SELECT` yang hanya membaca data
- `POST /v1/sql/execute` menerima tepat satu operasi `INSERT`, `UPDATE`, atau `DELETE`, termasuk bentuk `WITH` yang didukung
- endpoint kompatibilitas `POST /v1/sql` menerima skrip terbatas berisi beberapa pernyataan dan menerapkannya secara atomik. Gunakan endpoint ini hanya jika skrip memang perlu dijalankan secara atomik.

API memblokir atau menolak pola berikut.

- beberapa pernyataan dalam satu permintaan ke endpoint utama `/v1/sql/query` atau `/v1/sql/execute`
- DDL seperti `CREATE`, `DROP`, dan `ALTER`
- perintah pengendalian transaksi seperti `BEGIN`, `COMMIT`, dan `ROLLBACK`
- `set_config()`
- komentar SQL
- pengenal bertanda kutip
- string yang diapit tanda dolar

Server juga membatasi relasi yang dapat diakses melalui kueri. Gunakan `/v1/schema` untuk memeriksa relasi dan kolom yang tersedia sebelum membuat SQL.

Relasi berikut tersedia saat ini.

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (hanya baca)
- `fx_rates_raw` (hanya baca)
- `fx_rates_daily` (hanya baca)

## Batas Penggunaan

- Maksimal 100 baris hasil per permintaan
- Maksimal 100 baris yang dapat berubah per pernyataan tulis dan per permintaan
- Batas waktu total 25 detik per permintaan SQL
- Per kunci, maksimal 10 permintaan per detik dan 10.000 permintaan per hari

## Keamanan

- Kunci API disimpan sebagai hash SHA-256. Server tidak pernah menyimpan kunci dalam bentuk teks asli.
- RLS mengisolasi ruang kerja pada tingkat basis data.
- Kunci dapat dicabut kapan saja dari aplikasi.
- Mengeluarkan anggota dari ruang kerja otomatis mencabut semua kuncinya.

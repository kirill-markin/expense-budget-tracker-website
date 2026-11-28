---
title: Arsitektur
description: Ringkasan sistem, model data, cara aplikasi menangani berbagai mata uang, dan model autentikasi.
---

## Ringkasan Sistem

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

Enam komponen menggunakan satu basis data.

1. **web** — Aplikasi Next.js dengan dasbor dan rute API
2. **auth** — Masuk lewat email dengan kode verifikasi sekali pakai dan penyiapan akses agen di domain autentikasi
3. **sql-api** — AWS Lambda di belakang API Gateway untuk klien mesin
4. **mcp** — AWS Lambda khusus dan HTTP API di API Gateway untuk endpoint MCP terkelola
5. **worker** — Mengambil kurs harian dari ECB, CBR, dan NBS
6. **Postgres** — Satu-satunya sumber data acuan, dengan keamanan tingkat baris

## Model Data

- **ledger_entries** — Satu baris untuk setiap pergerakan dana pada rekening (pemasukan, pengeluaran, transfer)
- **budget_lines** — Perubahan pada sel anggaran selalu dicatat sebagai entri baru. Entri terakhir yang berlaku.
- **budget_comments** — Catatan yang dilampirkan pada sel anggaran dan hanya dapat ditambahkan
- **workspace_settings** — Mata uang pelaporan dan pengaturan ruang kerja
- **account_metadata** — Metadata rekening, misalnya klasifikasi likuiditas
- **exchange_rates** — Kurs harian untuk konversi saat kueri dijalankan
- **workspaces** / **workspace_members** — Isolasi data antar-tenant
- **accounts** — View yang dibentuk dari entri buku besar

## Berbagai Mata Uang

Semua nominal disimpan dalam mata uang aslinya. Konversi ke mata uang pelaporan dilakukan saat data dibaca melalui join SQL dengan `exchange_rates`, sehingga nominal asli tetap utuh.

## Autentikasi

Variabel lingkungan `AUTH_MODE` mengatur dua mode berikut.

- `none` — Tanpa autentikasi, satu ruang kerja lokal
- `cognito` — Masuk tanpa kata sandi dengan kode verifikasi sekali pakai yang dikirim AWS Cognito lewat email. Pendaftaran terbuka.

Klien mesin memulai penemuan API dari endpoint publik `GET /v1/`. Untuk menyiapkan akses, agen memverifikasi kode sekali pakai dari email melalui domain autentikasi. Setelah menerima ApiKey yang berlaku untuk jangka panjang, agen menjalankan SQL melalui API Gateway.

Klien yang mendukung MCP terhubung secara terpisah ke `https://mcp.expense-budget-tracker.com/mcp`. HTTP API khusus di API Gateway dan MCP Lambda menangani jalur tersebut. Otorisasi interaktif berlangsung melalui OAuth di browser pada domain autentikasi.

Setiap pengguna mendapat ruang kerja yang terisolasi. Kebijakan RLS memeriksa keanggotaan di setiap kueri, termasuk permintaan SQL dari klien mesin.

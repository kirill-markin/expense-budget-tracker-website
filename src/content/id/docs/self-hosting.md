---
title: Panduan Hosting Mandiri
description: Jalankan Expense Budget Tracker di server Anda sendiri dengan Docker Compose dan Postgres.
---

## Persyaratan

- Docker dan Docker Compose
- Postgres 18 (disertakan dalam file Compose)

## Mulai Cepat

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Perintah di atas memulai Postgres, menjalankan migrasi, dan menyalakan layanan berikut.

- aplikasi web di `http://localhost:3000`
- layanan autentikasi di `http://localhost:8081`
- worker yang mengambil data kurs di Docker Compose

## Konfigurasi

Salin `.env.example` ke `.env`, lalu sesuaikan pengaturan berikut.

- `MIGRATION_DATABASE_URL` — role pemilik basis data untuk migrasi
- `DATABASE_URL` — role aplikasi untuk proses web
- `AUTH_DATABASE_URL` — role skema autentikasi untuk layanan autentikasi
- `AUTH_MODE` — `none` untuk pemakaian lokal, `cognito` untuk lingkungan yang mengirim kode verifikasi sekali pakai lewat email
- `AUTH_DOMAIN`, `COOKIE_DOMAIN`, dan `ALLOWED_REDIRECT_URIS` — perutean autentikasi dan cookie

Jika `AUTH_MODE=cognito`, Anda juga memerlukan pengaturan Cognito dan `SESSION_ENCRYPTION_KEY` dari `.env.example`.

## Memperbarui Aplikasi

```bash
git pull
make up
```

Docker Compose membangun ulang layanan dan menjalankan kembali migrasi melalui kontainer `migrate`.

## Deployment di AWS

Stack CDK produksi menggunakan ECS Fargate, RDS, ALB, Cognito, API Gateway, dan Lambda. Aplikasi memakai domain publik berikut.

- `app.<domain>` — aplikasi web di ECS Fargate di belakang ALB
- `auth.<domain>` — layanan OTP dan OAuth di belakang ALB
- `api.<domain>/v1/*` — REST API SQL untuk klien mesin melalui API Gateway dan Lambda
- `mcp.<domain>/mcp` — layanan MCP terkelola melalui HTTP API khusus di API Gateway dan MCP Lambda

Domain kustom MCP memerlukan sertifikat ACM publik yang secara spesifik mencakup nama `mcp.<domain>`. Pertahankan CNAME validasi DNS agar sertifikat dapat diperpanjang. Sertakan ARN sertifikat dalam deployment CDK dan CI, lalu tambahkan record DNS `mcp.*` bersama domain publik lainnya.

Lihat [ringkasan deployment](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) dan [panduan AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) di repositori untuk langkah dan skrip penyiapan yang didukung.

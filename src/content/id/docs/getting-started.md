---
title: Memulai
description: Daftar untuk versi cloud atau siapkan instalasi sendiri dalam hitungan menit.
---

## Versi Cloud

Versi cloud terkelola adalah cara tercepat untuk mulai menggunakan aplikasi.

1. Buka [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Daftar dengan alamat email dan kode verifikasi sekali pakai (OTP), tanpa kata sandi
3. Mulai catat pengeluaran di aplikasi web
4. Jika klien Anda mendukung MCP, tambahkan `https://mcp.expense-budget-tracker.com/mcp` dan beri izin akses di browser
5. Untuk agen terminal atau klien HTTP langsung, mulai dari `GET https://api.expense-budget-tracker.com/v1/`

Anda dapat langsung mulai tanpa menginstal aplikasi atau menyiapkan server. Keamanan tingkat baris di Postgres mengisolasi data di setiap ruang kerja.

## Akses untuk agen dan program

Gunakan akun yang sama untuk mengakses ketiga layanan berikut.

- aplikasi web di `https://app.expense-budget-tracker.com`
- [konektor MCP](/id/docs/mcp-connector/) terkelola di `https://mcp.expense-budget-tracker.com/mcp`, dengan otorisasi OAuth melalui browser
- [penyiapan API Agen](/id/docs/agent-setup/) yang dimulai dari `GET https://api.expense-budget-tracker.com/v1/`, dilanjutkan dengan permintaan HTTP langsung menggunakan `Authorization: ApiKey <key>`

## Hosting Mandiri

Jika ingin menjalankan aplikasi di server sendiri, lihat [Panduan Hosting Mandiri](/id/docs/self-hosting/).

## Mode Demo

Aplikasi ini menyediakan mode demo bawaan. Beralih dari **Semua** ke **Demo** di bagian atas aplikasi untuk mencoba antarmuka dengan data contoh tanpa menyiapkan basis data.

---
title: Konektor MCP
description: Hubungkan klien MCP ke Expense Budget Tracker dengan OAuth untuk membaca atau memperbarui data keuangan dengan aman.
---

## Ringkasan

Expense Budget Tracker menyediakan konektor Model Context Protocol (MCP) terkelola di alamat berikut.

`https://mcp.expense-budget-tracker.com/mcp`

Endpoint ini menggunakan Streamable HTTP dan OAuth. Berikan URL ini kepada klien MCP yang mendukung server Streamable HTTP jarak jauh dan dapat menemukan metadata OAuth. Alur otorisasi membuka browser agar Anda dapat masuk dan menyetujui akses.

Konektor menggunakan token akses dan token penyegaran OAuth sebagai kredensial MCP. [Referensi API Agen](/id/docs/api/) menjelaskan `ApiKey` jangka panjang untuk integrasi HTTP langsung. Endpoint MCP tidak menerima kunci API.

## Koneksi dan penemuan metadata OAuth

Konektor terkelola memublikasikan metadata sumber daya yang dilindungi di alamat berikut.

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Metadata itu mengarahkan klien ke server otorisasi. Metadata server otorisasi tersedia di alamat berikut.

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Klien yang kompatibel mengikuti alur berikut.

1. Hubungkan ke `https://mcp.expense-budget-tracker.com/mcp` dan temukan metadata sumber daya yang dilindungi.
2. Daftar secara dinamis sebagai klien OAuth publik tanpa menggunakan client secret.
3. Mulai alur kode otorisasi (Authorization Code) dan buka URL otorisasi di browser pengguna.
4. Gunakan PKCE untuk setiap permintaan otorisasi. Satu-satunya metode code challenge PKCE yang didukung adalah `S256`.
5. Minta `expenses:read`. Tambahkan `expenses:write` hanya jika klien perlu memanggil `sql_execute`.
6. Tukarkan kode otorisasi dengan token akses dan token penyegaran, lalu biarkan klien memperbarui akses saat diperlukan.

Jangan salin token ke prompt, riwayat obrolan, file sumber, atau log. Simpan token hanya di penyimpanan kredensial klien MCP.

## Cakupan akses

- `expenses:read` wajib. Cakupan ini mengizinkan klien menemukan ruang kerja, memeriksa skema, dan menjalankan kueri baca saja.
- `expenses:write` opsional. Cakupan terpisah ini mengizinkan penggunaan alat `sql_execute`, yang dapat menambah, mengubah, atau menghapus data.

Minta hanya cakupan akses yang diperlukan untuk tugas tersebut. Klien yang hanya menganalisis data atau membuat laporan cukup meminta `expenses:read` tanpa `expenses:write`.

## Alat

### `list_workspaces`

Menampilkan daftar ruang kerja yang tersedia untuk pengguna yang telah masuk. Gunakan pengenal ruang kerja yang dikembalikan agar ruang kerja tujuan jelas sebelum Anda membaca atau mengubah data.

### `get_schema`

Mengembalikan relasi dan kolom yang tersedia melalui MCP untuk ruang kerja yang dipilih. Panggil alat ini sebelum menulis SQL agar Anda menggunakan nama tabel dan kolom yang benar.

### `sql_query`

Menjalankan satu kueri SQL terbatas yang hanya membaca data di ruang kerja yang dipilih. Basis data juga memastikan kueri ini hanya dapat membaca data. Hasilnya maksimal 100 baris dan waktu eksekusinya maksimal 20 detik.

### `sql_execute`

Menjalankan SQL terbatas yang mengubah data di ruang kerja yang dipilih. Alat ini dapat menambah, mengubah, atau menghapus data dan memerlukan cakupan terpisah `expenses:write`. Pastikan ruang kerjanya benar dan tinjau pernyataan SQL yang akan dijalankan sebelum menyetujui panggilan.

Pembatasan baca saja di tingkat basis data berlaku khusus untuk `sql_query`. Server MCP juga menyediakan `sql_execute` untuk operasi tulis.

## Penggunaan yang Aman

1. Panggil `list_workspaces` dan konfirmasikan ruang kerja tujuan dengan pengguna.
2. Panggil `get_schema` sebelum membuat SQL.
3. Gunakan `sql_query` untuk memeriksa data, menghitung total, mencocokkan saldo dengan catatan sumber, dan membuat laporan.
4. Minta `expenses:write` hanya untuk tugas yang perlu mengubah data.
5. Sebelum memanggil `sql_execute`, tampilkan pernyataan SQL yang akan dijalankan beserta dampak yang diperkirakan, lalu konfirmasikan kembali ruang kerja.
6. Setelah operasi tulis, gunakan `sql_query` untuk memverifikasi hasilnya.

Server membatasi operasi SQL dan relasi yang tersedia. Tetap tinjau SQL yang dihasilkan dengan cermat meski batasan tersebut berlaku.

## Batas

- Maksimal 100 baris dalam hasil SQL
- Batas waktu eksekusi 20 detik
- Akses terbatas pada ruang kerja yang tersedia bagi pengguna yang telah masuk
- `sql_query` hanya menerima SQL terbatas. Basis data memberlakukan akses baca saja.
- `sql_execute` memerlukan `expenses:write` selain cakupan baca yang wajib

## Privasi dan hosting mandiri

Klien MCP yang diberi otorisasi dapat membaca data keuangan. Dengan `expenses:write`, klien juga dapat mengubahnya. Tinjau [Kebijakan Privasi](/id/privacy/) serta kebijakan klien tentang pengelolaan data sebelum menghubungkannya.

URL di atas hanya berlaku untuk layanan terkelola Expense Budget Tracker. Jika Anda mengelola instalasi sendiri, baca [Panduan Hosting Mandiri](/id/docs/self-hosting/) dan konfigurasikan endpoint MCP dan metadata OAuth untuk domain Anda. Implementasinya tersedia di [repositori kode sumber](https://github.com/kirill-markin/expense-budget-tracker).

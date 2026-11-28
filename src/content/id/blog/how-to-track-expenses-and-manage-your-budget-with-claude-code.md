---
title: "Cara Mencatat Pengeluaran dengan Claude Code dan Merekonsiliasi Saldo"
description: "Hubungkan Claude Code ke Expense Budget Tracker dengan satu tautan. Tinjau dan setujui impor rekening koran, cocokkan saldo, lalu perbarui anggaran tanpa menghubungkan rekening bank."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "pencatat pengeluaran Claude Code"
  - "pencatat pengeluaran Claude"
  - "aplikasi pencatat pengeluaran untuk Claude"
  - "pencatat anggaran Claude Code"
  - "hubungkan Claude ke pencatat pengeluaran"
  - "impor rekening koran dengan Claude Code"
---

Empat transaksi bisa menghasilkan selisih saldo `€0.00` saat dicocokkan dengan rekening koran, meski anggaran Anda masih keliru. Jika belanja supermarket senilai €54.20 masuk kategori Perjalanan, saldo rekening tetap cocok, tetapi laporan belanja bahan makanan meleset €54.20.

Pencatatan pengeluaran dengan Claude Code perlu dua pemeriksaan. Mutasi yang tercatat harus menjelaskan saldo akhir di bank. Kategori yang dipakai juga harus sesuai dengan hasil tinjauan rekening koran. Claude Code bisa membaca dan mengolah file, menghitung, serta memanggil API. Anda memilih rekening dan kategori, memeriksa usulan pencatatan, lalu menyetujui perubahan yang akan dijalankan.

Expense Budget Tracker tidak menyimpan koneksi langsung ke bank atau menyediakan fitur unggah rekening koran untuk alur ini. Ekspor sendiri rekening korannya, simpan di lokasi yang boleh dibaca Claude Code, lalu kirim hanya catatan yang Anda setujui melalui API Agen terkelola. Jika Anda ingin menghindari akses bank yang terus aktif, baca [aplikasi anggaran tanpa menghubungkan rekening bank (bahasa Inggris)](/blog/budget-app-without-bank-linking/) untuk melihat kelebihan dan keterbatasan cara ini.

![Seorang konservator mosaik mengangkat ubin biru yang salah tempat dari jalur terakota, di samping timbangan kuningan yang seimbang](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Hubungkan Claude Code dengan satu tautan penemuan API

Instal Claude Code dan masuk dengan mengikuti [panduan resmi Anthropic (bahasa Inggris)](https://code.claude.com/docs/en/quickstart). [Referensi CLI (bahasa Inggris)](https://code.claude.com/docs/en/cli-reference) menjelaskan cara kerja direktori aktif dan pemberian akses ke file tambahan.

Buka `claude` di direktori yang menyimpan rekening koran, atau berikan akses ke direktori itu dengan cara yang didukung instalasi Anda. Lalu tempel prompt berikut.

```text
Connect to Expense Budget Tracker from this discovery link:
https://app.expense-budget-tracker.com/api/agent

Fetch it with GET, read the returned JSON, and follow the current action URLs. Do not
guess or hardcode the API flow. Ask me for my Expense Budget Tracker email and start
the email OTP flow.
After that request succeeds, tell me to check spam or junk if the message is not
visible, ask me for the 8-digit code, and follow the returned verification action.

After verification, ask me to approve a persistent storage location for the returned
ApiKey outside chat memory and source control. Load my account context, list my
workspaces, ask me to confirm the target workspace, save it as the default for this
key, and inspect the live schema. Run one small read-only query to confirm the selected
workspace. Do not write financial data.
```

[Tautan agen di domain aplikasi](https://app.expense-budget-tracker.com/api/agent) mengembalikan dokumen penemuan API yang berlaku. Saat ini, responsnya memberikan `https://api.expense-budget-tracker.com/v1/` sebagai URL dasar API, lengkap dengan URL tindakan untuk autentikasi dan SQL. Tempel tautan dari domain aplikasi agar Claude Code mengikuti URL yang diberikan layanan tanpa menetapkan urutan internal terlebih dahulu.

Pendaftaran dan proses masuk menggunakan alur email yang sama. Setelah Anda memberikan kode verifikasi 8 digit, Claude Code menerima `ApiKey` yang berlaku untuk jangka panjang. Setujui lokasi penyimpanan tertentu, misalnya file rahasia yang dikecualikan dari kontrol versi. Jangan simpan kunci dalam `CLAUDE.md` atau memasukkannya ke riwayat repositori. [Penyiapan Agen AI](/id/docs/agent-setup/) menjelaskan urutan autentikasi dan pemilihan ruang kerja.

## Cara kerja API Agen dan MCP

Istilah “pencatat pengeluaran Claude” bisa merujuk pada dua integrasi. Di artikel ini, Claude Code berjalan di terminal dan menggunakan API Agen. Claude dan Claude Desktop dapat menggunakan konektor MCP jarak jauh terkelola.

| | Claude Code dengan API Agen | Claude atau Claude Desktop dengan MCP |
|---|---|---|
| Cocok untuk | Pekerjaan di terminal dengan file lokal yang dapat diakses dan HTTP langsung | Percakapan di klien Claude yang mendukung MCP |
| Titik awal | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Autentikasi | Kode verifikasi sekali pakai lewat email, lalu `ApiKey` yang berlaku untuk jangka panjang | OAuth melalui browser |
| Akses data | URL penemuan API yang mengarah ke endpoint kueri dan eksekusi | Alat `sql_query` dan alat opsional `sql_execute` |
| Akses rekening koran | File dan direktori yang dapat diakses sesi Claude Code tersebut | Konektor jarak jauh tidak memberikan akses ke file lokal |

Kredensial kedua integrasi tidak dapat saling dipertukarkan. Untuk Claude versi web atau desktop, ikuti [panduan menghubungkan Claude melalui MCP (bahasa Inggris)](/blog/claude-expense-tracker-mcp-connector/). Gunakan alur API Agen di bawah ini jika tugas dimulai dari file yang bisa diakses Claude Code.

Perhatikan juga dua batasan berikut.

- Pemrosesan oleh penyedia model terpisah dari API dan penyimpanan Expense Budget Tracker. Sebelum membagikan data rekening koran, baca [dokumentasi penggunaan data Claude Code (bahasa Inggris)](https://code.claude.com/docs/en/data-usage) dan ketentuan penyedia yang dikonfigurasi di instalasi Anda.
- Docker Compose lokal dalam [panduan hosting mandiri](/id/docs/self-hosting/) menjalankan aplikasi web, layanan autentikasi, basis data, dan worker yang mengambil data kurs. Penyiapan ini tidak menyediakan API Agen terkelola yang digunakan di sini. Deployment AWS dari repositori merupakan penyiapan terpisah yang mencakup API publik untuk klien mesin.

## Tentukan cakupan impor

Untuk percobaan pertama, gunakan satu rekening, satu mata uang, dan satu periode rekening koran yang sudah berakhir. CSV praktis karena barisnya mudah diperiksa. Untuk format ekspor lain, minta Claude Code memastikan bahwa file dapat dibaca di lingkungan Anda dan menampilkan baris hasil pembacaan. Ekstensi file saja tidak memastikan bahwa formatnya didukung.

Berikan enam informasi berikut kepada Claude Code.

1. Lokasi file rekening koran di komputer.
2. Rekening bank dan rekening yang sesuai di aplikasi.
3. Mata uang rekening.
4. Tanggal pembukuan pertama dan terakhir.
5. Saldo awal atau saldo terakhir yang sudah dipastikan benar.
6. Saldo akhir pada rekening koran.

Tunda pencatatan transaksi yang masih tertunda sampai bank membukukannya. Biarkan file sumber tetap utuh dan minta Claude Code membuat pratinjau terpisah.

Anda bisa menyimpan aturan berikut dalam `CLAUDE.md` lokal di direktori keuangan.

```markdown
# Expense Budget Tracker workflow

- Start from https://app.expense-budget-tracker.com/api/agent and follow discovery.
- Confirm the target workspace and inspect the live schema before writing SQL.
- Use the read action for all inspection and reconciliation.
- Before a write, show the source totals, possible duplicates, exact SQL, and expected rows.
- Wait for my explicit approval of the complete change set.
- Use the write action only for the approved INSERT, UPDATE, or DELETE.
- Verify every write with a fresh read.
- Never invent a balancing entry or silently resolve an uncertain category.
- Keep the ApiKey outside this file and outside source control.
```

Tambahkan informasi yang jarang berubah, seperti nama rekening, aturan kategori, cara mencatat transfer, dan mata uang pelaporan. Gunakan kategori contoh di artikel ini hanya jika sesuai dengan buku besar Anda.

## Impor rekening koran setelah meninjau pratinjau lengkap

Setelah koneksi berfungsi, tempel prompt berikut dan ganti nilai di dalam tanda kurung siku.

```text
Import [local statement path] into [tracker account] for [posted start date] through
[posted end date] in [currency]. The opening balance is [amount] and the bank's closing
balance is [amount].

First confirm the selected workspace and inspect the live schema. Use only the read
action to inspect the target account, existing categories, and ledger rows that overlap
the statement period. Confirm that you can read the local file, parse it, and prepare a
complete preview without writing anything.

For every source row, show its source identifier or row number, posted date, signed
amount, currency, target account, proposed transaction type, proposed category, and
duplicate status. Flag transfers, refunds, reimbursements, fees, foreign-currency rows,
unfamiliar counterparties, and uncertain classifications.

Then show the source row count and signed total, all proposed ledger rows, possible
duplicates, the exact SQL you would send, and the expected affected-row count. Stop
and wait for my explicit approval of the complete change set.
```

Basis data hanya boleh dibaca hingga Anda menyetujui perubahan. Claude Code perlu memeriksa skema yang berlaku, mencari rekening yang sesuai, dan menjalankan kueri atas entri pada rentang tanggal yang sama. Tanggal dan nominal yang sama menandakan kemungkinan duplikat. Dua pembelian berbeda bisa tercatat pada tanggal yang sama dengan nominal yang sama.

### Contoh dengan empat baris transaksi

Misalkan laporan rekening giro menunjukkan saldo awal €1,250.00 dan empat transaksi yang sudah dibukukan.

| Baris | Tanggal pembukuan | Keterangan | Nominal bertanda | Usulan jenis | Usulan kategori | Catatan tinjauan |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Gaji | +€2,000.00 | Pemasukan | Gaji | Jelas |
| 2 | 2026-09-02 | Pasar | −€54.20 | Pengeluaran | Belanja bahan makanan | Periksa nama penjual jika tidak dikenal |
| 3 | 2026-09-03 | Transfer ke tabungan | −€300.00 | Transfer | — | Konfirmasi rekening tujuan |
| 4 | 2026-09-04 | Kafe | −€8.40 | Pengeluaran | Makan di luar | Jelas |

Total keempat nominal, dengan tanda plus atau minus masing-masing, adalah `+€1,637.40`. Tambahkan ke saldo awal `€1,250.00` untuk mendapatkan saldo akhir yang diharapkan, yaitu `€2,887.40`. Contoh ini muat dalam satu layar. Untuk impor yang lebih panjang, tetap tampilkan setiap baris sumber dalam pratinjau dan tandai semua hal yang belum pasti.

Pastikan rekening tujuan transfer sudah benar. Perpindahan uang antarrekening Anda sendiri dicatat sebagai transfer. Pertahankan jenis transaksi yang sebenarnya untuk pengembalian dana dan penggantian biaya. Jika klasifikasi belum pasti, tandai untuk diputuskan kemudian dan hindari menebak kategori.

### Setujui satu rangkaian perubahan yang sudah ditinjau

Periksa ruang kerja, rekening, rentang tanggal, jumlah baris, total nominal bertanda, kemungkinan duplikat, dan klasifikasi. Setujui pratinjau dan pernyataan SQL yang spesifik agar persetujuan hanya berlaku untuk perubahan yang Anda tinjau.

API Agen memisahkan operasi baca dan tulis. Claude Code memakai tindakan baca dari respons penemuan API untuk satu pernyataan `SELECT` atau `WITH ... SELECT`. Tindakan tulis hanya digunakan untuk `INSERT`, `UPDATE`, atau `DELETE` yang disetujui secara eksplisit. Gunakan skema yang berlaku sebagai acuan tabel dan kolom. [Referensi API](/id/docs/api/) menjelaskan kontrak dan batasan SQL.

### Uji insert dan update besar sebelum memprosesnya per kelompok

Sebelum `INSERT` atau `UPDATE` berskala besar, petunjuk dari API mengarahkan agen untuk menjalankan uji coba kecil dengan bentuk pernyataan SQL yang sama. Gunakan 1–3 baris dengan nilai literal untuk `INSERT`, atau satu baris target untuk `UPDATE`. Persetujuan Anda mencakup uji coba dan sisa baris dalam rangkaian perubahan yang telah ditinjau.

Jika uji berhasil, Claude Code langsung melanjutkan pemrosesan secara berurutan dalam kelompok maksimal 100 entri, sambil memverifikasi setiap kelompok. Dari 247 baris yang disetujui, uji 3 baris menyisakan kelompok berisi 100, 100, dan 44 baris. Minta persetujuan baru jika cakupan berubah, muncul hal yang belum jelas, atau eksekusi gagal. Kelompok berikutnya yang masih termasuk dalam persetujuan sebelumnya dapat langsung diproses.

SQL terbatas tidak mendukung `ON CONFLICT`, jadi penanganan duplikat harus ditentukan secara eksplisit. Hasil pembacaan dibatasi hingga 100 baris. Claude Code perlu memeriksa metadata jumlah baris dan penanda bahwa hasil dipotong, menghitung total dengan SQL, lalu membagi verifikasi terperinci menjadi kueri kecil dengan urutan yang jelas. Jika respons terpotong, pemeriksaan impor belum lengkap.

### Baca kembali baris yang tersimpan

Respons API yang berhasil menunjukkan bahwa permintaan sudah dijalankan. Untuk memastikan setiap nilai yang tersimpan cocok dengan pratinjau, jalankan kueri lagi pada rekening dan periode yang terdampak, lalu bandingkan hal berikut.

- jumlah baris yang ditambahkan
- tanggal, nominal bertanda, dan mata uang
- rekening yang digunakan
- jenis dan kategori transaksi
- kemungkinan duplikat
- total setiap kelompok dan total seluruh rekening koran

Jika ada perbedaan, kembali ke pemeriksaan hanya baca. Tinjau satu koreksi spesifik sebelum melakukan perubahan lain. [Panduan impor rekening koran (bahasa Inggris)](/blog/how-to-import-bank-statements-into-an-expense-tracker/) membahas periode yang tumpang tindih, pengembalian dana, dan transfer secara lebih terperinci.

## Rekonsiliasi saldo dan periksa kategori secara terpisah

Rekonsiliasi saldo memeriksa apakah mutasi yang tercatat menghasilkan saldo akhir yang sama dengan catatan bank pada rentang tanggal pembukuan yang sama.

Untuk rekening simpanan biasa, gunakan rumus ini.

**saldo akhir yang diharapkan = saldo awal + dana masuk yang sudah dibukukan − dana keluar yang sudah dibukukan**

Jika setiap nominal sudah memiliki tanda positif atau negatif, gunakan rumus berikut.

**saldo akhir yang diharapkan = saldo awal + jumlah seluruh pergerakan dana bertanda yang sudah dibukukan**

Rekening yang mencatat utang, seperti kartu kredit, mungkin menggunakan aturan tanda yang berbeda. Claude Code perlu menjelaskan aturan tanda yang dipakai sebelum membandingkan saldo.

Lanjutkan dengan prompt ini.

```text
Use the read action only. Reconcile [account] for [posted start date] through [posted
end date] against the bank closing balance of [amount and currency]. State the opening
boundary, the sign convention, the stored row count, and the signed movement total.

Show expected closing balance, bank closing balance, and the exact difference. If the
difference is not zero, list candidate missing, duplicated, excluded, wrong-date, or
mis-signed rows. Do not insert a balancing entry and do not change any data.

After the balance check, review category totals separately. List uncategorized rows,
transfer rows counted as spending, and categories that differ from the approved preview.
```

Pada contoh empat baris tadi, `€1,250.00 + €1,637.40 = €2,887.40`. Jika saldo akhir di bank juga €2,887.40, selisih saldo adalah `€0.00`.

Selisih nol mengonfirmasi perhitungan saldo untuk rentang yang dipilih. Kategori perlu diperiksa tersendiri. Mengubah kategori transaksi Pasar sebesar €54.20 dari Belanja bahan makanan ke Perjalanan menggeser €54.20 dari satu kategori ke kategori lain. Selisih saldo tetap nol.

Jika selisihnya bukan nol, periksa saldo awal, baris yang hilang atau terduplikasi, transfer, transaksi tertunda, tanda nominal, tanggal, dan mata uang. Jangan buat transaksi penyeimbang fiktif agar selisih terlihat hilang. [Panduan rekonsiliasi (bahasa Inggris)](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) membahas langkah pemeriksaannya lebih lanjut.

## Perbarui anggaran setelah rekonsiliasi

Lanjutkan ke anggaran hanya setelah baris yang dibaca kembali sesuai, saldo rekening cocok dengan catatan bank, dan total kategori masuk akal. Claude Code dapat membandingkan realisasi pemasukan dan pengeluaran dengan rencana di `budget_lines` dan menyiapkan usulan perubahan anggaran. Satu bulan yang tidak biasa belum tentu menjadi dasar anggaran berikutnya.

```text
Confirm the workspace and inspect the current schema. Use the read action to compare
actual income and spending for [complete period] with the matching budget lines. Exclude
transfers using the stored transaction type and show uncategorized activity separately.

For each proposed budget change, show the category, current amount, actual amount,
proposed amount, difference, and reason. Then show the exact SQL and expected affected
rows. Do not write until I approve specific lines.

After approval, use the write action only for those lines and verify them with a fresh
read. Report any stored value that differs from the approved proposal.
```

Pengeluaran besar mungkin hanya terjadi sekali. Pengeluaran yang tampak melebihi anggaran bisa berasal dari transfer atau pengembalian dana yang salah kategori. Claude Code dapat menghitung selisih dan menyiapkan SQL. Anda tetap menentukan nominal anggaran bulan depan.

## Gunakan urutan yang sama untuk setiap rekening koran

Ikuti urutan ini setiap kali memproses rekening koran.

1. Mulai dari `https://app.expense-budget-tracker.com/api/agent` dan ikuti respons penemuan API.
2. Muat konteks akun, konfirmasi ruang kerja, dan periksa skema yang berlaku.
3. Berikan satu file rekening koran yang dapat diakses Claude Code serta saldo awal dan akhir yang jelas.
4. Baca data buku besar pada periode yang sama dan siapkan pratinjau impor lengkap.
5. Setujui satu rangkaian perubahan yang sudah ditinjau.
6. Untuk penyisipan data dalam jumlah besar, uji 1–3 baris, lalu lanjutkan secara berurutan dalam kelompok maksimal 100 baris.
7. Baca kembali setiap kelompok yang tersimpan dan bandingkan dengan pratinjau.
8. Cocokkan saldo rekening dengan saldo akhir di bank tanpa membuat entri penyeimbang.
9. Tinjau total kategori meski selisih saldo nol.
10. Siapkan, setujui, dan verifikasi perubahan pos anggaran secara terpisah.

Mulai dengan satu rekening dan satu periode yang sudah berakhir. Setelah buku besar cocok dengan rekening koran dan anggaran selesai ditinjau, ulangi alur ini untuk rekening berikutnya. Claude Code menangani pekerjaan berulang pada file dan API, sementara Anda dapat melihat setiap keputusan keuangan sebelum catatan berubah.

# Portofolio Lorensio Dearil Aldo

Website statis berbahasa Indonesia, tanpa framework, build, backend, tracking, atau dependency runtime. File utama adalah `index.html`, `styles.css`, `theme.js`, `navigation.js`, dan `app.js`.

## Jalankan lokal

Dari folder proyek, jalankan:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Buka http://127.0.0.1:4173. Hentikan server dengan Ctrl+C. Membuka HTML langsung juga memungkinkan, tetapi clipboard mengikuti kebijakan keamanan browser; gunakan server lokal untuk pengujian.

## Memperbarui konten

- `index.html`: profil, kontak, pendidikan, keahlian, proyek, dan metadata sosial. Konten dasar tetap terbaca tanpa JavaScript.
- `app.js`: ringkasan pada `summaries`, lingkup pada `scopes`, filter, dialog proyek/lightbox, tema, kontak, reveal, spotlight, dan tilt.
- `navigation.js`: navigasi anchor, menu, pengukuran header, history, dan scrollspy. Item aktif adalah section terakhir yang melintasi garis 24 px di bawah header. Di dasar halaman, Kontak aktif. Klik menahan indikator pada tujuan hingga tercapai; wheel, sentuhan, atau keyboard melepasnya. Event `scrollend` lama diabaikan bila tujuan baru belum tercapai. Tidak memakai timeout durasi smooth scroll.
- `theme.js`: pemilihan tema sebelum stylesheet dimuat.
- `styles.css`: token warna, layout, responsivitas, motion, dan cetak. Font sistem Segoe UI/Arial dipadukan dengan Consolas/Courier New, tanpa permintaan font eksternal.
- `assets/setting-ont.webp`: salinan foto kegiatan yang diperkecil dan dikompresi, 1200 × 1600. Kedua JPG asli tetap disimpan.
- `assets/portrait-480.webp`, `assets/portrait-960.webp`: dua ukuran foto profil yang sama; digunakan melalui srcset. `assets/favicon.svg` adalah inisial L.

Untuk mengganti foto profil, perbarui kedua WebP tersebut dari foto baru (lebar 480 dan 960 px, proporsi asli tetap). Mengganti JPG saja tidak mengubah foto di halaman. Di elemen `.portrait img` dalam `index.html`, sesuaikan `width`/`height` dengan proporsi foto sumber dan naikkan versi `?v=2` pada `src` serta kedua entri `srcset` agar cache browser diperbarui. Jika nama JPG berubah, sesuaikan juga `og:image` dan `twitter:image`.

Untuk menambah proyek, tambahkan `article.project` dengan kategori dan ID unik, lalu masukkan ringkasan pada `summaries` dan lingkup pada `scopes`. Sesuaikan filter jika kategorinya baru. Tautan kompetensi menggunakan `data-project-filter` dengan kategori yang sama. Visual kartu adalah ilustrasi konsep, bukan dokumentasi konfigurasi asli. Tautan demo/repositori baru ditambahkan ketika URL dan berkasnya benar-benar tersedia.

## GitHub Pages

Workspace pengembangan ini bukan checkout Git. Salinan pembanding repositori berada di `.review/upstream`, commit yang diaudit `4dd78f5`. Jangan mengganti pekerjaan terbaru Anda dengan seluruh folder pembanding tersebut.

1. Pada checkout repositori `Zedost/lorensio.portofolio` milik Anda, buat branch kerja. Salin `index.html`, `styles.css`, `theme.js`, `navigation.js`, `app.js`, `.nojekyll`, `.gitignore`, `README.md`, dan folder `assets` yang diperbarui. Tinjau diff sebelum commit. Jangan salin `.review` atau arsip ZIP hasil tinjauan.
2. Setelah review, gabungkan perubahan ke branch yang akan dipublikasikan. Langkah commit, push, merge, dan publikasi dilakukan oleh Anda; tidak dilakukan dalam pekerjaan ini.
3. Di GitHub, buka **Settings → Pages → Build and deployment → Source → Deploy from a branch**. Pilih branch publikasi dan folder **/(root)**, lalu **Save**.
4. Pantau workflow Pages di tab Actions. Alamat yang diharapkan: https://zedost.github.io/lorensio.portofolio/.
5. Untuk pembaruan berikutnya, ubah file, uji lokal, tinjau diff, lalu push ke branch publikasi setelah disetujui. Jika URL berubah, perbarui canonical, Open Graph, dan Twitter di HTML.

Semua path CSS, JS, dan gambar lokal relatif, sehingga mendukung subfolder repositori. `.nojekyll` menghindari pemrosesan Jekyll. Panduan sumber publikasi: [dokumentasi resmi GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Pengujian

Dependency berikut hanya untuk pengembangan; tidak perlu dipasang untuk menjalankan atau menerbitkan website:

```powershell
npm install --prefix .review/tools --no-audit --no-fund playwright @axe-core/playwright lighthouse
python -m http.server 4173 --bind 127.0.0.1
```

Pengujian subfolder mengasumsikan proyek berada di `C:/Private/Github`. Di terminal lain, jalankan `python -m http.server 4174 --bind 127.0.0.1 --directory C:/Private`. Sesuaikan URL subfolder dalam skrip jika lokasi proyek berbeda.

```powershell
node tests/browser.cjs
node tests/refinement.cjs --core
node tests/visual.cjs
node tests/zoom.cjs after
node tests/capture.cjs
# Jalankan setelah semua browser uji lain selesai:
node tests/performance.mjs after
```

Skrip memakai Microsoft Edge yang terpasang di Windows; sesuaikan channel/path browser untuk OS lain. Folder `review/before` dan `review/after` harus tersedia untuk hasil. Pengujian zoom memakai API pengaturan native Edge dalam profil uji sementara di `.review`, bukan CSS zoom atau profil pribadi pengguna. WhatsApp diblokir oleh routing pengujian dan pembukaan popup disimulasikan. Tidak ada pesan yang dikirim. Hasil dan batas pengujian dijelaskan dalam `review/REPORT.md`. Buka `review/navigation-proof.html` untuk urutan screenshot navigasi sebelum/sesudah.

Source iterasi sebelum perbaikan disimpan di `.review/iteration-1`; skrip diagnosis dan zoom baseline menggunakan salinan ini bila diperlukan. Untuk audit performa baseline yang dapat dibandingkan, sajikan salinan tersebut pada port yang sama sebelum menjalankan `tests/performance.mjs before`; jalankan tiga audit berurutan tanpa pengujian browser lain. Jangan menimpa source utama demi menjalankan baseline.

## Informasi yang perlu dilengkapi

- Status pendidikan terkini dan tanggal kelulusan SMK. Tampilan hanya menyebut tahun mulai 2023, tanpa mengasumsikan status kelulusan.
- Tanggal mulai/akhir PKL. Durasi enam bulan dipertahankan dari sumber, tanpa menebak tanggal.
- Berkas Packet Tracer, konfigurasi server/MikroTik, screenshot, langkah reproduksi, dan hasil uji proyek. Ketiga proyek sudah ada dalam sumber; bukti teknis belum dilampirkan.
- Repositori atau demo pengembangan web jika ingin menambahkan proyek kategori Web.
- Konfirmasi tahun dan data MTCNA. Tautan asli dipertahankan, tetapi isi sertifikat belum diverifikasi. Nomor sertifikat placeholder dihapus.

Foto profil asli dari sumber tetap digunakan. Tidak ada identitas, pengalaman kerja, sertifikasi baru, atau metrik keberhasilan yang dibuat.

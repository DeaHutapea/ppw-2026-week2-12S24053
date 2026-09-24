# ppw-2026-week2-12S24053 — branch `week3-bootstrap`

Refactoring **Tugas Minggu 2** menjadi berstandar **Bootstrap 5.3** — mata kuliah
**Pemrograman dan Pengujian Aplikasi Web (12S3101)**, Institut Teknologi Del.

**Nama:** Dea Hutapea
**NIM:** 12S24053
**Dosen:** Chandro Pardede, S.Kom., M.Sc.

## Ringkasan pembaruan

Halaman portofolio Minggu 2 (HTML5 semantik + CSS murni) direfaktor memakai
Bootstrap 5.3 untuk navbar responsif, sistem grid 12-kolom, kartu proyek dengan
modal detail, dan formulir floating labels — tetap mempertahankan struktur
semantik dan aksesibilitas dari versi sebelumnya.

## Demo live

- **Minggu 2 (main):** https://deahutapea.github.io/ppw-2026-week2-12S24053/
- **Minggu 3 (week3-bootstrap):** https://deahutapea.github.io/ppw-2026-week2-12S24053/ *(branch aktif setelah Pages diarahkan ke `week3-bootstrap`)*

## Sebelum vs Sesudah Integrasi Framework

| Aspek | Minggu 2 (Vanilla CSS) | Minggu 3 (Bootstrap 5) |
|---|---|---|
| Navigasi | `<nav>` custom, tanpa menu mobile | Navbar Bootstrap `sticky-top` dengan tombol hamburger collapse |
| Tata letak | CSS Grid & Flexbox custom | Sistem grid 12-kolom Bootstrap (`row`, `col-lg-*`) |
| Kartu proyek | Baris tabel data statis | Grid 4 kartu (`row-cols-1 row-cols-md-2 row-cols-lg-2`) dengan modal detail |
| Formulir | `form-control` custom polos | Floating labels, input group berikon, umpan balik validasi visual |
| Warna & tema | Variabel CSS di `:root` | Variabel CSS di `:root` **+** override `--bs-primary` Bootstrap |
| Ukuran kode CSS | 1 file custom penuh (± 400 baris) | `custom-style.css` lebih ringkas, sebagian besar gaya diwariskan dari Bootstrap |
| Ikon | Tidak ada | Bootstrap Icons |
| Validasi form | Native HTML5 saja | Native HTML5 + kelas `.is-invalid` / `.invalid-feedback` Bootstrap |

## Struktur berkas (branch `week3-bootstrap`)

```
ppw-2026-week2-12S24053/
├── index.html            # struktur semantik + komponen Bootstrap
├── custom-style.css      # override & tema custom (dimuat setelah Bootstrap)
├── screenshot-week3.png  # tangkapan layar versi Bootstrap
├── lab3_bootstrap/        # tiga lab terbimbing Minggu 3
│   ├── lab1_specificity.html / .css
│   ├── lab2_navbar_hero.html / .css
│   └── lab3_cards_modal_form.html / .css
└── README.md
```

## Pemenuhan spesifikasi teknis Minggu 3

| No | Kriteria | Implementasi |
|----|----------|--------------|
| 1 | Fondasi framework & semantik | Bootstrap 5.3 CDN + Bootstrap Icons; header/nav/main/section/footer tetap utuh; `custom-style.css` dimuat setelah Bootstrap |
| 2 | Responsive navbar & hero | Navbar `sticky-top` + brand; hamburger toggle; hero dua kolom dengan CTA |
| 3 | Grid portofolio & modal | 4 kartu proyek (`row-cols-1 row-cols-md-2 row-cols-lg-2 g-4`), tiap kartu terhubung ke modal detail berbeda |
| 4 | Modernisasi formulir | Floating labels (nama, email, pesan), input group berikon (telepon), select topik, checkbox persetujuan, `.invalid-feedback` |
| 5 | Custom overrides & theming | 9 variabel CSS di `:root`, override `--bs-primary` tanpa `!important`, transisi hover pada kartu dan tombol |
| 6 | Git & deployment | Branch `week3-bootstrap`, commit terstruktur, README dengan tabel komparasi, live di GitHub Pages |

## Teknologi

HTML5 · Bootstrap 5.3 (CSS + JS Bundle) · Bootstrap Icons · CSS Custom Properties · Git · GitHub Pages
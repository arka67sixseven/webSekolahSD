# Website SD Taman Muda Jetis

Website sekolah lengkap: profil, ekstrakurikuler, berita, galeri kegiatan, kontak, dan
informasi PPDB. Konten berita dan galeri ditarik otomatis dari feed Instagram sekolah.

Data ditarik dari API scraper Instagram di
[`scrap-ig-apify-u55q.vercel.app`](https://scrap-ig-apify-u55q.vercel.app/api/instagram/),
lalu dinormalisasi menjadi dua bentuk: **kartu galeri** (filter, pencarian, lightbox) dan
**artikel berita** (slug, judul, paragraf isi, kategori).

> **Catatan:** isi galeri saat ini masih data contoh dari akun Instagram
> `@smptamandewasajetisjogja` (SMP Taman Dewasa Jetis Yogyakarta). Ganti dengan feed
> sekolah yang sebenarnya saat sudah tersedia — tidak ada perubahan kode yang diperlukan,
> hanya ubah `INSTAGRAM_API_URL` di `lib/instagram.ts`.

## Teknologi

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 3](https://tailwindcss.com)
- Plus Jakarta Sans (`next/font`)
- Vercel untuk hosting

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka <http://localhost:3000>.

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run start` | Menjalankan hasil build |
| `npm run typecheck` | Cek tipe TypeScript |
| `npm run lint` | Lint |

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Hero, statistik sekolah, sambutan kepala sekolah, berita terbaru, prestasi, galeri |
| `/profil` | Visi, misi, sejarah, data sekolah, fasilitas |
| `/ekstrakurikuler` | Daftar kegiatan (kategori + jadwal) |
| `/berita` | Daftar berita + filter kategori |
| `/berita/[slug]` | Detail artikel: media, paragraf, hashtag, tautan, berita lainnya |
| `/kontak` | Alamat, telepon, email, Instagram, peta Google, jam layanan |
| `/ppdb` | Alur, jadwal, syarat, dan formulir pendaftaran |
| `/instagram` | Galeri penuh: filter media/kategori, pencarian, lightbox |

## Struktur

```
app/
  layout.tsx              # Root layout, font, header & footer
  page.tsx                # Beranda
  globals.css             # Token komponen (.btn-primary, .eyebrow, dll.)
  sitemap.ts              # Peta situs (otomatis ikut memuat semua berita)
  robots.ts
  profil/page.tsx
  ekstrakurikuler/page.tsx
  berita/
    page.tsx              # Daftar berita + filter kategori
    [slug]/page.tsx       # Detail artikel + JSON-LD schema.org
  kontak/page.tsx
  ppdb/
    page.tsx
    ppdb-form.tsx         # Formulir (client component, validasi)
  instagram/
    page.tsx              # Halaman galeri (server component)
    gallery-client.tsx    # Filter, pencarian, lightbox (client component)
    caption.tsx           # Render caption (markdown + tautan)
    safe-image.tsx        # <img> dengan fallback
components/
  site-header.tsx         # Header sticky + menu mobile
  site-footer.tsx         # Footer
  page-hero.tsx           # Pita judul untuk halaman dalam
  post-card.tsx           # Kartu galeri (server-safe)
  berita-card.tsx         # Kartu artikel berita
  section-heading.tsx     # Judul section
  copy-link-button.tsx    # "Salin tautan" di detail berita
  icons.tsx               # Ikon garis 24x24 yang dipakai lintas halaman
  school-logo.tsx         # Monogram logo (SVG, tanpa aset gambar)
lib/
  school.ts               # ⚠ SEMUA KONTEN STATIS DI SINI
  instagram.ts            # Fetch API + normalisasi data
  berita.ts               # Bentuk artikel: slug, paragraf, kategori
  format.ts               # Parser caption, tanggal, angka
  present.ts              # Judul/kategori otomatis + view model
```

## Mengganti konten sekolah

Seluruh teks profil, visi & misi, sejarah, fasilitas, ekstrakurikuler, PPDB, dan kontak
berada di **`lib/school.ts`**. Edit nilai di sana — tidak perlu menyentuh komponen.

Isi file tersebut saat ini **teks contoh** untuk SD Taman Muda Jetis. Yang perlu diganti
dengan data asli sekolah:

| Konstanta | Isi |
| --- | --- |
| `SITE_URL` | Domain asli situs (dipakai untuk sitemap, robots, dan JSON-LD) |
| `SCHOOL` | Nama, alamat, telepon, email, Instagram, NPSN |
| `SCHOOL_HOURS` | Jam layanan |
| `HEAD_MASTER` | Nama dan sambutan kepala sekolah |
| `VISION`, `MISSIONS`, `HISTORY` | Profil sekolah |
| `FACILITIES` | Fasilitas (+ `icon`: `computer`, `book`, `flask`, `ball`, `music`, `mosque`) |
| `EXTRACURRICULAR` | Daftar kegiatan + jadwal |
| `PPDB*` | Periode, kuota, alur, syarat, jadwal |
| `HOME_STATS` | Angka statistik di beranda |

> Foto kepala sekolah dibaca dari `HEAD_MASTER.photo`. Bila file gambar belum ada, halaman
> otomatis menampilkan kotak cadangan — tidak perlu ubah kode.

## Formulir PPDB

`app/ppdb/ppdb-form.tsx` masih **demo**: data divalidasi lalu ditampilkan pesan sukses,
tapi **tidak dikirim ke mana pun**. Untuk menyimpan data sungguhan, ubah `handleSubmit`
di file tersebut agar memanggil route API (`app/api/...`), layanan email, atau tautan
WhatsApp.

## Yang dihitung otomatis

Caption Instagram tidak punya judul, kategori, maupun paragraf, jadi semuanya diturunkan
otomatis:

- **Judul** — setiap baris caption diberi skor (ada angka/tahun, bukan baris berlabel
  seperti `Hari/Tanggal:`, bukan kalimat ajakan), lalu baris terbaik dipilih.
- **Kategori** — dideteksi dari kata kunci: `Prestasi`, `Pengumuman`, `Lomba`,
  `Akademik`, `Kegiatan`, `Berita`.
- **Juara 1/2/3** — diambil dari teks seperti "membawa trophy Juara 2 ...".
- **Slug URL** — judul dinormalisasi menjadi slug unik untuk tautan `/berita/<slug>`.
- **Paragraf artikel** — baris caption dibersihkan dari URL, hashtag, dan emoji.

Untuk mengunci atau menambah kategori, ubah `CATEGORY_RULES` di `lib/present.ts`.

## Caching

Halaman di-cache 1 jam (`revalidate = 3600`) karena URL media dari CDN Instagram punya
masa berlaku. Kalau data tidak muncul dalam 1 jam, tunggu siklus berikutnya.

## Deploy

Repo ini siap dikirim ke Vercel. Cara tercepat:

1. Login ke Vercel, lalu pilih **Add New > Project**.
2. Impor repository ini (Vercel mendeteksi Next.js otomatis).
3. Biarkan semua pengaturan build default, lalu **Deploy**.

Setiap `git push` ke branch utama otomatis memicu deploy baru.

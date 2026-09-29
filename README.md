# Website SD Taman Muda Jetis

Website sekolah dengan galeri kegiatan otomatis yang diambil langsung dari feed Instagram.

Data galeri ditarik dari API scraper Instagram di
[`scrap-ig-apify-u55q.vercel.app`](https://scrap-ig-apify-u55q.vercel.app/api/instagram/),
lalu dinormalisasi menjadi kartu berita: judul dan kategori otomatis, filter, pencarian,
dan lightbox.

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

## Struktur

```
app/
  layout.tsx              # Root layout, font, header & footer
  page.tsx                # Beranda
  instagram/
    page.tsx              # Halaman galeri (server component)
    gallery-client.tsx    # Filter, pencarian, lightbox (client component)
    caption.tsx           # Render caption (markdown + tautan)
    safe-image.tsx        # <img> dengan fallback
components/
  site-header.tsx         # Header sticky + menu mobile
  site-footer.tsx         # Footer
  post-card.tsx           # Kartu berita/galeri (server-safe)
  section-heading.tsx     # Judul section
  school-logo.tsx         # Monogram logo (SVG, tanpa aset gambar)
lib/
  instagram.ts            # Fetch API + normalisasi data
  format.ts               # Parser caption, tanggal, angka
  present.ts              # Judul/kategori otomatis + view model
```

## Yang dihitung otomatis

Caption Instagram tidak punya judul maupun kategori, jadi keduanya diturunkan otomatis
di `lib/present.ts`:

- **Judul** — setiap baris caption diberi skor (ada angka/tahun, bukan baris berlabel
  seperti `Hari/Tanggal:`, bukan kalimat ajakan), lalu baris terbaik dipilih.
- **Kategori** — dideteksi dari kata kunci: `Prestasi`, `Pengumuman`, `Lomba`,
  `Akademik`, `Kegiatan`, `Berita`.
- **Juara 1/2/3** — diambil dari teks seperti "membawa trophy Juara 2 ...".

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

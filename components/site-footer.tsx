import Link from "next/link";
import { SchoolLogo } from "./school-logo";
import { InstagramIcon } from "./icons";
import { INSTAGRAM_API_URL } from "@/lib/instagram";
import { PPDB, SCHOOL, SCHOOL_HOURS } from "@/lib/school";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil Sekolah" },
  { href: "/ekstrakurikuler", label: "Ekstrakurikuler" },
  { href: "/berita", label: "Berita" },
  { href: "/kontak", label: "Kontak" },
  { href: "/ppdb", label: "PPDB" },
];

const GALERI_LINKS = [
  { href: "/instagram", label: "Semua Unggahan" },
  { href: "/berita?kategori=Prestasi", label: "Prestasi Siswa" },
  { href: "/berita?kategori=Kegiatan", label: "Kegiatan Sekolah" },
  { href: "/berita?kategori=Pengumuman", label: "Pengumuman" },
];

const iconClass = "mt-0.5 h-4 w-4 shrink-0 text-accent-300";
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-primary-100">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Identitas */}
          <div>
            <div className="flex items-center gap-3">
              <SchoolLogo className="h-10 w-10" variant="badge" />
              <div className="leading-tight">
                <p className="font-display text-base font-bold text-white">
                  {SCHOOL.shortName}
                </p>
                <p className="text-xs text-accent-300">Jetis, Yogyakarta</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-200">
              {SCHOOL.tagline}
            </p>
            <p className="mt-4 text-sm text-primary-300">
              {SCHOOL_HOURS[0].day}: {SCHOOL_HOURS[0].time}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SCHOOL.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent-500 hover:text-primary-950"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Navigasi
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-200 transition hover:text-accent-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Galeri */}
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Galeri
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {GALERI_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-200 transition hover:text-accent-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Hubungi Kami
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-primary-200">
              <li className="flex items-start gap-2.5">
                <svg {...svgProps} className={iconClass} aria-hidden="true">
                  <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>
                  {SCHOOL.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg {...svgProps} className={iconClass} aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                <a href={SCHOOL.phoneHref} className="transition hover:text-accent-300">
                  {SCHOOL.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <svg {...svgProps} className={iconClass} aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <a
                  href={`mailto:${SCHOOL.email}`}
                  className="break-all transition hover:text-accent-300"
                >
                  {SCHOOL.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ajakan PPDB */}
        {PPDB.isOpen && (
          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-bold text-white">
                PPDB {PPDB.period} sedang dibuka
              </p>
              <p className="mt-1 text-sm text-primary-200">
                Kuota {PPDB.quota.toLocaleString("id-ID")} peserta. Daftar lebih awal.
              </p>
            </div>
            <Link
              href="/ppdb"
              className="shrink-0 rounded-full bg-accent-400 px-5 py-2.5 text-center text-sm font-semibold text-primary-950 transition hover:bg-accent-300"
            >
              Lihat Syarat Pendaftaran
            </Link>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-primary-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {SCHOOL.name}. Hak cipta dilindungi.
          </p>
          <p>
            Data berita diambil otomatis dari{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-primary-200">
              scrap-ig-apify-u55q.vercel.app
            </code>{" "}
            dan diperbarui setiap jam.
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Diekspor agar halaman bisa menyertakan sumber data di footer galeri. */
export const DATA_SOURCE = INSTAGRAM_API_URL;

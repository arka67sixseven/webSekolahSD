import Link from "next/link";
import { SchoolLogo } from "./school-logo";
import { INSTAGRAM_API_URL, INSTAGRAM_HANDLE } from "@/lib/instagram";

/** TODO: ganti dengan data kontak resmi SD Taman Muda Jetis. */
const CONTACT = {
  address: "Jetis, Yogyakarta",
  phone: "-",
  email: "-",
};

const SOCIALS = [
  {
    label: "Instagram",
    href: `https://www.instagram.com/${INSTAGRAM_HANDLE.replace(/^@/, "")}/`,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-primary-100">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <SchoolLogo className="h-10 w-10" variant="badge" />
              <div className="leading-tight">
                <p className="font-display text-base font-bold text-white">SD Taman Muda</p>
                <p className="text-xs text-accent-300">Jetis, Yogyakarta</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-200">
              Bertumbuh, Berprestasi, dan Berbudaya.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent-500 hover:text-primary-950"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                    {social.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Navigasi
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-primary-200 transition hover:text-accent-300">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/instagram"
                  className="text-primary-200 transition hover:text-accent-300"
                >
                  Galeri Instagram
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Galeri
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/instagram"
                  className="text-primary-200 transition hover:text-accent-300"
                >
                  Foto Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  href="/instagram"
                  className="text-primary-200 transition hover:text-accent-300"
                >
                  Video Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  href="/instagram"
                  className="text-primary-200 transition hover:text-accent-300"
                >
                  Berita Sekolah
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Hubungi Kami
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-primary-200">
              <li className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true">
                  <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {CONTACT.address}
              </li>
              <li className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true">
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                {CONTACT.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-primary-300 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} SD Taman Muda Jetis. Hak cipta dilindungi.</p>
          <p>
            Data galeri diambil otomatis dari{" "}
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

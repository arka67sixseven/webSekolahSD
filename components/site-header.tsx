"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SchoolLogo } from "./school-logo";
import { INSTAGRAM_HANDLE } from "@/lib/instagram";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/instagram", label: "Galeri Instagram" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup menu tiap pindah halaman.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled || open
          ? "border-primary-100 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <nav className="container-page flex items-center justify-between py-3" aria-label="Navigasi utama">
        <Link href="/" className="flex items-center gap-3">
          <SchoolLogo className="h-11 w-11" priority />
          <span className="leading-tight">
            <span className="block font-display text-base font-bold text-primary-800 sm:text-lg">
              SD Taman Muda Jetis
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-wide text-accent-600">
              Jetis, Yogyakarta
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary-50 text-primary-800"
                  : "text-ink-soft hover:bg-primary-50 hover:text-primary-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://www.instagram.com/${INSTAGRAM_HANDLE.replace(/^@/, "")}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800 sm:inline-flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Ikuti Kami
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-800 transition hover:bg-primary-50 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-mobile" className="animate-fade-in border-t border-primary-100 bg-white lg:hidden">
          <div className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href) ? "bg-primary-50 text-primary-800" : "text-ink-soft"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`https://www.instagram.com/${INSTAGRAM_HANDLE.replace(/^@/, "")}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 rounded-lg bg-primary-700 px-3 py-3 text-center text-sm font-semibold text-white sm:hidden"
            >
              Ikuti di Instagram
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

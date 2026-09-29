import Link from "next/link";

/**
 * Pita judul untuk halaman dalam (Profil, Ekstrakurikuler, Berita, Kontak, PPDB).
 * Menggantikan pola hero yang berulang di tiap halaman supaya tetap seragam.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Label remah roti di atas judul, mis. "Beranda / Berita". */
  breadcrumb?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-900">
      {/* Pola titik tipis sebagai tekstur latar, murni dekoratif. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-700/40 blur-3xl"
      />

      <div className="container-page relative py-14 sm:py-20">
        {breadcrumb && (
          <nav aria-label="Remah roti" className="mb-4 text-sm text-primary-300">
            <Link href="/" className="transition hover:text-accent-300">
              Beranda
            </Link>
            <span className="mx-2 text-primary-500">/</span>
            <span className="text-primary-100">{breadcrumb}</span>
          </nav>
        )}

        {eyebrow && <p className="eyebrow">{eyebrow}</p>}

        <h1 className="mt-2 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-200 sm:text-lg">
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}

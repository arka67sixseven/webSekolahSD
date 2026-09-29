import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { BeritaCard } from "@/components/berita-card";
import { buildBeritaCategories, getBerita } from "@/lib/berita";

/** Data di-refresh tiap jam agar URL media dari CDN tetap berlaku. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Berita",
  description:
    "Kabar terbaru, pengumuman, dan prestasi SD Taman Muda Jetis, Jetis, Yogyakarta.",
};

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const { items, error } = await getBerita();

  const categories = buildBeritaCategories(items);
  // Ignore kategori yang tidak ada, supaya URL yang diketik manual tetap aman.
  const active = categories.some((category) => category.name === kategori) ? kategori : undefined;
  const filtered = active
    ? items.filter((item) => item.category === active)
    : items;

  return (
    <main>
      <PageHero
        breadcrumb="Berita"
        eyebrow="Kabar Sekolah"
        title="Berita & Pengumuman"
        description="Kabar terbaru dan pengumuman resmi dari sekolah."
      />

      <section className="bg-mist py-16 sm:py-20">
        <div className="container-page">
          {error && (
            <div role="alert" className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="font-semibold text-red-800">Berita belum bisa dimuat.</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <Link href="/berita" className="btn-primary mt-4">
                Muat ulang
              </Link>
            </div>
          )}

          {!error && categories.length > 1 && (
            <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-1">
              <Link
                href="/berita"
                aria-current={active ? undefined : "page"}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-white text-ink-soft hover:bg-primary-50"
                    : "bg-primary-700 text-white"
                }`}
              >
                Semua
              </Link>
              {categories.map((category) => {
                const isActive = category.name === active;
                return (
                  <Link
                    key={category.name}
                    href={`/berita?kategori=${encodeURIComponent(category.name)}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-primary-700 text-white"
                        : "bg-white text-ink-soft hover:bg-primary-50"
                    }`}
                  >
                    {category.name}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                        isActive ? "bg-white/20 text-white" : "bg-primary-100 text-primary-700"
                      }`}
                    >
                      {category.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {filtered.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <BeritaCard key={item.id} item={item} />
                ))}
              </div>

              <p className="mt-12 text-center text-sm text-ink-soft" role="status">
                Menampilkan {filtered.length} dari {items.length} berita
                {active ? ` dalam kategori ${active}` : ""}.
              </p>
            </>
          ) : (
            !error && (
              <div className="rounded-3xl border border-dashed border-primary-200 bg-white px-6 py-20 text-center">
                <p className="font-display text-lg font-bold text-primary-900">
                  Belum ada berita
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  {active
                    ? `Tidak ada berita dalam kategori ${active}.`
                    : "Belum ada berita yang dipublikasikan."}
                </p>
                {active && (
                  <Link href="/berita" className="btn-primary mt-6">
                    Lihat semua berita
                  </Link>
                )}
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}

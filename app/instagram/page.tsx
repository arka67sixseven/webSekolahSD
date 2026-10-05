import type { Metadata } from "next";
import Link from "next/link";
import { GalleryClient } from "./gallery-client";
import { INSTAGRAM_HANDLE, getInstagramPosts } from "@/lib/instagram";
import { buildCategories, computeStats, toPostView, type PostView } from "@/lib/present";
import { formatCount } from "@/lib/format";

/** Halaman dinamis: SSR tiap permintaan, lalu di-cache 1 jam (ISR). */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Galeri Instagram",
  description:
    "Foto, video, dan berita kegiatan SD Taman Muda Jetis Yogyakarta, diambil otomatis dari Instagram sekolah.",
};

export default async function InstagramPage() {
  const { posts, error, skipped } = await getInstagramPosts();
  const views: PostView[] = posts.map((post) => toPostView(post));
  const stats = computeStats(views);
  const categories = buildCategories(views);

  return (
    <main>
      {/* ---------------- Page header ---------------- */}
      <section className="relative isolate overflow-hidden bg-primary-900">
        {views[0] && (
          <div className="absolute inset-0 -z-10">
            <img
              src={views[0].mediaUrl}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/95 to-primary-800" />
          </div>
        )}

        <div className="container-page py-14 sm:py-20">
          <nav aria-label="Remah roti" className="mb-6 flex items-center gap-2 text-sm text-primary-300">
            <Link href="/" className="transition hover:text-accent-300">
              Beranda
            </Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5" aria-hidden="true">
              <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white">Galeri Instagram</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-300 ring-1 ring-white/15">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                {INSTAGRAM_HANDLE}
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white text-balance sm:text-5xl">
                Galeri Instagram Sekolah
              </h1>
              <p className="mt-4 text-base leading-relaxed text-primary-200 sm:text-lg">
                Aktivitas belajar, lomba, prestasi, dan pengumuman resmi SD Taman Muda
                Jetis â€” diperbarui otomatis setiap jam.
              </p>
            </div>

            {views.length > 0 && (
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-96">
                {[
                  { value: formatCount(stats.total), label: "Unggahan" },
                  { value: formatCount(stats.photos), label: "Foto" },
                  { value: formatCount(stats.videos), label: "Video" },
                  { value: formatCount(stats.likes), label: "Suka" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center"
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-xl font-extrabold text-accent-300">
                        {stat.value}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wide text-primary-300">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Galeri ---------------- */}
      <section className="bg-mist py-12 sm:py-16">
        <div className="container-page">
          {error ? (
            <div
              role="alert"
              className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-red-50 px-6 py-14 text-center"
            >
              <p className="font-display text-lg font-bold text-red-700">
                Galeri tidak dapat dimuat saat ini.
              </p>
              <p className="mt-2 text-sm text-red-500">Detail: {error}</p>
              <Link href="/" className="btn-primary mt-6">
                Kembali ke beranda
              </Link>
            </div>
          ) : views.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-primary-200 bg-white px-6 py-16 text-center">
              <p className="font-display text-lg font-bold text-primary-900">
                Belum ada postingan
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Unggahan terbaru akan tampil di sini secara otomatis.
              </p>
            </div>
          ) : (
            <>
              <GalleryClient views={views} categories={categories} />

              {skipped > 0 && (
                <p className="mt-8 text-center text-xs text-ink-soft">
                  {skipped} entri tidak valid dilewati.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}


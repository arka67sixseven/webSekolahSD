import Link from "next/link";
import { PostCard, PostStripCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { getInstagramPosts } from "@/lib/instagram";
import { buildCategories, computeStats, toPostView, type PostView } from "@/lib/present";
import { formatCount } from "@/lib/format";

/** Data di-refresh tiap jam agar URL media dari CDN tetap berlaku. */
export const revalidate = 3600;

const HERO_STATS = [
  { key: "total", label: "Unggahan" },
  { key: "photos", label: "Foto" },
  { key: "videos", label: "Video" },
  { key: "likes", label: "Total Suka" },
] as const;

export default async function HomePage() {
  const { posts, error } = await getInstagramPosts();
  const views: PostView[] = posts.map((post) => toPostView(post));

  const terbaru = views.slice(0, 3);
  const strip = views.slice(0, 6);
  const prestasi = views.filter((view) => view.category === "Prestasi").slice(0, 3);
  const categories = buildCategories(views).slice(0, 5);
  const stats = computeStats(views);
  const statValues: Record<(typeof HERO_STATS)[number]["key"], string> = {
    total: formatCount(stats.total),
    photos: formatCount(stats.photos),
    videos: formatCount(stats.videos),
    likes: formatCount(stats.likes),
  };

  return (
    <main>
      {/* ---------------- Hero ---------------- */}
      <section className="relative isolate overflow-hidden bg-primary-900">
        {views[0] && (
          <div className="absolute inset-0 -z-10">
            <img
              src={views[0].mediaUrl}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/95 to-primary-800" />
          </div>
        )}

        <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-300 ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-accent-400" />
              Galeri Kegiatan Sekolah
            </span>

            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-5xl">
              Jejak kegiatan, prestasi, dan kenangan
              <span className="text-accent-300"> terbaik</span> siswa kami.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-200 sm:text-lg">
              Ikuti aktivitas belajar, lomba, dan kegiatan sekolah yang berjalan setiap
              hari — langsung dari feed Instagram sekolah.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/instagram"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-900 transition hover:bg-primary-50 active:scale-[0.98]"
              >
                Lihat Galeri Instagram
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#terbaru"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
              >
                Kabar Terbaru
              </a>
            </div>

            {views.length > 0 && (
              <dl className="mt-12 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
                {HERO_STATS.map((stat) => (
                  <div key={stat.key}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-2xl font-extrabold text-accent-300">
                        {statValues[stat.key]}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wide text-primary-300">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Kolase 4 unggahan terbaru */}
          {views.length > 0 ? (
            <div className="animate-fade-up grid grid-cols-2 gap-3 [animation-delay:120ms] sm:gap-4">
              {strip.slice(0, 4).map((view, index) => (
                <Link
                  key={view.id}
                  href="/instagram"
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 shadow-lift ${
                    index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                  }`}
                >
                  <img
                    src={view.mediaUrl}
                    alt={view.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${view.categoryTone}`}
                    >
                      {view.category}
                    </span>
                    <p className="mt-1.5 line-clamp-2 font-display text-xs font-bold leading-snug text-white sm:text-sm">
                      {view.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-sm text-primary-200">
                {error
                  ? "Galeri belum dapat dimuat. Coba muat ulang sebentar lagi."
                  : "Belum ada unggahan untuk ditampilkan."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Kabar Terbaru ---------------- */}
      {terbaru.length > 0 && (
        <section id="terbaru" className="bg-mist py-20 sm:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow="Kabar Terbaru"
              title="Berita & Kegiatan"
              description="Jejak kegiatan, prestasi, dan pengumuman resmi SD Taman Muda Jetis."
              action={
                <Link href="/instagram" className="btn-ghost">
                  Lihat semua
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              }
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {terbaru.map((view) => (
                <PostCard key={view.id} view={view} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Kategori & Prestasi ---------------- */}
      {categories.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow="Telusuri"
              title="Jelajahi Kegiatan"
              description="Temukan unggahan berdasarkan kategori kegiatan sekolah."
            />

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href="/instagram"
                  className="group inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-card"
                >
                  {category.name}
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] text-primary-700 transition group-hover:bg-primary-200">
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>

            {prestasi.length > 0 && (
              <div className="mt-20">
                <SectionHeading
                  eyebrow="Sorotan"
                  title="Prestasi Siswa"
                  description="Pencapaian membanggakan siswa SD Taman Muda Jetis."
                />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {prestasi.map((view) => (
                    <PostCard key={view.id} view={view} showHashtags />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------------- Strip galeri ---------------- */}
      {strip.length > 0 && (
        <section className="bg-mist py-20 sm:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow="Galeri"
              title="Sorotan Visual"
              description="Potongan keseharian siswa di SD Taman Muda Jetis."
              action={<Link href="/instagram" className="btn-ghost">Buka galeri lengkap</Link>}
            />
          </div>

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
            {strip.map((view) => (
              <PostStripCard key={view.id} view={view} />
            ))}
          </div>
        </section>
      )}

      {/* ---------------- CTA ---------------- */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-700 py-16">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl font-display text-3xl font-bold text-white text-balance">
            Ingin melihat kegiatan terbaru sekolah?
          </h2>
          <p className="max-w-xl text-primary-100">
            Buka galeri lengkap untuk melihat foto, video, dan pengumuman sekolah.
          </p>
          <Link
            href="/instagram"
            className="rounded-full bg-accent-400 px-5 py-2.5 text-sm font-semibold text-primary-950 transition hover:bg-accent-300 active:scale-[0.98]"
          >
            Lihat Galeri Instagram
          </Link>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/copy-link-button";
import { ArrowLeftIcon, ClockIcon } from "@/components/icons";
import { findBerita, getBerita, relatedBerita } from "@/lib/berita";
import { SCHOOL, SITE_URL } from "@/lib/school";

/** Data di-refresh tiap jam, sama seperti halaman daftar berita. */
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { items } = await getBerita();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { items } = await getBerita();
  const item = findBerita(items, slug);

  if (!item) return { title: "Berita tidak ditemukan" };

  const description = item.excerpt ?? item.title;

  return {
    title: item.title,
    description,
    alternates: { canonical: `/berita/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      type: "article",
      locale: "id_ID",
      publishedTime: item.dateIso,
      images: item.mediaUrl ? [{ url: item.mediaUrl }] : undefined,
    },
  };
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { items, error } = await getBerita();
  const item = findBerita(items, slug);

  if (!item) notFound();

  const related = relatedBerita(items, item, 3);

  // Data terstruktur untuk mesin pencari (schema.org NewsArticle).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt ?? item.title,
    image: item.mediaUrl ? [item.mediaUrl] : undefined,
    datePublished: item.dateIso,
    dateModified: item.dateIso,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/berita/${item.slug}`,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: SCHOOL.name,
      telephone: SCHOOL.phone,
      email: SCHOOL.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: SCHOOL.addressLines.join(", "),
        addressLocality: "Yogyakarta",
        addressCountry: "ID",
      },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // Data berasal dari caption publik; escape penutup tag agar aman di-inline.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        {/* ---------------- Kepala artikel ---------------- */}
        <header className="relative overflow-hidden bg-primary-900">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="container-page relative py-14 sm:py-16">
            <nav aria-label="Remah roti" className="mb-6 text-sm text-primary-300">
              <Link href="/" className="transition hover:text-accent-300">
                Beranda
              </Link>
              <span className="mx-2 text-primary-500">/</span>
              <Link href="/berita" className="transition hover:text-accent-300">
                Berita
              </Link>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.categoryTone}`}>
                {item.category}
              </span>
              {item.dateLabel && (
                <time dateTime={item.dateIso} className="flex items-center gap-1.5 text-sm text-primary-300">
                  <ClockIcon className="h-4 w-4" />
                  {item.dateLabel}
                </time>
              )}
            </div>

            <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-4xl">
              {item.title}
            </h1>

            {item.hasEngagement && (
              <p className="mt-4 text-sm text-primary-300">
                {item.likesLabel} suka &middot; {item.commentsLabel} komentar
              </p>
            )}
          </div>
        </header>

        {/* ---------------- Media ---------------- */}
        {item.mediaUrl && (
          <div className="bg-white">
            <div className="container-page -mt-2 py-8">
              <div className="overflow-hidden rounded-3xl border border-primary-100 bg-earth-100">
                {item.isVideo && item.videoUrl ? (
                  <video
                    controls
                    playsInline
                    poster={item.mediaUrl}
                    className="max-h-[70vh] w-full bg-primary-950 object-contain"
                  >
                    <source src={item.videoUrl} />
                    Browser Anda tidak mendukung pemutaran video.
                  </video>
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="max-h-[70vh] w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- Isi ---------------- */}
        <div className="bg-white pb-20">
          <div className="container-page">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="max-w-3xl">
                {item.body.length > 0 ? (
                  <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
                    {item.body.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg leading-relaxed text-ink-soft">
                    Berita ini hanya memuat foto atau video. Selengkapnya ada di
                    postingan asli.
                  </p>
                )}

                {item.hashtags.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-2">
                    {item.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.links.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
                      Tautan terkait
                    </h2>
                    <ul className="mt-2 space-y-1">
                      {item.links.map((link) => (
                        <li key={link} className="break-all">
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-700 underline decoration-primary-300 underline-offset-2 transition hover:text-primary-600"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-10 flex flex-wrap gap-3 border-t border-primary-100 pt-8">
                  {item.permalink && (
                    <a
                      href={item.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Lihat di Instagram
                    </a>
                  )}
                  <CopyLinkButton />
                  <Link href="/berita" className="btn-ghost">
                    <ArrowLeftIcon />
                    Kembali ke berita
                  </Link>
                </div>
              </div>

              {/* ---------------- Berita lainnya ---------------- */}
              {related.length > 0 && (
                <aside aria-labelledby="berita-lainnya-title" className="lg:sticky lg:top-24 lg:self-start">
                  <h2
                    id="berita-lainnya-title"
                    className="font-display text-xl font-bold text-primary-900"
                  >
                    Berita lainnya
                  </h2>
                  <ul className="mt-4 space-y-5">
                    {related.map((other) => (
                      <li key={other.id}>
                        <Link
                          href={`/berita/${other.slug}`}
                          className="group flex gap-3"
                        >
                          {other.mediaUrl && (
                            <span className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-earth-100">
                              <img
                                src={other.mediaUrl}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block text-xs font-semibold text-primary-600">
                              {other.category}
                            </span>
                            <span className="mt-1 block text-sm font-semibold leading-snug text-primary-900 transition group-hover:text-primary-700">
                              {other.title}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
          </div>
        </div>
      </article>

      {error && (
        <div className="bg-white pb-10">
          <div className="container-page">
            <p className="text-sm text-ink-soft">
              Catatan: sebagian data berita gagal dimuat ({error}).
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

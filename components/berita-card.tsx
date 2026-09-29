import Link from "next/link";
import type { BeritaItem } from "@/lib/berita";
import { ArrowRightIcon } from "./icons";

/**
 * Kartu berita untuk daftar (/berita) dan "berita lainnya" di halaman detail.
 * Selalu tertaut ke `/berita/<slug>`.
 */
export function BeritaCard({
  item,
  className = "",
  showExcerpt = true,
}: {
  item: BeritaItem;
  className?: string;
  showExcerpt?: boolean;
}) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white transition hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-earth-100">
        {item.mediaUrl ? (
          <img
            src={item.mediaUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm text-ink-soft">
            Cover berita
          </span>
        )}

        {item.isVideo && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-950/55 text-white backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>
          </span>
        )}

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${item.categoryTone}`}
        >
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {item.dateLabel && (
          <time
            dateTime={item.dateIso}
            className="text-xs font-medium uppercase tracking-wide text-ink-soft"
          >
            {item.dateLabel}
          </time>
        )}

        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-primary-900">
          <Link href={`/berita/${item.slug}`} className="transition hover:text-primary-700">
            {/* Garis panjang agar seluruh kartu bisa diklik, tapi tetap terbaca sebagai link. */}
            <span className="absolute inset-0" aria-hidden="true" />
            {item.title}
          </Link>
        </h3>

        {showExcerpt && item.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {item.excerpt}
          </p>
        )}

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700">
          Baca selengkapnya
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

import type { ReactNode } from "react";
import { Caption } from "@/app/instagram/caption";
import type { PostView } from "@/lib/present";

/**
 * Kartu berita/galeri. Sengaja TANPA "use client" supaya bisa dipakai
 * dari Server Component (beranda) maupun Client Component (galeri).
 *
 * - Beri `onOpen` untuk membuka lightbox (kartu galeri).
 * - Beri `mediaHref` untuk melompat ke sumber (kartu beranda).
 * - Tanpa keduanya, area media tidak interaktif (entri berita tanpa sumber).
 */
export function PostCard({
  view,
  onOpen,
  mediaHref,
  showHashtags = false,
  className = "",
}: {
  view: PostView;
  onOpen?: () => void;
  mediaHref?: string;
  showHashtags?: boolean;
  className?: string;
}) {
  const href = mediaHref ?? view.permalink;
  const interactive = Boolean(href) || typeof onOpen === "function";
  const label = `Buka detail: ${view.title}`;

  const mediaInner = (
    <>
      <img
        src={view.mediaUrl}
        alt={view.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <span
        className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${view.categoryTone}`}
      >
        {view.category}
      </span>

      {view.isVideo && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-black/70">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5" aria-hidden="true">
              <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.14-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
            </svg>
          </span>
        </span>
      )}

      {view.hasEngagement && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-2.5 pt-8 text-xs font-medium text-white">
          <span>&#9825; {view.likesLabel}</span>
          {view.comments !== undefined && <span>&#128172; {view.commentsLabel}</span>}
        </span>
      )}
    </>
  );

  const media = (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden bg-primary-50 ${
        interactive ? "cursor-pointer" : ""
      }`}
    >
      {mediaInner}
    </div>
  );

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift ${className}`}
    >
      {onOpen ? (
        <button type="button" onClick={onOpen} aria-label={label} className="block w-full text-left">
          {media}
        </button>
      ) : href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="block w-full">
          {media}
        </a>
      ) : (
        media
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${view.categoryTone}`}
          >
            {view.category}
          </span>
          {view.dateLabel && (
            <time dateTime={view.dateIso} className="shrink-0 text-xs font-medium text-ink-soft">
              {view.dateLabel}
            </time>
          )}
        </div>

        <h3 className="font-display text-lg font-bold leading-snug text-primary-900">
          {view.title}
        </h3>

        <Caption
          lines={view.captionLines}
          maxLines={3}
          className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft"
        />

        {showHashtags && view.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {view.hashtags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4">
          {view.permalink ? (
            view.permalink === href ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition group-hover:gap-2.5">
                Lihat di Instagram
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : (
              <a
                href={view.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition hover:gap-2.5"
              >
                Lihat di Instagram
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              Berita sekolah
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/** Kartu ringkas untuk strip carousel di beranda. */
export function PostStripCard({ view, children }: { view: PostView; children?: ReactNode }) {
  return (
    <article className="group relative flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card transition hover:shadow-lift sm:w-[340px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-50">
        <img
          src={view.mediaUrl}
          alt={view.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {view.isVideo && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden="true">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.14-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
              </svg>
            </span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${view.categoryTone}`}>
          {view.category}
        </span>
        <h3 className="mt-2.5 line-clamp-2 font-display text-base font-bold leading-snug text-primary-900">
          {view.title}
        </h3>
        {view.dateLabel && (
          <time dateTime={view.dateIso} className="mt-auto pt-3 text-xs text-ink-soft">
            {view.dateLabel}
          </time>
        )}
        {children}
      </div>
    </article>
  );
}

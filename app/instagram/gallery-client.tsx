"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Caption } from "./caption";
import { SafeImage } from "./safe-image";
import { PostCard } from "@/components/post-card";
import {
  MEDIA_FILTERS,
  matchesFilter,
  matchesQuery,
  type FilterId,
  type PostView,
} from "@/lib/present";

/** Jumlah kartu sebelum pengguna menekan "Tampilkan semua". */
const INITIAL_VISIBLE = 9;

function ChevronGlyph({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {direction === "left" ? <path d="M15 18 9 12l6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function Lightbox({
  views,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  views: PostView[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const view = views[index];
  const [videoFailed, setVideoFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeRef, onClose, onNext, onPrev]);

  if (!view) return null;
  const showVideo = view.isVideo && view.videoUrl && !videoFailed;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail: ${view.title}`}
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-primary-950/85 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        key={view.id}
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-lift lg:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="relative flex min-h-56 flex-1 items-center justify-center bg-primary-950">
          {showVideo ? (
            <video
              src={view.videoUrl}
              poster={view.mediaUrl}
              controls
              playsInline
              onError={() => setVideoFailed(true)}
              className="max-h-[46vh] w-full object-contain lg:max-h-[92vh]"
            />
          ) : (
            <SafeImage
              src={view.mediaUrl}
              alt={view.title}
              className="max-h-[46vh] w-full object-contain lg:max-h-[92vh]"
            />
          )}

          {views.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                aria-label="Postingan sebelumnya"
                className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/75"
              >
                <ChevronGlyph direction="left" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Postingan berikutnya"
                className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/75"
              >
                <ChevronGlyph direction="right" />
              </button>
            </>
          )}
        </div>

        <div className="flex max-h-[46vh] w-full flex-col gap-4 overflow-y-auto border-t border-primary-100 p-5 lg:max-h-[92vh] lg:w-96 lg:border-l lg:border-t-0 lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${view.categoryTone}`}
            >
              {view.category}
            </span>
            {view.dateLabel && (
              <time dateTime={view.dateIso} className="text-xs text-ink-soft">
                {view.datePrefix ? `${view.datePrefix} ` : ""}
                {view.dateLabel}
              </time>
            )}
          </div>

          <h2 className="font-display text-xl font-bold leading-snug text-primary-900">
            {view.title}
          </h2>

          {view.hasEngagement && (
            <div className="flex items-center gap-4 text-sm font-medium text-ink-soft">
              <span>&#9825; {view.likesLabel} suka</span>
              <span>&#128172; {view.commentsLabel} komentar</span>
            </div>
          )}

          <Caption
            lines={view.captionLines}
            className="whitespace-pre-line text-sm leading-relaxed text-ink-soft"
          />

          {view.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {view.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {view.links.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                Tautan pada unggahan
              </p>
              {view.links.map((href) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate rounded-xl bg-mist px-3 py-2.5 text-xs font-medium text-primary-700 transition hover:bg-primary-50"
                >
                  {href}
                </a>
              ))}
            </div>
          )}

          {view.permalink && (
            <a
              href={view.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-auto w-full"
            >
              Lihat di Instagram
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function GalleryClient({
  views,
  categories,
}: {
  views: PostView[];
  categories: Array<{ name: string; count: number }>;
}) {
  const [mediaFilter, setMediaFilter] = useState<FilterId>("all");
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      views.filter(
        (view) =>
          matchesFilter(view, mediaFilter) &&
          (category === null || view.category === category) &&
          matchesQuery(view, query)
      ),
    [mediaFilter, category, query, views]
  );

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hidden = filtered.length - visible.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((current) =>
        current === null ? null : (current - 1 + filtered.length) % filtered.length
      ),
    [filtered.length]
  );
  const next = useCallback(
    () =>
      setOpenIndex((current) =>
        current === null ? null : (current + 1) % filtered.length
      ),
    [filtered.length]
  );

  const reset = () => {
    setMediaFilter("all");
    setCategory(null);
    setQuery("");
  };
  const hasActiveFilter = mediaFilter !== "all" || category !== null || query.trim() !== "";

  return (
    <div>
      {/* ---------- Kontrol ---------- */}
      <div className="mb-8 rounded-3xl border border-primary-100 bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1"
            role="group"
            aria-label="Saring jenis media"
          >
            {MEDIA_FILTERS.map((item) => {
              const count = views.filter((view) => matchesFilter(view, item.id)).length;
              const active = mediaFilter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMediaFilter(item.id);
                    setShowAll(false);
                  }}
                  aria-pressed={active}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-primary-700 text-white shadow-sm"
                      : "bg-mist text-ink-soft hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {item.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                      active ? "bg-white/20 text-white" : "bg-primary-100 text-primary-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative lg:w-80">
            <label htmlFor="galeri-pencarian" className="sr-only">
              Cari unggahan
            </label>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              id="galeri-pencarian"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowAll(false);
              }}
              placeholder="Cari kegiatan, prestasimu…"
              className="w-full rounded-full border border-primary-100 bg-mist py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-50"
            />
          </div>
        </div>

        {categories.length > 1 && (
          <div
            className="no-scrollbar mt-4 -mx-1 flex gap-2 overflow-x-auto border-t border-primary-50 px-1 pt-4"
            role="group"
            aria-label="Saring kategori"
          >
            <button
              type="button"
              onClick={() => {
                setCategory(null);
                setShowAll(false);
              }}
              aria-pressed={category === null}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === null
                  ? "bg-accent-400 text-primary-950"
                  : "bg-earth-50 text-ink-soft hover:bg-earth-100"
              }`}
            >
              Semua kategori
            </button>
            {categories.map((item) => {
              const active = category === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setCategory(active ? null : item.name);
                    setShowAll(false);
                  }}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-accent-400 text-primary-950"
                      : "bg-earth-50 text-ink-soft hover:bg-earth-100"
                  }`}
                >
                  {item.name}
                  <span className="ml-1.5 opacity-60">{item.count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------- Grid ---------- */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-primary-200 bg-white px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-primary-900">
            Tidak ada unggahan yang cocok
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Coba kata kunci lain, atau pilih kategori &ldquo;Semua kategori&rdquo;.
          </p>
          {hasActiveFilter && (
            <button type="button" onClick={reset} className="btn-primary mt-6">
              Atur ulang filter
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="sr-only" role="status">
            Menampilkan {filtered.length} dari {views.length} unggahan
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((view, index) => (
              <PostCard
                key={view.id}
                view={view}
                onOpen={() => setOpenIndex(index)}
                showHashtags
              />
            ))}
          </div>

          {hidden > 0 && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="btn-ghost"
              >
                Tampilkan {hidden} unggahan lainnya
              </button>
            </div>
          )}
        </>
      )}

      {openIndex !== null && filtered[openIndex] && (
        <Lightbox views={filtered} index={openIndex} onClose={close} onPrev={prev} onNext={next} />
      )}
    </div>
  );
}

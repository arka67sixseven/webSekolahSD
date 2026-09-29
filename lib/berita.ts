/**
 * Lapisan data untuk halaman Berita.
 *
 * Berita disusun dari data Instagram yang sama dengan galeri, lalu
 * diubah bentuknya menjadi "artikel": punya slug, judul, paragraf isi,
 * tanggal, dan kategori.
 *
 * Dengan begitu tidak perlu sumber data kedua — cukup satu endpoint.
 */

import { getInstagramPosts, INSTAGRAM_REVALIDATE_SECONDS } from "./instagram";
import { slugify, stripDecoration, toPostView, type PostView } from "./present";

export interface BeritaItem {
  id: string;
  slug: string;
  title: string;
  /** Paragraf isi artikel (sudah dibersihkan dari URL, hashtag, dan emoji). */
  body: string[];
  category: string;
  categoryTone: string;
  mediaUrl: string;
  isVideo: boolean;
  videoUrl?: string;
  permalink?: string;
  dateLabel?: string;
  dateIso?: string;
  relativeLabel?: string;
  hashtags: string[];
  links: string[];
  excerpt?: string;
  likesLabel: string;
  commentsLabel: string;
  hasEngagement: boolean;
  /** Field asli dari view model, dipakai untuk membuat tautan posting Instagram. */
  source: PostView;
}

export interface BeritaFeed {
  items: BeritaItem[];
  error: string | null;
}

/** Batas paragraf per berita agar halaman detail tidak terlalu panjang. */
const MAX_PARAGRAPHS = 12;

/**
 * Bangun slug yang unik. Dua berita dengan judul sama akan diberi akhiran
 * 4 karakter terakhir dari id masing-masing, supaya URL tidak bentrok.
 */
function withUniqueSlug(items: BeritaItem[]): BeritaItem[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.slug, (counts.get(item.slug) ?? 0) + 1);
  }

  return items.map((item) =>
    counts.get(item.slug) === 1
      ? item
      : { ...item, slug: `${item.slug || "berita"}-${item.id.slice(-4)}` }
  );
}

function toBeritaItem(view: PostView): BeritaItem {
  // Paragraf = baris caption setelah judul, dibersihkan dari elemen visual.
  const body = view.captionLines
    .map((line) => stripDecoration(line.map((token) => token.value).join("")))
    .filter((line) => line.length >= 3)
    .slice(0, MAX_PARAGRAPHS);

  return {
    id: view.id,
    slug: slugify(view.title),
    title: view.title,
    body,
    category: view.category,
    categoryTone: view.categoryTone,
    mediaUrl: view.mediaUrl,
    isVideo: view.isVideo,
    videoUrl: view.videoUrl,
    permalink: view.permalink,
    dateLabel: view.dateLabel,
    dateIso: view.dateIso,
    relativeLabel: view.relativeLabel,
    hashtags: view.hashtags,
    links: view.links,
    excerpt: view.preview,
    likesLabel: view.likesLabel,
    commentsLabel: view.commentsLabel,
    hasEngagement: view.hasEngagement,
    source: view,
  };
}

/**
 * Ambil semua berita. Tidak pernah melempar error — bila gagal, kembalikan
 * daftar kosong beserta pesan errornya supaya halaman bisa menampilkannya.
 */
export async function getBerita(): Promise<BeritaFeed> {
  const { posts, error } = await getInstagramPosts();
  if (error) return { items: [], error };

  const items = withUniqueSlug(posts.map((post) => toBeritaItem(toPostView(post))));
  return { items, error: null };
}

/** Cari satu berita berdasarkan slug-nya. */
export function findBerita(items: BeritaItem[], slug: string): BeritaItem | undefined {
  return items.find((item) => item.slug === slug);
}

/** Berita lain yang kategori sama, dipakai di sidebar detail. */
export function relatedBerita(
  items: BeritaItem[],
  current: BeritaItem,
  limit = 3
): BeritaItem[] {
  const sameCategory = items.filter(
    (item) => item.id !== current.id && item.category === current.category
  );
  const others = items.filter(
    (item) => item.id !== current.id && item.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

/** Jumlah berita per kategori, untuk chip filter di halaman daftar. */
export function buildBeritaCategories(
  items: BeritaItem[]
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "id"));
}

export { INSTAGRAM_REVALIDATE_SECONDS };

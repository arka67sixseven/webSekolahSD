/**
 * Lapisan data untuk galeri Instagram.
 *
 * Sumber data: API unggahan Instagram SD Taman Muda Jetis Yogyakarta.
 * Endpoint: https://api-ig-ruddy.vercel.app/api/berita/sekolah/sdtamansiswajetis
 *
 * Bentuk balasan API (HTTP 200):
 * {
 *   "status": "success",
 *   "total": 10,
 *   "data": [
 *     {
 *       "id": "3995916484207071907",
 *       "short_code": "Dd0WN8BSlKj",
 *       "type": "video",
 *       "caption": "...",
 *       "hashtags": ["ppdb2026", "sdtamansiswajetis"],
 *       "thumbnail_url": "https://scontent-...cdninstagram.com/...",
 *       "images": [],
 *       "is_video": true,
 *       "video_url": "https://...mp4" | null,
 *       "post_url": "https://www.instagram.com/p/Dd0WN8BSlKj/",
 *       "likes": 37,
 *       "posted_at": "2026-09-28T04:39:50+00:00",
 *       "scraped_at": "...",
 *       "username": "sdtamansiswajetis"
 *     }
 *   ]
 * }
 *
 * Catatan: semua entri adalah unggahan Instagram sekolah; tidak ada lagi
 * berita manual yang diunggah lewat endpoint scraper lama.
 */

/** Endpoint data IG SD Taman Muda Jetis (API khusus). */
export const SEKOLAH_IG_API_URL =
  "https://api-ig-ruddy.vercel.app/api/berita/sekolah/sdtamansiswajetis";

/**
 * Peta `id -> /images/berita/<id>.jpg`, dibuat oleh `npm run sync:berita`.
 *
 * Thumbnail Instagram URL bersifat sementara (parameter `oe` kedaluwarsa
 * dalam hitungan hari), sehingga gambar diunduh ke repo dan disajikan dari
 * domain sendiri. Post baru yang belum disinkron tetap memakai URL API.
 */
import localMedia from "@/data/gambar.generated.json";

const LOCAL_MEDIA: Record<string, string> = localMedia;

/** Handle asal data (dipakai di teks tombol "Ikuti Kami"). */
export const INSTAGRAM_HANDLE = "@sdtamansiswajetis";

/** Data di-refresh tiap 1 jam supaya URL CDN Instagram (bermasa berlaku) tetap hidup. */
export const INSTAGRAM_REVALIDATE_SECONDS = 3600;

/** Batas waktu agar fetch tidak menggantung bila endpoint lambat. */
const REQUEST_TIMEOUT_MS = 20_000;

export type InstagramPostType =
  | "image"
  | "carousel"
  | "video"
  | "article"
  | "unknown";

export interface InstagramPost {
  id: string;
  type: InstagramPostType;
  caption?: string;
  media_url: string;
  video_url?: string;
  /** undefined = entri berita sekolah, bukan tautan Instagram. */
  permalink?: string;
  /** Waktu publikasi (posted_at), atau created_at bila ini berita manual. */
  timestamp?: string;
  is_video: boolean;
  likes_count?: number;
  comments_count?: number;
  /** Tag dari kolom `hashtags` API (bukan disarikan dari caption). */
  hashtags?: string[];
}

export interface InstagramFeed {
  posts: InstagramPost[];
  error: string | null;
  /** Jumlah entri yang gagal difilter/diubah bentuknya (untuk catatan debug). */
  skipped: number;
}

type RawRecord = Record<string, unknown>;

/** Placeholder lokal (SVG inline) supaya tidak bergantung layanan pihak ketiga. */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#eef2ff"/>
      <path d="M170 190h60v60h-60z" fill="#c7d2fe"/>
      <text x="200" y="290" font-family="system-ui, sans-serif" font-size="20" fill="#6366f1" text-anchor="middle">Tanpa Gambar</text>
    </svg>`
  );

const isRecord = (value: unknown): value is RawRecord =>
  typeof value === "object" && value !== null;

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;

const asNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

/** Terima boolean maupun string ("true", "1") dari scraper yang berbeda. */
const asBoolean = (value: unknown): boolean =>
  value === true ||
  value === 1 ||
  (typeof value === "string" && /^(true|1|yes)$/i.test(value.trim()));

/** Hanya izinkan URL http/https (menolak javascript:, data: dari payload, dll). */
const safeUrl = (value: unknown): string | undefined => {
  const url = asString(value);
  return url && /^https?:\/\//i.test(url) ? url : undefined;
};

/** Nama key bisa berbeda-beda tiap scraper, ambil yang pertama tersedia. */
const pick = (post: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (post[key] !== undefined && post[key] !== null) return post[key];
  }
  return undefined;
};

/**
 * Petakan nilai `type` dari scraper ke tipe kita.
 * Data saat ini: "Image" | "Carousel" | "Video" | null.
 */
function resolveType(raw: RawRecord, isVideo: boolean, hasPermalink: boolean): InstagramPostType {
  const rawType = asString(pick(raw, ["type", "media_type", "mediaType"]))?.toLowerCase();

  if (rawType) {
    if (rawType.includes("video") || rawType.includes("reel") || rawType.includes("sidecar")) {
      return "video";
    }
    if (rawType.includes("carousel") || rawType.includes("album")) return "carousel";
    if (rawType.includes("image") || rawType.includes("photo")) return "image";
  }

  if (isVideo) return "video";
  // Tanpa tipe dan tanpa tautan Instagram => berita sekolah yang diunggah manual.
  if (!hasPermalink) return "article";
  return rawType ? "unknown" : "image";
}

/** Ubah satu item mentah menjadi InstagramPost yang valid. */
function normalizePost(raw: unknown, index: number): InstagramPost | null {
  if (!isRecord(raw)) return null;

  const mediaUrl = safeUrl(
    pick(raw, [
      "thumbnail_url",
      "thumbnailUrl",
      "media_url",
      "mediaUrl",
      "image_url",
      "display_url",
      "url",
    ])
  );
  const videoUrl = safeUrl(pick(raw, ["video_url", "videoUrl", "video"]));
  const caption = asString(pick(raw, ["caption", "text", "title"]));
  const permalink = safeUrl(pick(raw, ["post_url", "postUrl", "permalink", "link"]));
  const postedAt = asString(
    pick(raw, ["posted_at", "postedAt", "timestamp", "taken_at", "date"])
  );
  const createdAt = asString(pick(raw, ["created_at", "createdAt", "scraped_at", "scrapedAt"]));

  const rawHashtags = pick(raw, ["hashtags", "tags"]);
  const hashtags = Array.isArray(rawHashtags)
    ? rawHashtags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter((tag) => tag !== "")
    : undefined;

  // Buang objek sampah yang tidak punya gambar maupun keterangan sama sekali.
  if (!mediaUrl && !caption) return null;

  const isVideo =
    asBoolean(pick(raw, ["is_video", "isVideo"])) || Boolean(videoUrl);

  return {
    id:
      asString(pick(raw, ["id", "short_code", "shortcode", "code", "pk"])) ??
      `post-${index}-${mediaUrl ?? caption}`,
    type: resolveType(raw, isVideo, Boolean(permalink)),
    caption,
    media_url: mediaUrl ?? PLACEHOLDER_IMAGE,
    video_url: videoUrl,
    permalink,
    // Berita manual tidak punya posted_at, jadi pakai created_at sebagai gantinya.
    timestamp: postedAt ?? createdAt,
    is_video: isVideo,
    likes_count: asNumber(
      pick(raw, ["likes", "likes_count", "likesCount", "like_count", "likeCount"])
    ),
    comments_count: asNumber(
      pick(raw, ["comments_count", "commentsCount", "comment_count"])
    ),
    hashtags,
  };
}

/**
 * Ambil array entri dari berbagai bentuk respons:
 * array langsung, { posts }, { data }, { result }, { items },
 * bersarang seperti { data: { posts } }, atau GraphQL { edges: [{ node }] }.
 */
function extractRawEntries(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  const keys = ["posts", "data", "result", "results", "items", "medias", "edges"];

  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) {
      for (const nestedKey of keys) {
        const nested = value[nestedKey];
        if (Array.isArray(nested)) return nested;
      }
    }
  }

  return [];
}

/** Buang duplikat agar tidak memunculkan peringatan "Encountered two children with the same key". */
function normalizePosts(payload: unknown): { posts: InstagramPost[]; skipped: number } {
  const rawEntries = extractRawEntries(payload).map((item) =>
    isRecord(item) && isRecord(item.node) ? item.node : item // GraphQL edges
  );

  const seen = new Set<string>();
  const posts: InstagramPost[] = [];
  let skipped = 0;

  rawEntries.forEach((item, index) => {
    const post = normalizePost(item, index);
    if (!post || seen.has(post.id)) {
      skipped += 1;
      return;
    }
    seen.add(post.id);
    posts.push(post);
  });

  // Terbaru ke terlama. Entri tanpa tanggal tetap ditampilkan, ditaruh paling akhir.
  return {
    posts: posts.sort((a, b) => {
      const timeA = a.timestamp ? Date.parse(a.timestamp) : Number.NaN;
      const timeB = b.timestamp ? Date.parse(b.timestamp) : Number.NaN;
      const validA = Number.isNaN(timeA) ? -Infinity : timeA;
      const validB = Number.isNaN(timeB) ? -Infinity : timeB;
      return validB - validA;
    }),
    skipped,
  };
}

/** Petakan ke gambar lokal bila tersedia, agar tidak bergantung URL IG yg kedaluwarsa. */
function resoleLokal(post: InstagramPost): InstagramPost {
  const lokal = LOCAL_MEDIA[post.id];
  if (lokal) return { ...post, media_url: lokal };
  return post;
}

/** Ambil unggahan terbaru dari API SD Taman Muda Jetis. Tidak pernah melempar error. */
export async function getInstagramPosts(): Promise<InstagramFeed> {
  try {
    const res = await fetch(SEKOLAH_IG_API_URL, {
      next: { revalidate: INSTAGRAM_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`API merespons ${res.status} ${res.statusText}`);
    }

    const payload: unknown = await res.json();
    if (isRecord(payload) && payload.success === false) {
      throw new Error(
        asString(payload.error) ?? asString(payload.message) ?? "API mengembalikan status gagal"
      );
    }

    const { posts, skipped } = normalizePosts(payload);
    return { posts: posts.map(resoleLokal), error: null, skipped };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kesalahan tidak diketahui";
    console.error(`[instagram] Gagal mengambil data dari ${SEKOLAH_IG_API_URL}:`, error);
    return {
      posts: [],
      error: `${new URL(SEKOLAH_IG_API_URL).hostname}: ${message}`,
      skipped: 0,
    };
  }
}

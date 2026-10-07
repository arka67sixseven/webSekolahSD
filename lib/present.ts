/**
 * Mengubah `InstagramPost` (data mentah API) menjadi model siap tampil.
 * Dipisah dari komponen agar kartu, filter, dan statistik memakai
 * label yang konsisten.
 */

import type { InstagramPost, InstagramPostType } from "./instagram";
import {
  extractHashtags,
  extractLinks,
  formatCount,
  formatDate,
  formatRelative,
  parseCaption,
  tokensToPlain,
  type CaptionLine,
} from "./format";

export type FilterId = "all" | "photo" | "video" | "article";

export const MEDIA_FILTERS: ReadonlyArray<{ id: FilterId; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "photo", label: "Foto" },
  { id: "video", label: "Video" },
  { id: "article", label: "Berita" },
];

/* ------------------------------------------------------------------ *
 * Kategori
 * ------------------------------------------------------------------ */

export type PostCategory =
  | "Prestasi"
  | "Pengumuman"
  | "Lomba"
  | "Akademik"
  | "Kegiatan"
  | "Berita";

/** Urutan penting: kategori pertama yang cocok menang. */
const CATEGORY_RULES: ReadonlyArray<readonly [PostCategory, RegExp]> = [  ["Pengumuman", /pengumuman|pendaftaran|undangan|rekrutmen|gathering|\bppmb\b|\bspmb\b|\bppdb\b|info ppm|PPTS/i],
  ["Prestasi", /juara|trophy|juaraan|kejuaraan|kejuraan|medali|pembina|prestasi|mengollow|podium/i],
  ["Lomba", /\blomba\b|art fest|\bfest\b|turnamen|kompetisi|karnaval|lombatarikreasi/i],
  [
    "Akademik",    /asesmen|as\w*esen|\bast[sbp]\b|astts|sumatif|ujian|kuis|belajar|pembelajaran|workshop|literasi|numerasi|kombel|komunitas belajar|pelatihan|sosialisasi|geschool|praktikum|materi ajar|tugas/i,
  ],
  [
    "Kegiatan",    /maulid|upacara|perayaan|17 agustus|hut ri|khutbah|ramadhan|pawai|pentas|seni|budaya|fkub|persahabatan|teaching factory|jumat bersih|berkata|memo/i,
  ],
];

/** Warna badge: latar muda + teks gelap, tetap satu keluarga visual. */
const CATEGORY_TONE: Record<PostCategory, string> = {
  Prestasi: "bg-accent-100 text-accent-700",
  Pengumuman: "bg-primary-100 text-primary-700",
  Lomba: "bg-amber-100 text-amber-800",
  Akademik: "bg-emerald-100 text-emerald-800",
  Kegiatan: "bg-earth-100 text-stone-700",
  Berita: "bg-slate-100 text-slate-700",
};

const JUARA_WORDS: Record<string, string> = { satu: "1", dua: "2", tiga: "3", FIRST: "1", SECOND: "2", THIRD: "3" };

function deriveCategory(text: string, type: InstagramPostType): PostCategory {
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(text)) return category;
  }
  return type === "article" ? "Berita" : "Kegiatan";
}

/** "Juara 2" dari "membawa trophy Juara 2 Cokraodiningratan ...". */
function deriveJuara(text: string): string | null {
  const match = text.match(/juara\s*(?:ke[-\s]?)?\s*([123])\b|\bjuara\s+(satu|dua|tiga)\b|\b(1|2|3)(?:st|nd|rd)?\s*juara\b/i);
  if (!match) return null;
  const value = match[1] ?? match[2] ?? match[3];
  if (!value) return null;
  return `Juara ${JUARA_WORDS[value.toLowerCase()] ?? value}`;
}

/* ------------------------------------------------------------------ *
 * Judul otomatis
 * ------------------------------------------------------------------ */

/** Baris yang isinya hanya titik, emoji, atau tanda baca. */
const NOISE_LINE_RE = /^[\s.\u2022\u00b7\-–—*_~"'`#!?…:;,/|()[\]{}]*$/u;
const HASHTAG_ONLY_RE = /^(#[\p{L}\p{N}_]+\s*)+$/u;
// Cakup blok emoji/simbol yang sering muncul di caption Instagram:
//   1F000-1FAFF (emoji) | 2600-27BF (misc+dingbat) | 2B00-2BFF | 2300-23FF (⏰⌚⏱)
//   25A0-25FF (geometris) | 2190-21FF (panah) | 1F1E6-1F1FF (bendera) | 200D/20E3/FE0F (ZJW/VS16)
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{2190}-\u{21FF}\u{2B50}\u{203C}\u{2049}\u{2122}\u{2139}\u{3030}\u{303D}\u{3297}\u{3299}\u{FE0F}\u{200D}\u{20E3}\u{1F1E6}-\u{1F1FF}]/gu;
const GREETING_RE =
  /^(salam\s*(?:dan|&)\s*bahagia|salam\s*dan\s*sejahtera|salam\s*wahid|assalamu'?alaikum|selamat\s+(?:pagi|siang|sore|malam)|halo|hai)\b[\s,!.:;–—-]*/i;
const ALL_CAPS_RE = /^[^a-z]*[A-Z][^a-z]*$/;
/** Baris berlabel ("Hari/Tanggal: Senin, ...") berisi data, bukan judul. */
const FIELD_LINE_RE =
  /^(hari\s*\/?\s*tanggal|tanggal|waktu|tempat|agenda|alamat|contact\s*person|juknis|pendaftaran|hadiah|ketentuan|catatan|biaya|info|rekrutmen)\b\s*[:/]/i;
/** Pembuka kalimat ajakan, bukan judul. */
const SOFT_OPENER_RE =
  /^(selamat|ayo|mari|silakan|yuk|terima\s+kasih|sukses|dernama)\b/i;

/** Bersihkan satu baris menjadi kandidat judul. */
function toTitleCandidate(line: string): string {
  return line
    .replace(EMOJI_RE, " ")
    .replace(/[*_~`]/g, "")
    .replace(GREETING_RE, "")
    .replace(/^[\s,.:;–—-]+/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Skor agar baris yang paling "berasa judul" dipilih, bukan sekadar baris pertama. */
function scoreCandidate(value: string): number {
  const words = value.split(/\s+/).filter(Boolean).length;
  let score = 0;
  if (/\d/.test(value)) score += 3; // tahun atau nomor = informasi paling berguna
  if (words >= 2) score += 2;
  if (value.length >= 15 && value.length <= 60) score += 1;
  if (ALL_CAPS_RE.test(value)) score -= 1; // kapital penuh, biasanya slogan
  if (FIELD_LINE_RE.test(value)) score -= 5; // baris data kegiatan, bukan judul
  if (SOFT_OPENER_RE.test(value)) score -= 2; // kalimat ajakan, bukan judul
  if (/^(good job|ok|thanks|halo)\b/i.test(value)) score -= 4;
  return score;
}

/**
 * Judul otomatis dari caption. Caption Instagram tidak punya judul,
 * jadi diambil baris yang paling cocok dengan skor di atas.
 */
export function deriveTitle(lines: CaptionLine[], max = 72): string {
  const candidates = lines
    .map((line) => line.map((token) => token.value).join("").trim())
    .filter((line) => line !== "" && !NOISE_LINE_RE.test(line))
    .filter((line) => !/^https?:\/\//i.test(line) && !HASHTAG_ONLY_RE.test(line))
    .map(toTitleCandidate)
    .filter((value) => value.length >= 8);

  if (candidates.length === 0) return "Postingan Sekolah";

  const best = candidates.reduce((a, b) => (scoreCandidate(b) > scoreCandidate(a) ? b : a));
  return best.length > max ? `${best.slice(0, max).replace(/\s+\S*$/, "")}…` : best;
}

/* ------------------------------------------------------------------ *
 * Utilitas untuk halaman Berita
 * ------------------------------------------------------------------ */

/** URL polos, dibuang dari teks artikel supaya paragraf tetap bersih. */
const URL_RE = /https?:\/\/\S+/g;

/**
 * Buang URL, hashtag, dan emoji dari satu baris caption.
 * Hasilnya dipakai sebagai paragraf artikel di halaman detail berita.
 */
export function stripDecoration(value: string): string {
  return value
    .replace(URL_RE, " ")
    .replace(HASHTAG_ONLY_RE, " ")
    .replace(EMOJI_RE, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Ubah teks menjadi slug URL: huruf kecil, tanpa tanda baca, tanpa aksen.
 * Dipakai sebagai bagian tautan `/berita/<slug>`.
 */
export function slugify(value: string, max = 70): string {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length === 0) return "berita";
  return slug.length <= max ? slug : slug.slice(0, max).replace(/-[^-]*$/, "");
}

/* ------------------------------------------------------------------ *
 * View model
 * ------------------------------------------------------------------ */

export interface PostView {
  id: string;
  type: InstagramPostType;
  typeLabel: string;
  isVideo: boolean;
  /** Berita sekolah: tanpa tautan Instagram. */
  isArticle: boolean;
  mediaUrl: string;
  videoUrl?: string;
  permalink?: string;
  title: string;
  category: string;
  categoryTone: string;
  captionLines: CaptionLine[];
  /** Ringkasan teks polos, tanpa emoji/markdown, untuk pratinjau & pencarian. */
  preview?: string;
  hashtags: string[];
  links: string[];
  likes?: number;
  comments?: number;
  likesLabel: string;
  commentsLabel: string;
  hasEngagement: boolean;
  dateLabel?: string;
  dateIso?: string;
  datePrefix?: string;
  relativeLabel?: string;
  searchText: string;
}

const TYPE_LABEL: Record<InstagramPostType, string> = {
  image: "Foto",
  carousel: "Karousel",
  video: "Video",
  article: "Berita",
  unknown: "Postingan",
};

export function toPostView(post: InstagramPost, now: number = Date.now()): PostView {
  const captionLines = parseCaption(post.caption);
  const date = formatDate(post.timestamp);
  const hashtags = [
    ...new Set([...(post.hashtags ?? []), ...extractHashtags(post.caption)]),
  ];
  // Tag dari API ikut dipakai untuk kategori & pencarian, bukan hanya teks caption.
  const searchText = [post.caption ?? "", ...hashtags].join(" ");

  const baseCategory = deriveCategory(searchText, post.type);
  const juara = baseCategory === "Prestasi" ? deriveJuara(searchText) : null;

  return {
    id: post.id,
    type: post.type,
    typeLabel: TYPE_LABEL[post.type] ?? "Postingan",
    isVideo: post.is_video,
    isArticle: post.type === "article",
    mediaUrl: post.media_url,
    videoUrl: post.video_url,
    permalink: post.permalink,
    title: deriveTitle(captionLines),
    category: juara ?? baseCategory,
    categoryTone: CATEGORY_TONE[juara ? "Prestasi" : baseCategory],
    captionLines,
    preview: tokensToPlain(captionLines).slice(0, 220) || undefined,
    hashtags,
    links: extractLinks(post.caption),
    likes: post.likes_count,
    comments: post.comments_count,
    likesLabel: formatCount(post.likes_count),
    commentsLabel: formatCount(post.comments_count),
    // Bedakan "belum ada data interaksi" dari "0 suka".
    hasEngagement: post.likes_count !== undefined || post.comments_count !== undefined,
    dateLabel: date?.label,
    dateIso: date?.iso,
    datePrefix: post.type === "article" ? "Diperbarui" : undefined,
    relativeLabel: formatRelative(post.timestamp, now) ?? undefined,
    searchText,
  };
}

export function matchesFilter(view: PostView, filter: FilterId): boolean {
  switch (filter) {
    case "photo":
      return view.type === "image" || view.type === "carousel" || view.type === "unknown";
    case "video":
      return view.isVideo;
    case "article":
      return view.isArticle;
    default:
      return true;
  }
}

export function matchesQuery(view: PostView, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    view.searchText.toLowerCase().includes(q) ||
    view.title.toLowerCase().includes(q) ||
    view.hashtags.some((tag) => tag.toLowerCase().includes(q)) ||
    view.category.toLowerCase().includes(q)
  );
}

export interface FeedStats {
  total: number;
  photos: number;
  videos: number;
  articles: number;
  likes: number;
}

export function computeStats(views: PostView[]): FeedStats {
  return views.reduce<FeedStats>(
    (stats, view) => {
      stats.total += 1;
      if (view.isVideo) stats.videos += 1;
      else if (view.isArticle) stats.articles += 1;
      else stats.photos += 1;
      stats.likes += view.likes ?? 0;
      return stats;
    },
    { total: 0, photos: 0, videos: 0, articles: 0, likes: 0 }
  );
}

/** Chip filter kategori, diurutkan berdasarkan jumlah lalu nama. */
export function buildCategories(views: PostView[]): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const view of views) {
    counts.set(view.category, (counts.get(view.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "id"));
}


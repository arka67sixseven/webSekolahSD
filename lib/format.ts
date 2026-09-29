/**
 * Utilitas format & parse caption Instagram.
 *
 * Caption Instagram dari scraper mengandung:
 *  - baris baru yang tidak konstan ("Salam dan Bahagia,.\n.\n."),
 *  - markdown sederhana: *tebal* dan _miring_,
 *  - URL polos (formulir pendaftaran, tautan artikel) tanpa format link,
 *  - hashtag di baris terakhir.
 */

export type CaptionTokenType = "text" | "bold" | "italic" | "link";

export interface CaptionToken {
  type: CaptionTokenType;
  value: string;
  /** Hanya untuk type "link". */
  href?: string;
}

export type CaptionLine = CaptionToken[];

const URL_RE = /https?:\/\/[^\s<>()[\]{}"']+/g;
const EMPHASIS_RE = /(\*[^*\n]+\*|_[^_\n]+_)/g;
const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu;

/** Zona waktu sekolah (WIB). Server produksi berjalan di UTC. */
export const SCHOOL_TIME_ZONE = "Asia/Jakarta";

/** Hanya izinkan URL http/https agar payload mencurigakan tidak jadi tautan. */
const toSafeUrl = (value: string): string | undefined =>
  /^https?:\/\//i.test(value) ? value : undefined;

/** Pecah satu baris menjadi token, sambilialize tautan & markdown. */
function parseInline(raw: string): CaptionLine {
  const tokens: CaptionToken[] = [];

  const pushText = (text: string) => {
    if (!text) return;
    for (const part of text.split(EMPHASIS_RE)) {
      if (!part) continue;
      if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
        tokens.push({ type: "bold", value: part.slice(1, -1) });
      } else if (part.length > 2 && part.startsWith("_") && part.endsWith("_")) {
        tokens.push({ type: "italic", value: part.slice(1, -1) });
      } else {
        tokens.push({ type: "text", value: part });
      }
    }
  };

  let cursor = 0;
  for (const match of raw.matchAll(URL_RE)) {
    const start = match.index ?? 0;
    const rawUrl = match[0];
    // Buang tanda baca di ujung supaya "lihat situs." tidak jadi URL menyesatkan.
    const url = rawUrl.replace(/[.,;:!?]+$/, "");

    if (start > cursor) pushText(raw.slice(cursor, start));
    const href = toSafeUrl(url);
    if (href) tokens.push({ type: "link", value: href, href });
    cursor = start + rawUrl.length;
  }
  if (cursor < raw.length) pushText(raw.slice(cursor));

  return tokens;
}

/** Pecah caption penuh menjadi baris-baris token; baris kosong dibuang. */
export function parseCaption(caption?: string): CaptionLine[] {
  if (!caption) return [];
  return caption
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => parseInline(line.trim()))
    .filter((line) => line.some((token) => token.value.trim() !== "" || token.type === "link"));
}

/** Gabungkan token kembali menjadi teks biasa (untuk alt text, title, pencarian). */
export function tokensToPlain(lines: CaptionLine[]): string {
  return lines
    .map((line) => line.map((token) => token.value).join(""))
    .filter(Boolean)
    .join(" ");
}

/** Caption satu baris tanpa baris baru & spasi berlebih. */
export function plainText(caption?: string): string | undefined {
  const text = caption?.replace(/\s+/g, " ").trim();
  return text ? text : undefined;
}

/** Potong di batas kata, bukan di tengah kata, untuk label aksesibel. */
export function excerpt(value: string, max = 80): string {
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Baris pertama yang bukan cuma URL, dipakai sebagai ringkasan kartu. */
export function previewText(lines: CaptionLine[], max = 180): string | undefined {
  const meaningful = lines.find((line) =>
    line.some((token) => token.type !== "link" && token.value.trim() !== "")
  );
  const text = meaningful?.map((token) => token.value).join("").trim();
  if (!text) return undefined;
  return text.length > max ? `${excerpt(text, max)}` : text;
}

/** Semua hashtag unik dari caption, tanpa tanda "#". */
export function extractHashtags(caption?: string): string[] {
  if (!caption) return [];
  const seen = new Set<string>();
  for (const match of caption.matchAll(HASHTAG_RE)) {
    seen.add(match[0].slice(1));
  }
  return [...seen];
}

/** Semua URL polos di dalam caption, unik dan tetap berurutan. */
export function extractLinks(caption?: string): string[] {
  if (!caption) return [];
  const seen = new Set<string>();
  for (const match of caption.matchAll(URL_RE)) {
    const href = toSafeUrl(match[0].replace(/[.,;:!?]+$/, ""));
    if (href) seen.add(href);
  }
  return [...seen];
}

export function formatCount(value?: number): string {
  if (value === undefined) return "0";
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value?: string): { label: string; iso: string } | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    label: date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: SCHOOL_TIME_ZONE,
    }),
    iso: date.toISOString(),
  };
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/** "3 jam lalu", "2 hari lalu", dst. Dihitung di WIB agar konsisten dengan tanggal. */
export function formatRelative(value?: string, now: number = Date.now()): string | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;

  const formatter = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
  const diff = time - now;
  const absDiff = Math.abs(diff);

  if (absDiff < 60 * 1000) return "baru saja";
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (absDiff >= ms) return formatter.format(Math.round(diff / ms), unit);
  }
  return formatter.format(Math.round(diff / (60 * 1000)), "minute");
}

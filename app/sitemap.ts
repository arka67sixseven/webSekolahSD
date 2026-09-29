import type { MetadataRoute } from "next";
import { getBerita } from "@/lib/berita";
import { SITE_URL } from "@/lib/school";

/** Data di-refresh tiap jam, sama seperti halaman berita. */
export const revalidate = 3600;

/**
 * Peta situs untuk mesin pencari.
 * Halaman berita diambil dari sumber data, jadi ikut masuk otomatis.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statis: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/profil`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ekstrakurikuler`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/berita`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/ppdb`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/instagram`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];

  const { items } = await getBerita();
  const berita: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${SITE_URL}/berita/${item.slug}`,
    lastModified: item.dateIso ? new Date(item.dateIso) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...statis, ...berita];
}

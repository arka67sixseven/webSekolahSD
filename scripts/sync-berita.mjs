#!/usr/bin/env node
/**
 * Lokalkan thumbnail Instagram ke dalam repo.
 *
 * Masalah yang dipecahkan:
 *   - URL thumbnail Instagram (scontent-*.cdninstagram.com) bermasa berlaku
 *     (parameter `oe`) dan kedaluwarsa dalam hitungan hari.
 *   - Data API bisa basi (scraped lama), jadi semua kartu/galeri jadi tanpa gambar.
 *
 * Cara kerja:
 *   1. Ambil data post dari endpoint API.
 *   2. Unduh tiap thumbnail ke `public/images/berita/<id>.jpg`
 *      (lewati bila sudah ada, kecuali `--force`).
 *   3. Tulis `data/gambar.generated.json` berisi peta `id -> /images/berita/<id>.jpg`
 *      agar lib/instagram.ts memakai gambar lokal alih-alih URL remot yang bisa mati.
 *
 * Jalankan: npm run sync:berita
 */

import { mkdir, writeFile, copyFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const ROOT = new URL("..", import.meta.url).pathname;
const ENDPOINT =
  process.env.BERITA_ENDPOINT ??
  "https://api-ig-ruddy.vercel.app/api/berita/sekolah/sdtamansiswajetis";
const OUT_GAMBAR = join(ROOT, "public/images/berita");
const OUT_PETA = join(ROOT, "data/gambar.generated.json");

const FORCE = process.argv.includes("--force");

/** Unduh byte gambar. IG kadang butuh sidik jari browser pada header. */
async function unduh(url, fileTmp) {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36",
      accept: "image/avif,image/webp,image/jpeg,image/*,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await writeFile(fileTmp, Buffer.from(await res.arrayBuffer()));
}

/** Simpan ke .jpg (konversi via ImageMagick bila ada, salin biasa bila tidak). */
async function simpan(fileTmp, fileAkhir) {
  try {
    await run("magick", [fileTmp, "-strip", "-quality", "80", fileAkhir]);
  } catch {
    try {
      await run("convert", [fileTmp, "-strip", "-quality", "80", fileAkhir]);
    } catch {
      await copyFile(fileTmp, fileAkhir);
    }
  }
  await rm(fileTmp, { force: true });
}

async function main() {
  console.log(`Mengambil data dari ${ENDPOINT} ...`);
  const res = await fetch(ENDPOINT, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Endpoint gagal: HTTP ${res.status}`);

  const payload = await res.json();
  const items = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(items)) throw new Error("Bentuk data tidak dikenali");

  await mkdir(OUT_GAMBAR, { recursive: true });

  const peta = {};
  let sukses = 0;
  let gagal = 0;

  for (const item of items) {
    const id = String(item?.id ?? item?.short_code ?? "");
    const thumb = item?.thumbnail_url ?? item?.media_url ?? item?.image_url;
    if (!id || !thumb || !/^https?:\/\//i.test(thumb)) {
      gagal += 1;
      console.log(`  lewati id=${id || "(kosong)"}: tanpa id/thumbnail`);
      continue;
    }

    const fileAkhir = join(OUT_GAMBAR, `${id}.jpg`);
    const fileTmp = join(OUT_GAMBAR, `tmp-${id}.asli`);

    if (!FORCE && existsSync(fileAkhir)) {
      peta[id] = `/images/berita/${id}.jpg`;
      console.log(`  saja  ${id} (sudah ada)`);
      sukses += 1;
      continue;
    }

    try {
      await unduh(thumb, fileTmp);
      await simpan(fileTmp, fileAkhir);
      peta[id] = `/images/berita/${id}.jpg`;
      console.log(`  unduh ${id} -> /images/berita/${id}.jpg`);
      sukses += 1;
    } catch (error) {
      gagal += 1;
      await rm(fileTmp, { force: true });
      console.log(`  gagal ${id}: ${error.message}`);
    }
  }

  const isi = JSON.stringify(peta, null, 2);
  await mkdir(dirname(OUT_PETA), { recursive: true });
  await writeFile(OUT_PETA, isi, "utf8");

  console.log(`\nSelesai. ${sukses} gambar siap, ${gagal} gagal.`);
  console.log(`Peta gambar: ${OUT_PETA}`);
}

main().catch((error) => {
  console.error("Gagal:", error.message);
  process.exit(1);
});
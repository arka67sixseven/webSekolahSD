"use client";

import { useState, type ImgHTMLAttributes } from "react";

/** Dipakai kalau URL CDN Instagram kedaluwarsa atau gagal dimuat. */
const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#eef2ff"/>
      <path d="M170 190h60v60h-60z" fill="#c7d2fe"/>
      <text x="200" y="290" font-family="system-ui, sans-serif" font-size="20" fill="#6366f1" text-anchor="middle">Gambar tidak tersedia</text>
    </svg>`
  );

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & { src: string };

/**
 * <img> biasa dengan fallback otomatis.
 * Sengaja tidak memakai next/image: host CDN-nya berubah-ubah
 * (cdninstagram.com, fbcdn.net, i.ibb.co.com, ...), sedangkan
 * next/image butuh daftar remotePatterns yang eksplisit.
 */
export function SafeImage({ src, alt, ...rest }: SafeImageProps) {
  // Disimpan per-src, jadi otomatis pulih kalau src berikutnya berubah.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = src === FALLBACK_IMAGE || failedSrc === src;

  return (
    <img
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  );
}

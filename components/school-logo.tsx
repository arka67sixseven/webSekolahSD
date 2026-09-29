/**
 * Logo SD Taman Muda (emblem bulat).
 *
 * Sumber: `public/logo/sd-taman-muda.png` (256x256, latar transparan).
 * Diambil dari situs resmi sekolah: sdtamanmuda.wordpress.com
 *
 * Sengaja memakai `<img>` biasa, bukan `next/image`: berkasnya lokal dan kecil,
 * sehingga optimizer tidak menambah apa pun — hanya memperbesar HTML dengan
 * srcset panjang dan membuat varian 3840px untuk gambar kecil.
 * `width`/`height` tetap ditulis agar tidak terjadi layout shift (CLS).
 *
 * `variant="badge"` memberi latar putih melingkar agar kontras di atas footer
 * yang gelap (outline hitam pada logo akan hilang di atas `bg-primary-950`).
 */
export function SchoolLogo({
  className = "h-11 w-11",
  variant = "mark",
  priority = false,
}: {
  className?: string;
  variant?: "mark" | "badge";
  /** `true` = jangan lazy-load (dipakai untuk logo di header). */
  priority?: boolean;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${
        variant === "badge" ? "rounded-full bg-white p-1 shadow-sm" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/sd-taman-muda.png"
        alt=""
        aria-hidden="true"
        width={256}
        height={256}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={`${className} object-contain`}
      />
    </span>
  );
}

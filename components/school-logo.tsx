/**
 * Logo Perguruan Tamansiswa (lambang tunas dalam lingkaran).
 *
 * Sumber berkas: `public/logo/tamansiswa.png` (141x150, transparan, ~11 KB).
 *
 * Sengaja memakai `<img>` biasa, bukan `next/image`: berkasnya lokal dan kecil,
 * sehingga optimizer tidak menambah apa pun — hanya memperbesar HTML dengan
 * srcset panjang dan membuat varian 3840px untuk gambar 141px.
 * `width`/`height` tetap ditulis agar tidak terjadi layout shift (CLS).
 *
 * `variant="badge"` memberi latar putih melingkar agar kontras di atas footer
 * yang gelap (outline hitam logo akan hilang di atas `bg-primary-950`).
 */
export function SchoolLogo({
  className = "h-11 w-auto",
  variant = "mark",
  priority = false,
}: {
  className?: string;
  variant?: "mark" | "badge";
  /**true` = jangan lazy-load (dipakai untuk logo di header). */
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
        src="/logo/tamansiswa.png"
        alt=""
        aria-hidden="true"
        width={141}
        height={150}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={`${className} object-contain`}
      />
    </span>
  );
}

/**
 * Logo sekolah berupa monogram SVG (tanpa aset gambar) supaya tidak
 * bergantung pada berkas yang belum ada. Ganti dengan <img> bila
 * logo resmi sudah tersedia.
 */
export function SchoolLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span
      className={`flex ${className} shrink-0 items-center justify-center rounded-xl bg-primary-800 shadow-sm ring-1 ring-primary-900/20`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="h-full w-full" role="presentation">
        <rect width="40" height="40" rx="10" fill="#214b35" />
        <path d="M20 9c-4 2.6-6.4 6-6.4 9.6 0 1.5.5 2.9 1.3 4.1" stroke="#ecc24a" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M20 9c4 2.6 6.4 6 6.4 9.6 0 1.5-.5 2.9-1.3 4.1" stroke="#bce0c9" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M20 9v22" stroke="#f9ecbf" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 31h18" stroke="#bce0c9" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

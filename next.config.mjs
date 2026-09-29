/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Galeri memuat media dari beberapa host (CDN Instagram, imgbb, dll).
    // Catatan: komponen galeri sengaja memakai <img> biasa agar host baru
    // dari scraper tetap bisa tampil tanpa harus mengubah daftar ini.
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "i.ibb.co.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
};

export default nextConfig;

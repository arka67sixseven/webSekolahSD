import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "SD Taman Muda Jetis — Galeri Kegiatan Sekolah",
    template: "%s | SD Taman Muda Jetis",
  },
  description:
    "Website SD Taman Muda Jetis. Galeri kegiatan, prestasi, dan informasi terbaru sekolah.",
  openGraph: {
    title: "SD Taman Muda Jetis",
    description: "Galeri kegiatan, prestasi, dan informasi terbaru sekolah.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="flex min-h-screen flex-col bg-mist font-sans text-ink antialiased">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary-700 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader />
        <div id="konten" className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}

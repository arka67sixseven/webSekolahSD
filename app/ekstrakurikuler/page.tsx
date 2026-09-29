import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ClockIcon } from "@/components/icons";
import { EXTRACURRICULAR, EXTRACURRICULAR_TONES, SCHOOL } from "@/lib/school";

export const metadata: Metadata = {
  title: "Ekstrakurikuler",
  description:
    "Daftar kegiatan ekstrakurikuler SD Taman Muda Jetis: Pramuka, Paskibra, PMR, Tahfidz, olahraga, klub komputer, dan seni.",
};

export default function EkstrakurikulerPage() {
  return (
    <main>
      <PageHero
        breadcrumb="Ekstrakurikuler"
        eyebrow="Pengembangan Diri"
        title="Ekstrakurikuler"
        description="Wadah bagi siswa untuk menemukan minat, bakat, dan tumbuh di luar kelas."
      />

      <section className="bg-mist py-20 sm:py-24">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EXTRACURRICULAR.map((item) => (
              <article
                key={item.name}
                className="group flex flex-col rounded-2xl border border-primary-100 bg-white p-6 transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-lift"
              >
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    EXTRACURRICULAR_TONES[item.category]
                  }`}
                >
                  {item.category}
                </span>

                <h2 className="mt-4 font-display text-xl font-bold leading-snug text-primary-900">
                  {item.name}
                </h2>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>

                <p className="mt-5 flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-2.5 text-sm font-medium text-primary-800">
                  <ClockIcon className="h-4 w-4 shrink-0" />
                  {item.schedule}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-ink-soft">
            Jadwal dapat berubah sewaktu-waktu. Hubungi{" "}
            <a href={SCHOOL.phoneHref} className="font-semibold text-primary-700 underline underline-offset-2">
              {SCHOOL.phone}
            </a>{" "}
            untuk informasi terbaru.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-2xl font-bold text-primary-900 sm:text-3xl">
            Tertarik bergabung?
          </h2>
          <p className="max-w-xl text-ink-soft">
            Pendaftaran ekstrakurikuler dibuka pada awal tahun ajaran. Datang ke sekolah
            atau hubungi wali kelas untuk informasi lebih lanjut.
          </p>
          <Link href="/kontak" className="btn-primary">
            Hubungi sekolah
          </Link>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { FacilityIcon, ArrowRightIcon } from "@/components/icons";
import { FACILITIES, HISTORY, MISSIONS, PPDB, SCHOOL, VISION } from "@/lib/school";

export const metadata: Metadata = {
  title: "Profil Sekolah",
  description:
    "Sejarah, visi, misi, dan fasilitas SD Taman Muda Jetis, sekolah dasar di Jetis, Yogyakarta.",
};

export default function ProfilPage() {
  return (
    <main>
      <PageHero
        breadcrumb="Profil"
        eyebrow="Tentang Kami"
        title="Profil Sekolah"
        description={`Mengenal lebih dekat sejarah, visi, misi, dan fasilitas pendidikan yang kami sediakan. ${SCHOOL.tagline}`}
      />

      {/* ---------------- Visi & Misi ---------------- */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl bg-primary-800 p-8 text-white shadow-lift md:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative">
                <p className="eyebrow">Visi</p>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                  Visi Sekolah
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-primary-100">
                  {VISION}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-primary-100 bg-white p-8 md:p-10">
              <p className="eyebrow">Misi</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary-900 sm:text-3xl">
                Misi Sekolah
              </h2>
              <ul className="mt-5 space-y-3 text-ink-soft">
                {MISSIONS.map((mission) => (
                  <li key={mission} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-400"
                    />
                    <span className="leading-relaxed">{mission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Sejarah ---------------- */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-page">
          <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-10">
            <div>
              <p className="eyebrow">Sejarah</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">
                Sejarah Singkat
              </h2>
            </div>
            <div className="lg:col-span-2">
              <p className="border-l-4 border-primary-600 pl-5 text-lg leading-relaxed text-ink-soft">
                {HISTORY}
              </p>

              <dl className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-primary-100 bg-mist p-5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Tahun Berdiri
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-primary-800">
                    1995
                  </dd>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-mist p-5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Akreditasi
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-primary-800">
                    A
                  </dd>
                </div>
                <div className="rounded-2xl border border-primary-100 bg-mist p-5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    NPSN
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-primary-800">
                    {SCHOOL.npsn}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Fasilitas ---------------- */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Sarana"
            title="Fasilitas Sekolah"
            description="Sarana dan prasarana yang mendukung kegiatan belajar siswa."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((facility) => (
              <div
                key={facility.name}
                className="group rounded-2xl border border-primary-100 bg-white p-6 transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-lift"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white">
                  <FacilityIcon name={facility.icon} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-primary-900">
                  {facility.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA PPDB ---------------- */}
      {PPDB.isOpen && (
        <section className="bg-gradient-to-r from-primary-800 to-primary-700 py-16">
          <div className="container-page flex flex-col items-center gap-6 text-center">
            <h2 className="max-w-2xl font-display text-3xl font-bold text-white text-balance">
              Tertarik mendaftar?
            </h2>
            <p className="max-w-xl text-primary-100">
              Lihat alur, syarat, dan jadwal pendaftaran siswa baru {PPDB.period}.
            </p>
            <Link href="/ppdb" className="inline-flex items-center gap-2 rounded-full bg-accent-400 px-5 py-2.5 text-sm font-semibold text-primary-950 transition hover:bg-accent-300 active:scale-[0.98]">
              Cek syarat pendaftaran
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

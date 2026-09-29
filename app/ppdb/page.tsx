import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CheckIcon, ClockIcon } from "@/components/icons";
import { PPDBForm } from "./ppdb-form";
import { PPDB, PPDB_REQUIREMENTS, PPDB_SCHEDULE, PPDB_STEPS, SCHOOL } from "@/lib/school";

export const metadata: Metadata = {
  title: "PPDB",
  description:
    "Informasi alur, syarat, dan jadwal pendaftaran peserta didik baru SD Taman Muda Jetis.",
};

export default function PPDBPage() {
  return (
    <main>
      <PageHero
        breadcrumb="PPDB"
        eyebrow={PPDB.period}
        title="Penerimaan Peserta Didik Baru"
        description="Lihat alur, syarat, dan jadwal pendaftaran siswa baru di SD Taman Muda Jetis."
      >
        {PPDB.isOpen && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent-300 ring-1 ring-white/15">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Pendaftaran sedang dibuka
          </p>
        )}
      </PageHero>

      {/* ---------------- Alur & jadwal ---------------- */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="eyebrow">Alur</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary-900 sm:text-3xl">
                Tahapan Pendaftaran
              </h2>

              <ol className="mt-8 space-y-6">
                {PPDB_STEPS.map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-700 font-display text-base font-bold text-white"
                    >
                      {item.step}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-display text-lg font-bold text-primary-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="eyebrow">Jadwal</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary-900 sm:text-3xl">
                Jadwal PPDB
              </h2>

              <dl className="mt-8 space-y-3">
                {PPDB_SCHEDULE.map((row) => (
                  <div
                    key={row.stage}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-100 bg-white px-5 py-4"
                  >
                    <dt className="flex items-center gap-2 text-sm font-semibold text-primary-900">
                      <ClockIcon className="h-4 w-4 shrink-0 text-primary-600" />
                      {row.stage}
                    </dt>
                    <dd className="text-sm text-ink-soft">{row.date}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Kuota {(PPDB.quota).toLocaleString("id-ID")} peserta
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {PPDB.contactNote} Untuk pendaftaran langsung, hubungi{" "}
                  <a
                    href={SCHOOL.phoneHref}
                    className="font-semibold text-primary-700 underline underline-offset-2"
                  >
                    {SCHOOL.phone}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Syarat ---------------- */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Persyaratan</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-primary-900 sm:text-3xl">
              Berkas yang Dibutuhkan
            </h2>
            <p className="mt-3 text-ink-soft">
              Siapkan berkas berikut sebelum datang ke sekolah.
            </p>
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {PPDB_REQUIREMENTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-mist px-5 py-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className="text-sm leading-relaxed text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Formulir ---------------- */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <p className="eyebrow">Formulir</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary-900 sm:text-3xl">
                Kirim Data Minat Pendaftaran
              </h2>
              <p className="mt-3 text-ink-soft">
                Pendaftaran tetap dilakukan langsung di sekolah. Formulir ini membantu
                panitia menyiapkan data calon siswa.
              </p>
            </div>

            <PPDBForm />
          </div>
        </div>
      </section>
    </main>
  );
}

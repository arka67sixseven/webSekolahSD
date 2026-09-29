import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import {
  ArrowRightIcon,
  ClockIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PinIcon,
} from "@/components/icons";
import { PPDB, SCHOOL, SCHOOL_HOURS, SCHOOL_MAPS } from "@/lib/school";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Alamat, telepon, email, dan peta lokasi SD Taman Muda Jetis di Jetis, Yogyakarta.",
};

export default function KontakPage() {
  const addressText = SCHOOL.addressLines.join(", ");

  return (
    <main>
      <PageHero
        breadcrumb="Kontak"
        eyebrow="Hubungi Kami"
        title="Hubungi Kami"
        description="Punya pertanyaan seputar sekolah atau pendaftaran? Hubungi kami atau kunjungi langsung."
      />

      {/* ---------------- Kartu kontak ---------------- */}
      <section className="bg-mist py-16 sm:py-20">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ContactCard icon={<PinIcon />} title="Alamat">
              <address className="not-italic leading-relaxed">
                {SCHOOL.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a
                href={SCHOOL_MAPS.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-600"
              >
                Buka di Google Maps
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </a>
            </ContactCard>

            <ContactCard icon={<PhoneIcon />} title="Telepon">
              <a
                href={SCHOOL.phoneHref}
                className="font-display text-xl font-bold text-primary-900 transition hover:text-primary-700"
              >
                {SCHOOL.phone}
              </a>
              <p className="mt-2 text-sm text-ink-soft">Senin – Sabtu, jam kerja</p>
              <a
                href={SCHOOL.phoneHref}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-600"
              >
                Hubungi sekarang
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </a>
            </ContactCard>

            <ContactCard icon={<MailIcon />} title="Email">
              <a
                href={`mailto:${SCHOOL.email}`}
                className="break-all font-display text-base font-bold text-primary-900 transition hover:text-primary-700"
              >
                {SCHOOL.email}
              </a>
              <p className="mt-2 text-sm text-ink-soft">Balasan dalam 1x24 jam kerja</p>
            </ContactCard>

            <ContactCard icon={<InstagramIcon />} title="Instagram">
              <a
                href={SCHOOL.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-base font-bold text-primary-900 transition hover:text-primary-700"
              >
                {SCHOOL.instagram}
              </a>
              <p className="mt-2 text-sm text-ink-soft">Ikuti keseharian sekolah</p>
              <a
                href={SCHOOL.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-600"
              >
                Buka Instagram
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </a>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* ---------------- Peta & jam layanan ---------------- */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-page">
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="eyebrow">Lokasi</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary-900 sm:text-3xl">
                Kunjungi sekolah
              </h2>
              <p className="mt-3 max-w-xl text-ink-soft">
                Kami berada di kawasan Jetis, Kota Yogyakarta. Silakan datang pada jam
                layanan.
              </p>

              <div className="mt-6 overflow-hidden rounded-3xl border border-primary-100">
                <iframe
                  src={SCHOOL_MAPS.embed}
                  title={`Lokasi ${SCHOOL.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[22rem] w-full sm:h-[26rem]"
                />
              </div>

              <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                {addressText}
              </p>
            </div>

            <div>
              <p className="eyebrow">Jam Layanan</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary-900 sm:text-3xl">
                Jam sekolah
              </h2>

              <dl className="mt-6 space-y-3">
                {SCHOOL_HOURS.map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-primary-100 bg-mist px-5 py-4"
                  >
                    <dt className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                      <ClockIcon className="h-4 w-4 shrink-0 text-primary-600" />
                      {row.day}
                    </dt>
                    <dd className="text-sm font-semibold text-primary-900">{row.time}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-primary-900">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  NPSN {SCHOOL.npsn}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {PPDB.contactNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      {PPDB.isOpen && (
        <section className="bg-gradient-to-r from-primary-800 to-primary-700 py-16">
          <div className="container-page flex flex-col items-center gap-6 text-center">
            <h2 className="max-w-2xl font-display text-3xl font-bold text-white text-balance">
              Tertarik mendaftar?
            </h2>
            <p className="max-w-xl text-primary-100">
              Lihat alur, syarat, dan jadwal pendaftaran siswa baru.
            </p>
            <Link
              href="/ppdb"
              className="inline-flex items-center gap-2 rounded-full bg-accent-400 px-5 py-2.5 text-sm font-semibold text-primary-950 transition hover:bg-accent-300 active:scale-[0.98]"
            >
              Cek syarat pendaftaran
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function ContactCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-primary-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lift">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        {icon}
      </span>
      <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">
        {title}
      </h2>
      <div className="mt-2 text-sm text-ink-soft">{children}</div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";

/**
 * Formulir minat pendaftaran PPDB.
 *
 * CATATAN: ini masih DEMO. Data belum dikirim ke mana pun — hanya tampil
 * pesan konfirmasi. Untuk menyimpan data sungguhan, kirim `handleSubmit`
 * ke route API atau layanan email/WhatsApp.
 */

interface FormData {
  nama: string;
  nisn: string;
  asalSekolah: string;
  whatsapp: string;
  catatan: string;
}

const EMPTY: FormData = { nama: "", nisn: "", asalSekolah: "", whatsapp: "", catatan: "" };

type Errors = Partial<Record<keyof FormData, string>>;

/** Gaya bersama antar-field, diletakkan di modul agar bisa dipakai `Field` juga. */
const FIELD_CLASS =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink transition outline-none placeholder:text-ink-soft/60 focus:border-primary-500 focus:ring-2 focus:ring-primary-200";
const LABEL_CLASS = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft";
const ERROR_CLASS = "border-red-400 focus:border-red-500 focus:ring-red-100";

/** Nomor Indonesia: 08xx / +62xx, isi spasi dan tanda baca yang sering diketik. */
const WA_RE = /^(?:\+?62|0)8[1-9][0-9]{6,10}$/;
const NISN_RE = /^\d{10}$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (data.nama.trim().length < 3) errors.nama = "Nama lengkap siswa wajib diisi.";
  if (!NISN_RE.test(data.nisn.trim()))
    errors.nisn = "NISN terdiri dari 10 digit angka.";
  if (data.asalSekolah.trim().length < 2) errors.asalSekolah = "Asal sekolah wajib diisi.";
  if (!WA_RE.test(data.whatsapp.replace(/[\s-]/g, "")))
    errors.whatsapp = "Masukkan nomor WhatsApp yang valid, mis. 081234567890.";
  return errors;
}

export function PPDBForm() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    // Hapus pesan error begitu pengguna memperbaiki isiannya.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length === 0) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-emerald-900">
          Pendaftaran Berhasil Dikirim
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-emerald-800">
          Terima kasih. Data <strong>{data.nama}</strong> sudah tercatat. Panitia PPDB
          akan menghubungi orang tua melalui nomor WhatsApp yang diisi.
        </p>
        <button
          type="button"
          onClick={() => {
            setData(EMPTY);
            setErrors({});
            setSubmitted(false);
          }}
          className="mt-6 text-sm font-semibold text-emerald-800 underline underline-offset-4 transition hover:text-emerald-900"
        >
          Isi formulir lagi
        </button>
      </div>
    );
  }

  const errorClass = ERROR_CLASS;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-primary-100 bg-white p-6 shadow-card sm:p-8"
    >
      <h2 className="font-display text-xl font-bold text-primary-900">
        Formulir Minat Pendaftaran
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        Isi data berikut agar panitia dapat menghubungi orang tua. Semua kolom wajib
        diisi.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field
          id="nama"
          label="Nama Lengkap Siswa"
          error={errors.nama}
          className="sm:col-span-2"
        >
          <input
            id="nama"
            name="nama"
            type="text"
            autoComplete="name"
            placeholder="Sesuai akta kelahiran"
            value={data.nama}
            onChange={(event) => update("nama", event.target.value)}
            aria-invalid={Boolean(errors.nama)}
            aria-describedby={errors.nama ? "nama-error" : undefined}
            className={`${FIELD_CLASS} ${errors.nama ? errorClass : "border-primary-200"}`}
          />
        </Field>

        <Field id="nisn" label="NISN" hint="10 digit" error={errors.nisn}>
          <input
            id="nisn"
            name="nisn"
            type="text"
            inputMode="numeric"
            placeholder="Nomor Induk Siswa Nasional"
            value={data.nisn}
            onChange={(event) => update("nisn", event.target.value.replace(/\D/g, "").slice(0, 10))}
            aria-invalid={Boolean(errors.nisn)}
            aria-describedby={errors.nisn ? "nisn-error" : undefined}
            className={`${FIELD_CLASS} ${errors.nisn ? errorClass : "border-primary-200"}`}
          />
        </Field>

        <Field id="asal" label="Asal Sekolah" error={errors.asalSekolah}>
          <input
            id="asal"
            name="asalSekolah"
            type="text"
            placeholder="Nama SD/MI asal"
            value={data.asalSekolah}
            onChange={(event) => update("asalSekolah", event.target.value)}
            aria-invalid={Boolean(errors.asalSekolah)}
            aria-describedby={errors.asalSekolah ? "asal-error" : undefined}
            className={`${FIELD_CLASS} ${errors.asalSekolah ? errorClass : "border-primary-200"}`}
          />
        </Field>

        <Field
          id="whatsapp"
          label="No. WhatsApp Orang Tua"
          error={errors.whatsapp}
          className="sm:col-span-2"
        >
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="081234567890"
            value={data.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            className={`${FIELD_CLASS} ${errors.whatsapp ? errorClass : "border-primary-200"}`}
          />
        </Field>

        <Field id="catatan" label="Catatan" hint="Opsional" className="sm:col-span-2">
          <textarea
            id="catatan"
            name="catatan"
            rows={3}
            placeholder="Prestasi, kebutuhan khusus, atau hal lain yang perlu kami ketahui."
            value={data.catatan}
            onChange={(event) => update("catatan", event.target.value)}
            className={`${FIELD_CLASS} resize-y border-primary-200`}
          />
        </Field>
      </div>

      <button type="submit" className="btn-primary mt-7 w-full py-3">
        Kirim Data Pendaftaran
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
        Dengan mengirim formulir ini, orang tua menyetujui data kontak di atas
        digunakan oleh panitia PPDB sekolah.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {hint && <span className="ml-1 font-normal normal-case text-ink-soft/70">({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

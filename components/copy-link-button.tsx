"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "./icons";

/**
 * Tombol "Salin tautan" untuk halaman detail berita.
 * Clipboard API hanya tersedia di browser, jadi ini harus client component.
 */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  // Kembalikan label ke semula bila belum diklik dalam 2 detik.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard ditolak (mis. tanpa HTTPS) — pakai cara manual.
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }
    setCopied(true);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn-ghost"
      aria-live="polite"
    >
      {copied ? (
        <>
          <CheckIcon />
          Tautan tersalin
        </>
      ) : (
        "Salin tautan"
      )}
    </button>
  );
}

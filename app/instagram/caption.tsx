import type { CaptionLine } from "@/lib/format";

/** Baris yang isinya hanya URL tidak informatif untuk ringkasan kartu. */
const isMeaningful = (line: CaptionLine) =>
  line.some((token) => token.type !== "link" && token.value.trim() !== "");

interface CaptionProps {
  lines: CaptionLine[];
  className?: string;
  /** Batasi jumlah baris yang dirender ( kartu ringkas ). */
  maxLines?: number;
}

/**
 * Render caption Instagram dengan dukungan markdown sederhana
 * (*tebal*, _miring_) dan tautan polos.
 */
export function Caption({ lines, className, maxLines }: CaptionProps) {
  const meaningful = lines.filter(isMeaningful);
  const visible = maxLines
    ? (meaningful.length > 0 ? meaningful : lines).slice(0, maxLines)
    : lines;

  if (visible.length === 0) return null;

  return (
    <p className={className}>
      {visible.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.map((token, tokenIndex) => {
            const key = `${lineIndex}-${tokenIndex}`;
            switch (token.type) {
              case "bold":
                return (
                  <strong key={key} className="font-semibold text-gray-900">
                    {token.value}
                  </strong>
                );
              case "italic":
                return (
                  <em key={key} className="italic">
                    {token.value}
                  </em>
                );
              case "link":
                return (
                  <a
                    key={key}
                    href={token.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary-700 underline decoration-primary-300 underline-offset-2 transition hover:text-primary-600 break-all"
                  >
                    {token.value}
                  </a>
                );
              default:
                return <span key={key}>{token.value}</span>;
            }
          })}
        </span>
      ))}
    </p>
  );
}

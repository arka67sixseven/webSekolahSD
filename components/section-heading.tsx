export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  invert = false,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  invert?: boolean;
  action?: React.ReactNode;
}) {
  const alignment = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left";

  return (
    <div className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${alignment} ${align === "center" ? "" : "sm:mx-0"}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2
          className={`mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl ${
            invert ? "text-white" : "text-primary-900"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-3 text-base leading-relaxed ${invert ? "text-primary-200" : "text-ink-soft"}`}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--secondary)]">
        {title}
      </p>
      <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-[var(--secondary)]">{hint}</p>
      ) : null}
    </div>
  );
}
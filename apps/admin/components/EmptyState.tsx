export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
      <h3 className="text-lg font-bold text-[var(--foreground)]">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-[var(--secondary)]">{description}</p>
      ) : null}
    </div>
  );
}
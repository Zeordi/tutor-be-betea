export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--secondary)]">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
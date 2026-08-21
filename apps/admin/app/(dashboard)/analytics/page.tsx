export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Analytics & Reports
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Platform performance, revenue and growth metrics
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 h-64 flex items-center justify-center">
          <p className="text-[var(--secondary)]">Revenue Chart</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 h-64 flex items-center justify-center">
          <p className="text-[var(--secondary)]">User Growth Chart</p>
        </div>
      </div>
    </div>
  );
}

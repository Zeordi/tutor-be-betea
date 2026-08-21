export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Executive Dashboard
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Overview of platform performance
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--secondary)]">Total Parents</p>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--secondary)]">Verified Tutors</p>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--secondary)]">Active Contracts</p>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--secondary)]">Pending Verifications</p>
          <p className="mt-2 text-3xl font-bold text-[var(--warning)]">—</p>
        </div>
      </div>

      {/* TODO: Charts, recent activity, revenue summary */}
    </div>
  );
}

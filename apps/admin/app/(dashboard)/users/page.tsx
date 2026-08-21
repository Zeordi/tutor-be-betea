export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Users</h1>
      <p className="mt-1 text-[var(--secondary)]">
        Manage Parents, Teachers and Support Agents
      </p>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="p-6">
          {/* TODO: Filters + Search + Users table */}
          <p className="text-[var(--secondary)]">Users table will appear here</p>
        </div>
      </div>
    </div>
  );
}

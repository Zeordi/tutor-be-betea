export default function TicketsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Support Tickets
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Handle disputes, replacements and user reports
      </p>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {/* TODO: Tickets table */}
        <p className="text-[var(--secondary)]">Support tickets will appear here</p>
      </div>
    </div>
  );
}

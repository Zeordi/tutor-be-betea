export default function ContractsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Contracts & Escrow
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Monitor active contracts and escrow balances
      </p>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {/* TODO: Contracts table */}
        <p className="text-[var(--secondary)]">Contracts data will appear here</p>
      </div>
    </div>
  );
}

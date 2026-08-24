"use client";

export default function ParentWalletPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-[var(--secondary)] mb-8">
          Track payments, escrow holds, and transaction history.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="card">
            <div className="text-sm text-[var(--secondary)] mb-2">Available Balance</div>
            <div className="text-3xl font-bold text-[var(--primary)]">ETB 0.00</div>
          </div>
          <div className="card">
            <div className="text-sm text-[var(--secondary)] mb-2">In Escrow</div>
            <div className="text-3xl font-bold">ETB 0.00</div>
          </div>
          <div className="card">
            <div className="text-sm text-[var(--secondary)] mb-2">Total Spent</div>
            <div className="text-3xl font-bold">ETB 0.00</div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-lg mb-2">Recent Transactions</h3>
          <p className="text-[var(--secondary)]">
            No transactions yet. Escrow payments will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}
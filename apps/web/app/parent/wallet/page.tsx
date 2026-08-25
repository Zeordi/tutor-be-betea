"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type WalletData = {
  availableBalance?: number;
  escrowBalance?: number;
  totalSpent?: number;
  transactions?: Array<{
    id: string;
    type: string;
    amount: number;
    createdAt: string;
  }>;
};

export default function ParentWalletPage() {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // Preferred endpoint
        const result = await apiFetch<WalletData>("/payments/wallet");
        setData(result);
      } catch {
        // Fallback if endpoint not ready
        setData({
          availableBalance: 0,
          escrowBalance: 0,
          totalSpent: 0,
          transactions: [],
        });
        setError("Wallet service is not fully connected yet.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-[var(--secondary)]">Loading wallet...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Wallet</h1>
      <p className="text-[var(--secondary)] mb-8">
        Track payments, escrow holds, and transaction history.
      </p>

      {error && (
        <div className="card mb-5 text-sm text-[var(--secondary)]">{error}</div>
      )}

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="card">
          <div className="text-sm text-[var(--secondary)] mb-2">Available Balance</div>
          <div className="text-3xl font-bold text-[var(--primary)]">
            ETB {Number(data?.availableBalance || 0).toFixed(2)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-[var(--secondary)] mb-2">In Escrow</div>
          <div className="text-3xl font-bold">
            ETB {Number(data?.escrowBalance || 0).toFixed(2)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-[var(--secondary)] mb-2">Total Spent</div>
          <div className="text-3xl font-bold">
            ETB {Number(data?.totalSpent || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-lg mb-3">Recent Transactions</h3>
        {!data?.transactions?.length ? (
          <p className="text-[var(--secondary)]">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {data.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <div className="font-semibold">{tx.type}</div>
                  <div className="text-sm text-[var(--secondary)]">
                    {new Date(tx.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="font-bold">ETB {Number(tx.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
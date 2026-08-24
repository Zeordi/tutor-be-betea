"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type EarningsData = {
  availableBalance?: number;
  pendingEscrow?: number;
  totalEarned?: number;
  payouts?: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
};

export default function TeacherEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch<EarningsData>("/payments/earnings");
        setData(result);
      } catch {
        setData({
          availableBalance: 0,
          pendingEscrow: 0,
          totalEarned: 0,
          payouts: [],
        });
        setError("Earnings service is not fully connected yet.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-[var(--secondary)]">Loading earnings...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Earnings</h1>
      <p className="text-[var(--secondary)] mb-8">
        Track your balance, escrow releases, and payout history.
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
          <div className="text-sm text-[var(--secondary)] mb-2">Pending Escrow</div>
          <div className="text-3xl font-bold">
            ETB {Number(data?.pendingEscrow || 0).toFixed(2)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-[var(--secondary)] mb-2">Total Earned</div>
          <div className="text-3xl font-bold">
            ETB {Number(data?.totalEarned || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-lg mb-3">Payout History</h3>
        {!data?.payouts?.length ? (
          <p className="text-[var(--secondary)]">No payouts yet.</p>
        ) : (
          <div className="space-y-3">
            {data.payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <div className="font-semibold">{payout.status}</div>
                  <div className="text-sm text-[var(--secondary)]">
                    {new Date(payout.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="font-bold">ETB {Number(payout.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
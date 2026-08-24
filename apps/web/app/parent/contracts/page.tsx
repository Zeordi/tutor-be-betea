"use client";

import { useEffect, useState } from "react";

export default function ParentContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setContracts(Array.isArray(data) ? data : []);
      } catch {
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "PENDING_ESCROW":
        return "text-amber-600";
      case "COMPLETED":
        return "text-blue-600";
      case "DISPUTED":
        return "text-red-600";
      default:
        return "text-[var(--secondary)]";
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">My Contracts</h1>
        <p className="text-[var(--secondary)] mb-8">
          Track escrow-protected tutoring contracts and session status.
        </p>

        {loading ? (
          <p className="text-[var(--secondary)]">Loading contracts...</p>
        ) : contracts.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-2">No contracts yet</h3>
            <p className="text-[var(--secondary)]">
              Hire a tutor to create your first escrow-protected contract.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {contracts.map((contract) => (
              <div key={contract.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg">Contract</h3>
                    <p className={`text-sm font-semibold mt-1 ${statusColor(contract.status)}`}>
                      {contract.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[var(--primary)]">
                      ETB {contract.agreedAmount}
                    </div>
                    <div className="text-sm text-[var(--secondary)]">
                      Escrow: ETB {contract.escrowHeldAmount || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
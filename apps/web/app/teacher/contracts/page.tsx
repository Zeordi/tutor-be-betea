"use client";

import { useEffect, useState } from "react";

export default function TeacherContractsPage() {
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

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">My Contracts</h1>
        <p className="text-[var(--secondary)] mb-8">
          Active and past tutoring contracts.
        </p>

        {loading ? (
          <p className="text-[var(--secondary)]">Loading...</p>
        ) : contracts.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-2">No contracts yet</h3>
            <p className="text-[var(--secondary)]">
              Apply to jobs to start receiving contracts.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {contracts.map((contract) => (
              <div key={contract.id} className="card">
                <h3 className="font-bold text-lg">Contract</h3>
                <p className="text-sm text-[var(--secondary)] mt-1">
                  Status: {contract.status}
                </p>
                <p className="font-bold text-[var(--primary)] mt-3">
                  ETB {contract.agreedAmount}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
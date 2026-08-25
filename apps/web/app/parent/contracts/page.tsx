"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Contract = {
  id: string;
  status: string;
  agreedAmount: number;
  escrowHeldAmount?: number;
  teacherId?: string;
  startDate?: string;
  endDate?: string;
};

export default function ParentContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/contracts/my");
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
    <div>
      <h1 className="text-3xl font-bold mb-2">My Contracts</h1>
      <p className="text-[var(--secondary)] mb-8">
        Track escrow-protected contracts and open session details.
      </p>

      {loading ? (
        <p className="text-[var(--secondary)]">Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-xl font-bold mb-2">No contracts yet</h3>
          <p className="text-[var(--secondary)]">
            Hire a tutor to create your first contract.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {contracts.map((contract) => (
            <div key={contract.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg">Contract</h3>
                  <p className="text-sm text-[var(--secondary)] mt-1">
                    Status: {contract.status}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[var(--primary)]">
                    ETB {Number(contract.agreedAmount || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-[var(--secondary)]">
                    Escrow: ETB {Number(contract.escrowHeldAmount || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/parent/sessions/${contract.id}`}
                  className="btn btn-primary"
                >
                  View Sessions
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
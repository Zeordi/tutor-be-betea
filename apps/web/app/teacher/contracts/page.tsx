"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Contract = {
  id: string;
  status: string;
  agreedAmount: number;
  escrowHeldAmount?: number;
};

export default function TeacherContractsPage() {
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
        Open a contract to manage session check-in and attendance.
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
                ETB {Number(contract.agreedAmount || 0).toFixed(2)}
              </p>

              <div className="mt-5">
                <Link
                  href={`/teacher/sessions/${contract.id}`}
                  className="btn btn-primary"
                >
                  Open Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
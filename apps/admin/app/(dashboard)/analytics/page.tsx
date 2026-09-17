"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { adminApi } from "@/lib/adminApi";

type Analytics = {
  tutors: number;
  parents: number;
  contracts: number;
  tickets: number;
  mau: number;
  escrowVolume: string;
  chatRedactions: number;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.analytics();
      if (!cancelled) setData(res as Analytics);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load analytics");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Growth, conversion, and safety metrics" />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MAU" value={data ? String(data.mau) : "—"} delta="+9%" icon="📈" tone="teal" />
        <StatCard label="Tutors" value={data ? String(data.tutors) : "—"} delta="" icon="🎓" tone="blue" />
        <StatCard label="Contracts" value={data ? String(data.contracts) : "—"} delta="" icon="📅" tone="purple" />
        <StatCard label="Open tickets" value={data ? String(data.tickets) : "—"} delta="" icon="🎫" tone="amber" />
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#112240]">
        <p className="text-3xl">📊</p>
        <p className="mt-2 font-bold text-slate-800 dark:text-white">Charts panel</p>
        <p className="text-sm text-slate-500">Hook PostHog / custom series here later.</p>
      </div>
    </div>
  );
}

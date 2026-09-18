"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminPromo } from "@/lib/adminApi";

const BANNERS = [
  { title: "Fayda verified tutors", place: "Landing hero", status: "live" as const },
  { title: "Refer & earn ETB", place: "Parent home", status: "live" as const },
  { title: "Connects top-up", place: "Teacher jobs", status: "draft" as const },
];

export default function PromosPage() {
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", description: "", discountPct: 0, usageLimit: 100 });

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.promos();
      if (!cancelled) setPromos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load promos");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPromo = async () => {
    try {
      await adminApi.upsertPromo({
        code: form.code,
        description: form.description,
        discountPct: form.discountPct,
        usageLimit: form.usageLimit,
        active: true,
      });
      setForm({ code: "", description: "", discountPct: 0, usageLimit: 100 });
      setShowForm(false);
      load();
    } catch (err: any) {
      alert(err.message || "Failed to create promo");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Promo & Banner Manager</h1>
          <p className="text-sm text-[var(--secondary)]">Usage caps · campaign placement</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
        >
          + New promo
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="Promo code"
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
            />
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
            />
            <input
              type="number"
              value={form.discountPct}
              onChange={(e) => setForm({ ...form, discountPct: Number(e.target.value) })}
              placeholder="Discount %"
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
            />
            <input
              type="number"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
              placeholder="Usage limit"
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>
          <button
            type="button"
            onClick={createPromo}
            className="mt-3 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
          >
            Save promo
          </button>
        </div>
      )}

      <h2 className="text-sm font-extrabold uppercase tracking-wide text-[var(--secondary)]">Promo codes</h2>
      <div className="space-y-3">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : promos.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No promos found.</div>
        ) : (
          promos.map((p) => {
            const pct = p.usageLimit > 0 ? Math.round((p.usedCount / p.usageLimit) * 100) : 0;
            return (
              <div key={p.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-lg font-black text-[var(--primary)]">{p.code}</p>
                    <p className="text-sm text-[var(--secondary)]">{p.description || "—"}</p>
                  </div>
                  <span className={`text-xs font-bold ${p.active ? "text-emerald-600" : "text-slate-400"}`}>
                    {p.active ? "active" : "inactive"}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-xs text-[var(--secondary)]">
                  {p.usedCount} / {p.usageLimit} uses · {pct}%
                </p>
              </div>
            );
          })
        )}
      </div>

      <h2 className="text-sm font-extrabold uppercase tracking-wide text-[var(--secondary)]">Banners</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {BANNERS.map((b) => (
          <div key={b.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="font-bold text-[var(--foreground)]">{b.title}</p>
            <p className="mt-1 text-xs text-[var(--secondary)]">{b.place}</p>
            <span
              className={`mt-3 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                b.status === "live" ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40" : "bg-[var(--muted)] text-[var(--secondary)]"
              }`}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

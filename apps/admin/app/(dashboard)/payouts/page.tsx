"use client";

import { useState } from "react";

const INITIAL = [
  { id: "1", tutor: "Berhane Alemu", method: "Telebirr", amount: 3600, status: "ready", color: "#0072CE" },
  { id: "2", tutor: "Selamawit Bekele", method: "CBE Birr", amount: 2500, status: "ready", color: "#8A1538" },
  { id: "3", tutor: "Dawit Haile", method: "Telebirr", amount: 1900, status: "pending", color: "#0072CE" },
  { id: "4", tutor: "Fiyori Tesfaye", method: "M-Pesa", amount: 2800, status: "ready", color: "#00A859" },
];

export default function PayoutsPage() {
  const [rows, setRows] = useState(INITIAL);
  const [selected, setSelected] = useState<string[]>([]);

  const readyIds = rows.filter((r) => r.status === "ready").map((r) => r.id);
  const readyTotal = rows
    .filter((r) => r.status === "ready")
    .reduce((s, r) => s + r.amount, 0);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const bulkPay = () => {
    const ids = selected.length ? selected : readyIds;
    setRows((prev) =>
      prev.map((r) => (ids.includes(r.id) && r.status === "ready" ? { ...r, status: "paid" } : r))
    );
    setSelected([]);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">
            Payout Reconciliation
          </h1>
          <p className="text-sm text-[var(--secondary)]">
            Telebirr · CBE Birr · M-Pesa color-coded
          </p>
        </div>
        <button
          type="button"
          onClick={bulkPay}
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
        >
          Bulk pay ready
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          [`${readyTotal.toLocaleString()} ETB`, "Ready"],
          [String(rows.filter((r) => r.status === "pending").length), "Pending"],
          [String(rows.filter((r) => r.status === "paid").length), "Paid today"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <p className="text-xl font-black text-[var(--primary)]">{v}</p>
            <p className="text-xs text-[var(--secondary)]">{l}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              {["", "Tutor", "Method", "Amount", "Status", ""].map((h) => (
                <th
                  key={h || "sel"}
                  className="px-4 py-3 text-[11px] font-bold uppercase text-[var(--secondary)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-[var(--border)]">
                <td className="px-4 py-3">
                  {p.status === "ready" && (
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggle(p.id)}
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-bold text-[var(--foreground)]">{p.tutor}</td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{ background: `${p.color}18`, color: p.color }}
                  >
                    {p.method}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono font-bold text-[var(--primary)]">
                  {p.amount.toLocaleString()} ETB
                </td>
                <td className="px-4 py-3 capitalize text-[var(--secondary)]">{p.status}</td>
                <td className="px-4 py-3">
                  {p.status === "ready" && (
                    <button
                      type="button"
                      onClick={() =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r.id === p.id ? { ...r, status: "paid" } : r
                          )
                        )
                      }
                      className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

const PAYOUTS = [
  { tutor: "Berhane Alemu", method: "Telebirr", amount: 3600, status: "ready", color: "#0072CE" },
  { tutor: "Selamawit Bekele", method: "CBE Birr", amount: 2500, status: "ready", color: "#8A1538" },
  { tutor: "Dawit Haile", method: "Telebirr", amount: 1900, status: "pending", color: "#0072CE" },
  { tutor: "Fiyori Tesfaye", method: "M-Pesa", amount: 2800, status: "ready", color: "#00A859" },
];

export default function PayoutsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black">Payout Reconciliation</h1>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["8,900 ETB", "Ready"],
          ["1", "Pending"],
          ["0", "Held"],
        ].map(([v, l]) => (
          <div key={l} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-xl font-black text-[var(--primary)]">{v}</p>
            <p className="text-xs text-[var(--secondary)]">{l}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              {["Tutor", "Method", "Amount", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase text-[var(--secondary)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYOUTS.map((p) => (
              <tr key={p.tutor} className="border-b border-[var(--border)]">
                <td className="px-4 py-3 font-bold">{p.tutor}</td>
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
                <td className="px-4 py-3 capitalize">{p.status}</td>
                <td className="px-4 py-3">
                  {p.status === "ready" && (
                    <button type="button" className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">
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
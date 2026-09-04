"use client";

const SESSIONS = [
  { date: "Aug 27, 2026", tutor: "Berhane Alemu", child: "Kidist", subject: "Math", duration: "90 min", amount: 675, status: "completed" },
  { date: "Aug 25, 2026", tutor: "Selamawit Bekele", child: "Kidist", subject: "Chemistry", duration: "60 min", amount: 500, status: "completed" },
  { date: "Aug 20, 2026", tutor: "Berhane Alemu", child: "Kidist", subject: "Physics", duration: "90 min", amount: 675, status: "completed" },
  { date: "Aug 18, 2026", tutor: "Berhane Alemu", child: "Kidist", subject: "Math", duration: "60 min", amount: 450, status: "disputed" },
  { date: "Aug 15, 2026", tutor: "Dawit Haile", child: "Dawit Jr", subject: "English", duration: "60 min", amount: 380, status: "completed" },
];

function statusClass(s: string) {
  if (s === "completed") return "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300";
  if (s === "disputed") return "bg-red-50 text-red-600 dark:bg-red-950/40";
  return "bg-amber-50 text-amber-700";
}

export default function SessionHistoryPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Session History</h1>
          <p className="text-sm text-[var(--secondary)]">Invoices & past sessions</p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--foreground)]"
        >
          📥 Export invoices
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["6", "Sessions this month"],
          ["3,355 ETB", "Total spent"],
          ["1", "Active dispute"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
          >
            <p className="text-2xl font-black text-[var(--primary)]">{v}</p>
            <p className="text-xs text-[var(--secondary)]">{l}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              {["Date", "Tutor", "Child", "Subject", "Duration", "Amount", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[var(--secondary)]"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map((s, i) => (
              <tr key={i} className="border-b border-[var(--border)]">
                <td className="px-4 py-3.5 text-[13px] text-[var(--secondary)]">{s.date}</td>
                <td className="px-4 py-3.5 text-[13px] font-bold text-[var(--foreground)]">
                  {s.tutor}
                </td>
                <td className="px-4 py-3.5 text-[13px]">{s.child}</td>
                <td className="px-4 py-3.5 text-[13px] text-[var(--secondary)]">{s.subject}</td>
                <td className="px-4 py-3.5 text-[13px] text-[var(--secondary)]">{s.duration}</td>
                <td className="px-4 py-3.5 font-mono text-sm font-extrabold text-[var(--primary)]">
                  {s.amount.toLocaleString()} ETB
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(s.status)}`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--secondary)]"
                  >
                    Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

const TABS = ["All", "Jobs", "Sessions", "Payouts", "System"];
const ITEMS = [
  { tab: "Jobs", title: "New job near Bole", body: "Grade 12 Physics · 500 ETB/hr", time: "2h", unread: true },
  { tab: "Sessions", title: "Session tomorrow", body: "Kidane · Math · 4:00 PM", time: "5h", unread: true },
  { tab: "Payouts", title: "Payout received", body: "3,000 ETB via Telebirr", time: "1d", unread: false },
  { tab: "System", title: "Verification reminder", body: "1 document needs re-upload", time: "2d", unread: false },
];

export default function TeacherNotificationsPage() {
  const [tab, setTab] = useState("All");
  const list = tab === "All" ? ITEMS : ITEMS.filter((i) => i.tab === tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">Notifications</h1>
        <p className="text-sm text-[var(--secondary)]">Job alerts, sessions, and payouts</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold ${
              tab === t
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--secondary)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map((n) => (
          <div
            key={n.title}
            className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            {n.unread && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
            )}
            <div className={`min-w-0 flex-1 ${n.unread ? "" : "ml-4"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-[var(--text)]">{n.title}</p>
                <span className="text-xs text-[var(--secondary)]">{n.time}</span>
              </div>
              <p className="text-sm text-[var(--secondary)]">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
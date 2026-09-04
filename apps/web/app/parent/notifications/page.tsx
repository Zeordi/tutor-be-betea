"use client";

import { useState } from "react";

const NOTIFS = [
  { cat: "Session", icon: "📅", title: "Session in 2 hours", body: "Berhane Alemu · Math · Today 10:00 AM", time: "8:02 AM", unread: true },
  { cat: "Escrow", icon: "🔒", title: "Escrow released · 675 ETB", body: "Payment confirmed after session on Aug 27", time: "Yesterday", unread: true },
  { cat: "Session", icon: "✅", title: "Session completed", body: "Physics with Selamawit Bekele · Aug 26", time: "Aug 26", unread: false },
  { cat: "System", icon: "🛡️", title: "Berhane Alemu ID re-verified", body: "Annual verification passed", time: "Aug 24", unread: false },
  { cat: "Escrow", icon: "💳", title: "Payment processed · 2,400 ETB", body: "Starter Pack purchased for Kidist", time: "Aug 20", unread: false },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const list =
    filter === "All" ? NOTIFS : NOTIFS.filter((n) => n.cat === filter);

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-[var(--foreground)]">Notifications</h1>
        <button type="button" className="text-xs font-bold text-[var(--secondary)]">
          Mark all read
        </button>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {["All", "Session", "Escrow", "System"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-bold ${
              filter === f
                ? "border-[var(--primary)] bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                : "border-[var(--border)] text-[var(--secondary)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2.5">
        {list.map((n, i) => (
          <div
            key={i}
            className={`flex gap-3.5 rounded-2xl border p-4 ${
              n.unread
                ? "border-teal-200 bg-teal-50/80 dark:border-teal-900 dark:bg-teal-950/20"
                : "border-[var(--border)] bg-[var(--card)]"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-xl">
              {n.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex justify-between gap-2">
                <p className={`text-sm ${n.unread ? "font-extrabold" : "font-semibold"} text-[var(--foreground)]`}>
                  {n.title}
                </p>
                <span className="shrink-0 text-xs text-[var(--secondary)]">{n.time}</span>
              </div>
              <p className="text-[13px] text-[var(--secondary)]">{n.body}</p>
            </div>
            {n.unread && (
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
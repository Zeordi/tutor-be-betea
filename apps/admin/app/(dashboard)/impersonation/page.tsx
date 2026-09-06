"use client";

import { useState } from "react";

const USERS = [
  { name: "Hana Mulugeta", role: "Parent", email: "hana@example.com", id: "USR-0841" },
  { name: "Berhane Alemu", role: "Tutor", email: "berhane@tutor.et", id: "USR-0120" },
];

const AUDIT = [
  { who: "Yared Bekele", target: "Hana Mulugeta", action: "View session history", at: "Today 14:02" },
  { who: "Yared Bekele", target: "Berhane Alemu", action: "View verification status", at: "Yesterday 11:20" },
];

export default function ImpersonationPage() {
  const [sel, setSel] = useState(0);
  const [active, setActive] = useState(false);
  const [ticket, setTicket] = useState("");
  const u = USERS[sel];

  return (
    <div>
      {active && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-red-600 px-5 py-3 text-white">
          <p className="text-sm font-bold">
            👁️ Impersonating {u.name} ({u.role}) · view-only · audit logging on
          </p>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="rounded-lg border border-white/40 px-3 py-1 text-xs font-bold"
          >
            Exit session
          </button>
        </div>
      )}

      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">
        User Impersonation
      </h1>
      <p className="mb-6 text-sm text-[var(--secondary)]">
        Super Admin only · requires support ticket reference
      </p>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          {USERS.map((user, i) => (
            <button
              key={user.id}
              type="button"
              onClick={() => setSel(i)}
              className={`w-full border-b border-[var(--border)] px-4 py-4 text-left ${
                sel === i ? "bg-teal-50 dark:bg-teal-950/30" : ""
              }`}
            >
              <p className="font-bold text-[var(--foreground)]">{user.name}</p>
              <p className="text-xs text-[var(--secondary)]">
                {user.role} · {user.email}
              </p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-xl font-black text-[var(--foreground)]">{u.name}</p>
            <p className="mb-4 text-sm text-[var(--secondary)]">
              {u.role} · {u.id}
            </p>
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              ⚠️ Safety policy: view-only · no payments · no chat send · all actions
              written to immutable audit log · ticket required
            </div>
            <label className="mb-1 block text-xs font-bold uppercase text-[var(--secondary)]">
              Support ticket ID
            </label>
            <input
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              placeholder="e.g. TKT-28471"
              className="mb-4 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
            <button
              type="button"
              disabled={!ticket.trim()}
              onClick={() => setActive(true)}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              👁️ Start Impersonation Session
            </button>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="mb-3 font-bold text-[var(--foreground)]">Recent audit log</p>
            <div className="space-y-2">
              {AUDIT.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[var(--muted)] px-3 py-2 text-xs text-[var(--secondary)]"
                >
                  <span className="font-bold text-[var(--foreground)]">{a.who}</span> →{" "}
                  {a.target}: {a.action}
                  <span className="ml-2 text-[var(--secondary)]">{a.at}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
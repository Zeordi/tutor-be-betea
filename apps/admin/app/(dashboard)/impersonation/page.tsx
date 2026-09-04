"use client";

import { useState } from "react";

const USERS = [
  { name: "Hana Mulugeta", role: "Parent", email: "hana@example.com", id: "USR-0841" },
  { name: "Berhane Alemu", role: "Tutor", email: "berhane@tutor.et", id: "USR-0120" },
];

export default function ImpersonationPage() {
  const [sel, setSel] = useState(0);
  const [active, setActive] = useState(false);
  const u = USERS[sel];

  return (
    <div>
      {active && (
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-red-600 px-5 py-3 text-white">
          <p className="text-sm font-bold">
            👁️ Impersonating {u.name} ({u.role}) · audit logging on
          </p>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="rounded-lg border border-white/40 px-3 py-1 text-xs font-bold"
          >
            Exit
          </button>
        </div>
      )}
      <h1 className="mb-6 text-2xl font-black">User Impersonation</h1>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
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
              <p className="font-bold">{user.name}</p>
              <p className="text-xs text-[var(--secondary)]">
                {user.role} · {user.email}
              </p>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-xl font-black">{u.name}</p>
          <p className="mb-4 text-sm text-[var(--secondary)]">
            {u.role} · {u.id}
          </p>
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            ⚠️ View-only policy · all actions audit-logged · requires linked support ticket
          </div>
          <button
            type="button"
            onClick={() => setActive(true)}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
          >
            👁️ Start Impersonation Session
          </button>
        </div>
      </div>
    </div>
  );
}
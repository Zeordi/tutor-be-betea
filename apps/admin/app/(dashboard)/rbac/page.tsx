"use client";

import { useState } from "react";

const ROLES = [
  { id: "super", label: "Super Admin", color: "#8B5CF6", desc: "Full platform access" },
  { id: "verification", label: "Verification", color: "#0072CE", desc: "Document review" },
  { id: "support", label: "Support", color: "#F59E0B", desc: "Tickets & disputes" },
  { id: "finance", label: "Finance", color: "#10B981", desc: "Payouts & escrow" },
];

const TEAM = [
  { name: "Yared Bekele", role: "Super Admin", email: "yared@admin.et", active: "2 min ago" },
  { name: "Tigist Haile", role: "Verification", email: "tigist@admin.et", active: "1 hr ago" },
  { name: "Abel Girma", role: "Support", email: "abel@admin.et", active: "30 min ago" },
  { name: "Meron Tadesse", role: "Finance", email: "meron@admin.et", active: "3 hrs ago" },
];

export default function RbacPage() {
  const [role, setRole] = useState("super");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-[var(--foreground)]">
        Role-Based Access Control
      </h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className="rounded-2xl border-2 bg-[var(--card)] p-5 text-left"
            style={{
              borderColor: role === r.id ? r.color : "var(--border)",
              background: role === r.id ? `${r.color}12` : undefined,
            }}
          >
            <p className="font-extrabold" style={{ color: role === r.id ? r.color : undefined }}>
              {r.label}
            </p>
            <p className="mt-1 text-xs text-[var(--secondary)]">{r.desc}</p>
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <p className="font-bold">Admin Team</p>
          <button
            type="button"
            className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white"
          >
            + Invite
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              {["Name", "Email", "Role", "Last Active"].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase text-[var(--secondary)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEAM.map((u) => (
              <tr key={u.email} className="border-b border-[var(--border)]">
                <td className="px-4 py-3 font-bold">{u.name}</td>
                <td className="px-4 py-3 text-[var(--secondary)]">{u.email}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3 text-[var(--secondary)]">{u.active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
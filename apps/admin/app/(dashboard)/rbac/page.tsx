"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminStaff } from "@/lib/adminApi";

type RoleOption = {
  value: string;
  label: string;
};

const ROLES: RoleOption[] = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "VERIFICATION_OFFICER", label: "Verification Officer" },
  { value: "SUPPORT_AGENT", label: "Support Agent" },
  { value: "FINANCE", label: "Finance" },
];

const ROLE_META: Record<string, { color: string; bg: string; text: string }> = {
  SUPER_ADMIN: { color: "#8B5CF6", bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
  VERIFICATION_OFFICER: { color: "#0072CE", bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  SUPPORT_AGENT: { color: "#F59E0B", bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  FINANCE: { color: "#10B981", bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300" },
};

function roleBadge(role: string) {
  const meta = ROLE_META[role];
  if (meta) return `${meta.bg} ${meta.text}`;
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function statusBadge(status?: string) {
  const s = (status || "").toUpperCase();
  if (s === "ACTIVE") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  }
  if (s === "SUSPENDED") {
    return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  }
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export default function RbacPage() {
  const [staff, setStaff] = useState<AdminStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("SUPPORT_AGENT");
  const [tempPassword, setTempPassword] = useState("");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.staff();
      if (!cancelled) setStaff(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load staff");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await adminApi.createStaff({
        fullName,
        phoneNumber: phoneNumber || undefined,
        email: email || undefined,
        role,
        temporaryPassword: tempPassword || undefined,
      });
      setStaff((prev) => [result, ...prev]);
      setFullName("");
      setPhoneNumber("");
      setEmail("");
      setRole("SUPPORT_AGENT");
      setTempPassword("");
      if (result.temporaryPassword) {
        await navigator.clipboard.writeText(result.temporaryPassword);
        setCopiedId(result.id);
        setTimeout(() => setCopiedId(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create staff");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (
    id: string,
    body: { role?: string; status?: string; temporaryPassword?: string }
  ) => {
    setUpdatingId(id);
    try {
      const updated = await adminApi.updateStaff(id, body);
      setStaff((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err: any) {
      setError(err.message || "Failed to update staff");
    } finally {
      setUpdatingId(null);
    }
  };

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of staff) {
      counts[s.role] = (counts[s.role] || 0) + 1;
    }
    return counts;
  }, [staff]);

  const superCount = staff.filter((s) => s.role === "SUPER_ADMIN").length;
  const activeCount = staff.filter((s) => s.status === "ACTIVE").length;
  const suspendedCount = staff.filter((s) => s.status === "SUSPENDED").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role-Based Access Control"
        subtitle="Staff provisioning · audit-logged · Super Admin only"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => {
          const meta = ROLE_META[r.value];
          const count = roleCounts[r.value] || 0;
          return (
            <div key={r.value} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
              <p className="text-xl font-black text-slate-900 dark:text-white">{count}</p>
              <p className="text-xs text-slate-500">{r.label}</p>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.text}`}>
                {r.value.replace(/_/g, " ")}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <p className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Create staff member</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone (optional if email)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional if phone)"
            type="email"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <input
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            placeholder="Temporary password (optional)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {submitting ? "Creating…" : "+ Invite staff"}
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
          If temporary password is omitted, a random one is generated and shown for copying.
        </p>
      </form>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">Loading…</div>
        ) : staff.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">No staff members found.</div>
        ) : (
          staff.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                  {s.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{s.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.email || s.phoneNumber || s.id.slice(0, 8)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${roleBadge(s.role)}`}>
                    {s.role.replace(/_/g, " ")}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusBadge(s.status)}`}>
                    {s.status || "ACTIVE"}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.status === "ACTIVE" ? (
                  <button
                    type="button"
                    disabled={updatingId === s.id}
                    onClick={() => handleUpdate(s.id, { status: "SUSPENDED" })}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
                  >
                    {updatingId === s.id ? "…" : "Suspend"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={updatingId === s.id}
                    onClick={() => handleUpdate(s.id, { status: "ACTIVE" })}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                  >
                    {updatingId === s.id ? "…" : "Activate"}
                  </button>
                )}
                <select
                  value={s.role}
                  onChange={(e) => handleUpdate(s.id, { role: e.target.value })}
                  disabled={updatingId === s.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-bold disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={updatingId === s.id}
                  onClick={() => {
                    const pw = prompt("Enter new temporary password (min 6 chars):");
                    if (pw && pw.length >= 6) {
                      handleUpdate(s.id, { temporaryPassword: pw });
                    }
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Reset pw
                </button>
                {s.id === copiedId && (
                  <span className="text-xs text-emerald-600">Copied!</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

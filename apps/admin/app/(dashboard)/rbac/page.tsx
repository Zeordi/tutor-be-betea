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

function roleBadge(role: string) {
  const map: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    VERIFICATION_OFFICER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    SUPPORT_AGENT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    FINANCE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  };
  return map[role] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function statusBadge(status?: string) {
  const s = (status || "").toUpperCase();
  if (s === "ACTIVE") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  }
  if (s === "SUSPENDED") {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
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

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--foreground)]">{staff.length}</p>
          <p className="text-xs text-[var(--secondary)]">Total staff</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--foreground)]">{superCount}</p>
          <p className="text-xs text-[var(--secondary)]">Super Admins</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--foreground)]">{activeCount}</p>
          <p className="text-xs text-[var(--secondary)]">Active</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--foreground)]">{suspendedCount}</p>
          <p className="text-xs text-[var(--secondary)]">Suspended</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-4 text-sm font-bold text-[var(--foreground)]">Create staff member</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone (optional if email)"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional if phone)"
            type="email"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
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
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create staff"}
          </button>
        </div>
        <p className="mt-2 text-[10px] text-[var(--secondary)]">
          If temporary password is omitted, a random one is generated and shown for copying.
        </p>
      </form>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="overflow-hidden">
          <div className="grid grid-cols-12 gap-2 border-b border-[var(--border)] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[var(--secondary)]">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Contact</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
          ) : staff.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">No staff members found.</div>
          ) : (
            staff.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-12 items-center gap-2 border-b border-[var(--border)] px-4 py-3 last:border-0"
              >
                <div className="col-span-3">
                  <p className="text-sm font-bold text-[var(--foreground)]">{s.fullName}</p>
                  <p className="text-[10px] text-[var(--secondary)]">{s.id.slice(0, 8)}</p>
                </div>
                <div className="col-span-2 text-xs text-[var(--secondary)]">
                  {s.email || s.phoneNumber}
                </div>
                <div className="col-span-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${roleBadge(s.role)}`}>
                    {s.role.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadge(s.status)}`}>
                    {s.status || "ACTIVE"}
                  </span>
                </div>
                <div className="col-span-3 flex flex-wrap justify-end gap-1">
                  {s.status === "ACTIVE" ? (
                    <button
                      type="button"
                      disabled={updatingId === s.id}
                      onClick={() => handleUpdate(s.id, { status: "SUSPENDED" })}
                      className="rounded-lg border border-red-200 px-2 py-1 text-[10px] font-bold text-red-700 disabled:opacity-50"
                    >
                      {updatingId === s.id ? "…" : "Suspend"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={updatingId === s.id}
                      onClick={() => handleUpdate(s.id, { status: "ACTIVE" })}
                      className="rounded-lg border border-emerald-200 px-2 py-1 text-[10px] font-bold text-emerald-700 disabled:opacity-50"
                    >
                      {updatingId === s.id ? "…" : "Activate"}
                    </button>
                  )}
                  <select
                    value={s.role}
                    onChange={(e) => handleUpdate(s.id, { role: e.target.value })}
                    disabled={updatingId === s.id}
                    className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-2 py-1 text-[10px] font-bold disabled:opacity-50"
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
                    className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-bold disabled:opacity-50"
                  >
                    Reset pw
                  </button>
                  {s.id === copiedId && (
                    <span className="text-[10px] text-emerald-600">Copied!</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

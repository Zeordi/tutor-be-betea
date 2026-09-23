"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminUser, type AdminAuditLog } from "@/lib/adminApi";

export default function ImpersonationPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sel, setSel] = useState(0);
  const [active, setActive] = useState(false);
  const [ticket, setTicket] = useState("");
  const [starting, setStarting] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState("");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.users({ limit: 50 });
      if (!cancelled) setUsers(res.data || []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load users");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  const loadAudit = async () => {
    let cancelled = false;
    setAuditLoading(true);
    setAuditError("");
    try {
      const data = await adminApi.auditLogs(50);
      if (!cancelled) setAuditLogs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setAuditError(err.message || "Failed to load audit logs");
    } finally {
      if (!cancelled) setAuditLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadAudit();
  }, []);

  const startImpersonation = async () => {
    if (!ticket.trim() || !users[sel]) return;
    setStarting(true);
    try {
      await adminApi.startImpersonation(users[sel].id, ticket.trim());
      setActive(true);
    } catch (err: any) {
      alert(err.message || "Failed to start impersonation");
    } finally {
      setStarting(false);
    }
  };

  const u = users[sel];

  const userLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const user of users) {
      map.set(user.id, user.fullName || user.id);
    }
    return map;
  }, [users]);

  return (
    <div className="space-y-6">
      {active && u && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-red-600 px-5 py-3 text-white">
          <p className="text-sm font-bold">
            👁️ Impersonating {u.fullName} ({u.role}) · view-only · audit logging on
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

      <PageHeader
        title="User Impersonation"
        subtitle="Super Admin only · requires support ticket reference"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
          ) : users.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">No users found.</div>
          ) : (
            users.map((user, i) => (
              <button
                key={user.id}
                type="button"
                onClick={() => { setSel(i); setActive(false); }}
                className={`w-full border-b border-[var(--border)] px-4 py-4 text-left ${
                  sel === i ? "bg-teal-50 dark:bg-teal-950/30" : ""
                }`}
              >
                <p className="font-bold text-[var(--foreground)]">{user.fullName}</p>
                <p className="text-xs text-[var(--secondary)]">
                  {user.role} · {user.email || user.phoneNumber || "—"}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="space-y-4">
          {u && (
            <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-6">
              <p className="text-xl font-black text-[var(--foreground)]">{u.fullName}</p>
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
                disabled={!ticket.trim() || starting}
                onClick={startImpersonation}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {starting ? "Starting…" : "👁️ Start Impersonation Session"}
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="mb-3 font-bold text-[var(--foreground)]">Recent audit log</p>
            {auditError && (
              <p className="text-xs text-red-600">{auditError}</p>
            )}
            {auditLoading ? (
              <p className="text-xs text-slate-500">Loading audit log…</p>
            ) : auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500">No audit entries yet.</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.slice(0, 10).map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl bg-[var(--muted)] px-3 py-2 text-xs text-[var(--secondary)]"
                  >
                    <span className="font-bold text-[var(--foreground)]">
                      {userLookup.get(a.adminId) || a.adminId}
                    </span>{" "}
                    →{" "}
                    <span className="font-bold text-[var(--foreground)]">
                      {userLookup.get(a.targetUserId || "") || a.targetUserId || "—"}
                    </span>
                    : {a.actionType.replace(/_/g, " ")}
                    <span className="ml-2 text-[var(--secondary)]">
                      {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

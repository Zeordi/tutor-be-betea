"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminUser } from "@/lib/adminApi";

type RoleFilter = "ALL" | "PARENT" | "TEACHER" | "SUPPORT_AGENT" | "SUPER_ADMIN";
type StatusFilter = "ALL" | "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "BANNED";

const ROLE_OPTIONS: RoleFilter[] = ["ALL", "PARENT", "TEACHER", "SUPPORT_AGENT", "SUPER_ADMIN"];
const STATUS_OPTIONS: StatusFilter[] = ["ALL", "ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "BANNED"];

function statusClass(status: string) {
  if (status === "ACTIVE")
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (status === "SUSPENDED" || status === "BANNED")
    return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.users({
        role: roleFilter === "ALL" ? undefined : roleFilter,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: search || undefined,
        limit: 50,
      });
      if (!cancelled) setUsers(res.data);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load users");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Parents, tutors, and account status · Super Admin"
        action={
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {users.length} shown
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30">
              {users.filter((u) => u.status === "ACTIVE").length} active
            </span>
          </div>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={load}
          placeholder="Search name, email, phone…"
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r === "ALL" ? "All roles" : r}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">City</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-1">View</div>
        </div>
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : users.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No users match filters.</div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-12 items-center gap-2 border-b border-slate-50 px-4 py-3 last:border-0 dark:border-slate-800/60"
            >
              <div className="col-span-3">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{u.fullName}</p>
                <p className="text-xs text-slate-400">{u.phoneNumber || u.email || "—"}</p>
              </div>
              <div className="col-span-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {u.role}
                </span>
              </div>
              <div className="col-span-2 text-xs text-slate-500">{u.city || "—"}</div>
              <div className="col-span-2">
                {u.status && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(u.status)}`}>
                    {u.status}
                  </span>
                )}
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </div>
              <div className="col-span-1">
                <Link
                  href={`/users/${u.id}`}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  Open
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
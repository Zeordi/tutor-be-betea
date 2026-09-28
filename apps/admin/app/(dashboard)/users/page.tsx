"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminUser } from "@/lib/adminApi";

type RoleFilter = "ALL" | "PARENT" | "TEACHER" | "SUPPORT_AGENT" | "SUPER_ADMIN";
type StatusFilter = "ALL" | "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "BANNED";

const ROLE_OPTIONS: RoleFilter[] = ["ALL", "PARENT", "TEACHER", "SUPPORT_AGENT", "SUPER_ADMIN"];
const STATUS_OPTIONS: StatusFilter[] = ["ALL", "ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "BANNED"];

function roleClass(role: string) {
  const r = role.toLowerCase();
  if (r.includes("super")) return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  if (r.includes("support")) return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  if (r.includes("teacher")) return "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300";
  if (r.includes("parent")) return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function statusClass(status: string) {
  if (status === "ACTIVE")
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (status === "SUSPENDED" || status === "BANNED")
    return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
}

function initialsFrom(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle={`Tutor Be Betea · ${dateStr}`}
        action={
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {users.length} shown
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
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

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#112240]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={load}
          placeholder="Search name, email, phone…"
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-400"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled
          className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white opacity-80"
          title="Export CSV coming soon"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          Loading…
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          No users match filters.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {initialsFrom(u.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{u.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{u.phoneNumber || u.email || "—"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${roleClass(u.role)}`}>
                    {u.role}
                  </span>
                  {u.status && (
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(u.status)}`}>
                      {u.status}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </div>
                <Link
                  href={`/users/${u.id}`}
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-700"
                >
                  View
                </Link>
              </div>
              {u.subCity && (
                <p className="mt-2 text-xs text-slate-500">{u.subCity}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

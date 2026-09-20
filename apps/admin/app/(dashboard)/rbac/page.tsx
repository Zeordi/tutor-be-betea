"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminUser } from "@/lib/adminApi";

export default function RbacPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminApi
      .user("me")
      .then((data) => {
        if (!cancelled) setMe(data as AdminUser);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role-Based Access Control"
        subtitle="View-only · staff management not yet enabled"
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Full RBAC management (invite, role assignment, permission sets) is not yet exposed via API.
          Contact platform engineering to enable admin staff CRUD.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Current session</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : me ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Name</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{me.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Role</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {me.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{me.email || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  me.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-900/30"
                }`}
              >
                {me.status || "PENDING_VERIFICATION"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Unable to load current admin identity.</p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminUser } from "@/lib/adminApi";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phoneNumber: "", status: "" });

  const load = async () => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.user(id);
      if (!cancelled) {
        setUser(data as AdminUser);
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          status: data.status || "",
        });
      }
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load user");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("User updated");
      load();
    } catch (err: any) {
      alert(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Details"
        subtitle={user ? `${user.fullName} · ${user.role}` : `User ID: ${id}`}
        action={
          <Link href="/users" className="text-sm font-semibold text-slate-500 hover:text-teal-600">
            ← Back to users
          </Link>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {loading ? (
        <div className="px-4 py-8 text-center text-sm text-slate-500">Loading user…</div>
      ) : user ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 font-semibold">Profile Information</h3>
            <div className="space-y-3">
              {[
                ["Full name", form.fullName],
                ["Email", form.email],
                ["Phone", form.phoneNumber],
                ["Role", user.role],
                ["Status", form.status],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--secondary)]">{label as string}</span>
                  {label === "Full name" || label === "Email" || label === "Phone" || label === "Status" ? (
                    <input
                      value={String(value)}
                      onChange={(e) => setForm({ ...form, [label.toLowerCase().replace(" ", "")]: e.target.value })}
                      className="w-48 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-right text-sm font-bold outline-none focus:border-[var(--primary)]"
                    />
                  ) : (
                    <span className="text-sm font-bold">{String(value)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 font-semibold">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--secondary)]">User ID</span>
                <span className="font-mono text-xs text-slate-500">{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--secondary)]">Role</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--secondary)]">Status</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    user.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                      : user.status === "SUSPENDED" || user.status === "BANNED"
                        ? "bg-red-50 text-red-700 dark:bg-red-900/30"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30"
                  }`}
                >
                  {user.status || "PENDING_VERIFICATION"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

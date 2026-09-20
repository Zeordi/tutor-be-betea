"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type User = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  emergencyContact: string | null;
  addressLine: string | null;
  subCity: string | null;
  notificationPrefs: any;
};

type Subscription = {
  id: string;
  tier: string;
  active: boolean;
  startsAt: string;
  endsAt: string | null;
};

export default function ParentSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    emergencyContact: "",
    addressLine: "",
    subCity: "",
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      apiFetch<User>(paths.usersMe),
      apiFetch<Subscription | null>(paths.subscriptionMine),
    ])
      .then(([userRes, subRes]) => {
        if (!cancelled) {
          setUser(userRes);
          setSubscription(subRes);
          setForm({
            fullName: userRes.fullName,
            email: userRes.email || "",
            emergencyContact: userRes.emergencyContact || "",
            addressLine: userRes.addressLine || "",
            subCity: userRes.subCity || "",
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");

    try {
      const updated = await apiFetch<User>(paths.usersMe, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setUser(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error || "Profile not found"}</p>
      </div>
    );
  }

  const tierLabel = subscription?.tier || "FREE";

  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Profile & Settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white">
              {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="font-extrabold text-slate-800 dark:text-white">{user.fullName}</p>
              <p className="text-sm text-slate-400">{user.phoneNumber}</p>
              <span className="mt-1 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30">
                {tierLabel} Plan
              </span>
            </div>
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 bg-[var(--surface)] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 bg-[var(--surface)] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Emergency Contact</label>
                <input
                  value={form.emergencyContact}
                  onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 bg-[var(--surface)] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Address</label>
                <input
                  value={form.addressLine}
                  onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 bg-[var(--surface)] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Subcity</label>
                <input
                  value={form.subCity}
                  onChange={(e) => setForm({ ...form, subCity: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 bg-[var(--surface)] outline-none"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-teal-600 py-2 text-sm font-bold text-white disabled:opacity-70"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {[
                  ["Full Name", user.fullName],
                  ["Phone", user.phoneNumber],
                  ["Email", user.email || "—"],
                  ["Location", [user.addressLine, user.subCity].filter(Boolean).join(", ") || "—"],
                  ["Language", "Amharic / English"],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800"
                  >
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
        <div className="space-y-3">
          {[
            { title: "Notifications", desc: "Session reminders, report alerts", icon: "🔔" },
            { title: "Privacy & Safety", desc: "Location sharing, emergency contacts", icon: "🛡️" },
            { title: "Payment Methods", desc: "Telebirr, CBE Birr linked", icon: "💳" },
            { title: "Language", desc: "Amharic / English", icon: "🌐" },
            { title: "Help & Support", desc: "FAQ, live chat, tickets", icon: "❓" },
            { title: "Referral Program", desc: "Invite & earn 500 ETB", icon: "🎁" },
          ].map((item) => (
            <button
              key={item.title}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left transition-all hover:border-teal-300 dark:border-slate-800 dark:bg-[#112240] dark:hover:border-teal-700"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{item.title}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <span className="text-slate-400">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

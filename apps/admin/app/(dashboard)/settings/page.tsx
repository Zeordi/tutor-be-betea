"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi } from "@/lib/adminApi";

type Settings = {
  platformFeePercent: number;
  geofenceRadius: number;
  connectPrice: number;
  mfaEnabled: boolean;
  antiPoachingFilter: boolean;
  vaultEncryption: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Settings>({
    platformFeePercent: 5,
    geofenceRadius: 150,
    connectPrice: 100,
    mfaEnabled: true,
    antiPoachingFilter: true,
    vaultEncryption: "AES-256",
  });

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.settings();
      if (!cancelled && res) {
        const s = res as Settings;
        setSettings(s);
        setForm(s);
      }
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load settings");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(form);
      alert("Settings saved");
    } catch (err: any) {
      alert(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" subtitle="Platform fees, geofence radius, MFA policy" />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {loading ? (
        <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Platform fee", `${form.platformFeePercent}%`, "platformFeePercent"],
            ["Geofence radius", `${form.geofenceRadius} m`, "geofenceRadius"],
            ["Connect price", `${form.connectPrice} ETB`, "connectPrice"],
            ["Admin MFA", form.mfaEnabled ? "IP-bound enabled" : "disabled", "mfaEnabled"],
            ["Anti-poaching filter", form.antiPoachingFilter ? "Amharic + English ON" : "OFF", "antiPoachingFilter"],
            ["Vault encryption", form.vaultEncryption, "vaultEncryption"],
          ].map(([label, value, key]) => (
            <div
              key={label as string}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
            >
              <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
              {key === "mfaEnabled" || key === "antiPoachingFilter" ? (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, [key]: !form[key as keyof Settings] })}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    form[key as keyof Settings]
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                  }`}
                >
                  {form[key as keyof Settings] ? "ON" : "OFF"}
                </button>
              ) : (
                <input
                  value={String(value)}
                  onChange={(e) => {
                    const val = key === "vaultEncryption" ? e.target.value : Number(e.target.value);
                    setForm({ ...form, [key]: val });
                  }}
                  className="w-24 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-right text-sm font-bold outline-none focus:border-[var(--primary)]"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}

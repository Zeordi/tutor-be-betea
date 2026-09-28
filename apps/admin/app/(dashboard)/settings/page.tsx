"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminSettings } from "@/lib/adminApi";

type Section = {
  id: string;
  title: string;
  description: string;
  fields: {
    key: keyof AdminSettings;
    label: string;
    unit?: string;
    type?: "number" | "boolean" | "text" | "select" | "readonly";
    options?: string[];
    cols?: 1 | 2;
  }[];
};

const SECTIONS: Section[] = [
  {
    id: "platform",
    title: "Platform & Fees",
    description: "Core pricing and subscription tiers",
    fields: [
      { key: "platformFeePercent", label: "Platform fee", unit: "%", type: "number", cols: 1 },
      { key: "connectPriceEtb", label: "Connect price", unit: "ETB", type: "number", cols: 1 },
      { key: "boostPriceEtb", label: "Boost price", unit: "ETB", type: "number", cols: 1 },
      { key: "subscriptionBasicEtb", label: "Basic subscription", unit: "ETB", type: "number", cols: 1 },
      { key: "subscriptionPremiumEtb", label: "Premium subscription", unit: "ETB", type: "number", cols: 1 },
      { key: "subscriptionEliteEtb", label: "Elite subscription", unit: "ETB", type: "number", cols: 1 },
    ],
  },
  {
    id: "payments",
    title: "Payments & Escrow",
    description: "Payouts, escrow release, and provider toggles",
    fields: [
      { key: "escrowAutoReleaseHours", label: "Auto-release escrow", unit: "hours", type: "number", cols: 1 },
      { key: "disputeHoldDays", label: "Dispute hold", unit: "days", type: "number", cols: 1 },
      { key: "minPayoutEtb", label: "Min payout", unit: "ETB", type: "number", cols: 1 },
      { key: "payoutSchedule", label: "Payout schedule", type: "select", options: ["WEEKLY", "BIWEEKLY", "MONTHLY"], cols: 1 },
      { key: "payTelebirr", label: "Telebirr", type: "boolean", cols: 1 },
      { key: "payCbeBirr", label: "CBE Birr", type: "boolean", cols: 1 },
      { key: "payMpesa", label: "M-Pesa", type: "boolean", cols: 1 },
      { key: "payCard", label: "Card payments", type: "boolean", cols: 1 },
    ],
  },
  {
    id: "safety",
    title: "Safety & Geo",
    description: "Geofence rules and session windows",
    fields: [
      { key: "geofenceRadiusMeters", label: "Geofence radius", unit: "m", type: "number", cols: 1 },
      { key: "sessionCheckInWindowMinutes", label: "Check-in window", unit: "min", type: "number", cols: 1 },
      { key: "sosContactsRequired", label: "SOS contacts required", type: "boolean", cols: 1 },
    ],
  },
  {
    id: "trust",
    title: "Trust & Verification",
    description: "Document requirements and SLA",
    fields: [
      { key: "requireFaydaId", label: "Require Fayda ID", type: "boolean", cols: 1 },
      { key: "requireDegree", label: "Require degree", type: "boolean", cols: 1 },
      { key: "requireSelfie", label: "Require selfie", type: "boolean", cols: 1 },
      { key: "autoApproveVerifications", label: "Auto-approve verifications", type: "boolean", cols: 1 },
      { key: "verificationSlaHours", label: "Verification SLA", unit: "hours", type: "number", cols: 1 },
    ],
  },
  {
    id: "antipoaching",
    title: "Anti-Poaching & Chat",
    description: "PII redaction and chat safety",
    fields: [
      { key: "antiPoachingEnabled", label: "Anti-poaching filter", type: "boolean", cols: 1 },
      { key: "redactionLanguages", label: "Redaction languages", type: "text", cols: 1 },
      { key: "redactionSensitivity", label: "Redaction sensitivity", type: "select", options: ["LOW", "MEDIUM", "HIGH"], cols: 1 },
    ],
  },
  {
    id: "security",
    title: "Security",
    description: "MFA, timeouts, and network controls",
    fields: [
      { key: "adminMfaRequired", label: "Admin MFA required", type: "boolean", cols: 1 },
      { key: "sessionTimeoutMinutes", label: "Session timeout", unit: "min", type: "number", cols: 1 },
      { key: "ipAllowlistEnabled", label: "IP allowlist enabled", type: "boolean", cols: 1 },
      { key: "ipAllowlistCidrs", label: "IP allowlist CIDRs", type: "text", cols: 1 },
      { key: "vaultEncryptionLabel", label: "Vault encryption", type: "readonly", cols: 1 },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Alerts and webhooks",
    fields: [
      { key: "adminAlertEmail", label: "Admin alert email", type: "text", cols: 1 },
      { key: "criticalWebhookUrl", label: "Critical webhook URL", type: "text", cols: 1 },
      { key: "notifyOnVerification", label: "Notify on verification", type: "boolean", cols: 1 },
      { key: "notifyOnDispute", label: "Notify on dispute", type: "boolean", cols: 1 },
      { key: "notifyOnRiskFlag", label: "Notify on risk flag", type: "boolean", cols: 1 },
    ],
  },
  {
    id: "features",
    title: "Feature Flags",
    description: "Rollout controls",
    fields: [
      { key: "flagProgressAi", label: "Progress AI", type: "boolean", cols: 1 },
      { key: "flagConnectsEconomy", label: "Connects economy", type: "boolean", cols: 1 },
      { key: "flagGeoMapAdmin", label: "Geo map admin", type: "boolean", cols: 1 },
      { key: "flagMaintenanceBanner", label: "Maintenance banner", type: "boolean", cols: 1 },
    ],
  },
];

function formatValue(key: keyof AdminSettings, value: any): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "boolean") return value ? "ON" : "OFF";
  return String(value);
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [form, setForm] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["platform", "payments", "safety", "trust", "antipoaching", "security", "notifications", "features"]);
  const [maintenanceConfirm, setMaintenanceConfirm] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.settings();
      if (!cancelled && res) {
        const s = res as AdminSettings;
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
    if (!form) return;
    setSaving(true);
    try {
      await adminApi.updateSettings(form);
      await load();
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleMaintenance = async () => {
    if (!form) return;
    const next = !form.maintenanceMode;
    setForm({ ...form, maintenanceMode: next });
    setMaintenanceConfirm(false);
    setSaving(true);
    try {
      await adminApi.updateSettings({ maintenanceMode: next });
      await load();
    } catch (err: any) {
      setError(err.message || "Failed to update maintenance mode");
    } finally {
      setSaving(false);
    }
  };

  const forceLogout = async () => {
    setLogoutConfirm(false);
    setSaving(true);
    try {
      await adminApi.forceLogoutStaff();
      alert("Force logout staff executed. All staff sessions issued before this timestamp should be rejected on next request if the API enforces it.");
      await load();
    } catch (err: any) {
      setError(err.message || "Failed to force logout staff");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof AdminSettings, value: any) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="System Settings" subtitle="Platform configuration · Super Admin only" />
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        subtitle="Platform configuration · Super Admin only"
        action={
          settings?.meta?.updatedAt ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Last changed {new Date(settings.meta.updatedAt).toLocaleString()} by {settings.meta.updatedBy || "system"}
            </div>
          ) : null
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {SECTIONS.map((section) => {
        const isOpen = openSections.includes(section.id);
        return (
          <div key={section.id} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between p-5 text-left"
            >
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{section.title}</p>
                <p className="text-xs text-slate-500">{section.description}</p>
              </div>
              <span className="text-xs text-slate-400">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 p-5 dark:border-slate-800">
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <div
                      key={field.key}
                      className={`flex flex-col gap-1 ${field.cols === 2 ? "sm:col-span-2" : ""}`}
                    >
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {field.label}
                        {field.unit && <span className="ml-1 normal-case tracking-normal text-slate-400">({field.unit})</span>}
                      </label>
                      {field.type === "boolean" ? (
                        <button
                          type="button"
                          onClick={() => updateField(field.key, !form?.[field.key])}
                          className={`inline-flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                            form?.[field.key]
                              ? "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
                              : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          <span>{form?.[field.key] ? "ON" : "OFF"}</span>
                          <span className="text-xs">{form?.[field.key] ? "✓" : "○"}</span>
                        </button>
                      ) : field.type === "select" ? (
                        <select
                          value={String(form?.[field.key] || "")}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "readonly" ? (
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">READ-ONLY</span>
                          {formatValue(field.key, form?.[field.key])}
                        </div>
                      ) : (
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          value={String(form?.[field.key] ?? "")}
                          onChange={(e) => {
                            const val = field.type === "number" ? Number(e.target.value) : e.target.value;
                            updateField(field.key, val);
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <p className="text-sm font-bold text-slate-900 dark:text-white">Staff & RBAC</p>
        <p className="mt-1 text-xs text-slate-500">Manage staff roles, permissions, and access control from the dedicated page.</p>
        <a
          href="/rbac"
          className="mt-3 inline-flex rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
        >
          Open Role-Based Access →
        </a>
      </div>

      <div className="rounded-2xl border border-red-200 bg-white p-5 dark:border-red-900 dark:bg-[#112240]">
        <p className="text-sm font-bold text-red-700 dark:text-red-300">Danger Zone</p>
        <p className="mt-1 text-xs text-slate-500">Irreversible or site-wide actions. Confirm before proceeding.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMaintenanceConfirm(true)}
            disabled={saving}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
          >
            {form?.maintenanceMode ? "Disable maintenance mode" : "Enable maintenance mode"}
          </button>
          <button
            type="button"
            onClick={() => setLogoutConfirm(true)}
            disabled={saving}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Force logout all staff
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      {maintenanceConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-xl dark:border-red-900 dark:bg-[#112240]">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Enable maintenance mode?
            </p>
            <p className="mt-2 text-xs text-slate-500">
              This will make the platform unavailable to non-staff users until disabled. Proceed only if you are ready.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMaintenanceConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={toggleMaintenance}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                {form?.maintenanceMode ? "Disable" : "Enable"} maintenance mode
              </button>
            </div>
          </div>
        </div>
      )}

      {logoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-xl dark:border-red-900 dark:bg-[#112240]">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Force logout all staff?
            </p>
            <p className="mt-2 text-xs text-slate-500">
              This records a revocation timestamp in settings. Existing staff JWTs may remain valid until the API enforces the new cutoff. Use only during an incident.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLogoutConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={forceLogout}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Force logout staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

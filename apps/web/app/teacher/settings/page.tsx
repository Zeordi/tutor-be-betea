"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, paths, logout } from "@/lib/api";

type TeacherMe = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  subCity: string | null;
  language: string;
  notificationPrefs: Record<string, boolean>;
  preferredPayoutProvider: string | null;
};

const NOTIFS: { label: string; desc: string; key: string; defaultOn: boolean }[] = [
  {
    label: "New Booking Request",
    desc: "Alert when a parent books a session",
    key: "newBooking",
    defaultOn: true,
  },
  {
    label: "Session Reminder (1 hr before)",
    desc: "Push notification before each session",
    key: "sessionReminder",
    defaultOn: true,
  },
  {
    label: "Escrow Released",
    desc: "When payment is released to you",
    key: "escrowReleased",
    defaultOn: true,
  },
  {
    label: "New Job Matches",
    desc: "Weekly digest of matching jobs",
    key: "jobMatches",
    defaultOn: true,
  },
  {
    label: "Dispute Alerts",
    desc: "Immediate alert on any dispute",
    key: "disputeAlerts",
    defaultOn: true,
  },
  {
    label: "Platform Updates",
    desc: "Product updates and features",
    key: "platformUpdates",
    defaultOn: false,
  },
  {
    label: "Marketing Emails",
    desc: "Tips, promotions, newsletter",
    key: "marketing",
    defaultOn: false,
  },
];

const LANGS = [
  ["EN", "English"],
  ["አማ", "Amharic"],
  ["ORO", "Afaan Oromoo"],
  ["ትግ", "Tigrinya"],
] as const;

export default function TeacherSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<TeacherMe | null>(null);
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [lang, setLang] = useState("EN");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    apiFetch<TeacherMe>(paths.teachersMeProfile)
      .then((data) => {
        if (!cancelled) {
          setMe(data);
          setSelectedPayout(data?.preferredPayoutProvider || null);
          const prefs: Record<string, boolean> = {};
          NOTIFS.forEach((n) => {
            prefs[n.key] = data?.notificationPrefs?.[n.key] ?? n.defaultOn;
          });
          setToggles(prefs);
          setLang(data?.language || "EN");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load settings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (!me) return;
    setSaving(true);
    setSaved(false);

    try {
      const body: any = {
        language: lang,
        notificationPrefs: toggles,
      };
      if (selectedPayout) {
        body.payoutMethod = selectedPayout;
      }
      await apiFetch(paths.teachersProfileUpdate, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--secondary)]">
          Profile, notifications, language, and payout preferences
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="mb-4 text-base font-extrabold text-[var(--foreground)]">
          Profile information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Full Name", me?.fullName || ""],
            ["Email", me?.email || ""],
            ["Phone", me?.phoneNumber || ""],
            ["Sub-city", me?.subCity || ""],
          ].map(([label, value]) => (
            <label key={String(label)} className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--secondary)]">
                {label}
              </span>
              <input
                defaultValue={String(value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="mb-4 text-base font-extrabold text-[var(--foreground)]">
          Notification preferences
        </h2>
        <div className="divide-y divide-[var(--border)]">
          {NOTIFS.map((n) => (
            <div key={n.key} className="flex items-center gap-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--foreground)]">{n.label}</p>
                <p className="text-xs text-[var(--secondary)]">{n.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[n.key] || false}
                onClick={() =>
                  setToggles((t) => ({ ...t, [n.key]: !t[n.key] }))
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  toggles[n.key] ? "bg-[var(--primary)]" : "bg-[var(--muted)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    toggles[n.key] ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="mb-4 text-base font-extrabold text-[var(--foreground)]">
          Language
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LANGS.map(([code, name]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`rounded-xl border p-4 text-center transition ${
                lang === code
                  ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                  : "border-[var(--border)] bg-[var(--muted)]"
              }`}
            >
              <p
                className={`text-lg font-black ${
                  lang === code ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                }`}
              >
                {code}
              </p>
              <p className="text-[11px] text-[var(--secondary)]">{name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Payout */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="mb-2 text-base font-extrabold text-[var(--foreground)]">
          Payout method
        </h2>
        <p className="mb-4 text-sm text-[var(--secondary)]">
          Preferred rail for escrow releases (Telebirr / CBE Birr / M-Pesa)
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Telebirr", value: "TELEBIRR", color: "#0072CE" },
            { name: "CBE Birr", value: "CBE_BIRR", color: "#8A1538" },
            { name: "M-Pesa", value: "MPESA", color: "#00A859" },
          ].map((m) => {
            const active = selectedPayout === m.value;
            return (
              <button
                key={m.name}
                type="button"
                onClick={() => setSelectedPayout(m.value)}
                className="rounded-full border px-4 py-2 text-xs font-bold"
                style={{
                  borderColor: active ? m.color : "var(--border)",
                  color: active ? m.color : "var(--secondary)",
                  background: active ? `${m.color}12` : "transparent",
                }}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white disabled:opacity-70"
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save settings"}
        </button>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-bold text-[var(--foreground)]"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

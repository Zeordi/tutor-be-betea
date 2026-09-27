"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths, logout } from "@/lib/api";

type TeacherMe = {
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  subCity: string | null;
  language: string;
  notificationPrefs: Record<string, boolean>;
  preferredPayoutProvider: string | null;
  connectsBalance: number;
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

    return () => { cancelled = true; };
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
      <div className="space-y-5 p-4 md:p-8">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <div className="space-y-5 p-4 md:p-8">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Profile, notifications, language, and payout preferences
        </p>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <h2 className="mb-4 text-base font-extrabold text-slate-800 dark:text-white">Profile information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Full Name", me?.fullName || ""],
            ["Email", me?.email || ""],
            ["Phone", me?.phoneNumber || ""],
            ["Sub-city", me?.subCity || ""],
          ].map(([label, value]) => (
            <label key={String(label)} className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
              </span>
              <input
                defaultValue={String(value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <h2 className="mb-2 text-base font-extrabold text-slate-800 dark:text-white">Connects</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Connects are used when applying to jobs
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-2xl font-black text-teal-600">{me?.connectsBalance ?? 0}</p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Available connects</p>
          </div>
          {paths.connectsTopUp ? (
            <Link
              href={paths.connectsTopUp}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Top-up Connects
            </Link>
          ) : (
            <span className="text-xs text-slate-400">Top-up coming soon</span>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <h2 className="mb-4 text-base font-extrabold text-slate-800 dark:text-white">Notification preferences</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {NOTIFS.map((n) => (
            <div key={n.key} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{n.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{n.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[n.key] || false}
                onClick={() =>
                  setToggles((t) => ({ ...t, [n.key]: !t[n.key] }))
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  toggles[n.key] ? "bg-teal-600" : "bg-slate-200 dark:bg-slate-700"
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

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <h2 className="mb-4 text-base font-extrabold text-slate-800 dark:text-white">Language</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {LANGS.map(([code, name]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`rounded-xl border p-4 text-center transition ${
                lang === code
                  ? "border-teal-600 bg-teal-50 dark:bg-teal-950/30"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
              }`}
            >
              <p
                className={`text-lg font-black ${
                  lang === code ? "text-teal-700 dark:text-teal-300" : "text-slate-800 dark:text-slate-200"
                }`}
              >
                {code}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{name}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <h2 className="mb-2 text-base font-extrabold text-slate-800 dark:text-white">Payout method</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Preferred rail for escrow releases
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
                  borderColor: active ? m.color : undefined,
                  color: active ? m.color : undefined,
                  background: active ? `${m.color}12` : undefined,
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
          className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-70"
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save settings"}
        </button>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

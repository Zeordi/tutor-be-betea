"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const NOTIFS: { label: string; desc: string; defaultOn: boolean }[] = [
  {
    label: "New Booking Request",
    desc: "Alert when a parent books a session",
    defaultOn: true,
  },
  {
    label: "Session Reminder (1 hr before)",
    desc: "Push notification before each session",
    defaultOn: true,
  },
  {
    label: "Escrow Released",
    desc: "When payment is released to you",
    defaultOn: true,
  },
  {
    label: "New Job Matches",
    desc: "Weekly digest of matching jobs",
    defaultOn: true,
  },
  {
    label: "Dispute Alerts",
    desc: "Immediate alert on any dispute",
    defaultOn: true,
  },
  {
    label: "Platform Updates",
    desc: "Product updates and features",
    defaultOn: false,
  },
  {
    label: "Marketing Emails",
    desc: "Tips, promotions, newsletter",
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
  const [toggles, setToggles] = useState(
    Object.fromEntries(NOTIFS.map((n) => [n.label, n.defaultOn]))
  );
  const [lang, setLang] = useState("EN");

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
            ["Full Name", "Berhane Alemu"],
            ["Email", "berhane@tutor.et"],
            ["Phone", "+251 91 234 5678"],
            ["Sub-city", "Bole, Addis Ababa"],
          ].map(([label, value]) => (
            <label key={label} className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--secondary)]">
                {label}
              </span>
              <input
                defaultValue={value}
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
            <div key={n.label} className="flex items-center gap-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--foreground)]">{n.label}</p>
                <p className="text-xs text-[var(--secondary)]">{n.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[n.label]}
                onClick={() =>
                  setToggles((t) => ({ ...t, [n.label]: !t[n.label] }))
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  toggles[n.label] ? "bg-[var(--primary)]" : "bg-[var(--muted)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    toggles[n.label] ? "left-5" : "left-0.5"
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
            { name: "Telebirr", color: "#0072CE" },
            { name: "CBE Birr", color: "#8A1538" },
            { name: "M-Pesa", color: "#00A859" },
          ].map((m, i) => (
            <button
              key={m.name}
              type="button"
              className="rounded-full border px-4 py-2 text-xs font-bold"
              style={{
                borderColor: i === 0 ? m.color : "var(--border)",
                color: i === 0 ? m.color : "var(--secondary)",
                background: i === 0 ? `${m.color}12` : "transparent",
              }}
            >
              {m.name}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white"
        >
          Save settings
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
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
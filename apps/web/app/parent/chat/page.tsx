"use client";

import Link from "next/link";

const THREADS = [
  {
    id: "1",
    name: "Berhane Alemu",
    role: "Math · Kidist",
    preview: "See you tomorrow at 10:00 — bring the workbook.",
    time: "10:24 AM",
    unread: 2,
    emoji: "👨‍🏫",
    online: true,
  },
  {
    id: "2",
    name: "Selamawit Bekele",
    role: "Chemistry · Kidist",
    preview: "Progress report uploaded for this week.",
    time: "Yesterday",
    unread: 0,
    emoji: "👩‍🔬",
    online: false,
  },
  {
    id: "3",
    name: "Dawit Haile",
    role: "English · Dawit Jr",
    preview: "Homework feedback is ready in Progress.",
    time: "Mon",
    unread: 1,
    emoji: "👨‍💼",
    online: true,
  },
];

export default function ParentChatInboxPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--foreground)]">Messages</h1>
        <p className="mt-1 text-sm text-[var(--secondary)]">
          On-platform chat only · contact details are blocked for escrow & safety
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        🛡️ Anti-poaching shield active — phone numbers, Telegram, and bank accounts are
        redacted automatically.
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {THREADS.map((t, i) => (
          <Link
            key={t.id}
            href={`/parent/chat/${t.id}`}
            className={`flex items-center gap-3 px-4 py-4 transition hover:bg-[var(--muted)] ${
              i < THREADS.length - 1 ? "border-b border-[var(--border)]" : ""
            }`}
          >
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-xl">
                {t.emoji}
              </div>
              {t.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--card)] bg-emerald-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-bold text-[var(--foreground)]">{t.name}</p>
                <span className="shrink-0 text-xs text-[var(--secondary)]">{t.time}</span>
              </div>
              <p className="text-xs text-[var(--secondary)]">{t.role}</p>
              <p className="mt-0.5 truncate text-sm text-[var(--secondary)]">{t.preview}</p>
            </div>
            {t.unread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 text-[11px] font-bold text-white">
                {t.unread}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
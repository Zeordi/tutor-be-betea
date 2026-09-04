"use client";

import Link from "next/link";

const THREADS = [
  {
    id: "1",
    name: "Hana Mulugeta (Parent)",
    last: "Thursday confirmed! Thank you.",
    time: "9:41 AM",
    unread: 1,
    emoji: "👩🏾",
  },
  {
    id: "2",
    name: "Platform Safety Team",
    last: "Document approval confirmed.",
    time: "Yesterday",
    unread: 0,
    emoji: "🛡️",
  },
  {
    id: "3",
    name: "Abel Hailu (Parent)",
    last: "Session tomorrow at 10 AM.",
    time: "Aug 27",
    unread: 0,
    emoji: "👨🏿",
  },
];

export default function TeacherChatInboxPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">Messages</h1>
      <p className="mb-4 text-sm text-[var(--secondary)]">
        On-platform only · anti-poaching active
      </p>
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        🛡️ Contact details in chat are blocked to protect escrow coverage.
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {THREADS.map((t, i) => (
          <Link
            key={t.id}
            href={`/teacher/chat/${t.id}`}
            className={`flex items-center gap-3 px-4 py-4 hover:bg-[var(--muted)] ${
              i < THREADS.length - 1 ? "border-b border-[var(--border)]" : ""
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-lg">
              {t.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <p className="truncate font-bold text-[var(--foreground)]">{t.name}</p>
                <span className="text-xs text-[var(--secondary)]">{t.time}</span>
              </div>
              <p className="truncate text-sm text-[var(--secondary)]">{t.last}</p>
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
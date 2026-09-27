"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Conversation = {
  id: string;
  otherUser: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  lastMessage: {
    body: string;
    createdAt: string;
  } | null;
  unreadCount: number;
};

export default function TeacherChatInboxPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Conversation[]>(paths.chatConversations)
      .then((data) => {
        if (!cancelled) setConversations(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load conversations");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 60000;
    if (diff < 60) return `${Math.floor(diff)}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-5 p-4 md:p-8">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
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
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">Messages</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">On-platform only · anti-poaching active</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        🛡️ Contact details in chat are blocked to protect escrow coverage.
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#112240]">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No messages yet</p>
          <p className="mt-1 text-xs text-slate-400">Start a conversation from a contract.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/teacher/chat/${c.id}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-teal-200 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-teal-400 text-sm font-black text-white">
                {c.otherUser.avatarUrl ? (
                  <img
                    className="h-11 w-11 rounded-full object-cover"
                    src={c.otherUser.avatarUrl}
                    alt={c.otherUser.fullName}
                  />
                ) : (
                  initials(c.otherUser.fullName)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{c.otherUser.fullName}</p>
                  {c.lastMessage && (
                    <span className="text-[11px] text-slate-400">
                      {formatTime(c.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                {c.lastMessage && (
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{c.lastMessage.body}</p>
                )}
              </div>
              {c.unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 text-[11px] font-bold text-white">
                  {c.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

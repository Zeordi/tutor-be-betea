"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
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

type Msg = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  originalBlocked?: boolean;
};

export default function TeacherChatThreadPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "1";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [chatTitle, setChatTitle] = useState<string>("Conversation");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setMessages([]);

    Promise.allSettled([
      apiFetch<{ id: string; content: string; senderId: string; createdAt: string; originalBlocked?: boolean }[]>(paths.chatMessages(id)),
      apiFetch<Conversation[]>(paths.chatConversations),
    ]).then((results) => {
      if (cancelled) return;
      const msgsResult = results[0];
      const convsResult = results[1];

      if (msgsResult.status === "fulfilled") {
        setMessages(
          (msgsResult.value || []).map((m) => ({
            id: m.id,
            from: m.senderId === id ? "them" : "me",
            text: m.content,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            originalBlocked: m.originalBlocked,
          }))
        );
      }

      if (convsResult.status === "fulfilled") {
        const conv = (convsResult.value || []).find((c) => c.id === id);
        if (conv) setChatTitle(conv.otherUser.fullName);
      }
    }).catch(() => {
      if (!cancelled) setMessages([]);
    });

    return () => { cancelled = true; };
  }, [id]);

  const send = async () => {
    const raw = draft.trim();
    if (!raw) return;
    const tempId = `temp-${Date.now()}`;
    const optimistic: Msg = {
      id: tempId,
      from: "me",
      text: raw,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    try {
      const saved = await apiFetch<{ id: string; content: string; originalBlocked?: boolean }>(
        paths.chatSendMessage(id),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: raw }),
        },
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                id: saved.id || tempId,
                text: saved.content,
                originalBlocked: saved.originalBlocked || false,
              }
            : m
        )
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  return (
    <div className="space-y-5 p-4 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/teacher/chat")}
            className="mb-1 text-sm font-semibold text-slate-500 hover:text-teal-600 dark:text-slate-400"
          >
            ← All messages
          </button>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">{chatTitle}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Encrypted · on-platform only</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          🛡️ Anti-poaching active
        </span>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        Phone, Telegram, email, and bank numbers are replaced with [RESTRICTED CONTACT INFO].
      </div>

      <div className="flex min-h-[50vh] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-sm text-slate-400">No messages yet.</p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.from === "me"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <div
                  className={`mt-1 flex items-center gap-2 text-[10px] ${
                    m.from === "me" ? "text-white/70" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <span>{m.time}</span>
                  {m.originalBlocked && (
                    <span className="rounded bg-black/10 px-1.5 py-0.5 font-bold text-white dark:bg-black/20">
                      Contact info blocked
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type a message…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
            <button
              type="button"
              onClick={send}
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Prefer scheduling? Use{" "}
        <Link href="/teacher/calendar" className="font-bold text-teal-600 dark:text-teal-400">
          My Calendar
        </Link>
      </p>
    </div>
  );
}

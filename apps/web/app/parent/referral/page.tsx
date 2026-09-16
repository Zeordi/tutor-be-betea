"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type ReferralCode = {
  code: string;
  totalEarnings: number;
  referredCount: number;
  milestones: { label: string; reward: string; threshold: number; done: boolean; current: boolean }[];
};

type ReferredFriend = {
  id: string;
  name: string;
  date: string;
  status: "Joined" | "Pending";
  earned: string;
};

export default function ParentReferralPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [code, setCode] = useState<ReferralCode | null>(null);
  const [friends, setFriends] = useState<ReferredFriend[]>([]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<ReferralCode>(paths.referralsCode)
      .then((data) => {
        if (!cancelled) setCode(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load referral code");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    apiFetch<ReferredFriend[]>(paths.referralsMine)
      .then((data) => {
        if (!cancelled) setFriends(data || []);
      })
      .catch(() => {
        // best-effort
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const copy = () => {
    if (code?.code) {
      navigator.clipboard?.writeText(code.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <div className="h-6 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-1 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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

  if (!code) {
    return (
      <div className="p-6">
        <p className="text-sm text-[var(--secondary)]">No referral data available.</p>
      </div>
    );
  }

  const milestoneCount = friends.filter((f) => f.status === "Joined").length;
  const progressText = `${milestoneCount} / ${code.milestones[code.milestones.length - 1]?.threshold || 10} friends`;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Referral Program</h1>
        <p className="text-sm text-[var(--secondary)]">
          Invite friends. Earn ETB credit after first verified session.
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--primary)] p-6 text-white">
        <p className="text-xl font-extrabold">Invite friends. Earn ETB.</p>
        <p className="mt-2 text-sm text-white/90">
          You and your friend both get credit when they complete their first verified session.
        </p>
        <p className="mt-2 text-xs text-white/70">ጓደኛዎን ይጋብዙ · ሁለቱም ያግኙ</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-2 text-[10px] font-bold tracking-wide text-[var(--secondary)]">YOUR INVITE CODE</p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-2xl font-extrabold tracking-wide text-[var(--foreground)]">{code.code}</p>
          <button
            type="button"
            onClick={copy}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="mt-2 text-xs text-[var(--secondary)]">
          Earned so far: {code.totalEarnings.toLocaleString()} ETB · {code.referredCount} confirmed
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          ["📱", "Telebirr"],
          ["📲", "Telegram"],
          ["💬", "WhatsApp"],
          ["🔗", "Link"],
        ].map(([icon, label]) => (
          <button
            key={label as string}
            type="button"
            className="rounded-xl bg-[var(--muted)] py-3 text-center text-xs font-semibold text-[var(--secondary)]"
          >
            <span className="block text-xl">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-3 flex justify-between">
          <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">REWARD MILESTONES</p>
          <p className="text-xs font-bold text-[var(--primary)]">{progressText}</p>
        </div>
        <div className="space-y-3">
          {code.milestones.map((m, i) => (
            <div key={m.label} className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold text-white ${
                  m.done
                    ? "bg-[var(--primary)]"
                    : m.current
                      ? "bg-amber-500"
                      : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                {m.done ? "✓" : i + 1}
              </div>
              <p className="flex-1 text-sm font-semibold text-[var(--foreground)]">{m.label}</p>
              <p
                className={`text-sm font-extrabold ${
                  m.done ? "text-emerald-500" : m.current ? "text-amber-500" : "text-[var(--secondary)]"
                }`}
              >
                {m.reward}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">INVITED FRIENDS</p>
        <div className="space-y-2">
          {friends.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl bg-[var(--muted)] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] font-bold text-white">
                {f.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--foreground)]">{f.name}</p>
                <p className="text-xs text-[var(--secondary)]">{f.date}</p>
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    f.status === "Joined"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  {f.status}
                </span>
                <p className="mt-1 text-xs font-bold text-emerald-500">{f.earned}</p>
              </div>
            </div>
          ))}
          {friends.length === 0 && (
            <p className="text-center text-sm text-[var(--secondary)]">
              You haven't invited anyone yet. Share your code to start earning.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

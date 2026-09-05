"use client";

const CODE = "TBB-YESHI24";
const MILESTONES = [
  { label: "Invite 1 friend", reward: "200 ETB", done: true, current: false },
  { label: "Invite 3 friends", reward: "500 ETB", done: true, current: false },
  { label: "Invite 5 friends", reward: "1,000 ETB", done: false, current: true },
  { label: "Invite 10 friends", reward: "2,500 ETB", done: false, current: false },
];
const INVITED = [
  { name: "Meron Abebe", date: "Oct 2", status: "Joined", earned: "+200 ETB" },
  { name: "Dawit Lemma", date: "Oct 8", status: "Joined", earned: "+200 ETB" },
  { name: "Sara Kebede", date: "Oct 11", status: "Pending", earned: "—" },
];

export default function ParentReferralPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Referral Program</h1>
        <p className="text-sm text-[var(--secondary)]">Invite friends. Earn ETB credit after first verified session.</p>
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
          <p className="text-2xl font-extrabold tracking-wide text-[var(--foreground)]">{CODE}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(CODE)}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          ["📱", "Telebirr"],
          ["📲", "Telegram"],
          ["💬", "WhatsApp"],
          ["🔗", "Link"],
        ].map(([icon, label]) => (
          <button
            key={label}
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
          <p className="text-xs font-bold text-[var(--primary)]">2 / 5 friends</p>
        </div>
        <div className="space-y-3">
          {MILESTONES.map((m, i) => (
            <div key={m.label} className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold text-white ${
                  m.done ? "bg-[var(--primary)]" : m.current ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                {m.done ? "✓" : i + 1}
              </div>
              <p className="flex-1 text-sm font-semibold text-[var(--foreground)]">{m.label}</p>
              <p className={`text-sm font-extrabold ${m.done ? "text-emerald-500" : m.current ? "text-amber-500" : "text-[var(--secondary)]"}`}>
                {m.reward}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">INVITED FRIENDS</p>
        <div className="space-y-2">
          {INVITED.map((f) => (
            <div key={f.name} className="flex items-center gap-3 rounded-xl bg-[var(--muted)] p-3">
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
        </div>
      </div>
    </div>
  );
}
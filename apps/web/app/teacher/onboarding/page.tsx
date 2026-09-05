"use client";

import Link from "next/link";

const STEPS = [
  {
    id: 1,
    icon: "👤",
    label: "Complete Your Bio",
    desc: "Add headline, subjects, languages, and teaching style",
    status: "done" as const,
    time: "Completed Oct 5",
  },
  {
    id: 2,
    icon: "🪪",
    label: "Upload Identity Documents",
    desc: "Fayda National ID (front & back) + university degree",
    status: "issue" as const,
    time: "Action required · See notes",
    href: "/teacher/verification",
  },
  {
    id: 3,
    icon: "📅",
    label: "Set Availability",
    desc: "Add your weekly recurring schedule and preferred zones",
    status: "done" as const,
    time: "Completed Oct 6",
  },
  {
    id: 4,
    icon: "💰",
    label: "Payout Setup",
    desc: "Link Telebirr or CBE Birr account for earnings withdrawal",
    status: "pending" as const,
    time: "Not started",
    href: "/teacher/earnings",
  },
  {
    id: 5,
    icon: "📞",
    label: "Intro Call with Tutor Success",
    desc: "Optional 15-min orientation call with TBB team",
    status: "pending" as const,
    time: "Not started",
  },
  {
    id: 6,
    icon: "🚀",
    label: "Profile Goes Live",
    desc: "After all required steps are complete, you'll be searchable",
    status: "locked" as const,
    time: "Waiting on steps 2 & 4",
  },
];

export default function TeacherOnboardingPage() {
  const doneCount = STEPS.filter((s) => s.status === "done").length;
  const progress = Math.round((doneCount / (STEPS.length - 1)) * 100);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Getting Started</h1>
        <p className="text-sm text-[var(--secondary)]">Complete setup to go live</p>
      </div>

      <div className="rounded-2xl bg-[#0f766e] p-6 text-white">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-extrabold">Onboarding Progress</p>
            <p className="text-sm text-white/75">
              {doneCount} of {STEPS.length - 1} required steps complete
            </p>
          </div>
          <p className="text-3xl font-black">{progress}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-white/60">ፕሮፋይልዎን ለማጠናቀቅ 2 ደረጃዎች ይቀሩዎታል</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 border-b border-[var(--border)] p-4 last:border-0 ${
              step.status === "locked" ? "opacity-50" : ""
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-xl">
              {step.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-extrabold text-[var(--foreground)]">{step.label}</p>
                {step.status === "done" && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Done
                  </span>
                )}
                {step.status === "issue" && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                    Action
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--secondary)]">{step.desc}</p>
              <p
                className={`mt-1 text-[10px] font-semibold ${
                  step.status === "done"
                    ? "text-emerald-500"
                    : step.status === "issue"
                      ? "text-red-500"
                      : "text-[var(--secondary)]"
                }`}
              >
                {step.time}
              </p>
            </div>
            {step.href && step.status !== "done" && step.status !== "locked" && (
              <Link href={step.href} className="text-sm font-bold text-[var(--primary)]">
                {step.status === "issue" ? "Fix →" : "Start →"}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="font-bold text-amber-800 dark:text-amber-300">⚡ Quick action needed</p>
        <p className="my-2 text-sm text-amber-700 dark:text-amber-400">
          Add your Telebirr or CBE Birr number to complete payout setup and unlock profile publishing.
        </p>
        <Link
          href="/teacher/earnings"
          className="inline-block rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-extrabold text-white"
        >
          Set Up Payout Now →
        </Link>
      </div>
    </div>
  );
}
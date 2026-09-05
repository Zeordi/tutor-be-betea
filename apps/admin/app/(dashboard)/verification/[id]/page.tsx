"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";

export default function VerificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Review"
        subtitle={`Case ${id} · Admin eyes only · AES-256 vault`}
        action={
          <Link href="/verification" className="text-sm font-semibold text-slate-500 hover:text-teal-600">
            ← Back to queue
          </Link>
        }
      />

      <div className="rounded-2xl border-2 border-red-300 bg-white p-5 dark:border-red-800 dark:bg-[#112240]">
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/30">
          <p className="text-xs font-bold text-red-700 dark:text-red-400">
            🔐 Document Vault — Admin Only
          </p>
          <p className="text-[10px] text-red-600 dark:text-red-500">
            AES-256 · Access logged · NEVER public · Raw identity docs
          </p>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white">
            ST
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Selamawit Tadesse</p>
            <p className="text-xs text-slate-500">+251 91 *** 4521 · TEACHER · Pending verification</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🛡️", title: "Fayda National ID", status: "Ready", tone: "emerald" },
            { icon: "🎓", title: "University Degree", status: "Ready", tone: "emerald" },
            { icon: "🤳", title: "Liveness Selfie", status: "Ready", tone: "emerald" },
            { icon: "📋", title: "Police Clearance", status: "Pending upload", tone: "amber" },
          ].map((doc) => (
            <div
              key={doc.title}
              className={`rounded-xl border-2 p-4 text-center ${
                doc.tone === "emerald"
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                  : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
              }`}
            >
              <p className="text-2xl">{doc.icon}</p>
              <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{doc.title}</p>
              <p
                className={`text-xs font-semibold ${
                  doc.tone === "emerald" ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {doc.status === "Ready" ? "✓ " : "⏳ "}
                {doc.status}
              </p>
              <button className="mt-2 text-xs font-bold text-teal-600 hover:underline">
                Open in vault viewer
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => router.push("/verification")}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          ✓ Approve & Issue Badges
        </button>
        <button className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Request More Docs
        </button>
        <button className="rounded-xl border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          Reject
        </button>
      </div>
    </div>
  );
}
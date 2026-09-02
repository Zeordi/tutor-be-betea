export default function TeacherVerificationPage() {
  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Verification Status</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Document Status</h3>
          <div className="space-y-3">
            {[
              { name: "National ID (Fayda)", status: "verified", note: "Verified Aug 2024" },
              { name: "University Degree", status: "verified", note: "MSc Mathematics – AAU" },
              { name: "Police Clearance", status: "pending", note: "Under review · 2-3 days" },
              { name: "Intro Video", status: "missing", note: "Not uploaded yet" },
            ].map((doc) => (
              <div
                key={doc.name}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-700"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                    doc.status === "verified"
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : doc.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {doc.status === "verified" ? "✅" : doc.status === "pending" ? "⏳" : "📎"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{doc.name}</p>
                  <p className="text-xs text-slate-400">{doc.note}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-3 font-bold text-slate-800 dark:text-white">Onboarding Checklist</h3>
            <div className="space-y-2">
              {[
                ["Create account", true],
                ["Verify phone", true],
                ["Upload National ID", true],
                ["Upload Degree", true],
                ["Upload Police Check", false],
                ["Add intro video", false],
                ["Complete profile", true],
                ["Pass quiz", true],
              ].map(([step, done]) => (
                <div key={String(step)} className="flex items-center gap-2">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      done ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-400 dark:bg-slate-700"
                    }`}
                  >
                    {done ? "✓" : "○"}
                  </div>
                  <p
                    className={`text-xs text-slate-700 dark:text-slate-300 ${done ? "line-through" : ""}`}
                  >
                    {step as string}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="mb-1 text-sm font-bold text-amber-700 dark:text-amber-300">Admin Message</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              &quot;Your police clearance is under review. Expected completion: 2–3 business days.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
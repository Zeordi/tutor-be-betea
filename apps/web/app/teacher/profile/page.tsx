export default function TeacherProfilePage() {
  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">My Profile & Showcase</h2>
        <button className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white">Edit Profile</button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-[#112240] md:col-span-2">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-600 text-xl font-bold text-white">
              ST
            </div>
            <div className="flex-1">
              <p className="text-xl font-extrabold text-slate-800 dark:text-white">Selamawit Tadesse</p>
              <p className="mb-2 text-sm text-slate-500">
                Mathematics · Physics · Grade 9–12 · Addis Ababa
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {["🛡️ National ID", "🎓 Degree", "🥇 Gold", "⭐ Elite"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {[
                  ["4.9", "⭐ Rating"],
                  ["128", "📚 Sessions"],
                  ["98%", "⏰ On-time"],
                  ["94%", "🔁 Rehire"],
                ].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-lg font-extrabold text-teal-600">{v}</p>
                    <p className="text-[10px] text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">About Me</p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              MSc Mathematics from Addis Ababa University. 7 years teaching experience. Specializes
              in Ethiopian National Exams (Grade 10 and 12). Fluent in Amharic, Tigrinya, and English.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
            <p className="mb-3 text-sm font-bold text-slate-800 dark:text-white">Public Profile Preview</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p>✓ Verified National ID</p>
              <p>✓ Verified Degree (MSc Math)</p>
              <p>✓ Gold Tutor Badge</p>
              <p>✓ Elite Tutor Badge</p>
              <p className="text-red-500">✗ No raw docs shown publicly</p>
            </div>
          </div>
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
            <p className="mb-2 text-sm font-bold text-teal-700 dark:text-teal-300">Profile Strength</p>
            <div className="mb-1 h-2 rounded-full bg-teal-100 dark:bg-teal-900">
              <div className="h-full w-[85%] rounded-full bg-teal-500" />
            </div>
            <p className="text-xs text-teal-600">85% · Add intro video to reach 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function ParentSettingsPage() {
  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Profile & Settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white">
              YH
            </div>
            <div>
              <p className="font-extrabold text-slate-800 dark:text-white">Yeshi Haile</p>
              <p className="text-sm text-slate-400">+251 91 234 5678</p>
              <span className="mt-1 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30">
                Elite Plan
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              ["Full Name", "Yeshi Haile"],
              ["Phone", "+251 91 234 5678"],
              ["Location", "Bole, Addis Ababa"],
              ["Language", "Amharic / English"],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800"
              >
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{val}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Edit Profile
          </button>
        </div>
        <div className="space-y-3">
          {[
            { title: "Notifications", desc: "Session reminders, report alerts", icon: "🔔" },
            { title: "Privacy & Safety", desc: "Location sharing, emergency contacts", icon: "🛡️" },
            { title: "Payment Methods", desc: "Telebirr, CBE Birr linked", icon: "💳" },
            { title: "Language", desc: "Amharic / English", icon: "🌐" },
            { title: "Help & Support", desc: "FAQ, live chat, tickets", icon: "❓" },
            { title: "Referral Program", desc: "Invite & earn 500 ETB", icon: "🎁" },
          ].map((item) => (
            <button
              key={item.title}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left transition-all hover:border-teal-300 dark:border-slate-800 dark:bg-[#112240] dark:hover:border-teal-700"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{item.title}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <span className="text-slate-400">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
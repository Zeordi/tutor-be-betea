"use client";

const DAYS = ["Mon 1", "Tue 2", "Wed 3", "Thu 4", "Fri 5", "Sat 6", "Sun 7"];
const EVENTS: Record<string, { title: string; child: string; color: string }[]> = {
  "Mon 1": [{ title: "Math 10:00", child: "Kidist", color: "#0D9488" }],
  "Wed 3": [
    { title: "Physics 14:00", child: "Kidist", color: "#0284C7" },
    { title: "English 16:00", child: "Dawit", color: "#7C3AED" },
  ],
  "Fri 5": [{ title: "Chemistry 09:00", child: "Kidist", color: "#F59E0B" }],
};

export default function FamilyCalendarPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">
        Family Calendar
      </h1>
      <p className="mb-8 text-sm text-[var(--secondary)]">
        Color-coded by child · weekly view
      </p>
      <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-teal-600" /> Kidist
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-violet-600" /> Dawit
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {DAYS.map((d) => (
          <div
            key={d}
            className="min-h-[140px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
          >
            <p className="mb-2 text-xs font-bold text-[var(--secondary)]">{d}</p>
            <div className="space-y-1.5">
              {(EVENTS[d] || []).map((e) => (
                <div
                  key={e.title}
                  className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-white"
                  style={{ background: e.color }}
                >
                  {e.title}
                  <div className="text-[10px] opacity-80">{e.child}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
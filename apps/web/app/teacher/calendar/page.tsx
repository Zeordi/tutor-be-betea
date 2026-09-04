"use client";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EVENTS: Record<string, { title: string; student: string }[]> = {
  Mon: [{ title: "10:00 Math", student: "Kidist" }],
  Wed: [{ title: "14:00 Physics", student: "Kidist" }],
  Fri: [{ title: "09:00 Math", student: "Dawit Jr" }],
};

export default function TeacherCalendarPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">My Schedule</h1>
      <p className="mb-6 text-sm text-[var(--secondary)]">Weekly session calendar</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {DAYS.map((d) => (
          <div
            key={d}
            className="min-h-[120px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
          >
            <p className="mb-2 text-xs font-bold text-[var(--secondary)]">{d}</p>
            <div className="space-y-1.5">
              {(EVENTS[d] || []).map((e) => (
                <div
                  key={e.title}
                  className="rounded-lg bg-[var(--primary)] px-2 py-1.5 text-[11px] font-semibold text-white"
                >
                  {e.title}
                  <div className="text-[10px] opacity-80">{e.student}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
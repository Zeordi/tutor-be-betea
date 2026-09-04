"use client";

import { useState } from "react";

const COLS = [
  {
    status: "Submitted",
    color: "var(--primary)",
    apps: [{ title: "IGCSE Math Tutor", family: "Girma · Yeka", date: "Aug 28", rate: "500 ETB/hr" }],
  },
  {
    status: "Reviewing",
    color: "#F59E0B",
    apps: [
      { title: "Grade 11 Math", family: "Mulugeta · Bole", date: "Aug 25", rate: "450 ETB/hr" },
      { title: "Grade 12 Physics", family: "Tadesse · Sarbet", date: "Aug 24", rate: "480 ETB/hr" },
    ],
  },
  {
    status: "Hired",
    color: "#2DD4BF",
    apps: [{ title: "Grade 9–10 Maths", family: "Hailu · Kirkos", date: "Aug 20", rate: "450 ETB/hr" }],
  },
  {
    status: "Declined",
    color: "#EF4444",
    apps: [{ title: "Cambridge A-Level", family: "Bekele · Arada", date: "Aug 15", rate: "550 ETB/hr" }],
  },
];

export default function TeacherApplicationsPage() {
  const [mode, setMode] = useState<"kanban" | "table">("kanban");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {[["5", "Applied"], ["2", "Reviewing"], ["1", "Hired"], ["1", "Declined"]].map(
            ([v, l]) => (
              <div
                key={l}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
              >
                <p className="text-xl font-black text-[var(--primary)]">{v}</p>
                <p className="text-[11px] text-[var(--secondary)]">{l}</p>
              </div>
            )
          )}
        </div>
        <div className="flex overflow-hidden rounded-lg border border-[var(--border)]">
          {(["kanban", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setMode(v)}
              className={`px-4 py-2 text-xs font-bold capitalize ${
                mode === v
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--card)] text-[var(--secondary)]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {mode === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLS.map((col) => (
            <div key={col.status}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: col.color }}
                />
                <span className="text-xs font-bold uppercase text-[var(--secondary)]">
                  {col.status}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{ background: `${col.color}18`, color: col.color }}
                >
                  {col.apps.length}
                </span>
              </div>
              {col.apps.map((a) => (
                <div
                  key={a.title}
                  className="mb-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
                >
                  <p className="font-bold text-[var(--foreground)]">{a.title}</p>
                  <p className="text-xs text-[var(--secondary)]">{a.family}</p>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-[var(--secondary)]">{a.date}</span>
                    <span className="font-mono font-bold text-[var(--primary)]">
                      {a.rate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                {["Title", "Family", "Status", "Rate", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-bold uppercase text-[var(--secondary)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COLS.flatMap((c) =>
                c.apps.map((a) => (
                  <tr key={a.title} className="border-b border-[var(--border)]">
                    <td className="px-4 py-3 font-bold">{a.title}</td>
                    <td className="px-4 py-3 text-[var(--secondary)]">{a.family}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                        style={{ background: `${c.color}18`, color: c.color }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--primary)]">{a.rate}</td>
                    <td className="px-4 py-3 text-[var(--secondary)]">{a.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
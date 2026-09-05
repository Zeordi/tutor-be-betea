import React from "react";
import { Card } from "./index";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";

export interface AIScorecardProps {
  student: string;
  grade: string;
  subject: string;
  mastery: number;
  attendance: number;
  readiness: number;
  aiSummary: string;
  trend?: "up" | "down" | "neutral";
  examDate?: string;
  className?: string;
}

/** A5 · Student AI Scorecard */
export function AIScorecard({
  student,
  grade,
  subject,
  mastery,
  attendance,
  readiness,
  aiSummary,
  trend = "neutral",
  examDate,
  className = "",
}: AIScorecardProps) {
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendCls =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-red-500"
        : "text-amber-500";

  const meters = [
    { label: "Mastery", val: mastery, color: "teal" as const },
    { label: "Attendance", val: attendance, color: "emerald" as const },
    { label: "Readiness", val: readiness, color: "blue" as const },
  ];

  const status = mastery >= 80 ? "On Track" : mastery >= 70 ? "Needs Focus" : "At Risk";
  const statusVariant = mastery >= 80 ? "success" : mastery >= 70 ? "warning" : "error";

  return (
    <Card hover className={className}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar name={student} size="md" />
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{student}</p>
            <p className="text-xs text-slate-500">
              {grade} · {subject}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-extrabold ${trendCls}`}>{trendIcon}</p>
          <p className="text-[10px] text-slate-400">Trend</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        {meters.map((m) => (
          <div
            key={m.label}
            className="rounded-xl bg-slate-50 p-2 text-center dark:bg-slate-800/60"
          >
            <p
              className={`text-lg font-extrabold ${
                m.color === "teal"
                  ? "text-teal-600 dark:text-teal-400"
                  : m.color === "emerald"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {m.val}%
            </p>
            <p className="text-[10px] text-slate-400">{m.label}</p>
            <div className="mt-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full ${
                  m.color === "teal"
                    ? "bg-teal-500"
                    : m.color === "emerald"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, m.val)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 p-3">
        <p className="mb-1 text-[10px] font-bold text-white/80">🤖 AI Insight</p>
        <p className="text-xs leading-relaxed text-white/90">{aiSummary}</p>
      </div>

      <div className="flex items-center justify-between">
        {examDate ? (
          <span className="text-[10px] text-slate-400">🗓️ National Exam: {examDate}</span>
        ) : (
          <span />
        )}
        <Badge variant={statusVariant as "success" | "warning" | "error"} size="sm">
          {status}
        </Badge>
      </div>
    </Card>
  );
}

export default AIScorecard;
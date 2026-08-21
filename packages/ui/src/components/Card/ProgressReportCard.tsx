import React from "react";

interface ProgressReportCardProps {
  childName: string;
  weekLabel: string;
  aiSummary: string;
  topicsCovered: number;
  quizScore: number;
  predictedImprovement: string;
}

export function ProgressReportCard({
  childName,
  weekLabel,
  aiSummary,
  topicsCovered,
  quizScore,
  predictedImprovement,
}: ProgressReportCardProps) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{childName}</h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--secondary)" }}>
            {weekLabel}
          </p>
        </div>
      </div>

      <div
        style={{
          padding: 12,
          borderRadius: 12,
          backgroundColor: "var(--muted)",
          marginBottom: 16,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>AI Summary</p>
        <p style={{ margin: "6px 0 0", fontSize: 14 }}>{aiSummary}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{topicsCovered}</p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--secondary)" }}>Topics</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{quizScore}%</p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--secondary)" }}>Quiz Avg</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--success)" }}>
            {predictedImprovement}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--secondary)" }}>Predicted</p>
        </div>
      </div>
    </div>
  );
}

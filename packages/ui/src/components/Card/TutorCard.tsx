import React from "react";
import { Badge } from "../Badge";

interface TutorCardProps {
  name: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  distance?: string;
  badges?: Array<"id_verified" | "degree_verified" | "gold_elite">;
  onPress?: () => void;
}

export function TutorCard({
  name,
  subjects,
  rating,
  reviewCount,
  hourlyRate,
  distance,
  badges = [],
  onPress,
}: TutorCardProps) {
  return (
    <div
      onClick={onPress}
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface)",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{name}</h3>
          <p style={{ fontSize: 13, color: "var(--secondary)", margin: "4px 0 0" }}>
            {subjects.join(" • ")}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: 700, margin: 0 }}>ETB {hourlyRate}/hr</p>
          {distance && (
            <p style={{ fontSize: 12, color: "var(--secondary)", margin: "4px 0 0" }}>
              {distance}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {badges.map((b) => (
          <Badge key={b} type={b} />
        ))}
      </div>

      <div style={{ fontSize: 13, color: "var(--secondary)" }}>
        ★ {rating.toFixed(1)} ({reviewCount} reviews)
      </div>
    </div>
  );
}

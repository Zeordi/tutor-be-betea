import React from "react";

type BadgeType = "id_verified" | "degree_verified" | "gold_elite" | "silver" | "bronze" | "urgent";

interface BadgeProps {
  type: BadgeType;
  label?: string;
}

const badgeConfig: Record<BadgeType, { emoji: string; label: string; color: string }> = {
  id_verified: { emoji: "🛡️", label: "National ID Verified", color: "#0F766E" },
  degree_verified: { emoji: "🎓", label: "Degree Verified", color: "#1D4ED8" },
  gold_elite: { emoji: "🥇", label: "Gold Elite", color: "#D97706" },
  silver: { emoji: "🥈", label: "Silver", color: "#64748B" },
  bronze: { emoji: "🥉", label: "Bronze", color: "#9A3412" },
  urgent: { emoji: "⚡", label: "Urgent", color: "#DC2626" },
};

export function Badge({ type, label }: BadgeProps) {
  const config = badgeConfig[type];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 9999,
        backgroundColor: `${config.color}15`,
        color: config.color,
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <span>{config.emoji}</span>
      <span>{label || config.label}</span>
    </span>
  );
}

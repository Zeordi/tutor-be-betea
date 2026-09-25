import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "tealGlow";
}

const paddingMap = { none: "", sm: "p-3", md: "p-4", lg: "p-6" };
const shadowMap: Record<string, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow",
  lg: "shadow-lg",
  xl: "shadow-xl",
  tealGlow: "shadow-teal-glow",
};

export function Card({
  children,
  className = "",
  hover,
  padding = "md",
  shadow = "sm",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800/80 ${
        hover ? "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg" : ""
      } ${paddingMap[padding]} ${shadowMap[shadow] || shadowMap.sm} ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
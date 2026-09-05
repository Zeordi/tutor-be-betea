import React from "react";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
  verified?: boolean;
  className?: string;
}

const sizeMap = {
  xs: { outer: "h-6 w-6", text: "text-[9px]", dot: "h-2 w-2", verified: "h-3 w-3 text-[6px]" },
  sm: { outer: "h-8 w-8", text: "text-xs", dot: "h-2.5 w-2.5", verified: "h-4 w-4 text-[8px]" },
  md: { outer: "h-10 w-10", text: "text-sm", dot: "h-3 w-3", verified: "h-5 w-5 text-[10px]" },
  lg: { outer: "h-14 w-14", text: "text-lg", dot: "h-3.5 w-3.5", verified: "h-5 w-5 text-xs" },
  xl: { outer: "h-20 w-20", text: "text-2xl", dot: "h-4 w-4", verified: "h-6 w-6 text-xs" },
};

const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-slate-400",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

const avatarColors = [
  "from-teal-500 to-teal-700",
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-emerald-500 to-emerald-700",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function colorForName(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export function Avatar({
  src,
  name,
  size = "md",
  status,
  verified,
  className = "",
}: AvatarProps) {
  const s = sizeMap[size];
  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div
        className={`${s.outer} flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ring-2 ring-white dark:ring-slate-800 ${colorForName(name)}`}
      >
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className={`${s.text} font-bold text-white`}>{initials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-800 ${s.dot} ${statusColors[status]}`}
        />
      )}
      {verified && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-teal-600 font-bold text-white ${s.verified}`}
        >
          ✓
        </span>
      )}
    </div>
  );
}

export default Avatar;
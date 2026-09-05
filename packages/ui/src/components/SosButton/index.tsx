import React from "react";

export type SosState = "idle" | "holding" | "sent";

export interface SosButtonProps {
  state?: SosState;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
}

export function SosButton({ state = "idle", onHoldStart, onHoldEnd }: SosButtonProps) {
  const label =
    state === "sent" ? "Alert Sent" : state === "holding" ? "Hold to confirm…" : "Hold for SOS";
  const bg =
    state === "sent"
      ? "bg-emerald-600"
      : state === "holding"
        ? "bg-red-700 scale-105"
        : "bg-red-600";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onMouseDown={onHoldStart}
        onMouseUp={onHoldEnd}
        onTouchStart={onHoldStart}
        onTouchEnd={onHoldEnd}
        className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl text-white shadow-lg transition ${bg}`}
      >
        🚨
      </button>
      <p className="text-center text-xs font-bold text-slate-700 dark:text-slate-200">{label}</p>
      <p className="max-w-[200px] text-center text-[10px] text-slate-500">
        Hold 3 seconds to alert emergency contacts and share location
      </p>
    </div>
  );
}

export default SosButton;
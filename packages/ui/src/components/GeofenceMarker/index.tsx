import React from "react";
import { Card } from "../Card";
import { Avatar } from "../Avatar";

export type GeofenceStatus = "inside" | "outside" | "approaching";

export interface GeofenceMarkerProps {
  label?: string;
  status: GeofenceStatus;
  location: string;
  tutorName: string;
  radiusLabel?: string;
  className?: string;
}

/** A6 · Geofence Map Marker */
export function GeofenceMarker({
  label,
  status,
  location,
  tutorName,
  radiusLabel = "150m radius",
  className = "",
}: GeofenceMarkerProps) {
  const statusColor =
    status === "inside"
      ? "bg-emerald-500"
      : status === "approaching"
        ? "bg-amber-500"
        : "bg-red-500";
  const statusLabel =
    status === "inside"
      ? "✓ Inside Zone"
      : status === "approaching"
        ? "⚡ Approaching"
        : "✗ Outside Zone";
  const statusCls =
    status === "inside"
      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
      : status === "approaching"
        ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
        : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";

  const pinPos =
    status === "inside"
      ? "-top-4 -right-4"
      : status === "approaching"
        ? "-top-10 -right-10"
        : "-top-16 -right-16";

  return (
    <Card className={className}>
      {label && <p className="mb-3 text-xs font-semibold text-slate-500">{label}</p>}
      <div
        className="relative mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-teal-100 dark:bg-teal-900/30"
        style={{ height: 160 }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative">
          <div className="absolute -inset-20 rounded-full border-2 border-teal-400/30" />
          <div className="absolute -inset-14 rounded-full border-2 border-teal-400/50 bg-teal-400/5" />
          <div className="absolute -inset-8 rounded-full border-2 border-teal-500/60 bg-teal-400/10" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-teal-600 shadow-lg">
              <span className="text-sm text-white">🏠</span>
            </div>
            <div className="mt-0.5 h-2 w-2 rounded-full bg-teal-600" />
          </div>
          <div className={`absolute ${pinPos} flex flex-col items-center`}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md ${statusColor}`}
            >
              <span className="text-xs text-white">👤</span>
            </div>
            <div className={`mt-0.5 h-1.5 w-1.5 rounded-full ${statusColor}`} />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-bold text-teal-700 backdrop-blur dark:bg-slate-800/80 dark:text-teal-300">
          {radiusLabel}
        </div>
      </div>
      <div
        className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold ${statusCls}`}
      >
        <div className="flex items-center gap-2">
          <Avatar name={tutorName} size="xs" />
          <span className="text-slate-700 dark:text-slate-200">
            {tutorName} · {location}
          </span>
        </div>
        <span>{statusLabel}</span>
      </div>
    </Card>
  );
}

export default GeofenceMarker;
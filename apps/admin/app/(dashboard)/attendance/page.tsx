"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminAttendanceLog } from "@/lib/adminApi";

function geofenceClass(verified: boolean) {
  return verified
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
}

export default function AttendanceGeoPage() {
  const [logs, setLogs] = useState<AdminAttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.attendanceList(50);
      if (!cancelled) setLogs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load attendance");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const outsideGeofence = logs.filter((l) => !l.isVerifiedGeofence).length;
  const pendingConfirm = logs.filter((l) => !l.parentConfirmed).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Geofence"
        subtitle="150m rule · GPS check-in/out · Offline sync review"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-teal-600">{logs.length}</p>
          <p className="mt-2 text-xs text-slate-500">Recent sessions</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-red-600">{outsideGeofence}</p>
          <p className="mt-2 text-xs text-slate-500">Outside geofence</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-amber-600">{pendingConfirm}</p>
          <p className="mt-2 text-xs text-slate-500">Pending parent confirm</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-[#112240]">
        <p className="text-3xl">📍</p>
        <p className="mt-2 font-bold text-slate-800 dark:text-white">Live geo map panel</p>
        <p className="text-sm text-slate-500">
          Wire PostGIS session points here in a later iteration.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
          <div className="col-span-2">Session</div>
          <div className="col-span-2">Teacher</div>
          <div className="col-span-2">Check-in</div>
          <div className="col-span-2">Check-out</div>
          <div className="col-span-2">Geofence</div>
          <div className="col-span-1">Dist</div>
          <div className="col-span-1">Parent</div>
        </div>
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No attendance logs found.</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="grid grid-cols-12 items-center gap-2 border-b border-slate-50 px-4 py-3 text-sm last:border-0 dark:border-slate-800/60"
            >
              <div className="col-span-2 font-mono text-xs text-slate-500">{log.id.slice(0, 8)}</div>
              <div className="col-span-2 text-slate-600 dark:text-slate-300">{log.teacherId.slice(0, 8)}</div>
              <div className="col-span-2 text-xs text-slate-500">
                {log.checkInTime ? new Date(log.checkInTime).toLocaleString() : "—"}
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                {log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : "—"}
              </div>
              <div className="col-span-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${geofenceClass(log.isVerifiedGeofence)}`}
                >
                  {log.isVerifiedGeofence ? "Verified" : "Outside"}
                </span>
              </div>
              <div className="col-span-1 text-xs text-slate-500">
                {Number(log.distanceMeters).toFixed(0)}m
              </div>
              <div className="col-span-1 text-xs text-slate-500">
                {log.parentConfirmed ? "✓" : "—"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

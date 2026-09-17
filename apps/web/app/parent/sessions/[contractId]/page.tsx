"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, paths } from "@/lib/api";

type AttendanceLog = {
  id: string;
  checkInTime: string;
  checkOutTime?: string | null;
  distanceMeters?: number | null;
  isVerifiedGeofence?: boolean;
  requiresManualConfirm?: boolean;
  parentConfirmed?: boolean;
};

export default function ParentSessionPage() {
  const params = useParams();
  const contractId = String(params.contractId || "");

  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    try {
      const data = await apiFetch(paths.attendanceByContract(contractId));
      setLogs(Array.isArray(data) ? data : data?.logs || []);
    } catch (e: any) {
      setMessage(e.message || "Failed to load sessions");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmAttendance = async (attendanceId: string) => {
    setConfirmingId(attendanceId);
    setMessage("");
    try {
      await apiFetch(paths.attendanceConfirm(attendanceId), {
        method: "POST",
        body: JSON.stringify({}),
      });
      setMessage("Session confirmed.");
      await load();
    } catch (e: any) {
      setMessage(e.message || "Confirm failed");
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Session attendance</h1>
      <p className="text-[var(--secondary)] mb-8">
        Review tutor check-ins and confirm completed sessions.
      </p>

      {message && (
        <p className="mb-4 text-sm text-[var(--secondary)]">{message}</p>
      )}

      {loading ? (
        <p className="text-[var(--secondary)]">Loading...</p>
      ) : logs.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-xl font-bold mb-2">No sessions yet</h3>
          <p className="text-[var(--secondary)]">
            Attendance will show here after the tutor checks in.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="card">
              <h3 className="font-bold">
                {new Date(log.checkInTime).toLocaleString()}
              </h3>
              <p className="text-sm text-[var(--secondary)] mt-1">
                Checkout:{" "}
                {log.checkOutTime
                  ? new Date(log.checkOutTime).toLocaleString()
                  : "In progress"}
              </p>
              <p className="text-sm text-[var(--secondary)]">
                Geofence:{" "}
                {log.isVerifiedGeofence ? "Verified ✅" : "Not verified"}
                {log.requiresManualConfirm ? " · ⚠️ Manual confirm required" : ""}
              </p>
              <p className="text-sm text-[var(--secondary)]">
                Distance: {Number(log.distanceMeters ?? 0).toLocaleString()}m
              </p>
              <p className="text-sm text-[var(--secondary)]">
                Parent confirmed: {log.parentConfirmed ? "Yes ✅" : "No"}
              </p>
              {!log.parentConfirmed && log.checkOutTime && (
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  disabled={confirmingId === log.id}
                  onClick={() => confirmAttendance(log.id)}
                >
                  {confirmingId === log.id ? "Confirming…" : "Confirm session"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
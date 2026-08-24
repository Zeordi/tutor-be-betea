"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type AttendanceLog = {
  id: string;
  checkInTime: string;
  checkOutTime?: string | null;
  distanceMeters?: number;
  isVerifiedGeofence?: boolean;
  parentConfirmed?: boolean;
};

export default function ParentSessionsPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/attendance/contract/${contractId}`);
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractId) loadLogs();
  }, [contractId]);

  const confirmSession = async (attendanceId: string) => {
    try {
      await apiFetch(`/attendance/${attendanceId}/confirm`, {
        method: "POST",
      });
      setMessage("Session confirmed successfully.");
      loadLogs();
    } catch (error: any) {
      setMessage(error.message || "Failed to confirm session");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Sessions & Attendance</h1>
      <p className="text-[var(--secondary)] mb-8">
        Review geofenced check-ins and confirm completed sessions.
      </p>

      {message && (
        <div className="card mb-5 text-sm text-[var(--secondary)]">{message}</div>
      )}

      {loading ? (
        <p className="text-[var(--secondary)]">Loading sessions...</p>
      ) : logs.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-xl font-bold mb-2">No sessions yet</h3>
          <p className="text-[var(--secondary)]">
            Attendance logs will appear after the tutor checks in.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg">
                    Check-in: {new Date(log.checkInTime).toLocaleString()}
                  </h3>
                  <p className="text-sm text-[var(--secondary)] mt-1">
                    Check-out:{" "}
                    {log.checkOutTime
                      ? new Date(log.checkOutTime).toLocaleString()
                      : "In progress"}
                  </p>
                  <p className="text-sm text-[var(--secondary)]">
                    Distance: {Number(log.distanceMeters || 0).toFixed(1)} m
                  </p>
                  <p className="text-sm text-[var(--secondary)]">
                    Geofence: {log.isVerifiedGeofence ? "Verified ✅" : "Not verified"}
                  </p>
                  <p className="text-sm text-[var(--secondary)]">
                    Parent confirmation: {log.parentConfirmed ? "Confirmed ✅" : "Pending"}
                  </p>
                </div>

                {!log.parentConfirmed && log.checkOutTime && (
                  <button
                    onClick={() => confirmSession(log.id)}
                    className="btn btn-primary"
                  >
                    Confirm Session
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
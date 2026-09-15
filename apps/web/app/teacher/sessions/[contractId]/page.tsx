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
  parentConfirmed?: boolean;
};

async function getBrowserPosition(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => reject(new Error(err.message || "Location denied")),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  });
}

export default function TeacherSessionPage() {
  const params = useParams();
  const contractId = String(params.contractId || "");

  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    try {
      const data = await apiFetch(paths.attendanceByContract(contractId));
      setLogs(Array.isArray(data) ? data : data?.logs || []);
    } catch (e: any) {
      setMessage(e.message || "Failed to load attendance");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    load();
  }, [load]);

  const activeSession = logs.find((l) => !l.checkOutTime);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      const { latitude, longitude } = await getBrowserPosition();
      // Required shape: contractId, latitude, longitude, offlineId?
      await apiFetch(paths.attendanceCheckIn, {
        method: "POST",
        body: JSON.stringify({
          contractId,
          latitude,
          longitude,
        }),
      });
      setMessage("Checked in successfully.");
      await load();
    } catch (e: any) {
      setMessage(e.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      let latitude: number | undefined;
      let longitude: number | undefined;
      try {
        const pos = await getBrowserPosition();
        latitude = pos.latitude;
        longitude = pos.longitude;
      } catch {
        /* optional on checkout */
      }
      // Required shape: contractId, latitude?, longitude?, offlineId?
      await apiFetch(paths.attendanceCheckOut, {
        method: "POST",
        body: JSON.stringify({
          contractId,
          ...(latitude != null ? { latitude, longitude } : {}),
        }),
      });
      setMessage("Checked out successfully.");
      await load();
    } catch (e: any) {
      setMessage(e.message || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Session Check-in</h1>
      <p className="text-[var(--secondary)] mb-8">
        Use geofenced attendance to start and complete tutoring sessions.
      </p>

      <div className="card mb-6">
        <h3 className="font-bold text-lg mb-3">Current Action</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={actionLoading || !!activeSession}
            className="btn btn-primary"
          >
            {actionLoading ? "Please wait..." : "Check In"}
          </button>
          <button
            type="button"
            onClick={handleCheckOut}
            disabled={actionLoading || !activeSession}
            className="btn btn-secondary"
          >
            {actionLoading ? "Please wait..." : "Check Out"}
          </button>
        </div>
        {message && (
          <p className="text-sm text-[var(--secondary)] mt-4">{message}</p>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Attendance History</h2>

      {loading ? (
        <p className="text-[var(--secondary)]">Loading...</p>
      ) : logs.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-xl font-bold mb-2">No attendance yet</h3>
          <p className="text-[var(--secondary)]">
            Your check-ins will appear here.
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
                Distance: {Number(log.distanceMeters || 0).toFixed(1)} m
              </p>
              <p className="text-sm text-[var(--secondary)]">
                Geofence:{" "}
                {log.isVerifiedGeofence ? "Verified ✅" : "Not verified"}
              </p>
              <p className="text-sm text-[var(--secondary)]">
                Parent confirmed: {log.parentConfirmed ? "Yes ✅" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
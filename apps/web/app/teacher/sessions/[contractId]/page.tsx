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

export default function TeacherSessionPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
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

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported on this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => reject(new Error("Unable to get your location")),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setMessage("");
      const location = await getLocation();

      await apiFetch("/attendance/check-in", {
        method: "POST",
        body: JSON.stringify({
          contractId,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      setMessage("Checked in successfully.");
      loadLogs();
    } catch (error: any) {
      setMessage(error.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setMessage("");
      const location = await getLocation();

      await apiFetch("/attendance/check-out", {
        method: "POST",
        body: JSON.stringify({
          contractId,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      setMessage("Checked out successfully.");
      loadLogs();
    } catch (error: any) {
      setMessage(error.message || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  const activeSession = logs.find((l) => !l.checkOutTime);

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
            onClick={handleCheckIn}
            disabled={actionLoading || !!activeSession}
            className="btn btn-primary"
          >
            {actionLoading ? "Please wait..." : "Check In"}
          </button>
          <button
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
                Geofence: {log.isVerifiedGeofence ? "Verified ✅" : "Not verified"}
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
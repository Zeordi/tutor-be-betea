export default function AttendancePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Attendance & Geofence Logs
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Session check-ins, distance validation and offline sync records
      </p>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {/* TODO: Attendance logs table */}
        <p className="text-[var(--secondary)]">Attendance logs will appear here</p>
      </div>
    </div>
  );
}

import PageHeader from "@/components/PageHeader";

export default function AttendanceGeoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Geofence"
        subtitle="150m rule · GPS check-in/out · Offline sync review"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Check-ins today", "3,421"],
          ["Outside geofence", "42"],
          ["Pending parent confirm", "18"],
        ].map(([l, v]) => (
          <div
            key={l}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]"
          >
            <p className="text-2xl font-extrabold text-teal-600">{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-[#112240]">
        <p className="text-3xl">📍</p>
        <p className="mt-2 font-bold text-slate-800 dark:text-white">Live geo map panel</p>
        <p className="text-sm text-slate-500">
          Wire PostGIS session points here in a later iteration.
        </p>
      </div>
    </div>
  );
}
import PageHeader from "@/components/PageHeader";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" subtitle="Platform fees, geofence radius, MFA policy" />
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Platform fee", "5%"],
          ["Geofence radius", "150 m"],
          ["Connect price", "100 ETB"],
          ["Admin MFA", "IP-bound enabled"],
          ["Anti-poaching filter", "Amharic + English ON"],
          ["Vault encryption", "AES-256"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
          >
            <span className="text-sm text-slate-600 dark:text-slate-400">{k}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
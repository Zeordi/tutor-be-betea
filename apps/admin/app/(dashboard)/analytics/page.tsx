import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Growth, conversion, and safety metrics" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MAU" value="28.4k" delta="+9%" icon="📈" tone="teal" />
        <StatCard label="Tutor conversion" value="34%" delta="+2%" icon="🎓" tone="blue" />
        <StatCard label="Escrow volume" value="18.2M" delta="+15%" icon="💰" tone="amber" />
        <StatCard label="Chat redactions" value="1,204" delta="+6%" icon="🔒" tone="purple" />
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#112240]">
        <p className="text-3xl">📊</p>
        <p className="mt-2 font-bold text-slate-800 dark:text-white">Charts panel</p>
        <p className="text-sm text-slate-500">Hook PostHog / custom series here later.</p>
      </div>
    </div>
  );
}
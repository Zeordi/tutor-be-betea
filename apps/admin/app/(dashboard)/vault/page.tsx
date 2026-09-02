import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const VAULT = [
  { id: "v1", name: "Selamawit Tadesse", docs: 3, lastAccess: "11:42:03", by: "admin@tbb.et" },
  { id: "v2", name: "Bereket Solomon", docs: 2, lastAccess: "10:15:22", by: "admin@tbb.et" },
  { id: "v3", name: "Tadesse Alemu", docs: 4, lastAccess: "09:01:11", by: "system" },
];

export default function VaultPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Vault"
        subtitle="Encrypted credentials · Admin-only · Every open is audit-logged"
      />

      <div className="rounded-2xl border-2 border-red-300 bg-white p-4 dark:border-red-800 dark:bg-[#112240]">
        <p className="text-xs font-bold text-red-700 dark:text-red-400">
          🔐 AES-256 private vault · Raw Fayda / degree / selfie never shown on public profiles
        </p>
      </div>

      <div className="space-y-3">
        {VAULT.map((row) => (
          <div
            key={row.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
          >
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
              <p className="text-xs text-slate-500">
                {row.docs} encrypted documents · Last access {row.lastAccess} by {row.by}
              </p>
            </div>
            <Link
              href={`/verification/${row.id}`}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white dark:bg-teal-600"
            >
              Open vault case
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
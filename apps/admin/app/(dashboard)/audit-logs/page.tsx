export default function AuditLogsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Immutable Audit Logs
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Cryptographic ledger of all sensitive admin actions (HMAC-SHA256 chained)
      </p>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {/* TODO: Audit log table with hash verification */}
        <p className="text-[var(--secondary)]">
          Audit logs are append-only and cannot be modified
        </p>
      </div>
    </div>
  );
}

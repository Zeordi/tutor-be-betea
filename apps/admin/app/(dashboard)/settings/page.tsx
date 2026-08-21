export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        System Settings
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Platform configuration and security settings
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-semibold">Security</h3>
          <p className="mt-2 text-sm text-[var(--secondary)]">
            IP allowlist, MFA enforcement, session policies
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-semibold">Platform Fees</h3>
          <p className="mt-2 text-sm text-[var(--secondary)]">
            Configure platform commission rates
          </p>
        </div>
      </div>
    </div>
  );
}

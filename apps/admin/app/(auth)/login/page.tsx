export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Super Admin
          </h1>
          <p className="mt-2 text-[var(--secondary)]">
            Tutor Be Betea Administration Console
          </p>
          <p className="mt-1 text-sm text-[var(--warning)]">
            IP-bound MFA required
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="space-y-5">
            {/* TODO: Email + Password + MFA Code fields */}
            <button className="w-full rounded-xl bg-[var(--primary)] py-3 font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition">
              Sign in securely
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

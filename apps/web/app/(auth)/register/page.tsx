export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[var(--foreground)]">
          Create Account
        </h1>
        <p className="mt-3 text-center text-[var(--secondary)]">
          Join as a Parent or Tutor
        </p>

        <div className="mt-10 space-y-6">
          {/* TODO: Registration form */}
          <button className="w-full rounded-xl bg-[var(--primary)] py-3 font-semibold text-[var(--primary-foreground)]">
            Create Account
          </button>
        </div>
      </div>
    </main>
  );
}

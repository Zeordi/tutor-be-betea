export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[var(--foreground)]">
          Welcome Back
        </h1>
        <p className="mt-3 text-center text-[var(--secondary)]">
          Login to your Tutor Be Betea account
        </p>

        <div className="mt-10 space-y-6">
          {/* TODO: Phone / Email + Password form */}
          <button className="w-full rounded-xl bg-[var(--primary)] py-3 font-semibold text-[var(--primary-foreground)]">
            Login
          </button>
        </div>
      </div>
    </main>
  );
}

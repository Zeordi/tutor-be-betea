export default function ForTutorsPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">
          For Tutors
        </h1>
        <p className="mt-6 text-lg text-[var(--secondary)]">
          Join Ethiopia’s most trusted tutoring platform. Get verified, receive job requests,
          and grow your income with secure payouts.
        </p>

        <div className="mt-12 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] p-6 bg-[var(--surface)]">
            <h3 className="text-xl font-semibold">Get Verified & Stand Out</h3>
            <p className="mt-2 text-[var(--secondary)]">
              Earn Trust Badges (National ID, Degree, Gold Elite) and attract more parents.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-6 bg-[var(--surface)]">
            <h3 className="text-xl font-semibold">Secure & Fast Payouts</h3>
            <p className="mt-2 text-[var(--secondary)]">
              Receive payments through Telebirr, CBE Birr or bank transfer after sessions are completed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

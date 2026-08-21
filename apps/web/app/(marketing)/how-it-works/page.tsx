export default function HowItWorksPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">How It Works</h1>

        <div className="mt-16 space-y-12">
          <div className="flex gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold">Post a Job or Browse Tutors</h3>
              <p className="mt-2 text-[var(--secondary)]">
                Parents can post requirements or directly browse verified tutor profiles.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold">Hire & Pay Safely via Escrow</h3>
              <p className="mt-2 text-[var(--secondary)]">
                Funds are held securely until sessions are completed and verified.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold">Track Progress & Results</h3>
              <p className="mt-2 text-[var(--secondary)]">
                Receive beautiful weekly mastery reports powered by AI summaries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

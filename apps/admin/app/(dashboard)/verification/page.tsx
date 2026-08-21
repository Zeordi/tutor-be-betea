export default function VerificationQueuePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Verification Queue
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Review ID documents, degrees and liveness selfies (Admin only)
      </p>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {/* TODO: Table of pending verification requests */}
        <p className="text-[var(--secondary)]">
          Pending verification requests will appear here
        </p>
      </div>
    </div>
  );
}
